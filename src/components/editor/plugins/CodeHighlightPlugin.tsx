const { registerCodeHighlighting } = (await import("@lexical/code")).default;
const { useLexicalComposerContext } = (await import("@lexical/react/LexicalComposerContext.js")).default;
import { useEffect } from "react";

export default function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);
  return null;
}
