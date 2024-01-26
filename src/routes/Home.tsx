/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx as _jsx } from "../jsx-runtime.ts";
import Client from "../components/Client.tsx";

const jsx = (a, b, ...c: unknown[]) => _jsx(a, { children: c, ...(b ?? {}) });

export default (req: Request, ctx) => {
  const data = {
    apiKey: req.headers.get("authorization"),
    gqlHttpUrl: ctx.state.gqlHttpUrl,
    gqlWebsocketUrl: ctx.state.gqlWebsocketUrl,
    s3PublicUrl: Deno.env.get("S3_PUBLIC_URL"),
  };
  return (
    <html>
      <head></head>
      <body>
        <Client {...data} />
      </body>
    </html>
  );
};
