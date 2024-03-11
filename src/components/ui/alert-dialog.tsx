import type { UseClient } from "@/src/lib/useClient.ts";
const useClient: UseClient = await import("@/src/lib/useClient.ts").then((v) => v.default(import.meta.url));
export const h: UseClient["h"] = useClient.h;
export const hydrate: UseClient["hydrate"] = useClient.hydrate;

// @deno-types="@types/react"
import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/src/lib/utils.ts";
import { buttonVariants } from "@/src/components/ui/button.tsx";
import { type VariantProps } from "class-variance-authority";
import type { ClassProp, ClassValue, StringToBoolean } from "class-variance-authority/types";
type ConfigSchema = Record<string, Record<string, ClassValue>>;
type ConfigVariants<T extends ConfigSchema> = {
    [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null | undefined;
};

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay: React.ForwardRefExoticComponent<
  Omit<
    & AlertDialogPrimitive.AlertDialogOverlayProps
    & React.RefAttributes<HTMLDivElement>,
    "ref"
  > & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref): JSX.Element => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent: React.ForwardRefExoticComponent<
  Omit<
    & AlertDialogPrimitive.AlertDialogContentProps
    & React.RefAttributes<HTMLDivElement>,
    "ref"
  > & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref): JSX.Element => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader: {
  ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
  displayName: string;
} = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter: {
  ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
  displayName: string;
} = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle: React.ForwardRefExoticComponent<
  Omit<
    & AlertDialogPrimitive.AlertDialogTitleProps
    & React.RefAttributes<HTMLHeadingElement>,
    "ref"
  > & React.RefAttributes<HTMLHeadingElement>
> = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref): JSX.Element => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription: React.ForwardRefExoticComponent<
  Omit<
    & AlertDialogPrimitive.AlertDialogDescriptionProps
    & React.RefAttributes<HTMLParagraphElement>,
    "ref"
  > & React.RefAttributes<HTMLParagraphElement>
> = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref): JSX.Element => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

const AlertDialogAction: React.ForwardRefExoticComponent<
  & Omit<
    & AlertDialogPrimitive.AlertDialogActionProps
    & React.RefAttributes<HTMLButtonElement>,
    "ref"
  >
  & VariantProps<
    (
      props?:
        | (
          & ConfigVariants<{
            variant: {
              default: string;
              destructive: string;
              outline: string;
              secondary: string;
              ghost: string;
              link: string;
            };
            size: {
              default: string;
              sm: string;
              lg: string;
              icon: string;
            };
          }>
          & ClassProp
        )
        | undefined,
    ) => string
  >
  & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  & React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
  & VariantProps<typeof buttonVariants>
>(({ className, variant, ...props }, ref): JSX.Element => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants({ variant }), className)}
    {...props}
  />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel: React.ForwardRefExoticComponent<
  Omit<
    & AlertDialogPrimitive.AlertDialogCancelProps
    & React.RefAttributes<HTMLButtonElement>,
    "ref"
  > & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref): JSX.Element => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className,
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
