// @deno-types="npm:@types/react-dom@18.2.0/client"
import { hydrateRoot as hydrate } from "react-dom/client";
// @deno-types="@types/react"
import { createElement as h } from "react";

export const namespace = "@bureaudouble/bureau";

export default async (url: string): Promise<any> => {
  if (!globalThis.document) {
    const island = (await import("@bureaudouble/islet/client")).default;
    island(url, namespace);
  }
  return { h, hydrate };
};
