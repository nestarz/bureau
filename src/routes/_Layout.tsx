import { FreshContext } from "outils/createRenderPipe.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import type { SqliteMiddlewareState } from "outils/sqliteMiddleware.ts";
import { Sidebar } from "@/src/components/Sidebar.tsx";
import urlcat from "outils/urlcat.ts";
import { formatColumnName } from "@/src/lib/formatColumnName.ts";
import { Toast, Toaster } from "@/src/components/ui/sonner.tsx";
import { CodeIcon, GearIcon } from "@radix-ui/react-icons";
import { cn } from "@/src/lib/utils.ts";
import { MediaContext } from "@/src/components/Media.tsx";

export default async (
  req: Request,
  ctx: FreshContext<ClientMiddleware & SqliteMiddlewareState<any>>
) => {
  const tables = ctx.state.tables;
  const tableConfig = tables.find(
    (table) => table.name === ctx.params.tableName
  );
  const { data, error } = ctx.state.session.flash("x-sonner") ?? {};
  return (
    <body className="grid grid-cols-5 min-h-screen">
      <Sidebar
        name={ctx.state.s3Client.defaultBucket}
        paths={[
          {
            label: "Tables",
            paths: [
              ...tables.map((table) => ({
                label: formatColumnName(table.name),
                href: urlcat("/admin/browse/:id", { id: table.name }),
                active: tableConfig?.name === table.name,
              })),
            ],
          },
          {
            label: "Analytics",
            href: "/admin/analytics",
            active: new URL(req.url).pathname.startsWith("/admin/analytics"),
            icon: ({ className }) => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className={cn("h-4 w-4 text-muted-foreground", className)}
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            ),
          },
          {
            label: "Settings",
            href: "/admin/settings",
            active: new URL(req.url).pathname.startsWith("/admin/settings"),
            icon: GearIcon,
          },
          {
            label: "SQL Editor",
            href: "/admin/sqleditor",
            active: new URL(req.url).pathname.startsWith("/admin/sqleditor"),
            icon: CodeIcon,
          },
        ]}
      />
      <MediaContext endpoint={ctx.state.getS3Uri?.("/").href} />
      <ctx.Component />
      <Toaster />
      <Toast string={data ? "Success" : error ? "Error" : null} />
    </body>
  );
};
