import { FreshContext, Handlers, RouteConfig } from "outils/fresh/types.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import type { SqliteMiddlewareState } from "outils/database/sqlite/createSqlitePlugin.ts";
import { SqlInput } from "@/src/components/SqlInput.tsx";
import { Button } from "@/src/components/ui/button.tsx";
import DataTable from "@/src/components/DataTable.tsx";
import * as React from "react";
import { cn } from "@/src/lib/utils.ts";
import { getHashSync, scripted } from "@bureaudouble/scripted";

export const config: RouteConfig = {
  routeOverride: "/sqleditor{/}?",
};

const reqs = new Map();

export const handler: Handlers<
  null,
  ClientMiddleware & SqliteMiddlewareState<any>
> = {
  POST: async (req, ctx) => {
    const formData = await req.formData();
    const sql = formData.get("sql") as string;
    const result = await ctx.state.clientQuery
      .default(() => ({
        sql,
        query: null!,
        parameters: [],
      }))
      .then((data) => ({ data }))
      .catch((error) => ({ error: error.toString() }));

    const item = { result, sql, timestamp: new Date().getTime() };
    const reqId = getHashSync(JSON.stringify(item));
    reqs.set(reqId, item);
    ctx.state.session.flash("x-data-id", reqId);
    setTimeout(() => void reqs.delete(reqId), 1000);
    return new Response(null, {
      status: 302,
      headers: { Location: req.url },
    });
  },
};

export default (
  _req: Request,
  ctx: FreshContext<ClientMiddleware & SqliteMiddlewareState<any>>,
): JSX.Element => {
  const reqId = ctx.state.session.flash("x-data-id");
  const { sql, result, timestamp } = reqs.get(reqId) ?? {};
  reqs.delete(reqId);

  return (
    <form className="col-span-4 p-4 grid gap-2" method="POST">
      <div className="grid grid-cols-4 gap-2 max-h-[50vh]">
        <SqlInput
          name="sql"
          defaultValue={sql}
          sqlConfig={{
            schema: Object.fromEntries(
              ctx.state.tables.map((table) => [
                table.name,
                table.columns.map((column) => column.name),
              ]),
            ),
          }}
          className="col-span-3 [&_.cm-editor]:h-full [&_.cm-editor]:!outline-none min-h-64 relative leading-5 font-normal text-left rounded-md w-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm"
        />
        <div
          className={cn(
            "rounded border text-sm leading-none divide-y overflow-auto",
            "[&>div]:grid [&>div]:grid-cols-[minmax(0,_1fr)_auto]",
            "[&_div_button]:cursor-pointer [&_div_button]:mb-auto [&_div_button]:after:content-['⨯'] [&_div_button]:px-2 [&_div_button]:text-sm [&_div_button]:text-muted-foreground",
            "[&_div_div]:cursor-pointer [&_div_div:hover]:bg-muted [&_div_div]:p-3 [&_div_div]:flex [&_div_div]:flex-col [&_div_div]:gap-1 [&_div_div]:before:truncate [&_div_div]:before:content-[attr(data-sql)] [&_div_div]:after:content-[attr(data-timestamp)] [&_div_div]:after:text-xs [&_div_div]:after:text-muted-foreground",
            scripted(
              (
                node: HTMLDivElement,
                { sql, timestamp }: { sql: string; timestamp: number },
              ) => {
                const sqlKey = "sql_history_V2";
                const sqlHistory = JSON.parse(
                  globalThis.localStorage.getItem(sqlKey) ?? "[]",
                );
                if (sql && sql !== sqlHistory[sqlHistory.length - 1]?.sql) {
                  sqlHistory.push({ sql, timestamp });
                  globalThis.localStorage.setItem(
                    sqlKey,
                    JSON.stringify(sqlHistory),
                  );
                }
                for (const item of sqlHistory.toReversed()) {
                  const container = document.createElement("div");
                  const div = document.createElement("div");
                  div.dataset.sql = item.sql.slice(0, 50);
                  div.dataset.timestamp = new Date(
                    item.timestamp,
                  ).toLocaleString("fr-FR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  });
                  div.addEventListener("click", () => {
                    const editor = document.querySelector("[contenteditable]");
                    if (editor) editor.innerHTML = item.sql;
                  });
                  const close = document.createElement("button");
                  close.type = "button";
                  close.addEventListener("click", () => {
                    globalThis.localStorage.setItem(
                      sqlKey,
                      JSON.stringify(
                        sqlHistory.filter((v) =>
                          v.timestamp !== item.timestamp
                        ),
                      ),
                    );
                    container.remove();
                  });
                  container.appendChild(div);
                  container.appendChild(close);
                  node.appendChild(container);
                }
              },
              { sql, timestamp },
            ),
          )}
        />
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <Button type="submit">Submit</Button>
        <div className="text-muted-foreground text-xs">{result?.error}</div>
      </div>
      <DataTable
        name={"query"}
        columns={Object.entries(result?.data?.[0] ?? {}).map((
          [key, value],
        ) => ({
          name: key,
          type: typeof value as any,
        })) as any}
        data={result?.data ?? []}
      />
    </form>
  );
};
