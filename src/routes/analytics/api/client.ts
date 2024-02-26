import type { SqliteMiddlewareState } from "outils/database/sqlite/createSqlitePlugin.ts";
import type { PluginRoute } from "outils/fresh/types.ts";
import {
  collectAndCleanScripts,
  storeFunctionExecution,
} from "@bureaudouble/scripted";
import { join } from "@std/path/join";

const clientScript = (endpoint: string | URL) => {
  console.time("[double_analytics]");
  const VISIT = new URL("./api/log/visit", endpoint);
  const QUIT = new URL("./api/log/exit", endpoint);
  const EVENT = new URL("./api/log/event", endpoint);
  const IGNORE_KEY = "analytics:ignore";
  const newIgnore = new URL(document.location.href).searchParams.get(
    IGNORE_KEY
  );
  if (typeof newIgnore === "string") {
    localStorage.setItem(IGNORE_KEY, String(newIgnore !== "false"));
  }
  const ignore = localStorage.getItem(IGNORE_KEY) === "true";
  if (ignore) console.warn("[double_analytics] ignored mode activated");
  const post = (e: URL, v: any) =>
    fetch(e, { method: "POST", body: JSON.stringify(v) });
  const beacon = (e: URL, v: any) =>
    navigator.sendBeacon(
      e,
      new Blob([JSON.stringify(v)], {
        type: "application/json; charset=UTF-8",
      })
    );
  Object.fromEntries =
    Object.fromEntries ||
    ((arr: any[]) => arr.reduce((acc, [k, v]) => ((acc[k] = v), acc), {}));
  const id = Date.now();
  post(VISIT, {
    id,
    ignore,
    hostname: window.location.hostname,
    path: window.location.pathname,
    referrer: document.referrer,
    user_agent: navigator.userAgent,
    parameters: Object.fromEntries(
      new URL(document.location.href).searchParams
    ),
    screen_width: window.screen.width,
    screen_height: window.screen.height,
  });
  const logEvent = (
    action: string,
    category: string,
    value: Record<string, unknown>
  ) =>
    beacon(EVENT, {
      visit_id: id,
      action,
      category,
      value,
    });
  document.addEventListener("click", (e) => {
    const { host, href, target } = (e.target as HTMLElement).closest("a") || {};
    if (host && target === "_blank" && host !== window.location.host) {
      logEvent("CLICK", "EXTERNAL_LINK", {
        href: href,
      });
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      const load_time =
        (window.performance.timing.loadEventEnd -
          window.performance.timing.navigationStart) /
        1000;
      beacon(QUIT, {
        id,
        visit_duration: (new Date().getTime() - id) / 1000,
        load_time: load_time > 0 ? load_time : null,
      });
    }
  });
  console.timeEnd("[double_analytics]");
};

export const createApiClientPluginRoute = ({
  basePath,
}: {
  basePath?: string;
}): PluginRoute<SqliteMiddlewareState<any>> => ({
  path: join(basePath ?? "", "/client.js"),
  handler: {
    GET: (req: Request) => {
      const url = new URL(`${basePath ?? ""}/`.replace("//", "/"), req.url);
      storeFunctionExecution(clientScript, url.href);

      return new Response(collectAndCleanScripts(), {
        headers: { "content-type": "application/javascript" },
      });
    },
  },
});
