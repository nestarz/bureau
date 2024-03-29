// @deno-types="npm:@types/react-dom@18.2.0/server"
import { renderToReadableStream } from "react-dom/server";
import * as Islands from "@bureaudouble/islet/server";
import { join } from "@std/path/join";

import type { PluginMiddleware } from "outils/fresh/types.ts";
import createRenderer from "outils/fresh/createRenderPipe.ts";
import createSqlitePlugin, {
  type SqliteMiddlewareConfig,
} from "outils/database/sqlite/createSqlitePlugin.ts";
import createHmrPlugin from "outils/fresh/createHmrPlugin.ts";
import createStaticFilePlugin from "outils/fresh/createStaticFilePlugin.ts";
import createTailwindPlugin from "outils/fresh/createTailwindPlugin.ts";
import { composeRoutes, type rutt } from "outils/fresh/composeRoutes.ts";

import {
  type AnalyticsConfig,
  createAnalyticsPlugin,
} from "@/src/routes/analytics/createAnalyticsPlugin.ts";
import { namespace } from "@/src/lib/useClient.ts";
import { createClientMiddleware } from "@/src/middlewares/client.ts";
import * as Layout from "@/src/routes/_Layout.tsx";
import * as Home from "@/src/routes/Home.tsx";
import * as Upsert from "@/src/routes/Upsert.tsx";
import * as Browse from "@/src/routes/Browse.tsx";
import * as MiddlewareSession from "@/src/middlewares/session.ts";
import * as Settings from "@/src/routes/Settings.tsx";
import * as ApiMedias from "@/src/routes/api/medias.ts";
import * as SqlEditor from "@/src/routes/SqlEditor.tsx";
import * as Analytics from "@/src/routes/Analytics.tsx";
import * as ApiReorder from "@/src/routes/api/reorder.ts";

const withWritePermissionAndLocal: boolean =
  ((await Deno.permissions.query({ name: "write", path: Deno.cwd() })).state ===
    "granted") && import.meta.url.startsWith("file:");

interface BureauConfig {
  getDatabase: SqliteMiddlewareConfig["getDatabase"];
  databaseKey?: string;
  basePath?: string;
  getS3Uri: (key: string) => URL;
  s3Client: ApiMedias.S3Client;
  analyticsConfig?: AnalyticsConfig;
  isDev?: boolean;
  middleware?: PluginMiddleware[];
  outDirectory?: string;
  logLevel?: "verbose" | "debug" | "info" | "warning" | "error" | "silent";
}

export default async ({
  basePath = "/admin/",
  getDatabase,
  databaseKey = "database.sqlite",
  getS3Uri,
  s3Client,
  isDev,
  logLevel,
  middleware: middlewareFns,
  analyticsConfig,
  outDirectory,
}: BureauConfig): Promise<any> => {
  Islands.setNamespaceParentPathSegment(namespace, basePath ?? "");

  const analytics = analyticsConfig
    ? await createAnalyticsPlugin(analyticsConfig)
    : null;
  const sqlitePlugin = createSqlitePlugin({
    namespace: "default",
    getDatabase,
    withDeserializeNestedJSON: true,
    disableWritingTypes: true,
  });
  const hmr = await createHmrPlugin({
    basePath,
    path: "/__hmr",
    hmrEventName: Islands.hmrNewIsletSnapshotEventName,
  });
  const islet = await Islands.createIsletPlugin({
    jsxImportSource: "react",
    baseUrl: new URL(import.meta.url),
    namespace,
    prefix: join(basePath ?? "", "/islands/"),
    buildDir: outDirectory,
    importMapFileName: "deno.json",
    esbuildOptions: { minify: isDev ?? !withWritePermissionAndLocal, logLevel },
  });
  const tailwindPlugin = await createTailwindPlugin({
    basePath,
    outDirectory: "./build/",
    baseUrl: new URL(".", import.meta.url).href,
    tailwindConfig: () => import("@/tailwind.config.ts"),
  });
  const staticFilePlugin = createStaticFilePlugin({ baseUrl: import.meta.url });

  const routes: rutt.Routes = composeRoutes([
    {
      routes: [
        ApiMedias,
        ApiReorder,
        Analytics,
        SqlEditor,
        Settings,
        Home,
        Upsert,
        Browse,
      ],
      middlewares: [
        middlewareFns,
        hmr.middlewares,
        sqlitePlugin.middlewares,
        analytics?.middlewares,
        MiddlewareSession.createMiddleware(),
        createClientMiddleware({
          basePath,
          getS3Uri,
          s3Client,
          databaseKey,
          analyticsKey: analyticsConfig?.databaseKey,
        }),
      ],
      renderer: createRenderer<JSX.Element>({
        Layout,
        virtualNodePipe: (vn) =>
          Promise.resolve(vn)
            .then(renderToReadableStream)
            .then(Islands.addScripts)
            .then(tailwindPlugin.transformEnd),
      }),
    },
    { routes: analytics?.routes, middlewares: analytics?.middlewares },
    { routes: [islet.routes, hmr.routes, staticFilePlugin.routes] },
  ]);

  return routes;
};
