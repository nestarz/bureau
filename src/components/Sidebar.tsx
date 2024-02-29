// @deno-types="@types/react"
import * as React from "react";
import { cn } from "@/src/lib/utils.ts";
import { Button } from "@/src/components/ui/button.tsx";
import { Badge } from "@/src/components/ui/badge.tsx";

interface Path {
  active?: boolean;
  href?: string;
  label: string;
  icon?: any;
  paths?: Path[];
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  paths: Path[];
}

export function Sidebar({ className, paths, name }: SidebarProps) {
  return (
    <div className={cn("h-screen border-r sticky top-0", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Button
            asChild
            variant="ghost"
            className="text-lg font-semibold tracking-tight w-full justify-start gap-2"
          >
            <a href="/admin/">
              Bureau Double{" "}
              <Badge variant="outline" className="mt-[1px]">
                CMS
              </Badge>
            </a>
          </Button>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mb-2 px-4">
            {name}
          </p>
          <div className="flex flex-col gap-1">
            {paths.map((path) => (
              <React.Fragment>
                {path.href ? (
                  <Button
                    variant={path.active ? "default" : "ghost"}
                    className="w-full justify-start"
                    asChild
                  >
                    <a href={path.href}>
                      {path.icon && <path.icon className="mr-2 h-4 w-4" />}
                      {path.label}
                    </a>
                  </Button>
                ) : (
                  <h2 className="py-2 pt-4 px-4 text-sm text-muted-foreground tracking-tight">
                    {path.label}
                  </h2>
                )}
                {path.paths?.map((path, i, arr) => (
                  <Button
                    variant={path.active ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      i === arr.length - 1 ? "mb-4" : ""
                    )}
                    asChild
                  >
                    <a href={path.href}>
                      {path.icon && <path.icon />}
                      {path.label}
                    </a>
                  </Button>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
