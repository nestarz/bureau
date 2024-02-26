import type { SqliteMiddlewareState } from "outils/database/sqlite/createSqlitePlugin.ts";
import type { PluginRoute } from "outils/fresh/types.ts";
import { join } from "@std/path/join";
import columnSafe from "@/src/routes/analytics/utils/columnSafe.ts";

type ActiveSessions = { [ip: string]: number };

const createGetSessionId = (
  activeSessions: ActiveSessions = {}
): ((ip: string) => number) => {
  const getSessionId = (ip: string): number => {
    const halfHourAgo = Date.now() + 1000 * 60 * 60 * -0.5;
    if (!activeSessions[ip] || activeSessions[ip] < halfHourAgo) {
      activeSessions[ip] = new Date().getTime();
    }
    return activeSessions[ip];
  };
  return getSessionId;
};

const getSessionId: (ip: string) => number = createGetSessionId();

export type GetIpData = (ip: string) => Promise<
  | null
  | undefined
  | {
      latitude: string;
      longitude: string;
      country_code: string;
      region_code: string;
      city_name: string;
    }
>;

export const createApiLogVisitPluginRoute = ({
  basePath,
  getIpData,
}: {
  basePath?: string;
  getIpData?: GetIpData;
}): PluginRoute<SqliteMiddlewareState<any, "analytics">> => ({
  path: join(basePath ?? "", "/api/log/visit{/}?"),
  handler: {
    POST: async (req, ctx) => {
      const json = await req.json();
      const { hostname } = ctx?.remoteAddr ?? {};
      const ip =
        req.headers.get("x-forwarded-for")?.split(",").shift() || hostname;
      const geo = ip ? await getIpData?.(ip) : null;
      const payload = {
        ...json,
        session_id: new Date(ip ? getSessionId(ip) : new Date()).getTime(),
        user_agent: req.headers.get("user-agent") ?? json.user_agent,
        ip,
        latitude: geo?.latitude,
        longitude: geo?.longitude,
        country_code: geo?.country_code,
        region_name: geo?.region_code,
        city_name: geo?.city_name,
      };

      const keys = Object.keys(payload).map(columnSafe);
      const columns = keys.map((v) => `"${v}"`).join(", ");
      const placeholders = keys.map(() => `?`).join(", ");
      const query = `INSERT INTO analytics_visits (${columns}) VALUES (${placeholders});`;
      const values = Object.values(payload).map((d) =>
        typeof d === "object" && d !== null
          ? JSON.stringify(d)
          : (d as any) ?? null
      );
      const res = await ctx.state.db.query(query, values);
      return new Response(JSON.stringify(res));
    },
  },
});
