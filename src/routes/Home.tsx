import { FreshContext, RouteConfig } from "outils/fresh/types.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import type { SqliteMiddlewareState } from "outils/database/sqlite/createSqlitePlugin.ts";

export const config: RouteConfig = {
  routeOverride: "/",
};

export default async (
  _req: Request,
  _ctx: FreshContext<ClientMiddleware & SqliteMiddlewareState<any>>,
) => {
  return new Response(null, {
    status: 302,
    headers: { Location: "/admin/analytics" },
  });
};


import React from "react";
const A = (): React.ReactElement => <div />;
const B = (): React.ReactElement => <A />;
