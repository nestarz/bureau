import { FreshContext, RouteConfig } from "outils/createRenderPipe.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import { CustomInput } from "@/src/components/CustomInput.tsx";
import type { SqliteMiddlewareState } from "outils/sqliteMiddleware.ts";
import { Button } from "@/src/components/ui/button.tsx";
import { Column } from "@/src/middlewares/client.ts";
import formatColumnName from "@/src/lib/formatColumnName.ts";
import urlcat from "outils/urlcat.ts";
import createAdjacentOrderRetrieval from "@/src/lib/createAdjacentOrderRetrieval.ts";
import { TrashIcon } from "@radix-ui/react-icons";
import { jsonArrayFrom } from "npm:kysely/helpers/sqlite";
import deserializeNestedJSON from "outils/deserializeNestedJSON.ts";
import DataTable from "@/src/components/DataTable.tsx";
import { sql } from "npm:kysely";
import { Fragment } from "react";

export const config: RouteConfig["config"] = {
  routeOverride: "/upsert/:tableName{/}?",
};

export const handler = {
  POST: async (
    req: Request,
    ctx: FreshContext<ClientMiddleware & SqliteMiddlewareState<any>>
  ) => {
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
      (tableConfig?.columns ?? [])
        .filter((v) => v.references)
        .map((v) => v.references)
    )
  );
  const results = await ctx.state.clientQuery.default((qb) => {
    for (const references of referencesSet) {
      qb = qb.with(`cte_${tableConfig.name}_${references}`, (wb) => {
        wb = wb.selectFrom(references).distinct().selectAll(references);
        return wb;
      });
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
          qb = qb.with(`cte_${referencedTable.name}_${references}`, (wb) => {
            wb = wb.selectFrom(references).distinct().selectAll(references);
            for (const column of columns) {
              wb = wb.innerJoin(
                referencedTable.name,
                sql.ref(`${referencedTable.name}.${column.name}`),
                sql.ref(`${column.references}.${column.to}`)
              );
            }
            return wb;
          });
        }
      }
      qb = qb.with("cte_referenced_cte", (wb) =>
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
                    wb = wb.where(fk.name, "=", value);
                  }
                  return wb;
                })
            ).as(table.name)
          )
        )
      );
    }

    return qb
      .with("cte_current_cte", (wb) =>
        wb
          .selectFrom(tableConfig.name)
          .$if(orderKey, (wb) => wb.orderBy(orderKey))
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
                  .columns,
              ])
          ),
          ...referencesSet.map((references) => [
            `${tableConfig.name}_${references}`,
            tables.find((table) => table.name === references).columns,
          ]),
        ]
          .filter(([, columns]) => columns.length > 0)
          .map(([references, columns]) =>
            jsonArrayFrom(
              qb
                .selectFrom(`cte_${references}`)
                .select(columns.map((column) => column.name))
            ).as(references)
          )
      )
      .compile();
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
  const referencedJson =
    referencedTables?.length > 0
      ? Object.entries(JSON.parse(results[0].referenced_cte)?.[0]).map(
          ([key, value]) => [
            ctx.state.tables.find((table) => table.name === key),
            deserializeNestedJSON(JSON.parse(value)),
          ]
        )
      : [];
  const data = deserializeNestedJSON(JSON.parse(results[0].current_cte))?.[0];
  const rowNext = deserializeNestedJSON(JSON.parse(results[0].next_cte))?.[0];
  const rowPrev = deserializeNestedJSON(
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
                        : null
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
                        : null
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
              required={column.notnull}
              type={column.type}
              className="w-full"
              references={column.references}
              referencesRows={referencesData[column.references]}
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
                      results[0][`${tableConfig.name}_${subtable.references}`]
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
