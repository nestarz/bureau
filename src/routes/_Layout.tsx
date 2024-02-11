import { FreshContext } from "outils/createRenderPipe.ts";
import type { ClientMiddleware } from "@/src/middlewares/client.ts";
import type { SqliteMiddlewareState } from "outils/sqliteMiddleware.ts";
import { Sidebar } from "@/src/components/Sidebar.tsx";
import urlcat from "outils/urlcat.ts";
import { formatColumnName } from "@/src/lib/formatColumnName.ts";
import { Toaster } from "@/src/components/ui/sonner.tsx";

export default async (
  _req: Request,
  ctx: FreshContext<ClientMiddleware & SqliteMiddlewareState<any>>
) => {
  const tables = ctx.state.tables;
  const tableConfig = tables.find(
    (table) => table.name === ctx.params.tableName
  );

  return (
    <body className="grid grid-cols-5 min-h-screen">
      <Sidebar
        name={ctx.state.s3Client.defaultBucket}
        paths={[
          ...tables.map((table) => ({
            label: formatColumnName(table.name),
            href: urlcat("/admin/browse/:id", { id: table.name }),
            active: tableConfig?.name === table.name,
          })),
          { label: "SQL Editor", href: urlcat("/admin/sqleditor") },
          { label: "Analytics", href: urlcat("/admin/analytics") },
          { label: "Settings", href: urlcat("/admin/settings") },
        ]}
      />
      <ctx.Component />
      <Toaster />
    </body>
  );
};
