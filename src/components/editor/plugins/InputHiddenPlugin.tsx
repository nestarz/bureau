const { useLexicalComposerContext } = (
  await import("@lexical/react/LexicalComposerContext.js")
).default;
const { $generateNodesFromDOM } = (await import("@lexical/html")).default;
const { $insertNodes, $selectAll } = (await import("lexical")).default;
const { $generateHtmlFromNodes } = (await import("@lexical/html")).default;

import { Fragment, useEffect, useRef } from "react";

export function LoadHtmlPlugin({
  string,
  type = "text/html",
}: {
  string?: string;
  type?: DOMParserSupportedType;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      if (!string) return;
      const parser = new DOMParser();
      const dom = parser.parseFromString(string, type);
      const nodes = $generateNodesFromDOM(editor, dom);
      $selectAll();
      $insertNodes(nodes);
    });
  }, [editor, string]);

  return null;
}

const HtmlGeneratorPlugin = ({
  onChange,
}: {
  onChange?: (arg: string) => any;
}) => {
  const [editor] = useLexicalComposerContext();

  editor.registerUpdateListener(() =>
    editor.update(() =>
      globalThis?.document
        ? onChange?.($generateHtmlFromNodes(editor, null))
        : null
    )
  );

  return null;
};

export function InputHiddenPlugin({
  defaultValue,
  name,
  disabled,
  required,
}: {
  name: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <Fragment>
      <input
        ref={ref}
        type="hidden"
        defaultValue={defaultValue}
        name={name}
        disabled={disabled}
        required={required}
      />
      <LoadHtmlPlugin string={defaultValue} />
      <HtmlGeneratorPlugin
        onChange={(value) => {
          if (ref.current) ref.current.value = value;
        }}
      />
    </Fragment>
  );
}
