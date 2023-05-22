import pipe from "https://deno.land/x/pipe@0.3.0/mod.ts";
import doctype from "https://deno.land/x/rotten@0.2.1/doctype.ts";
import { render } from "https://esm.sh/*preact-render-to-string@5.2.0";
import TwindStream from "https://esm.sh/@twind/with-react@1.1.3/readableStream.js";
import { h } from "https://esm.sh/preact@10.13.2";
import { twind, virtual } from "https://esm.sh/v103/@twind/core@1.1.2";
import { setup } from "https://deno.land/x/rotten@0.2.1/islands.ts";

import * as Client from "./src/islands/Client.tsx";
import * as ApiMedias from "./src/routes/api/medias.ts";
import { twindOptions } from "./twind.ts";

import type { S3Client } from "https://deno.land/x/s3_lite_client@0.5.0/mod.ts";

export default async (
  prefix: string,
  s3: S3Client,
  getS3Uri: (key: string) => string | URL,
  gqlHttpUrl: string,
  gqlWebsocketUrl: string
) => {
  const { register, ...islands } = await setup({
    baseUrl: import.meta.url,
    islands: new URL("./src/islands", import.meta.url),
    prefix: `${prefix}/islands/`,
  });

  const rotten = (route: { default: (...args: any) => string }) =>
    pipe(
      route.default,
      (vn) =>
        new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode(render(vn)));
            controller.close();
          },
        }),
      (stream: ReadableStream) =>
        stream.pipeThrough(new TwindStream(twind(twindOptions, virtual(true)))),
      islands.inject,
      doctype(["html"]),
      (body) => new Response(body, { headers: { "content-type": "text/html" } })
    );

  return {
    "/api/medias": (req) => ApiMedias.handler(req, { s3, getS3Uri }),
    "GET@/islands/:file": async (req: Request) =>
      new Response(await islands.get(req.url), {
        headers: { "content-type": "text/javascript" },
      }),
    "GET@/static/*": async (req: Request) => {
      const path = await Deno.realPath(
        decodeURIComponent(`.${new URL(req.url).pathname}`)
      )
        .then((path) => (path.startsWith(Deno.cwd() + "/static") ? path : null))
        .catch(() => null);
      return path
        ? new Response(await Deno.readFile(path))
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
