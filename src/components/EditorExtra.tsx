import { h } from "preact";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import clsx from "clsx";

const EditorButton = ({ editor, action, cb, props, children }) => {
  const active = useSignal(false);
  const disabled = useSignal(false);
  const onClick = () => {
    const res = cb?.({ editor: editor.peek() });
    const options = { ...props, ...(res ?? {}) };
    editor.peek().chain().focus()[action](options).run();
  };
  useSignalEffect(() => {
    const on = ({ editor }) => {
      disabled.value = !editor.can().chain().focus()[action](props).run();
      active.value = editor.isActive(
        action.replace(/^toggle(.)/, (_, p1) => p1.toLowerCase()),
        props
      );
    };
    const events = ["transaction", "selectionUpdate", "focus"];
    events.forEach((event) => editor.value.on(event, on));
    return () => events.forEach((event) => editor.value.off(event, on));
  });

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={useComputed(() =>
        clsx("font-icon px-2 disabled:(text-slate-100) rounded", {
          "bg-slate-100 text-slate-800": active.value,
        })
      )}
    >
      {children}
    </button>
  );
};

const Toolbar = ({ editor }) => {
  const actions = [
    { action: "toggleBold", label: "bold", icon: 0xead1 },
    { action: "toggleItalic", label: "italic", icon: 0xee6b },
    { action: "toggleStrike", label: "strike", icon: 0xf1ab },
    { action: "toggleUnderline", label: "underline", icon: 0xf244 },
    { action: "toggleCode", label: "code", icon: 0xeba9 },
    {
      action: "toggleLink",
      label: "link",
      icon: 0xeeb2,
      cb: ({ editor }) => {
        const before = editor.getAttributes("link").href;
        return before ? {} : { href: window.prompt("URL"), target: "_blank" };
      },
    },
    { action: "unsetAllMarks", label: "clear marks", icon: 0xed96 },
    // { action: "clearNodes", label: "clear nodes" },
    { action: "setParagraph", label: "paragraph", icon: 0xefc8 },
    ...Array.from({ length: 6 }, (_, i) => ({
      action: "toggleHeading",
      label: `h${i + 1}`,
      level: i + 1,
      icon: 0xede6 + i,
    })),
    { action: "toggleBulletList", label: "bullet list", icon: 0xeebe },
    { action: "toggleOrderedList", label: "ordered list", icon: 0xeebb },
    { action: "toggleCodeBlock", label: "code block", icon: 0xeba7 },
    { action: "toggleBlockquote", label: "blockquote", icon: 0xec51 },
    { action: "setHorizontalRule", label: "horizontal rule", icon: 0xf0de },
    { action: "setHardBreak", label: "hard break", icon: 0xf200 },
    { action: "undo", label: "undo", icon: 0xea58 },
    { action: "redo", label: "redo", icon: 0xea5a },
  ];

  return (
    editor.value && (
      <div className="flex flex-wrap gap-[1px] rounded-md border border-slate-200 sticky top-0 bg-white z-10">
        {actions.map(({ action, label, icon, cb, ...props }) => (
          <EditorButton editor={editor} action={action} props={props} cb={cb}>
            {icon ? String.fromCodePoint(icon) : label}
          </EditorButton>
        ))}
      </div>
    )
  );
};

export default Toolbar;
