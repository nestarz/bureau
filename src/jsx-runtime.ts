import { jsx as jsx_ } from "preact/jsx-runtime";
import { toChildArray, h, cloneElement } from "preact";
import { createJsx } from "islands/mod.ts";
export const jsx = createJsx({
  jsx: jsx_,
  h,
  toChildArray,
  cloneElement,
  key: "cms",
  prefix: "/admin",
});
