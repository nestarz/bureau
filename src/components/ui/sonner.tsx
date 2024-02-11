export const { h, hydrate } = await import("@/src/lib/use_client.ts").then(
  (v) => v.default(import.meta.url)
);
import { useEffect } from "react";
import { Toaster as Sonner, toast } from "npm:sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
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

export const Toast = ({ string }: { string: string }) => {
  useEffect(() => {
    toast(string);
  }, [string]);

  return <Toaster />;
};

export { Toaster };