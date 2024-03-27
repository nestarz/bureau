/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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

import { $createYouTubeNode, YouTubeNode } from "../nodes/YouTubeNode.tsx";

export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = createCommand(
  "INSERT_YOUTUBE_COMMAND",
);

export default function YouTubePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([YouTubeNode])) {
      throw new Error("YouTubePlugin: YouTubeNode not registered on editor");
    }

    return editor.registerCommand<string>(
      INSERT_YOUTUBE_COMMAND,
      (payload) => {
        const youTubeNode = $createYouTubeNode(payload);
        $insertNodeToNearestRoot(youTubeNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
