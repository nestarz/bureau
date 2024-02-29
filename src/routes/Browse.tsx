import { FreshContext, RouteConfig } from "outils/fresh/types.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import DataTable from "@/src/components/DataTable.tsx";
import { Button } from "@/src/components/ui/button.tsx";
import urlcat from "outils/urlcat.ts";
import type { SqliteMiddlewareState } from "outils/database/sqlite/createSqlitePlugin.ts";
import formatColumnName from "@/src/lib/formatColumnName.ts";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/sqlite";
import deserializeNestedJSON from "outils/deserializeNestedJSON.ts";
import type { Column } from "@/src/middlewares/client.ts";

export const config: RouteConfig = {
  routeOverride: "/browse/:tableName",
};

export default async (
  _req: Request,
  ctx: FreshContext<ClientMiddleware & SqliteMiddlewareState<any>>,
) => {
  const tables = ctx.state.tables;
  const tableConfig = tables.find(
    (table) => table.name === ctx.params.tableName,
  );
  const tableName = tableConfig?.name;
  if (!tableName) return new Response(null, { status: 404 });

  const orderKey = tableConfig?.columns.find(
    (d) => formatColumnName(d.name) === "Order",
  )?.name;
  const referencesArray = Array.from(
    Map.groupBy(
      (tableConfig?.columns ?? []).filter((v) => v.references),
      (v) => v.references!,
    ),
  );
  const results: null | { [x: string]: string }[] = await ctx.state.clientQuery
    .default((qb) => {
      for (const [references, columns] of referencesArray) {
        const newQb = qb.with(`cte_${references}`, (wb): any => {
          let sq = wb.selectFrom(references).distinct().selectAll(references);
          for (const column of columns) {
            sq = sq.innerJoin(
              tableName,
              sql.ref(`${tableName}.${column.name}`) as any,
              sql.ref(`${column.references}.${column.to}`) as any,
            );
          }
          return sq;
        });
        qb = newQb as any;
      }

      return qb
        .with("cte_target_cte", (wb) =>
          wb
            .selectFrom(tableName)
            .$if(!!orderKey, (wb) => wb.orderBy(orderKey!))
            .selectAll())
        .selectNoFrom((qb) =>
          [
            ["target_cte", tableConfig.columns],
            ...referencesArray.map(([references]) => [
              references,
              tables.find((table) => table.name === references)?.columns,
            ]),
          ].map(([references, columns]) =>
            jsonArrayFrom(
              qb
                .selectFrom(`cte_${references}`)
                .select((columns as Column[]).map((column) => column.name)),
            ).as(references as string)
          )
        )
        .compile() as any;
    });

  const referencesData = Object.fromEntries(
    referencesArray.map(([references]) => [
      references,
      deserializeNestedJSON(JSON.parse(results[0][references])),
    ]),
  );

  return !tableConfig ? <div></div> : (
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
