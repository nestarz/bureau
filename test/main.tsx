import "std/dotenv/load.ts";

import { router } from "rutt";
import renderToString from "preact-render-to-string";
import createContentManagementSystem from "bureau";
import createGQLite from "gqlite";
import createRenderPipe from "outils/createRenderPipe.ts";
import createBasicAuth from "outils/createBasicAuth.ts";
import { createCors } from "outils/cors.ts";
import { middleware } from "outils/fresh/middleware.ts";

import { databases, getS3Uri, s3Client } from "./database.ts";

const graphql = await createGQLite(databases.main, {
  generateTypeScriptDefinitions: true,
});

const renderPipe = createRenderPipe((vn) =>
  "<!DOCTYPE html>".concat(renderToString(vn))
);

const route = (module: Parameters<typeof renderPipe>[0]) => ({
  [module.config!.routeOverride!]: middleware(
    graphql.freshMiddleware,
    ...(module?.middleware?.handler ? module?.middleware.handler : []),
    renderPipe(module)
  ),
});

await Deno.serve(
  { port: 8028 },
  router({
    "/graphql": graphql.handler,
    "/admin": await createContentManagementSystem({
      s3Client,
      getS3Uri,
      graphqlPath: "/graphql",
      prefix: "/admin",
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
