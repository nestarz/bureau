import {
  RiAlignCenter,
  RiAlignJustify,
  RiAlignLeft,
  RiAlignRight,
  RiArrowDropDownLine,
  RiArrowGoBackFill,
  RiArrowGoForwardFill,
  RiBold,
  RiCodeLine,
  RiH1,
  RiH2,
  RiItalic,
  RiLink,
  RiListOrdered,
  RiListUnordered,
  RiParagraph,
  RiPencilLine,
  RiQuoteText,
  RiStrikethrough,
  RiUnderline,
} from "react-icons/ri";

const { INSERT_EMBED_COMMAND } = (await import(
  "@lexical/react/LexicalAutoEmbedPlugin.js"
)).default;
const { useLexicalComposerContext } = (
  await import("@lexical/react/LexicalComposerContext.js")
).default;
// @deno-types="npm:@types/react@18.2.0"
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
const {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} = (await import("lexical")).default;
const { $isLinkNode, TOGGLE_LINK_COMMAND } = (await import("@lexical/link"))
  .default;
const { $isAtNodeEnd, $isParentElementRTL, $wrapNodes } = (
  await import("@lexical/selection")
).default;
const { $getNearestNodeOfType, mergeRegister } = (
  await import("@lexical/utils")
).default;
const {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} = (await import("@lexical/list")).default;
import { createPortal } from "react-dom";
const { $createHeadingNode, $createQuoteNode, $isHeadingNode } = (
  await import("@lexical/rich-text")
).default;
const {
  $createCodeNode,
  $isCodeNode,
  getCodeLanguages,
  getDefaultCodeLanguage,
} = (await import("@lexical/code")).default;
import { EmbedConfigs } from "./AutoEmbedPlugin.tsx";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu.tsx";
import { PlusIcon } from "@radix-ui/react-icons";

interface FloatingLinkEditorProps {
  editor: ReturnType<typeof useLexicalComposerContext>[0]; // Assuming you have a specific type for this in your actual codebase
}

interface SelectProps {
  onChange(event: React.ChangeEvent<HTMLSelectElement>): void;
  className: string;
  options: string[];
  value: string;
}

interface BlockOptionsDropdownListProps {
  editor: ReturnType<typeof useLexicalComposerContext>[0];
  blockType: string;
  toolbarRef: React.RefObject<HTMLDivElement>;
  setShowBlockOptionsDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}

const LowPriority = 1;

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "ul",
  "ol",
]);

const blockTypeToBlockName = {
  code: "Code Block",
  h1: "Large Heading",
  h2: "Small Heading",
  h3: "Heading",
  h4: "Heading",
  h5: "Heading",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  ul: "Bulleted List",
};

function Divider(): JSX.Element {
  return <div className="divider" />;
}

function positionEditorElement(
  editor: HTMLDivElement,
  rect: DOMRect | null,
): void {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + globalThis.scrollY + 10}px`;
    editor.style.left = `${
      rect.left + globalThis.scrollX - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

function FloatingLinkEditor({ editor }: FloatingLinkEditorProps): JSX.Element {
  const editorRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState<any>(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = globalThis.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      !nativeSelection?.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection?.anchorNode ?? null)
    ) {
      const domRange = nativeSelection?.getRangeAt(0);
      let rect: DOMRect | undefined;
      if (nativeSelection?.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild as HTMLElement;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange?.getBoundingClientRect();
      }

      if (!mouseDownRef.current && rect) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority,
      ),
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div ref={editorRef} className="link-editor">
      {isEditMode
        ? (
          <input
            ref={inputRef}
            className="link-input"
            value={linkUrl}
            onChange={(event) => {
              setLinkUrl(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (lastSelection !== null) {
                  if (linkUrl !== "") {
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                  }
                  setEditMode(false);
                }
              } else if (event.key === "Escape") {
                event.preventDefault();
                setEditMode(false);
              }
            }}
          />
        )
        : (
          <Fragment>
            <div className="link-input">
              <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                {linkUrl}
              </a>
              <div
                className="w-[35px] absolute cursor-pointer right-0 inset-y-0 align-[-0.25em] flex items-center justify-center"
                role="button"
                tabIndex={0}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setEditMode(true);
                }}
              >
                <RiPencilLine className="w-5 h-5" />
              </div>
            </div>
          </Fragment>
        )}
    </div>
  );
}

function Select({
  onChange,
  className,
  options,
  value,
}: SelectProps): JSX.Element {
  return (
    <select className={className} onChange={onChange} value={value}>
      <option hidden={true} value="" />
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function getSelectedNode(selection: any): any {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function BlockOptionsDropdownList({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown,
}: BlockOptionsDropdownListProps): JSX.Element {
  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event: Event & { target: EventTarget | null }) => {
        const target = event.target as HTMLElement;

        if (target && !dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatLargeHeading = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h1"));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatSmallHeading = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h2"));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, void 0);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, void 0);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, void 0);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, void 0);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  return (
    <div className="dropdown pointer-events-auto" ref={dropDownRef}>
      <button type="button" className="item" onClick={formatParagraph}>
        <RiParagraph className="icon paragraph" />
        <span className="text">Normal</span>
        {blockType === "paragraph" && <span className="active" />}
      </button>
      <button type="button" className="item" onClick={formatLargeHeading}>
        <RiH1 className="icon large-heading" />
        <span className="text">Large Heading</span>
        {blockType === "h1" && <span className="active" />}
      </button>
      <button type="button" className="item" onClick={formatSmallHeading}>
        <RiH2 className="icon small-heading" />
        <span className="text">Small Heading</span>
        {blockType === "h2" && <span className="active" />}
      </button>
      <button type="button" className="item" onClick={formatBulletList}>
        <RiListUnordered className="icon bullet-list" />
        <span className="text">Bullet List</span>
        {blockType === "ul" && <span className="active" />}
      </button>
      <button type="button" className="item" onClick={formatNumberedList}>
        <RiListOrdered className="icon numbered-list" />
        <span className="text">Numbered List</span>
        {blockType === "ol" && <span className="active" />}
      </button>
      <button type="button" className="item" onClick={formatQuote}>
        <RiQuoteText className="icon quote" />
        <span className="text">Quote</span>
        {blockType === "quote" && <span className="active" />}
      </button>
      <button type="button" className="item" onClick={formatCode}>
        <RiCodeLine className="icon code" />
        <span className="text">Code Block</span>
        {blockType === "code" && <span className="active" />}
      </button>
    </div>
  );
}

const blockTypesIcons = {
  code: RiCodeLine,
  quote: RiQuoteText,
  ol: RiListOrdered,
  ul: RiListUnordered,
  h1: RiH1,
  h2: RiH2,
  paragraph: RiParagraph,
};

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState<keyof typeof blockTypesIcons>(
    "paragraph",
  );
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(
    null,
  );
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(
    false,
  );
  const [codeLanguage, setCodeLanguage] = useState("");
  const [isRTL, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === "root"
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type as any);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  useEffect((): ReturnType<typeof mergeRegister> => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const codeLanguges: string[] = useMemo(() => getCodeLanguages(), []);
  const onCodeLanguageSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>): void => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey],
  );

  const insertLink = useCallback((): void => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const BlockTypeIcon = blockTypesIcons[blockType];

  return (
    <div
      className="toolbar flex flex-wrap align-middle mb-[1px] p-1 rounded-t"
      ref={toolbarRef}
    >
      <button
        type="button"
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, void 0);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <RiArrowGoBackFill className="format" />
      </button>
      <button
        type="button"
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, void 0);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <RiArrowGoForwardFill className="format redo" />
      </button>
      <Divider />
      {supportedBlockTypes.has(blockType) && (
        <Fragment>
          <button
            type="button"
            className="toolbar-item block-controls"
            onClick={() =>
              setShowBlockOptionsDropDown(!showBlockOptionsDropDown)}
            aria-label="Formatting Options"
          >
            <BlockTypeIcon className="icon block-type" />
            <span className="text">{blockTypeToBlockName[blockType]}</span>
            <RiArrowDropDownLine className="chevron-down" />
          </button>
          {showBlockOptionsDropDown &&
            createPortal(
              <BlockOptionsDropdownList
                editor={editor}
                blockType={blockType}
                toolbarRef={toolbarRef}
                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
              />,
              document.body,
            )}
          <Divider />
        </Fragment>
      )}
      {blockType === "code"
        ? (
          <Fragment>
            <Select
              className="toolbar-item code-language"
              onChange={onCodeLanguageSelect}
              options={codeLanguges}
              value={codeLanguage}
            />
            <RiArrowDropDownLine className="chevron-down inside" />
          </Fragment>
        )
        : (
          <Fragment>
            <button
              type="button"
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
              }}
              className={"toolbar-item spaced " + (isBold ? "active" : "")}
              aria-label="Format Bold"
            >
              <RiBold className="format bold" />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
              }}
              className={"toolbar-item spaced " + (isItalic ? "active" : "")}
              aria-label="Format Italics"
            >
              <RiItalic className="format italic" />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
              }}
              className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
              aria-label="Format Underline"
            >
              <RiUnderline className="format underline" />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
              }}
              className={"toolbar-item spaced " +
                (isStrikethrough ? "active" : "")}
              aria-label="Format Strikethrough"
            >
              <RiStrikethrough className="format strikethrough" />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
              }}
              className={"toolbar-item spaced " + (isCode ? "active" : "")}
              aria-label="Insert Code"
            >
              <RiCodeLine className="format code" />
            </button>
            <button
              type="button"
              onClick={insertLink}
              className={"toolbar-item spaced " + (isLink ? "active" : "")}
              aria-label="Insert Link"
            >
              <RiLink className="format link" />
            </button>
            {isLink &&
              createPortal(
                <FloatingLinkEditor editor={editor} />,
                document.body,
              )}
            <Divider />
            <button
              type="button"
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
              }}
              className="toolbar-item spaced"
              aria-label="Left Align"
            >
              <RiAlignLeft className="format left-align" />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
              }}
              className="toolbar-item spaced"
              aria-label="Center Align"
            >
              <RiAlignCenter className="format center-align" />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
              }}
              className="toolbar-item spaced"
              aria-label="Right Align"
            >
              <RiAlignRight className="format right-align" />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
              }}
              className="toolbar-item"
              aria-label="Justify Align"
            >
              <RiAlignJustify className="format justify-align" />
            </button>
            {" "}
          </Fragment>
        )}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button
            type="button"
            className="toolbar-item block-controls"
            onClick={() =>
              setShowBlockOptionsDropDown(!showBlockOptionsDropDown)}
            aria-label="Formatting Options"
          >
            <PlusIcon className="icon block-type" />
            <span className="text">Insert</span>
            <RiArrowDropDownLine className="chevron-down" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {EmbedConfigs.map((embedConfig) => (
            <DropdownMenuItem
              key={embedConfig.type}
              onClick={() => {
                editor.dispatchCommand(
                  INSERT_EMBED_COMMAND,
                  embedConfig.type,
                );
              }}
              className="item"
            >
              {embedConfig.icon}
              <span className="text">{embedConfig.contentName}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
