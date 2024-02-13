import { FreshContext, RouteConfig } from "outils/createRenderPipe.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import DataTable from "@/src/components/DataTable.tsx";
import { Button } from "@/src/components/ui/button.tsx";
import urlcat from "outils/urlcat.ts";
import type { SqliteMiddlewareState } from "outils/sqliteMiddleware.ts";
import formatColumnName from "@/src/lib/formatColumnName.ts";
import { sql } from "npm:kysely";
import { jsonArrayFrom } from "npm:kysely/helpers/sqlite";
import deserializeNestedJSON from "outils/deserializeNestedJSON.ts";

export const config: RouteConfig["config"] = {
  routeOverride: "/browse/:tableName",
};

export default async (
  _req: Request,
  ctx: FreshContext<ClientMiddleware & SqliteMiddlewareState<any>>
) => {
  const tables = ctx.state.tables;
  const tableConfig = tables.find(
    (table) => table.name === ctx.params.tableName
  );
  const tableName = tableConfig?.name;
  const orderKey = tableConfig?.columns.find(
    (d) => formatColumnName(d.name) === "Order"
  )?.name;
  const referencesArray = Array.from(
    Map.groupBy(
      (tableConfig?.columns ?? []).filter((v) => v.references),
      (v) => v.references
    )
  );
  const results = tableName
    ? await ctx.state.clientQuery.default((qb) => {
        for (const [references, columns] of referencesArray) {
          qb = qb.with(`cte_${references}`, (wb) => {
            wb = wb.selectFrom(references).distinct().selectAll(references);
            for (const column of columns) {
              wb = wb.innerJoin(
                tableName,
                sql.ref(`${tableName}.${column.name}`),
                sql.ref(`${column.references}.${column.to}`)
              );
            }
            return wb;
          });
        }

        return qb
          .with("cte_target_cte", (wb) =>
            wb
              .selectFrom(tableName)
              .$if(orderKey, (wb) => wb.orderBy(orderKey))
              .selectAll()
          )
          .selectNoFrom((qb) =>
            [
              ["target_cte", tableConfig.columns],
              ...referencesArray.map(([references]) => [
                references,
                tables.find((table) => table.name === references).columns,
              ]),
            ].map(([references, columns]) =>
              jsonArrayFrom(
                qb
                  .selectFrom(`cte_${references}`)
                  .select(columns.map((column) => column.name))
              ).as(references)
            )
          )
          .compile();
      })
    : null;

  const referencesData = Object.fromEntries(
    referencesArray.map(([references]) => [
      references,
      deserializeNestedJSON(JSON.parse(results[0][references])),
    ])
  );

  return !tableConfig ? (
    <div></div>
  ) : (
    <div className="col-span-4 p-4">
      <DataTable
        name={tableConfig?.name}
        columns={tableConfig?.columns}
        data={deserializeNestedJSON(JSON.parse(results[0].target_cte))}
        references={referencesData}
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
    </div>
  );
};
