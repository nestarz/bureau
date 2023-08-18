/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "../jsx-runtime.ts";
import Client from "../components/Client.tsx";

export const handler = {
  GET: (req: Request, ctx) =>
    ctx.render({
      apiKey: req.headers.get("authorization"),
      gqlHttpUrl: ctx.state.gqlHttpUrl,
      gqlWebsocketUrl: ctx.state.gqlWebsocketUrl,
    }),
};

export default ({ data }) => (
  <html>
    <head></head>
    <body>
      <Client {...data} />
    </body>
  </html>
);
