import { router } from "rutt";
import renderToString from "preact-render-to-string";
import createContentManagementSystem from "bureau/mod.ts";
import createRenderPipe from "outils/createRenderPipe.ts";
import createBasicAuth from "outils/createBasicAuth.ts";
import { createCors } from "outils/cors.ts";
import { middleware } from "outils/fresh/middleware.ts";

import { databases, getS3Uri, s3Client } from "./database.ts";

const renderPipe = createRenderPipe((vn) =>
  "<!DOCTYPE html>".concat(renderToString(vn))
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
      analytics: databases.analytics,
      analyticsKey: "analytics.sqlite",
      parentPathSegment: "/admin",
      middleware: [
        createBasicAuth(
          Deno.env.get("BASIC_AUTH_USERNAME")!,
          Deno.env.get("BASIC_AUTH_PASSWORD")!
        )((_req, ctx) => ctx.next()),
        createCors({ hostnames: ["localhost"] })((_req, ctx) => ctx.next()),
      ],
    }),
    ...[{ config: { routeOverride: "/" }, default: () => "ok" }].reduce(
      (acc, module) => ({ ...acc, ...route(module) }),
      {}
    ),
  })
).finished;
