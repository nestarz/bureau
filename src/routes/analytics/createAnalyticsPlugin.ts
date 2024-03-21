import { createApiLogExitPluginRoute } from "@/src/routes/analytics/api/logExit.ts";
import {
  createApiLogVisitPluginRoute,
  type GetIpData,
} from "@/src/routes/analytics/api/logVisit.ts";
import { createApiLogEventPluginRoute } from "@/src/routes/analytics/api/logEvent.ts";
import { createApiClientPluginRoute } from "@/src/routes/analytics/api/client.ts";
import { Plugin } from "outils/fresh/types.ts";
import createSqlitePlugin, {
  type SqliteMiddlewareConfig,
  type SqliteMiddlewareState,
} from "outils/database/sqlite/createSqlitePlugin.ts";
import createRequiredTables from "@/src/routes/analytics/utils/createRequiredTables.ts";

export interface AnalyticsConfig {
  getIpData?: GetIpData;
  databaseKey?: string;
  getDatabase: SqliteMiddlewareConfig["getDatabase"];
  basePath?: string;
}

export const createAnalyticsPlugin = async (
  config: AnalyticsConfig,
): Promise<Plugin<SqliteMiddlewareState<any, "analytics">>> => {
  const sqlitePlugin = await createSqlitePlugin({
    namespace: "analytics",
    getDatabase: config.getDatabase,
    withDeserializeNestedJSON: true,
    disableWritingTypes: true,
  });

  let createPromise: Promise<any> | undefined;
  return {
    name: "analyticsPlugin",
    middlewares: [
      ...(sqlitePlugin.middlewares ?? []),
      {
        path: "",
        middleware: {
          handler: async (_req, ctx) => {
            createPromise ??= ctx.state.db
              ? createRequiredTables(ctx.state.db)
              : undefined;
            await createPromise;
            return ctx.next();
          },
        },
      },
    ],
    routes: [
      createApiLogEventPluginRoute(config),
      createApiLogVisitPluginRoute(config),
      createApiLogExitPluginRoute(config),
      createApiClientPluginRoute(config),
    ],
  };
};
