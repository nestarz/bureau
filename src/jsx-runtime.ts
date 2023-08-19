export * from "https://esm.sh/preact@10.17.1&target=es2020/jsx-runtime";
import { jsx as _jsx } from "https://esm.sh/preact@10.17.1&target=es2020/jsx-runtime";
import {
  cloneElement,
  Fragment,
} from "https://esm.sh/preact@10.17.1&target=es2020";
import { createJsx } from "@/deps/islet/server.ts";

export const jsx = (...props) => {
  return createJsx({
    jsx: _jsx,
    cloneElement,
    h: _jsx,
    Fragment,
    key: "cms",
    prefix: "/admin",
  })(...props);
};
export const jsxs = jsx;
