"use client";

// @deno-types="@types/react"
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import type { ClassProp } from "class-variance-authority/types";

import { cn } from "@/src/lib/utils.ts";

const labelVariants: (props?: ClassProp | undefined) => string = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label: React.ForwardRefExoticComponent<
  & Omit<
    LabelPrimitive.LabelProps & React.RefAttributes<HTMLLabelElement>,
    "ref"
  >
  & VariantProps<(props?: ClassProp | undefined) => string>
  & React.RefAttributes<HTMLLabelElement>
> = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  & React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
  & VariantProps<typeof labelVariants>
>(
  ({ className, ...props }, ref): JSX.Element => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    />
  ),
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
