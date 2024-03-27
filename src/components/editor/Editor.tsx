import ExampleTheme from "./themes/ExampleTheme.ts";
const { LexicalComposer } = (await import("@lexical/react/LexicalComposer.js"))
  .default;
const { RichTextPlugin } = (
  await import("@lexical/react/LexicalRichTextPlugin.js")
).default;
const { ContentEditable } = (
  await import("@lexical/react/LexicalContentEditable.js")
).default;
const { HistoryPlugin } = (
  await import("@lexical/react/LexicalHistoryPlugin.js")
).default;
const { AutoFocusPlugin } = (
  await import("@lexical/react/LexicalAutoFocusPlugin.js")
).default;
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary.js";
import { InputHiddenPlugin } from "./plugins/InputHiddenPlugin.tsx";
import ToolbarPlugin from "./plugins/ToolbarPlugin.tsx";
import YouTubePlugin from "./plugins/YouTubePlugin.tsx";
import { YouTubeNode } from "./nodes/YouTubeNode.tsx";
import VimeoPlugin from "./plugins/VimeoPlugin.tsx";
import { VimeoNode } from "./nodes/VimeoNode.tsx";
const { HeadingNode, QuoteNode } = (await import("@lexical/rich-text")).default;
const { TableCellNode, TableNode, TableRowNode } = (
  await import("@lexical/table")
).default;
const { ListItemNode, ListNode } = (await import("@lexical/list")).default;
const { CodeHighlightNode, CodeNode } = (await import("@lexical/code")).default;
const { AutoLinkNode, LinkNode } = (await import("@lexical/link")).default;
const { LinkPlugin } = (await import("@lexical/react/LexicalLinkPlugin.js"))
  .default;
const { ListPlugin } = (await import("@lexical/react/LexicalListPlugin.js"))
  .default;
const { MarkdownShortcutPlugin } = (
  await import("@lexical/react/LexicalMarkdownShortcutPlugin.js")
).default;
const { TRANSFORMERS } = (await import("@lexical/markdown")).default;

import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin.tsx";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin.tsx";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin.tsx";

import { cn } from "@/src/lib/utils.ts";
import AutoEmbedPlugin from "@/src/components/editor/plugins/AutoEmbedPlugin.tsx";

function Placeholder() {
  return (
    <div className="text-muted-foreground overflow-hidden absolute text-ellipsis text-sm select-none inline-block pointer-events-none left-3 top-4">
      Enter some text...
    </div>
  );
}

const editorConfig = {
  namespace: "",
  // The editor theme
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error: any) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    YouTubeNode,
    VimeoNode,
  ],
};

// Define the prop types for the Editor component
interface EditorProps {
  defaultValue?: string;
  name: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

// Destructure the props in the component definition using the EditorProps interface
export function Editor({
  defaultValue,
  name,
  disabled,
  required,
  className,
}: EditorProps): JSX.Element {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div
        className={cn(
          "relative leading-5 font-normal text-left rounded-md w-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm",
          className,
        )}
      >
        <InputHiddenPlugin
          defaultValue={defaultValue}
          name={name}
          disabled={disabled}
          required={required}
        />
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="[&_iframe]:max-w-full min-h-40 outline-none resize-none text-sm caret-primary relative px-3 py-4 prose prose-black min-w-none" />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary as any}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <YouTubePlugin />
          <VimeoPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <AutoEmbedPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default Editor;
