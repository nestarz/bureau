import { lookup } from "https://deno.land/x/mrmime@v1.0.1/mod.ts";
import type { RouteConfig } from "outils/createRenderPipe.ts";
import type { S3Client } from "https://deno.land/x/s3_lite_client@0.6.1/mod.ts";

export const config: RouteConfig["config"] = {
  routeOverride: "/api/medias{/}?",
};

const filterByAcceptRule = (
  object: { [key: string]: any; "content-type": string },
  acceptRule: string,
): boolean => {
  const rules = acceptRule.split(",").map((rule) => rule.trim());
  for (const rule of rules) {
    if (rule === "*") return true;
    const [type, subtype] = rule.split("/");
    if (subtype === "*" && object["content-type"]?.startsWith(`${type}/`)) {
      return true;
    }
    if (object["content-type"] === rule) {
      return true;
    }
  }
  return false;
};

export const handler = async (
  req: Request,
  ctx: { s3Client: S3Client; getS3Uri: (key: string) => string | URL },
) => {
  const { getS3Uri, s3Client: s3 } = ctx.state;
  if (req.method === "PUT") {
    const objectName = new URL(req.url).searchParams.get("object_name");
    return typeof objectName !== "string"
      ? new Response(null, {
        status: 500,
        statusText: "Missing object_name",
      })
      : new Response(
        await s3.getPresignedUrl("PUT", objectName, { expirySeconds: 5 }),
        { headers: { "content-type": "text/raw" } },
      );
  }
  if (req.method === "DELETE") {
    const { medias = [] } = await req.json().catch(() => ({}));
    for (const { key } of medias) await s3.deleteObject(key);
    return new Response(JSON.stringify({ success: true }), {
      headers: { "content-type": "application/json" },
    });
  }
  const {
    prefix,
    page_size: pageSize,
    max_results: maxResults,
    ilike: _ilike,
    object_name,
    accept,
  } = req.method === "POST"
    ? await req.json().catch((v) => ({}))
    : Object.fromEntries(new URL(req.url).searchParams);
  if (req.method === "GET" && object_name) {
    return new Response((await s3.getObject(object_name)).body, {
      headers: {
        "Content-Type": "application/vnd.sqlite3",
        "Content-Disposition": `attachment; filename="${object_name}"`,
      },
    });
  }
  const results: any[] = [];
  for await (
    const result of s3.listObjects({
      prefix: ["medias", prefix].filter((v) => v).join("/"),
      pageSize,
      maxResults,
    })
  ) {
    if (result.key.includes("ds_store")) continue;
    const url = getS3Uri(result.key);
    results.push({ ...result, url, "content-type": lookup(result.key) });
  }

  return new Response(
    JSON.stringify(
      results
        .filter(
          ({ key }) =>
            typeof _ilike !== "string" ||
            key.match(new RegExp(`^${(_ilike ?? "")?.replace(/%/g, ".*")}$`)),
        )
        .filter((v) => filterByAcceptRule(v, accept ?? "*")),
    ),
    { headers: { "Content-Type": "application/json" } },
  );
};
