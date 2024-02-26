import { createApiLogExitPluginRoute } from "@/src/routes/analytics/api/logExit.ts";
import {
  createApiLogVisitPluginRoute,
  type GetIpData,
} from "@/src/routes/analytics/api/logVisit.ts";
import { createApiLogEventPluginRoute } from "@/src/routes/analytics/api/logEvent.ts";
import { createApiClientPluginRoute } from "@/src/routes/analytics/api/client.ts";
import { Plugin } from "outils/fresh/types.ts";
import createRequiredTables from "@/src/routes/analytics/utils/createRequiredTables.ts";
import createSqlitePlugin, {
  SqliteMiddlewareState,
} from "outils/database/sqlite/createSqlitePlugin.ts";

export interface AnalyticsConfig {
  getIpData?: GetIpData;
  databaseKey?: string;
  database: any;
  basePath?: string;
}

export const createAnalyticsPlugin = async (
  config: AnalyticsConfig,
): Promise<Plugin<SqliteMiddlewareState<any>>> => {
  if (config.database) await createRequiredTables(config.database);

  const sqlitePlugin = await createSqlitePlugin({
    namespace: "analytics",
    database: config.database,
    withDeserializeNestedJSON: true,
  });

  return {
    name: "analyticsPlugin",
    middlewares: sqlitePlugin.middlewares,
    routes: [
      createApiLogEventPluginRoute(config),
      createApiLogVisitPluginRoute(config),
      createApiLogExitPluginRoute(config),
      createApiClientPluginRoute(config),
    ],
  };
};
