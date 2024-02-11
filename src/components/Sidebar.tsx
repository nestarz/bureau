import * as React from "react";
import { cn } from "@/src/lib/utils.ts";
import { Button } from "@/src/components/ui/button.tsx";
import { Badge } from "@/src/components/ui/badge.tsx";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className: string;
  name: string;
}

export function Sidebar({ className, paths, name }: SidebarProps) {
  return (
    <div className={cn("h-screen border-r sticky top-0", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="px-4 text-lg font-semibold tracking-tight flex items-center gap-2">
            Bureau Double{" "}
            <Badge variant="outline" className="mt-[1px]">
              CMS
            </Badge>
          </h2>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mb-2 px-4">
            {name}
          </p>
          <div className="space-y-1">
            {paths.map((path) => (
              <Button
                variant={path.active ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <a href={path.href}>{path.label}</a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
