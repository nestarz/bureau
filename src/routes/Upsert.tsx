import { FreshContext, RouteConfig } from "outils/createRenderPipe.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import { CustomInput } from "@/src/components/CustomInput.tsx";
import type { SqliteMiddlewareState } from "outils/sqliteMiddleware.ts";
import { Button } from "@/src/components/ui/button.tsx";
import { Column } from "@/src/middlewares/client.ts";
import formatColumnName from "@/src/lib/formatColumnName.ts";
import urlcat from "outils/urlcat.ts";
import { sql } from "npm:kysely";
import adjacentOrderRetrieval from "@/src/lib/adjacentQueryBuilder.ts";
import { TrashIcon } from "@radix-ui/react-icons";

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
  const rows =
    tableConfig?.name && mode === "update"
      ? await ctx.state.clientQuery.default((qb) =>
          qb
            .with("cte_target", (qb) =>
              qb
                .selectFrom(tableConfig.name)
                .selectAll()
                .select(sql<string>`'target'`.as("_pos"))
                .$if(mode === "update", (wb) => {
                  for (const [key, value] of Object.entries(primaryKeys)) {
                    wb = wb.where(key, "=", value);
                    wb = wb.orderBy(key, "desc");
                  }
                  return wb.limit(1);
                })
            )
            .with("cte_prev", (qb) =>
              qb
                .selectFrom([tableConfig.name, "cte_target"])
                .selectAll(tableConfig.name)
                .select(sql<string>`'previous'`.as("_pos"))
                .$if(
                  mode === "update",
                  adjacentOrderRetrieval(
                    "cte_target",
                    tableConfig.name,
                    primaryKeys,
                    orderKey,
                    "desc"
                  )
                )
            )
            .with("cte_next", (qb) =>
              qb
                .selectFrom([tableConfig.name, "cte_target"])
                .selectAll(tableConfig.name)
                .select(sql<string>`'next'`.as("_pos"))
                .$if(
                  mode === "update",
                  adjacentOrderRetrieval(
                    "cte_target",
                    tableConfig.name,
                    primaryKeys,
                    orderKey,
                    "asc"
                  )
                )
            )
            .selectFrom("cte_target")
            .union((eb) => eb.selectFrom("cte_prev").selectAll())
            .union((eb) => eb.selectFrom("cte_next").selectAll())
            .selectAll()
            .compile()
        )
      : [];

  const name = tableConfig?.name;
  const columns = tableConfig?.columns as Column[];
  const data = rows.find((d) => d._pos === "target");
  const rowNext = rows.find((d) => d._pos === "next");
  const rowPrev = rows.find((d) => d._pos === "previous");
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
    <form className="gap-4 bg-background p-6 col-span-4" method="POST">
      <div className="flex gap-2 w-full justify-between">
        <div className="flex flex-col space-y-2">
          <div className="text-lg font-semibold text-foreground capitalize">
            {mode} {name}
          </div>
          <div className="text-sm text-muted-foreground">
            Make changes to your profile here. Click save when you're done.
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
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
          />
        ))}
      </div>
    </form>
  );
};
