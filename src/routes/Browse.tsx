import { FreshContext, RouteConfig } from "outils/createRenderPipe.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import DataTable from "@/src/components/DataTableDemo.tsx";
import { Button } from "@/src/components/ui/button.tsx";
import urlcat from "outils/urlcat.ts";
import type { SqliteMiddlewareState } from "outils/sqliteMiddleware.ts";

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
  const table = tableName
    ? await ctx.state.clientQuery.default((qb) =>
        qb.selectFrom(tableName).selectAll().compile()
      )
    : null;
  return (
    <div className="col-span-4 p-4">
      {tableConfig && (
        <Button asChild>
          <a
            href={urlcat("/admin/upsert/:table_name", {
              table_name: tableConfig.name,
            })}
          >
            Insert
          </a>
        </Button>
      )}
      <DataTable
        name={tableConfig?.name}
        columns={tableConfig?.columns}
        data={table}
      />
    </div>
  );
};
