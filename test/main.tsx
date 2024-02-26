import { router } from "rutt";
import renderToString from "preact-render-to-string";
import createContentManagementSystem from "bureau/mod.ts";
import createRenderPipe from "old_outils/createRenderPipe.ts";
import createBasicAuth from "old_outils/createBasicAuth.ts";
import { createCors } from "old_outils/cors.ts";
import { middleware } from "old_outils/fresh/middleware.ts";

import { databases, getS3Uri, s3Client } from "./database.ts";

const renderPipe = createRenderPipe((vn) =>
  "<!DOCTYPE html>"
    .concat(renderToString(vn))
    .concat(`<script src="/analytics/client.js" />`)
);

const route = (module: Parameters<typeof renderPipe>[0]) => ({
  [module.config!.routeOverride!]: middleware(
    ...(module?.middleware?.handler ? module?.middleware.handler : []),
    renderPipe(module)
  ),
});

Deno.serve(
  { port: 8029 },
  router({
    "/admin": await createContentManagementSystem({
      s3Client,
      getS3Uri,
      database: databases.main,
      analyticsConfig: {
        database: databases.analytics,
        databaseKey: "analytics.sqlite",
        basePath: "../analytics",
      },
      basePath: "/admin",
    }),
    ...[{ config: { routeOverride: "/" }, default: () => "ok" }].reduce(
      (acc, module) => ({ ...acc, ...route(module) }),
      {}
    ),
  })
).finished;
