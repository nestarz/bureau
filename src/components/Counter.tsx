/** @jsxImportSource https://esm.sh/preact@10.15.1?target=es2022 */
export { h, hydrate } from "https://esm.sh/preact@10.15.1?target=es2022";
import { useState } from "https://esm.sh/preact@10.15.1/hooks.js?target=es2022";
import Test from "generic";

export default ({ className }) => {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((s) => s + 1)} className={className}>
      Value: {count}
      <Test />
    </button>
  );
};
