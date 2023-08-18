/** @jsxImportSource https://esm.sh/preact@10.15.1?target=es2022 */
import {
  useEffect,
  useState,
} from "https://esm.sh/preact@10.15.1/hooks.js?target=es2022";
import island from "https://deno.land/x/islet@0.0.8/island.ts";
export { h, hydrate } from "https://esm.sh/preact@10.15.1?target=es2022";

const Home = globalThis.window?.document
  ? (await import("../components/Home.tsx")).default
  : () => "";

export default island(
  ({ className, ...props }) => {
    const [mounted, setMoundted] = useState(false);
    useEffect(() => setMoundted(true), []);
    return <div className={className}>{mounted && <Home {...props} />}</div>;
  },
  import.meta.url,
  undefined,
  "cms"
);
