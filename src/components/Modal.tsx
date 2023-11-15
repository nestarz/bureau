import { Fragment, h, hydrate } from "preact";
export { h, hydrate };
import { useEffect, useRef } from "preact/hooks";
import { default as twindConfig, twind } from "../../twind.config.ts";

await twind(twindConfig("/admin/"));

export default ({
  button,
  children,
  className,
  initialOpen,
  onClose,
  ...props
}) => {
  const ref = useRef<HTMLDialogElement>(null);
  const open = () => ref.current?.showModal();
  const close = () => {
    ref.current?.close();
    onClose?.();
  };
  useEffect(() => initialOpen && open(), []);

  useEffect(() => {
    let mouseDownInside = false;
    const dialog = ref.current;
    if (!dialog) return;

    const handleMouseDown = (e: MouseEvent) =>
      mouseDownInside = e.target === dialog;
    dialog.addEventListener("mousedown", handleMouseDown);

    const handleMouseUp = (e: MouseEvent) => {
      if (mouseDownInside && e.target === dialog) close();
    };
    dialog.addEventListener("mouseup", handleMouseUp);

    return () => {
      dialog.removeEventListener("mousedown", handleMouseDown);
      dialog.removeEventListener("mouseup", handleMouseUp);
    };
  }, [ref, close]);

  return (
    <Fragment>
      {button?.({ open, close })}
      <dialog
        ref={ref}
        className={className}
        onClose={close}
        onCancel={close}
        {...(props ?? {})}
      >
        {typeof children === "function" ? children({ open, close }) : children}
      </dialog>
    </Fragment>
  );
};
