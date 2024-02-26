import { S3Client } from "https://deno.land/x/s3_lite_client@0.6.2/mod.ts";
import sqliteMemorySync from "outils/database/sqlite/memorySync.ts";
import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";

export const getS3Uri = (key: string) =>
  new URL(key, Deno.env.get("S3_PUBLIC_URL")!);

export const s3Client = new S3Client({
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
    () => s3Client.statObject(filename).then((r) => r.etag),
  );

export const databases = {
  analytics: await createDatabase("analytics.sqlite"),
  main: await createDatabase("database.sqlite"),
};
