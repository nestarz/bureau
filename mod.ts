import pipe from "https://deno.land/x/pipe@0.3.0/mod.ts";
import { setup } from "https://deno.land/x/rotten@0.2.6/islands.ts";
import { render } from "https://esm.sh/preact-render-to-string@6.0.3&deps=preact@10.15.0";
import TwindStream from "https://esm.sh/@twind/with-react@1.1.3/readableStream.js";
import { h } from "https://esm.sh/preact@10.15.0";
import { twind, virtual } from "https://esm.sh/@twind/core@1.1.3";
import { lookup } from "https://deno.land/x/mrmime@v1.0.1/mod.ts";

import * as Client from "./src/islands/Client.tsx";
import * as ApiMedias from "./src/routes/api/medias.ts";
import { twindOptions } from "./twind.ts";

import type { S3Client } from "https://deno.land/x/s3_lite_client@0.5.0/mod.ts";
export type { S3Client } from "https://deno.land/x/s3_lite_client@0.5.0/mod.ts";
import type { Routes } from "https://deno.land/x/rutt@0.1.0/mod.ts";
export type { Routes } from "https://deno.land/x/rutt@0.1.0/mod.ts";

export default async (
  prefix: string,
  s3: S3Client,
  getS3Uri: (key: string) => string | URL,
  gqlHttpUrl: string,
  gqlWebsocketUrl: string
): Promise<Routes> => {
  const { register, ...islands } = await setup({
    baseUrl: new URL(import.meta.url),
    islands: ["./src/islands/Client.tsx"].map(
      (v) => new URL(v, new URL(".", import.meta.url))
    ),
    prefix: `${prefix}/islands/`,
  });

  const rotten = (route: { default: (...args: any) => string }) =>
    pipe(
      route.default,
      (vn) =>
        new ReadableStream({
          start(controller) {
            controller.enqueue(
              new TextEncoder().encode("<!DOCTYPE html>".concat(render(vn)))
            );
            controller.close();
          },
        }),
      (stream: ReadableStream) =>
        stream.pipeThrough(
          new TwindStream(twind(twindOptions(prefix), virtual(true)))
        ),
      islands.inject,
      (body) => new Response(body, { headers: { "content-type": "text/html" } })
    );

  return {
    "/api/medias": (req) => ApiMedias.handler(req, { s3, getS3Uri }),
    "GET@/islands/:file": async (req: Request) =>
      new Response(await islands.get(req.url), {
        headers: { "content-type": "text/javascript" },
      }),
    "GET@/static/*": async (req: Request) => {
      const url = new URL(
        "." +
          decodeURIComponent(new URL(req.url).pathname).slice(prefix.length),
        import.meta.url
      );
      console.log(url, import.meta.url);
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
    "GET@/*": rotten({
      default: (req: Request) => {
        const apiKey = req.headers.get("authorization");
        const props = { apiKey, gqlHttpUrl, gqlWebsocketUrl };
        props.className = register("Client", props);
        return h("html", null, [
          h("head"),
          h("body", null, h(Client.default, props)),
        ]);
      },
    }),
  };
};
