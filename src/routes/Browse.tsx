import { FreshContext, RouteConfig } from "outils/createRenderPipe.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import DataTable from "@/src/components/DataTableDemo.tsx";
import { Button } from "@/src/components/ui/button.tsx";
import urlcat from "outils/urlcat.ts";
import type { SqliteMiddlewareState } from "outils/sqliteMiddleware.ts";
import formatColumnName from "@/src/lib/formatColumnName.ts";

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
  const table = tableName
    ? await ctx.state.clientQuery.default((qb) =>
        qb
          .selectFrom(tableName)
          .$if(orderKey, (wb) => wb.orderBy(orderKey))
          .selectAll()
          .compile()
      )
    : null;
  return !tableConfig ? (
    <div></div>
  ) : (
    <div className="col-span-4 p-4">
      <DataTable
        name={tableConfig?.name}
        columns={tableConfig?.columns}
        data={table}
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
