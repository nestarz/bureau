import type { Plugin } from "https://deno.land/x/fresh@1.6.3/server.ts";
import { createApiLogExitPlugin } from "@/src/routes/analytics/api/logExit.ts";
import { createApiLogVisitPlugin } from "@/src/routes/analytics/api/logVisit.ts";
import { createApiLogEventPlugin } from "@/src/routes/analytics/api/logEvent.ts";
import { createApiClientPlugin } from "@/src/routes/analytics/api/client.ts";

export const createAnalyticsPlugin = (options): Plugin[] => [
  createApiLogEventPlugin(options),
  createApiLogVisitPlugin(options),
  createApiLogExitPlugin(options),
  createApiClientPlugin(options),
];
