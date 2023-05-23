/** @jsxImportSource https://esm.sh/preact@10.15.0?target=es2022 */
import {
  useEffect,
  useState,
} from "https://esm.sh/preact@10.15.0/hooks.js?target=es2022";
import { h, hydrate } from "https://esm.sh/preact@10.15.0?target=es2022";
export { h, hydrate };

const Home = globalThis.window?.document
  ? (await import("../components/Home.tsx")).default
  : () => "";

export default ({ className, ...props }) => {
  const [mounted, setMoundted] = useState(false);
  useEffect(() => setMoundted(true), []);
  return <div className={className}>{mounted && <Home {...props} />}</div>;
};
