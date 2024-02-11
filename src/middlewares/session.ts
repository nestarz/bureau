import type { Middleware } from "$fresh/src/server/types.ts";
import {
  cookieSession,
  type WithSession,
} from "https://deno.land/x/fresh_session@0.2.2/mod.ts";

export interface SessionMiddlewareState extends WithSession {
  lang: string;
}

const session = cookieSession({
  secure: true,
  httpOnly: true,
  sameSite: "Strict",
});

export const middleware: Middleware<SessionMiddlewareState> = {
  handler: [
    (req, ctx) => session(req, ctx),
    (req, ctx) => {
      console.log("ok");
      return ctx.next();
    },
  ],
};
