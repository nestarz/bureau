import type { Plugin } from "https://deno.land/x/fresh@1.6.3/server.ts";
import { join } from "https://deno.land/std@0.215.0/path/join.ts";
import columnSafe from "../utils/columnSafe.ts";

export const createApiLogExitPlugin = ({
  parentPathSegment,
}: {
  parentPathSegment: string;
}): Plugin => ({
  name: "createApiLogExitPlugin",
  routes: [
    {
      path: join(parentPathSegment, "/api/log/exit{/}?"),
      handler: {
        POST: async (req: Request, ctx) => {
          const { id, ...payload } = await req.json();
          const upCols = (v: string) =>
            ["load_time", "visit_duration"].includes(v);
          const keys = Object.keys(payload).map(columnSafe).filter(upCols);
          const updates = keys.map((key) => `"${key}" = ?`).join(", ");
          const query = `UPDATE analytics_visits SET ${updates} WHERE id = ?;`;
          const values = Object.values(payload).map((d) =>
            typeof d === "object" && d !== null ? JSON.stringify(d) : d ?? null
          );
          const res = await ctx.state.db.query(query, [...values, id]);
          return new Response(JSON.stringify(res));
        },
      },
    },
  ],
});
