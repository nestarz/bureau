import type { SqliteMiddlewareState } from "outils/database/sqlite/createSqlitePlugin.ts";
import type { PluginRoute } from "outils/fresh/types.ts";
import { join } from "@std/path/join";
import columnSafe from "@/src/routes/analytics/utils/columnSafe.ts";

export const createApiLogEventPluginRoute = ({
  basePath,
}: {
  basePath?: string;
}): PluginRoute<SqliteMiddlewareState<any>> => ({
  path: join(basePath ?? "", "/api/log/event{/}?"),
  handler: {
    POST: async (req: Request, ctx) => {
      const payload = await req.json();
      const keys = Object.keys(payload).map(columnSafe);
      const columns = keys.map((v) => `"${v}"`).join(", ");
      const placeholders = keys.map(() => `?`).join(", ");
      const query = `INSERT INTO analytics_events (${columns}) VALUES (${placeholders});`;
      const values = Object.values(payload).map((d: any) =>
        typeof d === "object" && d !== null ? JSON.stringify(d) : d ?? null
      );
      const res = await ctx.state.db.query(query, values);
      return new Response(JSON.stringify(res));
    },
  },
});
