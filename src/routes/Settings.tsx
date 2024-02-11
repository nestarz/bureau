import { FreshContext, RouteConfig } from "outils/createRenderPipe.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import type { SqliteMiddlewareState } from "outils/sqliteMiddleware.ts";
import { Button } from "@/src/components/ui/button.tsx";
import { Badge } from "@/src/components/ui/badge.tsx";

export const config: RouteConfig["config"] = {
  routeOverride: "/settings{/}?",
};

export const handler = {
  POST: async (
    req: Request,
    ctx: FreshContext<ClientMiddleware & SqliteMiddlewareState<any>>
  ) => {
    const formData = await req.formData();
    ctx.state.session.flash("x-data", returning);
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
            href={ctx.state.getS3Uri(ctx.state.databaseKey)}
            className="flex gap-2 items-center"
          >
            Export Database
          </a>
        </Button>
        <Button asChild disabled={!!ctx.state.analyticsKey}>
          <a
            href={ctx.state.getS3Uri(ctx.state.analyticsKey)}
            className="flex gap-2 items-center"
          >
            Export Analytics
          </a>
        </Button>
      </div>
    </form>
  );
};
