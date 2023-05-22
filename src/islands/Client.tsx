import { useEffect, useState } from "https://esm.sh/*preact@10.13.2/hooks.js";
import { h, hydrate } from "https://esm.sh/preact@10.13.2";
export { h, hydrate };

const Home = globalThis.window?.document
  ? (await import("../components/Home.tsx")).default
  : () => "";

export default ({ className, ...props }) => {
  const [mounted, setMoundted] = useState(false);
  useEffect(() => setMoundted(true), []);
  return <div className={className}>{mounted && <Home {...props} />}</div>;
};
