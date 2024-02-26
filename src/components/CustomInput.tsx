import { Input } from "@/src/components/ui/input.tsx";
import { Label } from "@/src/components/ui/label.tsx";
import { MediaManager } from "@/src/components/MediaManager.tsx";
import { Editor } from "@/src/components/editor/Editor.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu.tsx";
import { useState } from "react";
import formatColumnName from "@/src/lib/formatColumnName.ts";
import getExtendedType from "@/src/lib/getExtendedType.ts";
import { ComboBoxResponsive } from "@/src/components/bureau-ui/combobox.tsx";

export const { h, hydrate } = await import("@/src/lib/useClient.ts").then((v) =>
  v.default(import.meta.url)
);

interface CustomInputProps {
  type: "TEXT" | "INTEGER" | "REAL" | "BLOB";
  name: string;
  references?: string | null;
  referencesRows?: any[];
  referencesTo?: string;
  disabled?: boolean;
  defaultValue?: any;
  required?: boolean;
  label?: string;
  className?: string;
}

export const CustomInput = ({
  type,
  name,
  references,
  referencesRows,
  referencesTo,
  ...props
}: CustomInputProps) => {
  const [extendedType, setExtendedType] = useState(() =>
    getExtendedType(type, name)
  );

  const components: Record<
    string,
    (arg: CustomInputProps & { children?: any }) => any
  > = {
    TEXT: ({ children: _v, ...props }) => <Input {...props} type="text" />,
    INTEGER: ({ children: _v, ...props }) => <Input {...props} type="number" />,
    REAL: ({ children: _v, ...props }) => (
      <Input {...props} type="number" step="any" />
    ),
    html: ({ ...props }) => <Editor {...props} />,
    media: ({ ...props }) => <MediaManager {...props} accept="*" />,
    audio: ({ ...props }) => <MediaManager {...props} accept="audio/*" />,
    image: ({ ...props }) => <MediaManager {...props} accept="image/*" />,
    video: ({ ...props }) => <MediaManager {...props} accept="video/*" />,
    timestamp: ({ children: _v, ...props }) => (
      <Input {...props} type="datetime-local" />
    ),
    date: ({ children: _v, ...props }) => <Input {...props} type="date" />,
  };
  const Component = references
    ? ({ ...props }: CustomInputProps & { children?: any }) => (
        <ComboBoxResponsive
          {...props}
          optionsName={references}
          options={(referencesRows ?? []).map((row) => ({
            label: row.name ?? row.title ?? row.label ?? row.key,
            value: row[referencesTo!],
          }))}
        />
      )
    : components[extendedType as keyof typeof components] ?? Input;

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <DropdownMenu>
        <DropdownMenuTrigger disabled={props.disabled} asChild>
          <Label htmlFor={name} className="text-left">
            {formatColumnName(name)}
          </Label>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="start">
          <DropdownMenuLabel>Force a field type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={extendedType}
            onValueChange={setExtendedType}
          >
            {[...new Set([extendedType, ...Object.keys(components)])].map(
              (type) => (
                <DropdownMenuRadioItem
                  key={type}
                  value={type}
                  className="uppercase"
                >
                  {type}
                </DropdownMenuRadioItem>
              )
            )}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Component {...props} type={type} name={name} />
    </div>
  );
};
