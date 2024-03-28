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
          .with("cte_null_orders", (wb) =>
            wb
              .selectFrom(tableConfig.name)
              .select((eb) => [
                ...primaryKeys.map((key) => key),
                eb.fn
                  .agg<number>("ROW_NUMBER")
                  .over((ob) => {
                    for (const key of primaryKeys) ob = ob.orderBy(key, "desc");
                    return ob;
                  })
                  .as(orderKey),
              ])
              .where(orderKey, "is", null)
              // .where(
              //   primaryKeys.map((key) => eb.ref(key)).pop(),
              //   "not in",
              //   qb.selectFrom("cte_reordered").select(primaryKeys),
              // )
              .where((qb) => {
                let wb = qb.selectFrom("cte_reordered").select(primaryKeys);
                for (const pk of primaryKeys) {
                  wb = wb.whereRef(
                    sql.ref(`cte_reordered.${pk}`),
                    "=",
                    sql.ref(`${tableConfig.name}.${pk}`),
                  );
                }
                return qb.not(qb.exists(wb));
              }))
          .with("cte_combined", (qb) =>
            qb
              .selectFrom("cte_reordered")
              .selectAll()
              .unionAll(qb.selectFrom("cte_null_orders").selectAll()))
          .updateTable(tableConfig.name)
          .$if(true, (qb) => {
            let wb = qb.from("cte_combined");
            for (const pk of primaryKeys) {
              wb = wb.whereRef(
                sql.ref(`cte_combined.${pk}`),
                "=",
                sql.ref(`${tableConfig.name}.${pk}`),
              );
            }
            return wb;
          })
          .set((eb) => ({
            [orderKey]: eb.ref(`cte_combined.${orderKey}`),
          }))
          .returning([...primaryKeys, orderKey])
          .compile()
      )
      .then((data) => ({ data }))
      .catch((error) => ({ error: error.toString() }));

    return new Response(JSON.stringify(returning));
  },
};
