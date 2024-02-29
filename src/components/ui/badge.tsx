import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type {
  ClassProp,
  ClassValue,
  StringToBoolean,
} from "class-variance-authority/types";
type ConfigSchema = Record<string, Record<string, ClassValue>>;
type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null | undefined;
};
type Cva<T extends ConfigSchema> = (
  props?: (ConfigVariants<T> & ClassProp) | undefined,
) => string;

import { cn } from "@/src/lib/utils.ts";

const badgeVariants: Cva<{
  variant: {
    default: string;
    secondary: string;
    destructive: string;
    outline: string;
  };
}> = (() =>
  cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
      variants: {
        variant: {
          default:
            "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
          secondary:
            "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
          destructive:
            "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
          outline: "text-foreground",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    },
  ))();

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: any;
  className?: string;
}

function Badge({ className, variant, ...props }: BadgeProps): React.ReactElement {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
