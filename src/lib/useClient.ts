// @deno-types="npm:@types/react-dom@18/client"
import { hydrateRoot as hydrate } from "react-dom/client";
// @deno-types="npm:@types/react@18"
import { createElement as h } from "react";

export const namespace = "@bureaudouble/bureau";

export default async (url: string) => {
  if (!globalThis.document) {
    const island = (await import("@bureaudouble/islet/client")).default;
    island(url, namespace);
    console.log(url, namespace);
  }
  return { h, hydrate };
};
