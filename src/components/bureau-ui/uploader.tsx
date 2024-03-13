import { Slot } from "@radix-ui/react-slot";
import useUpload from "@/src/lib/useUpload.ts";
import { Fragment, forwardRef, useRef, ReactNode } from "react";

interface UploaderProps {
  asChild?: boolean;
  onEnded: (total: number) => void;
  onProgress: (progress: number, total: number) => void;
  accept?: string;
  folder: string;
  children?: ReactNode; // If your component accepts children, otherwise omit
  // Add other props as needed
}

// Properly typing 'ref' with 'Ref<any>' to be more flexible or specify a more specific type
export const Uploader = forwardRef<
  HTMLButtonElement | HTMLInputElement,
  UploaderProps
>(({ asChild, onEnded, onProgress, accept, folder, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload } = useUpload({
    folder,
    onEnded,
    onProgress,
    uploadFn: async (key, body) => {
      const url = `/admin/api/medias?object_name=${encodeURIComponent(key)}`;
      await fetch(await fetch(url, { method: "PUT" }).then((r) => r.text()), {
        method: "PUT",
        body,
      });
    },
  });

  const on = (evt: Event): void => evt.preventDefault();

  // Deciding the component type based on 'asChild' prop
  const Comp = asChild ? Slot : "button";

  return (
    <Fragment>
      <Comp
        ref={ref as any}
        onDragOver={on as any}
        onDragEnter={on as any}
        onDrop={(e: React.DragEvent<HTMLButtonElement>) => {
          e.preventDefault();
          const fileInput = (e.target as any)
            ?.childNodes?.[0] as HTMLInputElement;
          if (fileInput) fileInput.files = e.dataTransfer.files;
        }}
        onClick={() => inputRef.current?.click()}
        {...props}
      />
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          upload(e.target?.files ?? [])
        }
        accept={accept}
        className="hidden"
      />
    </Fragment>
  );
});
