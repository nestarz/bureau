const { useLexicalComposerContext } =
  (await import("@lexical/react/LexicalComposerContext.js")).default;
const { $generateNodesFromDOM } = (await import("@lexical/html")).default;
const { $insertNodes, $getRoot } = (await import("lexical")).default;

export function LoadHtmlPlugin({ string, type = "text/html" }: {
  string: string;
  type?: DOMParserSupportedType;
}) {
  const [editor] = useLexicalComposerContext();

  editor.update(() => {
    // In the browser you can use the native DOMParser API to parse the HTML string.
    const parser = new DOMParser();
    const dom = parser.parseFromString(string, type);

    // Once you have the DOM instance it's easy to generate LexicalNodes.
    const nodes = $generateNodesFromDOM(editor, dom);

    // Select the root
    $getRoot().select();

    // Insert them at a selection.
    $insertNodes(nodes);
  });

  return null;
}
