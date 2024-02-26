import type { SqliteMiddlewareState } from "outils/database/sqlite/createSqlitePlugin.ts";
import type { PluginRoute } from "outils/fresh/types.ts";
import { join } from "@std/path/join";
import columnSafe from "@/src/routes/analytics/utils/columnSafe.ts";

export const createApiLogExitPluginRoute = ({
  basePath,
}: {
  basePath?: string;
}): PluginRoute<SqliteMiddlewareState<any, "analytics">> => ({
  path: join(basePath ?? "", "/api/log/exit{/}?"),
  handler: {
    POST: async (req: Request, ctx) => {
      const { id, ...payload } = await req.json();
      const upCols = (v: string) => ["load_time", "visit_duration"].includes(v);
      const keys = Object.keys(payload).map(columnSafe).filter(upCols);
      const updates = keys.map((key) => `"${key}" = ?`).join(", ");
      const query = `UPDATE analytics_visits SET ${updates} WHERE id = ?;`;
      const values = Object.values(payload).map((d: any) =>
        typeof d === "object" && d !== null ? JSON.stringify(d) : d ?? null
      );
      const res = await ctx.state.db.query(query, [...values, id]);
      return new Response(JSON.stringify(res));
    },
  },
});
