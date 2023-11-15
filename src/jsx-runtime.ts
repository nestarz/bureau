export * from "https://esm.sh/preact@10.19.2&target=es2020/jsx-runtime";
import { jsx as _jsx } from "https://esm.sh/preact@10.19.2&target=es2020/jsx-runtime";
import {
  cloneElement,
  Fragment,
} from "https://esm.sh/preact@10.19.2&target=es2020";
import { createJsx } from "https://deno.land/x/islet@0.0.58/server.ts";

export const jsx = createJsx({
  jsx: _jsx,
  cloneElement,
  h: _jsx,
  Fragment,
  key: "@bureaudouble/bureau",
  prefix: "/admin",
});

export const jsxs = jsx;
