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
import { toast } from "npm:sonner";
import { CheckCircledIcon, CircleIcon, TrashIcon } from "@radix-ui/react-icons";
import slugify from "outils/slugify.ts";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card.tsx";
import Media from "@/src/components/Media.tsx";
import { cn } from "@/src/lib/utils.ts";
import { useDebounce } from "@/src/lib/useDebounce.ts";
import { Uploader } from "@/src/components/bureau-ui/uploader.tsx";
import useFileBrowser from "@/src/lib/useFileBrowser.ts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/src/components/bureau-ui/breadcrumb.tsx";

const MediaCard = ({
  className,
  folder,
  media,
  checked,
  onChecked,
  maxWidth,
  onDelete,
  size,
}) => (
  <Card
    className={cn(
      checked ? "border-accent-foreground" : "",
      "overflow-hidden",
      className
    )}
    onClick={size === "small" ? () => onChecked?.(!checked) : null}
  >
    {size !== "small" && (
      <div className="w-full h-0 relative z-10 flex gap-1 justify-between">
        <Button
          onClick={() => onChecked?.(!checked)}
          variant="ghost"
          size="icon"
        >
          {checked ? <CheckCircledIcon /> : <CircleIcon />}
        </Button>
        <Button size="icon" variant="ghost" onClick={onDelete}>
          <TrashIcon />
        </Button>
      </div>
    )}
    <Media
      media={media}
      maxWidth={maxWidth ?? 321}
      className={cn(size !== "small" && "m-2", "rounded overflow-hidden")}
      mediaClassName={cn(size === "small" && "object-cover")}
    />
    {size !== "small" && (
      <CardHeader className="p-2 pt-0 space-y-0">
        <CardTitle className="truncate text-xs">
          {media.key.replace(folder, "").replace(/^\//, "")}
        </CardTitle>
        <CardDescription className="text-xs">
          {media["content-type"]}
        </CardDescription>
      </CardHeader>
    )}
  </Card>
);

const MediaManagerContent = ({ onChange, value, accept }) => {
  const [ilike, setIlike] = useState();
  const debouncedIlike = useDebounce(ilike, 1000);
  const { data, mutate } = useSWR(
    ["/admin/api/medias", accept, debouncedIlike],
    ([url, accept, ilike]) =>
      fetch(url, {
        method: "POST",
        body: JSON.stringify({ accept, ilike }),
      }).then((r) => r.json())
  );
  const toggleMedia = (media, isSelected) => {
    onChange?.(
      isSelected
        ? [...(value ?? []), media]
        : value?.filter((v) => v.key !== media.key)
    );
  };

  const {
    path,
    currentFiles,
    currentFolders,
    goTo,
    getFolder,
    getFolderName,
    addFolder,
  } = useFileBrowser({
    initialPath: "medias",
    files: data ?? [],
    getKey: ({ key }) => key,
  });

  return (
    <Fragment>
      <DialogHeader>
        <DialogTitle>Media Library</DialogTitle>
        <DialogDescription>
          Anyone who has this link will be able to view this.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2 overflow-x-hidden">
        <div className="flex gap-2">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input
            id="search"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIlike(e.target.value.length > 1 ? `%${e.target.value}%` : null)
            }
          />
          <Button
            variant="outline"
            onClick={() => {
              const name = prompt("Choose a name");
              if (name?.trim()) addFolder(name, slugify);
            }}
          >
            New Folder
          </Button>
          <Uploader
            asChild
            folder={path}
            accept={accept}
            onProgress={(i, length) => toast(`Uploading (${i}/${length})`)}
            onEnded={(length) => {
              toast(`${length} Files uploaded`);
              mutate();
            }}
          >
            <Button>Upload</Button>
          </Uploader>
        </div>
        <div className="flex overflow-x-auto max-w-full gap-2 min-h-10">
          {value.map((media) => (
            <MediaCard
              key={media.key}
              media={media}
              checked={value?.some((v) => v.key === media.key)}
              onChecked={(selected) => toggleMedia(media, selected)}
              maxWidth={30}
              className="w-10"
              size="small"
            />
          ))}
        </div>
        {path?.split("/").length > 1 && (
          <Breadcrumb separator="/">
            {path.split("/").map((folder, i, arr) => (
              <BreadcrumbItem
                key={folder}
                onClick={() => goTo(arr.slice(0, i + 1).join("/"))}
              >
                <BreadcrumbLink as="div">{folder}</BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        )}
        <div className="max-h-[60vh] overflow-auto flex flex-col gap-1">
          {currentFolders.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-1">
              {currentFolders.map((folder) => (
                <Button
                  key={getFolderName(folder)}
                  className="w-full"
                  variant="outline"
                  size="sm"
                  onClick={() => goTo(getFolder(folder))}
                >
                  <span className="truncate">{getFolderName(folder)}</span>
                </Button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-1">
            {currentFiles.map((media) => (
              <MediaCard
                key={media.key}
                folder={path}
                media={media}
                checked={value?.some((v) => v.key === media.key)}
                onChecked={(selected) => toggleMedia(media, selected)}
                maxWidth={200}
                onDelete={async () => {
                  const reply = globalThis.prompt(
                    [
                      `You are deleting images, they may be associated in somes pages, if so it may break the website, be sure to not use them in the website.`,
                      media.key,
                      `Are you sure ? [Yes|No]`,
                    ].join("\n\n"),
                    "No"
                  );
                  if (reply?.toLowerCase()?.trim() === "yes") {
                    await fetch("/admin/api/medias", {
                      method: "DELETE",
                      body: JSON.stringify({
                        medias: [{ key: media.key }],
                      }),
                    });
                    mutate();
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <DialogFooter className="sm:justify-start mt-auto">
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
        : defaultValue) ?? null
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
      <DialogContent className="sm:max-w-4xl h-full max-h-[90vh] flex flex-col">
        <MediaManagerContent
          value={selection}
          onChange={setSelection}
          accept={accept}
        />
      </DialogContent>
    </Dialog>
  );
}
