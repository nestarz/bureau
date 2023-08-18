import { Fragment, h, hydrate } from "preact";
export { h, hydrate };
import { useEffect, useRef } from "preact/hooks";
import { twind, default as twindConfig } from "../../twind.config.ts";

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
  return (
    <Fragment>
      {button?.({ open, close })}
      <dialog
        ref={ref}
        className={className}
        onClose={close}
        onCancel={close}
        onClick={(e: EventHandler<TargetedMouseEvent<HTMLDialogElement>>) => {
          e.target.tagName === "DIALOG" && close();
        }}
        {...(props ?? {})}
      >
        {typeof children === "function" ? children({ open, close }) : children}
      </dialog>
    </Fragment>
  );
};
