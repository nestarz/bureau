import {
  FreshContext,
  Handlers,
  RouteConfig,
} from "outils/fresh/types.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import type { SqliteMiddlewareState } from "outils/database/sqlite/createSqlitePlugin.ts";
import { Button } from "@/src/components/ui/button.tsx";

export const config: RouteConfig = {
  routeOverride: "/settings{/}?",
};

export const handler: Handlers<
  null,
  ClientMiddleware & SqliteMiddlewareState<any>
> = {
  POST: (req, _ctx) => {
    return new Response(null, {
      status: 302,
      headers: { Location: req.url },
    });
  },
};

export default async (
  _req: Request,
  ctx: FreshContext<ClientMiddleware & SqliteMiddlewareState<any>>
) => {
  const data = ctx.state.session.flash("x-data");

  return (
    <form
      className="flex flex-col gap-4 bg-background p-6 col-span-4"
      method="POST"
    >
      <div className="flex gap-2 w-full justify-between">
        <div className="flex flex-col space-y-2">
          <div className="text-lg font-semibold text-foreground capitalize">
            Settings
          </div>
          <div className="text-sm text-muted-foreground">
            Make changes to your CMS here. Click save when you're done.
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Button asChild disabled={!!ctx.state.databaseKey}>
          <a
            href={ctx.state.getS3Uri(ctx.state.databaseKey).href}
            className="flex gap-2 items-center"
          >
            Export Database
          </a>
        </Button>
        <Button asChild disabled={!!ctx.state.analyticsKey}>
          <a
            href={
              ctx.state.analyticsKey
                ? ctx.state.getS3Uri(ctx.state.analyticsKey).href
                : undefined
            }
            className="flex gap-2 items-center"
          >
            Export Analytics
          </a>
        </Button>
      </div>
    </form>
  );
};
