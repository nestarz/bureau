import { FreshContext, RouteConfig } from "outils/createRenderPipe.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import type { SqliteMiddlewareState } from "outils/sqliteMiddleware.ts";

export const config: RouteConfig["config"] = {
  routeOverride: "/",
};

export default async (
  _req: Request,
  _ctx: FreshContext<ClientMiddleware & SqliteMiddlewareState<any>>
) => {
  return new Response(null, {
    status: 302,
    headers: { Location: "/admin/analytics" },
  });
};
