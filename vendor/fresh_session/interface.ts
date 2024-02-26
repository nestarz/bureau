import { FreshContext } from "outils/fresh/types.ts";
import { Session } from "./session.ts";
export type WithSession = {
  session: Session;
};

export type sessionModule =(req: Request, ctx: FreshContext) => Promise<Response>