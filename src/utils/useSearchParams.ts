import { useEffect, useState } from "preact/hooks";

const emptyIsUndefined = (v) => (v.length > 0 ? v : undefined);
const atomic = (v) => (v.length > 1 ? v : v[0]);
const getValue = (search, param, array) =>
  param
    ? (array ? emptyIsUndefined : atomic)(
        new URLSearchParams(search).getAll(param)
      )
    : Object.fromEntries(new URLSearchParams(search));
const on = (a, b, c) => a.addEventListener(b, c);
const off = (a, b, c) => a.removeEventListener(b, c);
const getDefaultUrl = () => new URL("https://localhost:0000");
const useSearchParams = (
  param,
  {
    array = false,
    native = false,
    url = new URL(window?.location?.href ?? getDefaultUrl()),
  } = {}
) => {
  const [value, setValue] = useState(() => getValue(url.search, param, array));

  useEffect(() => {
    const f = native ? (v) => v.toLowerCase() : (v) => v;
    const onChange = () => {
      setValue((state) => {
        const value = getValue(url.search, param, array);
        return JSON.stringify(value) === JSON.stringify(state) ? state : value;
      });
    };
    onChange();

    on(window, "popstate", onChange);
    on(window, f("pushState"), onChange);
    on(window, f("replaceState"), onChange);

    return () => {
      on(window, "popstate", onChange);
      off(window, f("pushState"), onChange);
      off(window, f("replaceState"), onChange);
    };
  }, [native, param, array]);

  return value === "null" ? null : value;
};

const useSearchParamServer = () => null;

export default typeof window !== "undefined"
  ? useSearchParams
  : useSearchParamServer;

export const getPath = (pathname, query = {}) => {
  if (!pathname) return pathname;
  const emptyIsUndefined = (v) => (v.length > 0 ? v : undefined);
  const atomic = (v) => (v.length > 1 ? v : v[0]);
  const getQueryValue = (search, param, array) =>
    (array ? emptyIsUndefined : atomic)(
      new URLSearchParams(search).getAll(param)
    );

  const { search: currSearch } =
    window?.location ?? new URL(pathname, getDefaultUrl());
  const keys = Object.keys(Object.fromEntries(new URLSearchParams(currSearch)));
  const searchParams = new URLSearchParams();
  const f = (fn) => (a, b) => fn.bind(searchParams)(a, b);
  Object.entries(
    typeof query === "function"
      ? query(
          keys.reduce(
            (prev, param) => ({
              ...prev,
              [param]: getQueryValue(currSearch, param),
            }),
            {}
          )
        )
      : query
  ).forEach(([key, value]) =>
    (Array.isArray(value) ? value : [value])
      .filter((v) => typeof v !== "undefined")
      .forEach((v, i) =>
        (i === 0 ? f(searchParams.set) : f(searchParams.append))(key, v)
      )
  );
  return `${pathname}?${searchParams.toString()}`;
};

export const getPathParams = (query = {}) =>
  getPath(window.location?.pathname ?? "/", query);

export const jsonparse = (value: string | undefined) => {
  try {
    return JSON.parse(value ?? "null");
  } catch {
    return null;
  }
};
