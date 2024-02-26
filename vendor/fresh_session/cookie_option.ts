import { type Cookie } from "@std/http/cookie";
export type { Cookie };
export type CookieOptions = Omit<Cookie, "name" | "value">;
export type CookieWithRedisOptions = CookieOptions & { keyPrefix?: string };
