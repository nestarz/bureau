import {
  FreshContext,
  Handlers,
  RouteConfig,
} from "outils/fresh/types.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import { CustomInput } from "@/src/components/CustomInput.tsx";
import type { SqliteMiddlewareState } from "outils/database/sqlite/createSqlitePlugin.ts";
import { Button } from "@/src/components/ui/button.tsx";
import { Column } from "@/src/middlewares/client.ts";
import formatColumnName from "@/src/lib/formatColumnName.ts";
import urlcat from "outils/urlcat.ts";
import createAdjacentOrderRetrieval from "@/src/lib/createAdjacentOrderRetrieval.ts";
import { TrashIcon } from "@radix-ui/react-icons";
import { jsonArrayFrom } from "kysely/helpers/sqlite";
import deserializeNestedJSON, {
  type JsonArray,
} from "outils/deserializeNestedJSON.ts";
import DataTable from "@/src/components/DataTable.tsx";
import { sql } from "kysely";
// @deno-types="npm:@types/react@18.2.0"
import { Fragment } from "react";
import type { Table } from "@/src/middlewares/client.ts";

export const config: RouteConfig = {
  routeOverride: "/upsert/:tableName{/}?",
};

export const handler: Handlers<
  null,
  ClientMiddleware & SqliteMiddlewareState<any>
> = {
  POST: async (req, ctx) => {
    const tableConfig = ctx.state.tables.find(
      (table) => table.name === ctx.params.tableName
    )!;
    const searchParams = new URL(req.url).searchParams;
    const extendedMethod = (searchParams.get("method") ?? "POST").toUpperCase();
    const primaryKeys = JSON.parse(searchParams.get("pk") || "null");
    if (extendedMethod === "DELETE") {
      const returning =
        Object.keys(primaryKeys).length > 0
          ? await ctx.state.clientQuery.default((qb) => {
              let wb = qb.deleteFrom(tableConfig.name);
              for (const [key, value] of Object.entries(primaryKeys)) {
                wb = wb.where(key, "=", value);
              }
              return wb.compile();
            })
          : null;

      ctx.state.session.flash("x-sonner", returning);
      return new Response(null, {
        status: 302,
        headers: {
          Location: urlcat("/admin/browse/:name", { name: tableConfig.name }),
        },
      });
    }

    const formData = await req.formData();
    const values = [...formData.entries()].reduce((prev, [key, value]) => {
      const type = tableConfig.columns.find((v) => v.name === key)?.type;
      return !type
        ? prev
        : {
            ...prev,
            [key]:
              typeof value !== "string" || value === "null"
                ? null
                : ["REAL", "INTEGER"].includes(type)
                ? parseFloat(value)
                : value,
          };
    }, {});
    const returning = await ctx.state.clientQuery
      .default((qb) =>
        (Object.entries(primaryKeys ?? {}).length > 0
          ? qb
              .updateTable(tableConfig.name)
              .set(values)
              .$if(true, (wb) => {
                for (const [key, value] of Object.entries(primaryKeys)) {
                  wb = wb.where(key, "=", value);
                }
                return wb;
              })
              .returningAll()
          : qb.insertInto(tableConfig.name).values(values).returningAll()
        ).compile()
      )
      .then((data) => ({ data }))
      .catch((error) => ({ error }));

    ctx.state.session.flash("x-sonner", returning);
    return new Response(null, {
      status: 302,
      headers: { Location: req.url },
    });
  },
};

export default async (
  req: Request,
  ctx: FreshContext<ClientMiddleware & SqliteMiddlewareState<any>>
) => {
  const tables = ctx.state.tables;
  const pk = new URL(req.url).searchParams.get("pk");
  const primaryKeys = JSON.parse(pk || "null");
  const tableConfig = ctx.state.tables.find(
    (table) => table.name === ctx.params.tableName
  );
  if (!tableConfig?.name) return new Response(null, { status: 404 });

  const mode =
    Object.entries(primaryKeys ?? {}).length > 0
      ? ("update" as const)
      : ("insert" as const);
  const orderKey = tableConfig?.columns.find(
    (d) => formatColumnName(d.name) === "Order"
  )?.name;
  const adjacentOrderRetrieval = createAdjacentOrderRetrieval(
    "cte_current_cte",
    tableConfig.name,
    primaryKeys,
    orderKey
  );
  const referencedTables =
    mode === "update"
      ? tables.filter((v) =>
          v.columns.some((v) => v.references === tableConfig.name)
        )
      : [];
  const referencesSet = Array.from(
    new Set(
      (tableConfig?.columns ?? []).flatMap((v) =>
        v.references ? [v.references] : []
      )
    )
  );
  const results: { [x: string]: string }[] =
    await ctx.state.clientQuery.default((qb) => {
      for (const references of referencesSet) {
        qb = qb.with(`cte_${tableConfig.name}_${references}`, (wb: any) => {
          wb = wb
            .selectFrom(references)
            .distinct()
            .selectAll(references) as any;
          return wb;
        }) as any;
      }
      if (referencedTables.length > 0) {
        for (const referencedTable of referencedTables) {
          const referencesArray = Array.from(
            Map.groupBy(
              (referencedTable?.columns ?? []).filter((v) => v.references),
              (v) => v.references
            )
          );
          for (const [references, columns] of referencesArray) {
            qb = qb.with(
              `cte_${referencedTable.name}_${references}`,
              (wb: any) => {
                const newWb = (wb as typeof qb)
                  .selectFrom(references!)
                  .distinct()
                  .selectAll(references!);
                wb = newWb as any;
                for (const column of columns) {
                  const colWb = (wb as unknown as typeof newWb).innerJoin(
                    referencedTable.name,
                    sql.ref(`${referencedTable.name}.${column.name}`) as any,
                    sql.ref(`${column.references}.${column.to}`) as any
                  );
                  wb = colWb as any;
                }
                return wb;
              }
            ) as any;
          }
        }
        const newQb = qb.with("cte_referenced_cte", (wb) =>
          wb.selectNoFrom((qb) =>
            referencedTables.map((table) =>
              jsonArrayFrom(
                qb
                  .selectFrom(table.name)
                  .select(table.columns.map((column) => column.name))
                  .$if(mode === "update", (wb) => {
                    for (const [key, value] of Object.entries(primaryKeys)) {
                      const fk = table.columns.find(
                        (c) => c.references === tableConfig.name && key === c.to
                      );
                      if (fk) wb = wb.where(fk.name, "=", value);
                    }
                    return wb;
                  })
              ).as(table.name)
            )
          )
        );

        qb = newQb as any;
      }

      return qb
        .with("cte_current_cte", (wb) =>
          wb
            .selectFrom(tableConfig.name)
            .$if(!!orderKey, (wb) => (orderKey ? wb.orderBy(orderKey) : wb))
            .$if(mode === "update", (wb) => {
              for (const [key, value] of Object.entries(primaryKeys)) {
                wb = wb.where(key, "=", value);
                wb = wb.orderBy(key, "desc");
              }
              return wb.limit(1);
            })
            .$if(mode === "insert", (wb) => wb.limit(0))
            .selectAll()
        )
        .with("cte_previous_cte", (qb) =>
          qb
            .selectFrom([tableConfig.name, "cte_current_cte"])
            .selectAll(tableConfig.name)
            .$if(mode === "update", adjacentOrderRetrieval("desc"))
        )
        .with("cte_next_cte", (qb) =>
          qb
            .selectFrom([tableConfig.name, "cte_current_cte"])
            .selectAll(tableConfig.name)
            .$if(mode === "update", adjacentOrderRetrieval("asc"))
        )
        .selectNoFrom((qb) =>
          [
            [
              "referenced_cte",
              referencedTables.map((table) => ({ name: table.name })),
            ],
            ["current_cte", tableConfig.columns],
            ["next_cte", tableConfig.columns],
            ["previous_cte", tableConfig.columns],
            ...referencedTables.flatMap((table) =>
              (table?.columns ?? [])
                .filter((v) => v.references)
                .map((subtable) => [
                  `${table.name}_${subtable.references}`,
                  tables.find((table) => table.name === subtable.references)
                    ?.columns,
                ])
            ),
            ...referencesSet.map((references) => [
              `${tableConfig.name}_${references}`,
              tables.find((table) => table.name === references)?.columns,
            ]),
          ]
            .filter(([, columns]) => (columns?.length ?? 0) > 0)
            .map(([references, columns]) =>
              jsonArrayFrom(
                qb
                  .selectFrom(`cte_${references}`)
                  .select((columns as Column[])!.map((column) => column.name))
              ).as(references as string)
            )
        )
        .compile() as any;
    });

  const referencesData = Object.fromEntries(
    referencesSet.map((references) => [
      references,
      deserializeNestedJSON(
        JSON.parse(results[0][`${tableConfig.name}_${references}`])
      ),
    ])
  );
  const name = tableConfig?.name;
  const columns = tableConfig?.columns as Column[];
  const referencedJson: [Table, JsonArray][] =
    referencedTables?.length > 0
      ? Object.entries(JSON.parse(results[0].referenced_cte)?.[0]).map(
          ([key, value]) => [
            ctx.state.tables.find((table) => table.name === key)!,
            deserializeNestedJSON<JsonArray>(JSON.parse(value as string)),
          ]
        )
      : [];
  const data = deserializeNestedJSON<{ [a: string]: any }[]>(
    JSON.parse(results[0].current_cte)
  )?.[0];
  const rowNext = deserializeNestedJSON<{ [a: string]: any }[]>(
    JSON.parse(results[0].next_cte)
  )?.[0];
  const rowPrev = deserializeNestedJSON<{ [a: string]: any }[]>(
    JSON.parse(results[0].previous_cte)
  )?.[0];

  const nextPk = rowNext
    ? JSON.stringify(
        Object.fromEntries(
          Object.keys(primaryKeys ?? {}).map((key) => [key, rowNext[key]])
        )
      )
    : null;
  const prevPk = rowPrev
    ? JSON.stringify(
        Object.fromEntries(
          Object.keys(primaryKeys ?? {}).map((key) => [key, rowPrev[key]])
        )
      )
    : null;

  return (
    <div className="col-span-4">
      <form className="p-6" method="POST">
        <div className="flex gap-2 w-full justify-between">
          <div className="flex flex-col space-y-2">
            <div className="text-lg font-semibold text-foreground capitalize">
              {mode} {formatColumnName(name)}
            </div>
            <div className="text-sm text-muted-foreground">
              {mode === "update"
                ? "Make changes to your data here."
                : "Insert a new record here."}{" "}
              Click save when you're done.
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            {mode === "update" && (
              <Fragment>
                <Button
                  size="icon"
                  variant="destructive"
                  formAction={urlcat("/admin/upsert/:name", {
                    pk,
                    name,
                    method: "DELETE",
                  })}
                  formMethod="POST"
                >
                  <TrashIcon />
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href={
                      prevPk
                        ? urlcat("/admin/upsert/:name", { pk: prevPk, name })
                        : undefined
                    }
                  >
                    Previous
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href={
                      nextPk
                        ? urlcat("/admin/upsert/:name", { pk: nextPk, name })
                        : undefined
                    }
                  >
                    Next
                  </a>
                </Button>
              </Fragment>
            )}
            <Button type="submit">Save changes</Button>
          </div>
        </div>
        <div className="grid gap-6 py-4">
          {columns.map((column) => (
            <CustomInput
              key={column.name}
              label={formatColumnName(column.name)}
              disabled={column.pk === 1}
              name={column.name}
              defaultValue={data?.[column.name]}
              required={column.notnull > 0}
              type={column.type}
              className="w-full"
              references={column.references}
              referencesRows={
                column.references ? referencesData[column.references] : null
              }
              referencesTo={column.to}
            />
          ))}
        </div>
      </form>
      <div className="border-t py-6 px-6">
        {referencedJson.map(([tableConfig, data]) => (
          <DataTable
            name={tableConfig?.name}
            columns={tableConfig?.columns}
            data={data}
            references={Object.fromEntries(
              (tableConfig?.columns ?? [])
                .filter((v) => v.references)
                .map((subtable) => [
                  subtable.references,
                  deserializeNestedJSON(
                    JSON.parse(
                      results[0][
                        `${tableConfig.name}_${subtable.references}`
                      ] as unknown as string
                    )
                  ),
                ])
            )}
          >
            {tableConfig?.name && (
              <Button asChild>
                <a
                  href={urlcat("/admin/upsert/:table_name", {
                    table_name: tableConfig?.name,
                  })}
                >
                  Insert
                </a>
              </Button>
            )}
          </DataTable>
        ))}
      </div>
    </div>
  );
};
