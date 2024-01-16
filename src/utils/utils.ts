export const sharp = (url, { w = 200, q = 60 } = {}) =>
  url?.includes(".svg")
    ? url
    : url
    ? `https://image-transformer.vercel.app/api/transformer?w=${w}&q=${q}&format=jpg&src=${encodeURIComponent(
        url
      )}`
    : url;

export const unique =
  (fn: (args: any) => any) => (a: any, i: number, arr: Array<any>) =>
    i === arr.findIndex((b: any) => fn(a) === fn(b));

export const convertToPlain = (obj: any) => {
  const innerHTML = typeof obj === "string"
    ? obj
    : String(obj).length > 0
    ? JSON.stringify(obj)
    : null;
  return typeof innerHTML === "string" && innerHTML?.trim()
    ? globalThis.document
      ? Object.assign(globalThis.document.createElement("fragment"), {
        innerHTML,
      }).textContent
      : innerHTML.replace(/<[^>]+>/g, "")
    : "";
};

export const toArray = <T extends unknown>(value: Array<T> | T): Array<T> =>
  Array.isArray(value)
    ? value
    : typeof value !== "undefined" && value !== null
    ? [value]
    : [];

export const isOutside =
  (fn: (e: MouseEvent) => (e: MouseEvent) => undefined) =>
  (e: MouseEvent & { target: HTMLInputElement }): void => {
    if (
      e.offsetX < 0 ||
      e.offsetX > e.target.offsetWidth ||
      e.offsetY < 0 ||
      e.offsetY > e.target.offsetHeight
    ) {
      fn(e);
    }
  };

export const slugify = (text: string | undefined) =>
  text
    ?.toString()
    ?.normalize("NFD")
    ?.replace(/[\u0300-\u036f]/g, "")
    ?.toLowerCase()
    ?.trim()
    ?.replace(/\s+/g, "-")
    ?.replace(/[^\w-]+/g, "")
    ?.replace(/--+/g, "-");
