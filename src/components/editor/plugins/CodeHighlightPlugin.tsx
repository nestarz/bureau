const { registerCodeHighlighting } = (await import("@lexical/code")).default;
const { useLexicalComposerContext } = (await import("@lexical/react/LexicalComposerContext.js")).default;
// @deno-types="npm:@types/react@18.2.0"
import { useEffect } from "react";

export default function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);
  return null;
}
