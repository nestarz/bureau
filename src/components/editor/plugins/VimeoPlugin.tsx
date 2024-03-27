const { useLexicalComposerContext } = (
  await import("@lexical/react/LexicalComposerContext.js")
).default;

const { $insertNodeToNearestRoot } = (
  await import("@lexical/utils")
).default;

const { createCommand, COMMAND_PRIORITY_EDITOR } = (
  await import("lexical")
).default;

import type { LexicalCommand } from "lexical";
import { useEffect } from "react";

import { $createVimeoNode, VimeoNode } from "../nodes/VimeoNode.tsx";

export const INSERT_VIMEO_COMMAND: LexicalCommand<string> = createCommand(
  "INSERT_VIMEO_COMMAND",
);

export default function VimeoPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([VimeoNode])) {
      throw new Error("VimeoPlugin: VimeoNode not registered on editor");
    }

    return editor.registerCommand<string>(
      INSERT_VIMEO_COMMAND,
      (payload) => {
        const youTubeNode = $createVimeoNode(payload);
        $insertNodeToNearestRoot(youTubeNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
