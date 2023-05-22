import { h, hydrate } from "preact";
export { h, hydrate };
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { useSignal, useSignalEffect } from "@preact/signals";
import Toolbar from "./EditorExtra.tsx";
import { useRef, useEffect } from "preact/hooks";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

export default ({ className, value, onChange, containerClassName }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const node = useSignal<HTMLDivElement | null>(null);
  useEffect(() => void (node.value = ref.current), []);

  const editor = useSignal<Editor | null>(null);
  useSignalEffect(() => {
    if (!editor.value) {
      editor.value = new Editor({
        extensions: [
          StarterKit,
          Underline,
          Link.configure({
            openOnClick: true,
            protocols: ["mailto"],
            validate: (href) => /^(https|mailto)?:\/\//.test(href),
          }),
        ],
        content: value.peek(),
        editorProps: { attributes: { class: className } },
      });
      const onUpdate = (e) => onChange?.(e.editor.getHTML());
      editor.peek()?.on?.("update", onUpdate);
    }
    return () => editor.peek()?.commands?.setContent?.();
  });
  useSignalEffect(() => {
    const element = editor.value?.options.element;
    if (element) node.value?.append(element);
  });
  useSignalEffect(() => {
    if (value.value !== editor.value?.getHTML())
      editor.peek()?.commands?.setContent?.(value.peek());
  });

  return (
    <div className={containerClassName}>
      <Toolbar editor={editor} />
      <div ref={ref} style={{ display: "contents" }} />
    </div>
  );
};
