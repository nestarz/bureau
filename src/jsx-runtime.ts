export * from "preact/jsx-runtime";
import { jsx as _jsx } from "preact/jsx-runtime";
import { cloneElement, toChildArray, Fragment } from "preact";
import { createJsx } from "https://deno.land/x/islet@0.0.8/server.ts";

export const jsx = createJsx({
  jsx: _jsx,
  cloneElement,
  h: _jsx,
  toChildArray,
  Fragment,
  key: "cms",
  prefix: "/admin",
});
export const jsxs = jsx;
