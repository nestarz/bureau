import type { Plugin } from "https://deno.land/x/fresh@1.6.3/server.ts";
import columnSafe from "../utils/columnSafe.ts";
import { join } from "https://deno.land/std@0.215.0/path/join.ts";

export const createApiLogEventPlugin = ({
  parentPathSegment,
}: {
  parentPathSegment: string;
}): Plugin => ({
  name: "createApiLogEventPlugin",
  routes: [
    {
      path: join(parentPathSegment, "/api/log/event{/}?"),
      handler: {
        POST: async (req: Request, ctx) => {
          const payload = await req.json();
          const keys = Object.keys(payload).map(columnSafe);
          const columns = keys.map((v) => `"${v}"`).join(", ");
          const placeholders = keys.map(() => `?`).join(", ");
          const query = `INSERT INTO analytics_events (${columns}) VALUES (${placeholders});`;
          const values = Object.values(payload).map((d) =>
            typeof d === "object" && d !== null ? JSON.stringify(d) : d ?? null
          );
          const res = await ctx.state.db.query(query, values);
          return new Response(JSON.stringify(res));
        },
      },
    },
  ],
});
