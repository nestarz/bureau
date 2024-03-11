import { FreshContext, Handlers, RouteConfig } from "outils/fresh/types.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import type { SqliteMiddlewareState } from "outils/database/sqlite/createSqlitePlugin.ts";
import { SqlInput } from "@/src/components/SqlInput.tsx";
import { Button } from "@/src/components/ui/button.tsx";
import DataTable from "@/src/components/DataTable.tsx";
import * as React from "react";

export const config: RouteConfig = {
  routeOverride: "/sqleditor{/}?",
};

export const handler: Handlers<
  null,
  ClientMiddleware & SqliteMiddlewareState<any>
> = {
  POST: async (req, ctx) => {
    const formData = await req.formData();
    const returning = await ctx.state.clientQuery
      .default(() => ({
        sql: formData.get("sql") as string,
        query: null!,
        parameters: [],
      }))
      .then((data) => ({ data }))
      .catch((error) => ({ error: error.toString() }));

    ctx.state.session.flash("x-data", returning);
    return new Response(null, {
      status: 302,
      headers: { Location: req.url },
    });
  },
};

export default (
  _req: Request,
  ctx: FreshContext<ClientMiddleware & SqliteMiddlewareState<any>>
): JSX.Element => {
  const { data, error } = ctx.state.session.flash("x-data") ?? {};
  console.log(data);

  return (
    <form className="col-span-4 p-4 flex flex-col gap-2" method="POST">
      <SqlInput
        name="sql"
        sqlConfig={{
          schema: Object.fromEntries(
            ctx.state.tables.map((table) => [
              table.name,
              table.columns.map((column) => column.name),
            ])
          ),
        }}
        className="[&_.cm-editor]:h-full [&_.cm-editor]:!outline-none min-h-64 relative leading-5 font-normal text-left rounded-md w-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm"
      />
      <div className="flex flex-wrap gap-2 items-center">
        <Button type="submit">Submit</Button>
        <div className="text-muted-foreground text-xs">{error}</div>
      </div>
      <DataTable
        name={"query"}
        columns={
          Object.entries(data?.[0] ?? {}).map(([key, value]) => ({
            name: key,
            type: typeof value as any,
          })) as any
        }
        data={data ?? []}
      />
    </form>
  );
};
