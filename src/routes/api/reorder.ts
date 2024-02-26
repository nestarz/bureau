import { Handlers, RouteConfig } from "outils/fresh/types.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import type { SqliteMiddlewareState } from "outils/database/sqlite/createSqlitePlugin.ts";
import { sql } from "kysely";
import formatColumnName from "@/src/lib/formatColumnName.ts";

export const config: RouteConfig = {
  routeOverride: "/api/reorder/:tableName{/}?",
};

export const handler: Handlers<
  null,
  ClientMiddleware & SqliteMiddlewareState<any>
> = {
  POST: async (req, ctx) => {
    const tableConfig = ctx.state.tables.find(
      (table) => table.name === ctx.params.tableName,
    );
    const orderKey = tableConfig?.columns.find(
      (d) => formatColumnName(d.name) === "Order",
    )?.name;
    if (!orderKey) return new Response("orderKey missing");

    const formData = await req.formData();
    const primaryKeys = tableConfig.columns
      .filter((column) => column.pk === 1)
      .map((column) => column.name);
    const returning = await ctx.state.clientQuery
      .default((qb) =>
        qb
          .with("cte_reordered", (wb) =>
            wb
              .selectFrom(sql`json_each(json(${formData.get("order")}))` as any)
              .select((eb: any) =>
                [orderKey, ...primaryKeys].map((key) =>
                  eb.ref("value", "->>").key(key).as(key)
                )
              ))
          .updateTable(tableConfig.name)
          .from("cte_reordered")
          .$if(true, (wb) => {
            for (const key of primaryKeys) {
              wb = wb.whereRef(
                sql.ref(`${tableConfig.name}.${key}`),
                "=",
                sql.ref(`cte_reordered.${key}`),
              );
            }
            return wb;
          })
          .set((eb) => ({
            [orderKey]: eb.ref(`cte_reordered.${orderKey}`),
          }))
          .returningAll()
          .compile()
      )
      .then((data) => ({ data }))
      .catch((error) => ({ error: error.toString() }));

    return new Response(JSON.stringify(returning));
  },
};
