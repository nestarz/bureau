import { Button } from "@/src/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog.tsx";
import { Input } from "@/src/components/ui/input.tsx";
import { Label } from "@/src/components/ui/label.tsx";
import { Fragment, useState } from "react";
import useSWR from "npm:swr";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card.tsx";
import Media from "@/src/components/Media.tsx";
import { cn } from "@/src/lib/utils.ts";

const MediaCard = ({ media, checked, onChecked }) => (
  <Card
    className={cn(
      checked ? "border-accent-foreground" : "",
      "overflow-hidden",
    )}
    onClick={() => onChecked?.(!checked)}
  >
    <Media
      media={media}
      maxWidth={321}
      className="m-2 rounded overflow-hidden"
    />
    <CardHeader className="p-2">
      <CardTitle className="truncate text-xs">{media.key}</CardTitle>
      <CardDescription>{media["content-type"]}</CardDescription>
    </CardHeader>
  </Card>
);

const MediaManagerContent = ({ onChange, value, accept }) => {
  const { data, error, isLoading } = useSWR(
    ["/admin/api/medias", accept],
    ([url, accept]) =>
      fetch(url, { method: "POST", body: JSON.stringify({ accept }) }).then(
        (r) => r.json(),
      ),
  );
  const toggleMedia = (media, isSelected) => {
    onChange?.(
      isSelected
        ? [...(value ?? []), media]
        : value?.filter((v) => v.key !== media.key),
    );
  };

  return (
    <Fragment>
      <DialogHeader>
        <DialogTitle>Media Library</DialogTitle>
        <DialogDescription>
          Anyone who has this link will be able to view this.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input id="search" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 max-h-[70vh] gap-4 overflow-auto p-1">
          {data?.map((media) => (
            <MediaCard
              media={media}
              checked={value?.some((v) => v.key === media.key)}
              onChecked={(selected) => toggleMedia(media, selected)}
            />
          ))}
        </div>
      </div>
      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </Fragment>
  );
};

const parseJSON = (obj: any) => {
  try {
    return JSON.parse(obj);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export function MediaManager({
  defaultValue,
  name,
  disabled,
  accept,
  required,
  className,
}) {
  const [selection, setSelection] = useState<Media[]>(
    () =>
      (typeof defaultValue === "string"
        ? parseJSON(defaultValue)
        : defaultValue) ?? null,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled} className={className}>
          <input
            type="hidden"
            name={name}
            value={JSON.stringify(selection)}
            required={required}
          />
          <div className="flex items-center gap-1 w-full">
            <span className="mr-auto">Choose a media</span>
            {selection?.map((media) => (
              <Media
                key={media.key}
                media={media}
                maxWidth={50}
                className="w-5 h-5 object-cover"
              />
            ))}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <MediaManagerContent
          value={selection}
          onChange={setSelection}
          accept={accept}
        />
      </DialogContent>
    </Dialog>
  );
}
