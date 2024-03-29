import type { UseClient } from "@/src/lib/useClient.ts";
const useClient: UseClient = await import("@/src/lib/useClient.ts").then((v) => v.default(import.meta.url));
export const h: UseClient["h"] = useClient.h;
export const hydrate: UseClient["hydrate"] = useClient.hydrate;
import { useEffect } from "react";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps): JSX.Element => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export const Toast = ({ string }: { string: string | null }): JSX.Element => {
  useEffect(() => {
    console.log("toast", string);
    if (string) setTimeout(() => toast(string), 10);
  }, [string]);
  return <div className="hidden absolute" />;
};

export { Toaster };
