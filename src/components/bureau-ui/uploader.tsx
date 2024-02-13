export const { h, hydrate } = await import("@/src/lib/useClient.ts").then((v) =>
  v.default(import.meta.url)
);

import { Slot } from "@radix-ui/react-slot";
import useUpload from "@/src/lib/useUpload.ts";
import { Fragment, forwardRef, useRef } from "react";

export const Uploader = forwardRef(
  ({ asChild, onEnded, onProgress, accept, folder, ...props }, ref) => {
    const inputRef = useRef();
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
    const on = (evt: Event) => evt.preventDefault();
    const Comp = asChild ? Slot : "button";
    return (
      <Fragment>
        <Comp
          ref={ref}
          onDragOver={on}
          onDragEnter={on}
          onDrop={(e) => {
            e.preventDefault();
            const fileInput = e.target?.childNodes?.[0];
            if (fileInput) fileInput.files = e.dataTransfer.files;
          }}
          onClick={() => inputRef.current.click()}
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
  }
);
