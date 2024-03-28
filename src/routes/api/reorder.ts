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
          .with("cte_values", (wb) =>
            wb
              .selectFrom(sql`json_each(json(${formData.get("order")}))` as any)
              .select((eb: any) =>
                [orderKey, ...primaryKeys].map((key) =>
                  eb.ref("value", "->>").key(key).as(key)
                )
              ))
          .with("cte_row_number", (wb) =>
            wb.selectFrom(tableConfig.name).select((eb) => [
              ...primaryKeys.map((key) =>
                key
              ),
              eb.fn
                .agg<number>("ROW_NUMBER")
                .over((ob) => {
                  ob.orderBy(orderKey, "desc");
                  for (const key of primaryKeys) ob = ob.orderBy(key, "desc");
                  return ob;
                })
                .as(orderKey),
            ]))
          .updateTable(tableConfig.name)
          .$if(true, (qb) => {
            let wb = qb.from("cte_row_number");
            for (const pk of primaryKeys) {
              wb = wb.leftJoin(
                "cte_values",
                `cte_row_number.${pk}`,
                `cte_values.${pk}`,
              );
            }
            for (const pk of primaryKeys) {
              wb = wb.whereRef(
                sql.ref(`cte_row_number.${pk}`),
                "=",
                sql.ref(`${tableConfig.name}.${pk}`),
              );
            }
            return wb;
          })
          .set((eb) => ({
            [orderKey]: eb.fn.coalesce(
              eb.ref(`cte_values.${orderKey}`),
              eb.ref(`${tableConfig.name}.${orderKey}`),
              eb.ref(`cte_row_number.${orderKey}`),
            ),
          }))
          .returning([...primaryKeys, orderKey])
          .compile()
      )
      .then((data) => ({ data }))
      .catch((error) => ({ error: error.toString() }));

    return new Response(JSON.stringify(returning));
  },
};
