import * as Islands from "https://deno.land/x/islet@0.0.58/server.ts";
import middleware from "https://deno.land/x/outils@0.0.103/fresh/middleware.ts";
import * as staticFileRoute from "https://deno.land/x/outils@0.0.103/staticFileRoute.ts";
import { twind, virtual } from "https://esm.sh/@twind/core@1.1.3";
import TwindStream from "https://esm.sh/@twind/with-react@1.1.3/readableStream.js";
import { render as renderToString } from "https://esm.sh/preact-render-to-string@6.3.1&deps=preact@10.19.2&target=es2022";
import prepass from "https://esm.sh/preact-ssr-prepass@1.2.0?target=es2022&deps=preact@10.19.2";
import toReadableStream from "https://esm.sh/to-readable-stream@4.0.0";

import * as ApiMedias from "./src/routes/api/medias.ts";
import * as Home from "./src/routes/Home.tsx";
import twindConfig from "./twind.config.ts";

import type { S3Client } from "https://deno.land/x/s3_lite_client@0.6.1/mod.ts";
export type { S3Client } from "https://deno.land/x/s3_lite_client@0.6.1/mod.ts";
import type { Routes } from "https://deno.land/x/rutt@0.2.0/mod.ts";
export type { Routes } from "https://deno.land/x/rutt@0.2.0/mod.ts";

export interface ContentManagmentSystemOptions {
  prefix: string;
  s3Client: S3Client;
  getS3Uri: (key: string) => string | URL;
  graphqlPath: string;
  middleware?:
    | Parameters<typeof middleware>[0]
    | Parameters<typeof middleware>[0][];
}

import type { defineLayout } from "$fresh/src/server/defines.ts";
import type {
  HandlerContext,
  Handlers,
} from "https://deno.land/x/fresh@1.4.2/server.ts";
import { pipe } from "outils/pipe.ts";

type PipelineFunction<In, Out> = (arg: In) => Out | Promise<Out>;

export const createRenderPipe =
  <
    First extends <T>(vnode: T) => any | Promise<any>,
    Middle extends PipelineFunction<any, any>[],
    Last extends PipelineFunction<
      any,
      BodyInit | null | Promise<BodyInit | null>
    >
  >(
    firstFn: First,
    ...fns: [...Middle, Last]
  ) =>
  (
    route: {
      default: (<T>(props: Record<string, unknown>) => T) | Handlers["GET"];
      handler: Handlers;
      config?: { routeOverride?: string };
    },
    config?: {
      responseInit?: ResponseInit;
      Layout?: { default: ReturnType<typeof defineLayout> };
    }
  ) =>
  (req: Request, ctx: HandlerContext, matcher?: Record<string, string>) => {
    const url = new URL(req.url);
    const newCtx = matcher ? { ...ctx, params: matcher, url } : { ...ctx, url };
    const props = { url, ctx: newCtx };

    const vNodePipe = pipe(
      firstFn,
      ...fns as any[],
      (result: Response | BodyInit | null) =>
        result instanceof Response
          ? result
          : new Response(result, {
              headers: {
                "content-type": "text/html; charset=utf-8",
              },
              ...(config?.responseInit ?? {}),
            })
    );

  const render = route.default
    ? pipe(
      (data: unknown) =>
        route.handler?.GET ? [{ ...props, data }] : [req, newCtx],
      ([p1, p2]) =>
        Promise.resolve().then(() => route.default?.(p1, p2))
          .catch((err) => (console.error(err), Promise.reject(err))),
      (node) => [node, { ...newCtx, Component: () => node }],
      ([node, ctx]) =>
        node instanceof Response ? node : vNodePipe(
          Promise.resolve().then(() => config?.Layout?.default(req, ctx) ?? node).catch(
            (err) => (console.error(err), Promise.reject(err)),
          ),
        ),
    )
    : undefined;
    
    return (
      route.handler?.[req.method]?.(req, { ...newCtx, render, vNodePipe }) ??
      (req.method === "GET" ? render?.() : new Response(null, { status: 404 }))
    );
  };

export default async ({
  prefix,
  s3Client,
  getS3Uri,
  graphqlPath,
  middleware: middlewareFns,
}: ContentManagmentSystemOptions): Promise<Routes> => {
  const renderPipe = createRenderPipe(
    async (vn) => (await prepass(vn), vn),
    (vn) => "<!DOCTYPE html>".concat(renderToString(vn)),
    (str: string) => new TextEncoder().encode(str),
    toReadableStream,
    Islands.addScripts,
    (stream: ReadableStream) =>
      stream.pipeThrough(
        new TwindStream(twind(twindConfig(prefix), virtual(true)))
      )
  );

  const withMiddlewares = (handler) =>
    middleware(
      ...(Array.isArray(middlewareFns)
        ? middlewareFns
        : middlewareFns
        ? [middlewareFns]
        : []),
      (_, ctx) => {
        ctx.state.gqlHttpUrl = graphqlPath;
        ctx.state.gqlWebsocketUrl = graphqlPath;
        return ctx.next();
      },
      handler
    );

  return {
    "/api/medias": withMiddlewares((req: Request) =>
      ApiMedias.handler(req, { s3Client, getS3Uri })
    ),
    [Islands.config.routeOverride]: await Islands.createHandler({
      key: "@bureaudouble/bureau",
      jsxImportSource: "preact",
      baseUrl: new URL(import.meta.url),
      prefix: `${prefix}/islands/`,
      importMapFileName: "import_map.json",
    }),
    [staticFileRoute.config.routeOverride!]: staticFileRoute.createHandler({
      baseUrl: import.meta.url,
      prefix,
    }),
    "GET@/*": withMiddlewares(renderPipe(Home)),
  };
};
