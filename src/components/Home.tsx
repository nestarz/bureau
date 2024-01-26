/** @jsxImportSource https://esm.sh/preact@10.19.2&target=es2022 */
import { h, hydrate } from "preact";
import clsx from "clsx";
import { Link, Route, useRoute, Router } from "wouter";
import { useEffect } from "preact/hooks";
import Table from "../components/Table.tsx";
import SqlEditor from "../components/SqlEditor.tsx";
import { useStore } from "../utils/useStore.ts";
import { ApiContext } from "../utils/useHttp.ts";
import { twind, default as twindConfig } from "../../twind.config.ts";
export { h, hydrate };

await twind(twindConfig("/admin/"));

const Nav = () => {
  const { tables } = useStore();
  const [, params] = useRoute("/table/:table");

  return (
    <div className="flex flex-col sticky top-0 self-start overflow-y-auto bg-slate-50 border-solid border-r border-[#e8eaee] min-w-fit">
      <nav className="sticky top-0 h-screen px-5 py-4 mt-[2px] max-w-full max-h-screen overflow-y-auto">
        <ul className="h-full flex flex-col">
          <Link href="/">
            <a className="flex items-center font-medium text-slate-800 capitalize gap-2 py-2 mb-4 sticky top-0">
              <span className="font-icon text-[#46daa7]">
                {String.fromCodePoint(0xebf0)}
              </span>
              <span className="flex gap-1">
                <span className="whitespace-nowrap leading-none">
                  Bureau Double
                </span>
                <span className="text-xs leading-none mt-[2px] self-center">
                  CMS
                </span>
              </span>
            </a>
          </Link>
          {[
            ...tables.value.map(({ name }) => ({
              name,
              href: `/table/${name}`,
              isTable: true,
              active: params?.table === name,
            })),
            {
              name: "SQL Editor",
              href: "/sql",
              className: "!mt-auto opacity-0 hover:opacity-100",
            },
          ].map(({ className, name, href, active }) => (
            <li
              className={clsx(
                "px-6 py-2 rounded-md text-sm",
                active && "bg-[#e6f0ff] text-[#0065ff]",
                !active && "hover:(bg-slate-100)",
                className
              )}
            >
              <Link href={href}>
                <a className="flex items-center justify-between font-medium capitalize">
                  <span className="font-medium capitalize">
                    {name.split("_").join(" ")}
                  </span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const Routes = () => {
  const { fetch } = useStore();
  useEffect(() => void fetch(), []);

  return (
    <Router base={"/admin"}>
      <Nav />
      <Route path="/sql" component={SqlEditor} />
      <Route path="/table/:table/:rest*" component={Table} />
      <Route></Route>
    </Router>
  );
};

export default ({
  className,
  gqlHttpUrl,
  gqlWebsocketUrl,
  apiKey,
  s3PublicUrl,
}: {
  apiKey: string;
  gqlHttpUrl: string;
  gqlWebsocketUrl: string;
  className?: string;
  s3PublicUrl: string;
}) => (
  <div className={clsx(className, "flex", "gap-2")}>
    <ApiContext.Provider
      value={{
        s3PublicUrl,
        url: new URL(gqlHttpUrl, window.location.origin),
        wss: new URL(gqlWebsocketUrl, window.location.origin),
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: apiKey,
        }),
      }}
    >
      <Routes />
    </ApiContext.Provider>
  </div>
);
