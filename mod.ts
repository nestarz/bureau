import { renderToReadableStream } from "react-dom/server";
import * as Islands from "islet/server";
import * as staticFileRoute from "outils/staticFileRoute.ts";
import * as Hmr from "outils/hmr.ts";
import createRenderPipe from "outils/createRenderPipe.ts";
import middleware from "outils/fresh/middleware.ts";
import * as Home from "@/src/routes/Home.tsx";
import * as Upsert from "@/src/routes/Upsert.tsx";
import * as Browse from "@/src/routes/Browse.tsx";
import { createHandler } from "@/src/middlewares/client.ts";
import * as MiddlewareSession from "@/src/middlewares/session.ts";
import createSqliteMiddleware from "outils/sqliteMiddleware.ts";
import adaptFreshPlugin from "outils/fresh/adaptFreshPlugin.ts";
import { join } from "std/path/join.ts";
import { namespace } from "@/src/lib/use_client.ts";
import { createAnalyticsPlugin } from "@/src/routes/analytics/createAnalyticsPlugin.ts";
import * as Layout from "@/src/routes/_Layout.tsx";
import * as Settings from "@/src/routes/Settings.tsx";
import * as ApiMedias from "@/src/routes/api/medias.ts";
import * as SqlEditor from "@/src/routes/SqlEditor.tsx";
import * as Analytics from "@/src/routes/Analytics.tsx";
import * as ApiReorder from "@/src/routes/api/reorder.ts";
import createRequiredTables from "@/src/routes/analytics/utils/createRequiredTables.ts";

const withWritePermission =
  (await Deno.permissions.query({ name: "write", path: Deno.cwd() })).state ===
    "granted";

export default async ({
  parentPathSegment,
  database,
  databaseKey = "database.sqlite",
  analytics,
  analyticsKey,
  getS3Uri,
  s3Client,
  getIpData,
  isDev,
}: {
  parentPathSegment: string;
  database: any;
}) => {
  const getPrefixFn = (parentPathSegment: string) => (key: string) => {
    const path = join("_islet", parentPathSegment, "tailwindcss", key);
    return new URL(import.meta.resolve("./".concat(path)));
  };
  const getPrefix = getPrefixFn(parentPathSegment);
  if (withWritePermission && import.meta.url.startsWith("file://")) {
    const tailwindConfig = await import("./tailwind.config.ts");
    const postcss = (await import("postcss")).default;
    const tailwindCss = (await import("tailwindcss")).default;
    const { getHashSync } = await import(
      "https://deno.land/x/scripted@0.0.3/mod.ts"
    );
    const newCss = await postcss([tailwindCss(tailwindConfig.default) as any])
      .process(tailwindConfig.globalCss, { from: undefined })
      .then((v) => v.css);
    const hash = getHashSync(newCss);
    const filename = getPrefix(`${hash}.css`);
    await Deno.remove(getPrefix(""), { recursive: true }).catch(() => null);
    await Deno.mkdir(getPrefix(""), { recursive: true });
    await Deno.writeTextFile(
      getPrefix("snapshot.json"),
      JSON.stringify({ filename: `${hash}.css` }),
    );
    await Deno.writeTextFile(filename, newCss);
  }
  const newCss = await fetch(getPrefix("snapshot.json"))
    .then((response) => response.json())
    .then((snapshot) => fetch(getPrefix(snapshot.filename)))
    .then((response) => response.text())
    .catch(console.error)
    .catch(() => null);

  const renderPipe = createRenderPipe((vn) =>
    Promise.resolve(vn)
      .then(renderToReadableStream)
      .then(Islands.addScripts as any)
      .then(async (stream) => {
        const string = await new Response(stream).text();
        return string.replace(
          string.includes("</head>") ? /(<\/head>)/ : /(.*)/,
          (_, $1) => (newCss ? `<style tailwind>${newCss}</style>${$1}` : $1),
        );
      })
  );

  if (analytics) await createRequiredTables(analytics);
  const [sqliteMiddleware, analyticsMiddleware] = [
    ["default", database],
    ...(analytics ? [["analytics", analytics]] : []),
  ].map(([namespace, database]) =>
    createSqliteMiddleware({
      namespace,
      database,
      withDeserializeNestedJSON: true,
    })
  );

  const route = (module: Parameters<typeof renderPipe>[0]) => ({
    [module.config!.routeOverride!]: middleware(
      Hmr.middleware,
      ...MiddlewareSession.middleware.handler,
      sqliteMiddleware.handler,
      analyticsMiddleware.handler,
      createHandler({
        parentPathSegment,
        getS3Uri,
        s3Client,
        databaseKey,
        analyticsKey,
      }),
      renderPipe(module, { Layout }),
    ),
  });

  Islands.setNamespaceParentPathSegment(namespace, parentPathSegment);

  return {
    ...createAnalyticsPlugin({
      database: analytics,
      parentPathSegment: "../analytics",
      getIpData,
    })
      .map(adaptFreshPlugin)
      .flatMap((module) => module.routes)
      .reduce((acc, module) => ({ ...acc, ...route(module) }), {}),
    ...[
      ApiMedias,
      ApiReorder,
      Analytics,
      SqlEditor,
      Settings,
      Home,
      Upsert,
      Browse,
    ].reduce(
      (acc, module) => ({ ...acc, ...route(module) }),
      {},
    ),
    [staticFileRoute.config.routeOverride!]: staticFileRoute.createHandler({
      baseUrl: import.meta.url,
    }),
    [Hmr.config.routeOverride!]: await Hmr.createHandler({
      hmrEventName: Islands.hmrNewIsletSnapshotEventName,
    }),
    [Islands.config.routeOverride]: await Islands.createHandler({
      jsxImportSource: "react",
      baseUrl: new URL(import.meta.url),
      namespace,
      prefix: join(parentPathSegment, "/islands/"),
      importMapFileName: "deno.json",
      esbuildOptions: { minify: !(isDev ?? withWritePermission) },
    }),
  };
};
