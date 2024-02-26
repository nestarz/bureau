import { cookieSession, type WithSession } from "fresh_session";
import type { MiddlewareModule } from "outils/fresh/types.ts";

export interface SessionMiddlewareState extends WithSession {
  lang: string;
}

const session = cookieSession({
  secure: true,
  httpOnly: true,
  sameSite: "Strict",
});

export const createMiddleware = (): MiddlewareModule<
  SessionMiddlewareState
> => ({
  handler: [
    (req, ctx) => session(req, ctx),
    (_req, ctx) => {
      return ctx.next();
    },
  ],
});
