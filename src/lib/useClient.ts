export const namespace = "@bureaudouble/bureau";

export default async (url: string) => {
  const { hydrateRoot: hydrate } = (await import("react-dom/client")).default;
  const { createElement: h } = (await import("react")).default;
  if (!globalThis.document) {
    const island = (await import("islet/client")).default;
    island(url, namespace);
  }
  return { h, hydrate };
};
