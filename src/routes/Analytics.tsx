import { FreshContext, RouteConfig } from "outils/fresh/types.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import type { SqliteMiddlewareState } from "outils/database/sqlite/createSqlitePlugin.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card.tsx";
import DataTable from "@/src/components/DataTable.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs.tsx";

export const config: RouteConfig = {
  routeOverride: "/analytics{/}?",
};

const createColumnsFromData = (
  data: { [key: string]: any }[],
): { name: string; type: string }[] =>
  Object.entries(data?.[0] ?? {}).map(([key, value]) => ({
    name: key,
    type: typeof value,
  }));

interface AnalyticsData {
  hits: number;
  uniques: number;
  sessions: number;
  bounces: number;
  daily: {
    date: string;
    count: number;
  }[];
  session_duration: number | null;
  visit_duration: number | null;
  load_time: number | null;
  cities: {
    city_name: string | null;
    country_code: string | null;
    views: number;
  }[];
  regions: {
    region_name: string | null;
    country_code: string | null;
    views: number;
  }[];
  countries: {
    country_code: string | null;
    views: number;
  }[];
  screens: {
    width: number;
    height: number;
    views: number;
  }[];
  locations: {
    path: string;
    views: number;
  }[];
  devices: {
    device: string;
    views: number;
  }[];
  browsers: {
    browser: string;
    views: number;
  }[];
  versions: {
    version: string;
    views: number;
  }[];
  parameters: any[];
  referrers: {
    referrer: string;
    views: number;
  }[];
  external_links: any[];
}

export default async (
  _req: Request,
  ctx: FreshContext<ClientMiddleware & SqliteMiddlewareState<any, "analytics">>,
) => {
  const table: AnalyticsData = await ctx.state.clientQuery
    .analytics((qb) => ({
      query: null!,
      parameters: [],
      sql: `WITH
    filtered AS (SELECT * FROM analytics_visits WHERE hostname NOT LIKE '%deno.dev' AND hostname NOT LIKE '%localhost%'),
    ua AS (
      SELECT
        CASE
          WHEN (user_agent LIKE '%tablet%' OR user_agent LIKE '%ipad%' OR user_agent LIKE '%playbook%' OR user_agent LIKE '%silk%') OR (user_agent LIKE '%android%' AND user_agent NOT LIKE '%mobi%') THEN 'tablet'
          WHEN (user_agent LIKE '%Mobile%' OR user_agent LIKE '%iP%' OR user_agent LIKE '%Android%' OR user_agent LIKE '%BlackBerry%' OR user_agent LIKE '%IEMobile%') OR (user_agent LIKE '%Kindle%' OR user_agent LIKE '%Silk-Accelerated%' OR user_agent LIKE '%hpwOS%' OR user_agent LIKE '%webOS%' OR user_agent LIKE '%Opera M%') THEN 'mobile'
          ELSE 'desktop'
        END AS device,
        CASE
          WHEN user_agent LIKE '%edg%' THEN 'Microsoft Edge'
          WHEN user_agent LIKE '%trident%' THEN 'Microsoft Internet Explorer'
          WHEN user_agent LIKE '%firefox%' OR user_agent LIKE '%fxios%' THEN 'Mozilla Firefox'
          WHEN user_agent LIKE '%chrome%' OR user_agent LIKE '%chromium%' OR user_agent LIKE '%crios%' THEN 'Google Chrome'
          WHEN user_agent LIKE '%safari%' THEN 'Apple Safari'
          ELSE 'Unknown Browser'
        END AS browser,
        CASE
          WHEN user_agent LIKE '%firefox%' OR user_agent LIKE '%fxios%' THEN
            'Firefox ' || SUBSTR(user_agent, INSTR(user_agent, 'Firefox/') + 8, LENGTH(user_agent))
          WHEN user_agent LIKE '%chrome%' OR user_agent LIKE '%chromium%' OR user_agent LIKE '%crios%' THEN
            'Chrome ' || SUBSTR(user_agent, INSTR(user_agent, 'Chrome/') + 7, 5)
          WHEN user_agent LIKE '%safari%' THEN
            'Apple Safari ' || SUBSTR(user_agent, INSTR(user_agent, 'Version/') + 8, 4)
          ELSE 'Unknown Version'
        END AS "version",
      *
      FROM filtered
    ),
    visits2 AS (SELECT *, SUBSTR(referrer, CASE WHEN INSTR(referrer, '://') > 0 THEN INSTR(referrer, '://') + 3 ELSE 1 END, CASE WHEN INSTR(SUBSTR(referrer, CASE WHEN INSTR(referrer, '://') > 0 THEN INSTR(referrer, '://') + 3 ELSE 1 END), '/') = 0 THEN LENGTH(referrer) ELSE INSTR(SUBSTR(referrer, CASE WHEN INSTR(referrer, '://') > 0 THEN INSTR(referrer, '://') + 3 ELSE 1 END), '/') - 1 END) as ref_hostname FROM ua),
    hits AS (SELECT COUNT(*) as hits FROM visits2),
    uniques AS (SELECT COUNT(DISTINCT ip) as uniques FROM visits2),
    "sessions" AS (SELECT COUNT(DISTINCT session_id) as "sessions" FROM visits2),
    bounces AS (SELECT COUNT(*) as bounces FROM (SELECT session_id, COUNT(*) as count FROM visits2 GROUP BY session_id HAVING count = 1) sq)
  SELECT
    json_object(
      'hits', (SELECT hits FROM hits),
      'uniques', (SELECT uniques FROM uniques),
      'sessions', (SELECT "sessions" FROM "sessions"),
      'bounces', (SELECT bounces FROM bounces),
      'daily', (SELECT json_group_array(json_object('date', date, 'count', count)) FROM (SELECT DATE(id/1000, 'unixepoch') as date, COUNT(*) as count FROM visits2 GROUP BY date ORDER BY date)),
      'session_duration', (SELECT avg(total_duration) FROM (SELECT session_id, SUM(visit_duration) as total_duration FROM visits2 GROUP BY session_id)),
      'visit_duration', (SELECT avg(visit_duration) FROM visits2 WHERE visit_duration > 0),
      'load_time', (SELECT avg(load_time) FROM visits2 WHERE load_time > 0),
      'cities', (SELECT json_group_array(json_object('city_name', city_name, 'country_code', country_code, 'views', count)) FROM (SELECT country_code, city_name, COUNT(*) as count FROM visits2 GROUP BY country_code, city_name ORDER BY count DESC)),
      'regions', (SELECT json_group_array(json_object('region_name', region_name, 'country_code', country_code, 'views', count)) FROM (SELECT country_code, region_name, COUNT(*) as count FROM visits2 GROUP BY country_code, region_name ORDER BY count DESC)),
      'countries', (SELECT json_group_array(json_object('country_code', country_code, 'views', count)) FROM (SELECT country_code, COUNT(*) as count FROM visits2 GROUP BY country_code ORDER BY count DESC)),
      'screens', (SELECT json_group_array(json_object('width', screen_width, 'height', screen_height, 'views', count)) FROM (SELECT screen_width, screen_height, COUNT(*) as count FROM visits2 GROUP BY screen_width, screen_height ORDER BY count DESC)),
      'locations', (SELECT json_group_array(json_object('path', path, 'views', count)) FROM (SELECT path, COUNT(*) as count FROM visits2 GROUP BY path ORDER BY count DESC)),
      'devices', (SELECT json_group_array(json_object('device', device, 'views', count)) FROM (SELECT device, COUNT(*) as count FROM visits2 GROUP BY device ORDER BY count DESC)),
      'browsers', (SELECT json_group_array(json_object('browser', browser, 'views', count)) FROM (SELECT browser, COUNT(*) as count FROM visits2 GROUP BY browser ORDER BY count DESC)),
      'versions', (SELECT json_group_array(json_object('version', "version", 'views', count)) FROM (SELECT "version", COUNT(*) as count FROM visits2 GROUP BY "version" ORDER BY count DESC)),
      'parameters', (SELECT json_group_array(json_object('key', key, 'value', value, 'views', count)) FROM (SELECT key, value, COUNT(*) as count FROM (SELECT json_each.key as key, json_each.value as value FROM visits2, json_each(visits2.parameters) WHERE key != 'fbclid') GROUP BY key, value ORDER BY count DESC)),
      'referrers', (SELECT json_group_array(json_object('referrer', referrer, 'views', count)) FROM (SELECT referrer, COUNT(*) as count FROM visits2 WHERE ref_hostname != hostname AND LENGTH(referrer) > 0 GROUP BY referrer ORDER BY count DESC)),
      'external_links', (SELECT json_group_array(json_object('href', href, 'count', count)) FROM (SELECT json_extract("value",'$.href') as href, COUNT(*) as count FROM analytics_events WHERE "action" = 'CLICK' AND category = 'EXTERNAL_LINK' GROUP BY href ORDER BY count DESC))
    ) as result
  FROM hits, uniques, "sessions", bounces;`,
    }))
    .then((r) => JSON.parse((r[0] as any).result))
    .catch(() => null);

  const tabs = [
    { data: table.referrers, title: "Top Sources" },
    { data: table.cities, title: "Cities" },
    { data: table.countries, title: "Countries" },
    { data: table.devices, title: "Devices" },
    { data: table.browsers, title: "Browsers" },
    { data: table.versions, title: "Versions" },
    { data: table.screens, title: "Screens" },
    { data: table.external_links, title: "External Links" },
    { data: table.parameters, title: "Parameters" },
  ];

  return (
    <div className="flex flex-col gap-4 bg-background p-6 col-span-4">
      <div className="flex gap-2 w-full justify-between">
        <div className="flex flex-col space-y-2">
          <div className="text-lg font-semibold text-foreground capitalize">
            Analytics
          </div>
          <div className="text-sm text-muted-foreground">
            See here the activity on your site.
          </div>
        </div>
      </div>
      <div className="flex items-start flex-wrap gap-2 justify-between">
        {[
          { label: "Visits", value: table.sessions },
          { label: "Uniques", value: table.uniques },
          {
            label: "Pageview Avg.",
            value: (table.hits / (table.sessions ?? 1)).toFixed(1),
          },
          {
            label: "Bounce Rate",
            value: (table.bounces / table.sessions)?.toLocaleString("fr", {
              style: "percent",
              maximumFractionDigits: 1,
            }),
          },
          {
            label: "Load time (ms)",
            value: table.load_time
              ? (table.load_time * 1000)?.toLocaleString("fr", {
                maximumFractionDigits: 0,
              })
              : null,
          },
          {
            label: "Visit duration (s)",
            value: table.visit_duration?.toLocaleString("fr", {
              maximumFractionDigits: 0,
            }),
          },
        ].map(({ label, value }) => (
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value ?? "N/A"}</div>
              {false && (
                <p className="text-xs text-muted-foreground pt-1">
                  +20% from last month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <Tabs defaultValue={tabs[0]?.title}>
        <TabsList className="flex w-full">
          {tabs.map(({ title }) => (
            <TabsTrigger value={title}>{title}</TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(({ data, title }) => (
          <TabsContent
            value={title}
            forceMount={!globalThis?.document ? true : undefined}
            className="data-[state=inactive]:hidden"
          >
            <DataTable
              columns={createColumnsFromData(data)}
              data={data}
              name={title}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
