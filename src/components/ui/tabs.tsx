import type { UseClient } from "@/src/lib/useClient.ts";
const useClient: UseClient = await import("@/src/lib/useClient.ts").then((v) => v.default(import.meta.url));
export const h: UseClient["h"] = useClient.h;
export const hydrate: UseClient["hydrate"] = useClient.hydrate;

// @deno-types="npm:@types/react@18.2.0"
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/src/lib/utils.ts";

const Tabs = TabsPrimitive.Root;

const TabsList: React.ForwardRefExoticComponent<
  & Omit<
    TabsPrimitive.TabsListProps & React.RefAttributes<HTMLDivElement>,
    "ref"
  >
  & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger: React.ForwardRefExoticComponent<
  & Omit<
    TabsPrimitive.TabsTriggerProps & React.RefAttributes<HTMLButtonElement>,
    "ref"
  >
  & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent: React.ForwardRefExoticComponent<
  & Omit<
    TabsPrimitive.TabsContentProps & React.RefAttributes<HTMLDivElement>,
    "ref"
  >
  & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(
  ({ className, ...props }, ref): JSX.Element => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  ),
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
