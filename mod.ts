import pipe from "https://deno.land/x/pipe@0.3.0/mod.ts";
import * as Islands from "https://deno.land/x/islet@0.0.8/server.ts";
import { render as renderToString } from "https://esm.sh/preact-render-to-string@6.2.0&deps=preact@10.15.1&target=es2022";
import TwindStream from "https://esm.sh/@twind/with-react@1.1.3/readableStream.js";
import { twind, virtual } from "https://esm.sh/@twind/core@1.1.3";
import { lookup } from "https://deno.land/x/mrmime@v1.0.1/mod.ts";
import toReadableStream from "https://esm.sh/to-readable-stream@4.0.0";
import middleware from "https://deno.land/x/outils@0.0.19/fresh/middleware.ts";

import * as Home from "./src/routes/Home.tsx";
import * as ApiMedias from "./src/routes/api/medias.ts";
import twindConfig from "./twind.config.ts";

import type { S3Client } from "https://deno.land/x/s3_lite_client@0.5.0/mod.ts";
export type { S3Client } from "https://deno.land/x/s3_lite_client@0.5.0/mod.ts";
import type { Routes } from "https://deno.land/x/rutt@0.1.0/mod.ts";
export type { Routes } from "https://deno.land/x/rutt@0.1.0/mod.ts";

const createRotten =
  (prefix: string) =>
  (route: {
    default: (props: Record<string, unknown>) => VNode;
    handler: Handlers;
  }) =>
  (req: Request, ctx: HandlerContext, matcher?: Record<string, string>) => {
    const newCtx = matcher ? { ...ctx, params: matcher } : ctx;
    const props = { url: new URL(req.url), ctx: newCtx };
    const render = route.default
      ? pipe(
          (data?: unknown) => route.default({ ...props, data }),
          (vn) => "<!DOCTYPE html>".concat(renderToString(vn)),
          (str: string) => new TextEncoder().encode(str),
          toReadableStream,
          Islands.addScripts,
          (stream: ReadableStream) =>
            stream.pipeThrough(
              new TwindStream(twind(twindConfig(prefix), virtual(true)))
            ),
          (body: ReadableStream) =>
            new Response(body, { headers: { "content-type": "text/html" } })
        )
      : undefined;
    return (
      route.handler?.[req.method]?.(req, { ...newCtx, render }) ??
      (req.method === "GET" ? render?.() : new Response(null, { status: 404 }))
    );
  };

export interface ContentManagmentSystemOptions {
  base: string;
  s3Client: S3Client;
  getS3Uri: (key: string) => string | URL;
  graphqlPath: string;
}

export default ({
  base,
  s3Client,
  getS3Uri,
  graphqlPath,
}: ContentManagmentSystemOptions): Promise<Routes> => {
  const rotten = createRotten(base);
  return {
    "/api/medias": (req: Request) =>
      ApiMedias.handler(req, { s3Client, getS3Uri }),
    [Islands.config.routeOverride]: Islands.createHandler({
      key: "cms",
      jsxImportSource: "preact",
      baseUrl: new URL(import.meta.url),
      prefix: `${base}/islands/`,
      importMapFileName: "import_map.json",
    }),
    "GET@/static/*": async (req: Request) => {
      const url = new URL(
        "." + decodeURIComponent(new URL(req.url).pathname).slice(base.length),
        import.meta.url
      );
      const resp = await fetch(url);
      const size = resp?.headers.get("content-length");
      return resp.status === 200
        ? new Response(resp.body, {
            headers: {
              "content-type": lookup(url.href),
              ...(size ? { "content-length": String(size) } : {}),
              "Access-Control-Allow-Credentials": "true",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods":
                "GET,OPTIONS,PATCH,DELETE,POST,PUT",
              "Access-Control-Allow-Headers": "*",
              "Cache-Control":
                "public, max-age=604800, must-revalidate, immutable",
            },
          })
        : new Response(null, { status: 404 });
    },
    "GET@/*": middleware((_, ctx) => {
      ctx.state.gqlHttpUrl = graphqlPath;
      ctx.state.gqlWebsocketUrl = graphqlPath;
      return ctx.next();
    }, rotten(Home)),
  };
};
