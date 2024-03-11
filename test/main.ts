import { router } from "rutt";
import { S3Client } from "https://deno.land/x/s3_lite_client@0.7.0/mod.ts";
import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";
import createContentManagementSystem from "../mod.ts";
import sqliteMemorySync from "outils/database/sqlite/memorySync.ts";

const s3Client = new S3Client({
  accessKey: Deno.env.get("S3_ACCESS_KEY_ID")!,
  secretKey: Deno.env.get("S3_SECRET_ACCESS_KEY")!,
  endPoint: Deno.env.get("S3_ENDPOINT_URL")!,
  region: Deno.env.get("S3_BUCKET_REGION")!,
  bucket: Deno.env.get("S3_DEFAULT_BUCKET")!,
  useSSL: true,
  pathStyle: true,
});

const createDatabase = (filename: string) =>
  sqliteMemorySync(
    DB,
    () => s3Client.getObject(filename).then((r) => r.arrayBuffer()),
    (buffer) => s3Client.putObject(filename, buffer).then(() => true),
    () => s3Client.statObject(filename).then((r) => r.etag)
  );

await Deno.serve(
  { port: 8029 },
  router({
    "/admin": await createContentManagementSystem({
      s3Client,
      getS3Uri: (key: string) => new URL(key, Deno.env.get("S3_PUBLIC_URL")!),
      database: await createDatabase("database.sqlite"),
      analyticsConfig: {
        database: await createDatabase("analytics.sqlite"),
        databaseKey: "analytics.sqlite",
        basePath: "../analytics",
      },
      basePath: "/admin",
      outDirectory: "./test/.islet/",
    }),
  })
).finished;

if (withWritePermission && import.meta.url.includes("file://")) {
  setTimeout(async () => {
    const islands = await import("@bureaudouble/islet/client");
    const exports: Record<string, string> = { ".": "./mod.ts" };
    islands.getIslands(namespace).data.forEach((island) => {
      const path = island.url;
      const value =
        "./" + path.replace("file://" + import.meta.dirname + "/", "");
      const key = value.replace(/.(j|t)s(x|)$/, "");
      exports[key.replace("@", "_")] = value;
      exports[value.replace("@", "_")] = value;
    });

    let denoConfig: any = {};
    const configPath = join(import.meta.dirname!, "deno.json");
    try {
      denoConfig = JSON.parse(await Deno.readTextFile(configPath));
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) throw error; // Ignore file not found to create a new one
    }
    if (JSON.stringify(denoConfig.export) === JSON.stringify(exports)) return;
    denoConfig.exports = exports;
    await Deno.writeTextFile(configPath, JSON.stringify(denoConfig, null, 2));
  }, 10);
}
