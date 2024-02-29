const useClient: any = await import("@/src/lib/useClient.ts").then((v) => v.default(import.meta.url));
export const h: any = useClient.h;
export const hydrate: any = useClient.hydrate;

// @deno-types="npm:@types/react@18.2.0"
import * as React from "react";

import { useMediaQuery } from "@/src/lib/useMediaQuery.ts";
import { Button } from "@/src/components/ui/button.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command.tsx";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/src/components/ui/drawer.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover.tsx";
import { cn } from "@/src/lib/utils.ts";
import { Badge } from "@/src/components/ui/badge.tsx";

function Options<T extends { value: string; label: string }>({
  name,
  options,
  setOpen,
  setSelected,
}: {
  name: string;
  options: T[];
  setOpen: (open: boolean) => void;
  setSelected: (status: T | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder={`Filter ${name}...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              onSelect={() => {
                setSelected(
                  options.find((priority) => priority.value === item.value) ||
                    null,
                );
                setOpen(false);
              }}
            >
              <Badge variant="outline" className="mr-2">
                {item.value}
              </Badge>
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function ComboBoxResponsive<T extends { label: string; value: string }>({
  options = [],
  className,
  defaultValue,
  name,
  optionsName,
  disabled,
  required,
}: {
  options: T[];
  className?: string;
  defaultValue?: string | number;
  name: string;
  optionsName: string;
  disabled?: boolean;
  required?: boolean;
}): React.ReactNode {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selected, setSelected] = React.useState<T | null>();

  const InputHidden = (
    <input
      type="hidden"
      name={name}
      value={selected ? selected.value : defaultValue}
      disabled={disabled}
      required={required}
    />
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-[150px] justify-start", className)}
          >
            {selected
              ? (
                <>
                  <Badge variant="outline" className="-ml-2 mr-2">
                    {selected.value}
                  </Badge>
                  {selected.label}
                </>
              )
              : <></>}
            {InputHidden}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200%] max-w-sm p-0" align="start">
          <Options
            name={optionsName ?? name}
            setOpen={setOpen}
            setSelected={setSelected}
            options={options}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[150px] justify-start", className)}
        >
          {selected ? <>{selected.label}</> : <></>}
          {InputHidden}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <Options
            name={optionsName ?? name}
            setOpen={setOpen}
            setSelected={setSelected}
            options={options}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
