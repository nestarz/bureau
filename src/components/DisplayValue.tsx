import Media, { type MediaProp } from "@/src/components/Media.tsx";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Badge } from "@/src/components/ui/badge.tsx";

const MAX = 3;

export default ({
  href,
  value,
  type,
  references,
}: {
  href: string;
  value: any;
  type: string;
  references?: {
    name?: string;
    title?: string;
    label?: string;
    key?: string;
  } | null;
}) => {
  const Comp = href ? "a" : "div";
  return (
    <Comp className="flex space-x-2" href={href}>
      <span className="max-w-[300px] truncate font-medium">
        {type === "order" ? (
          <DragHandleDots2Icon className="mx-auto" />
        ) : typeof value === "object" ? (
          type === "image" ? (
            <div className="flex items-center gap-1 w-max">
              {(value as MediaProp[])?.slice(0, MAX).map((media) => (
                <Media
                  key={media.key}
                  media={media}
                  maxWidth={20}
                  mediaClassName="w-6 h-6 flex-1 rounded object-cover"
                />
              ))}
              {(value?.length ?? 0) - MAX > 0 ? (
                <Badge variant="outline">+{value.length - MAX}</Badge>
              ) : null}
            </div>
          ) : (
            JSON.stringify(value)
          )
        ) : typeof value === "string" ? (
          value
        ) : (
          value
        )}
        {references ? (
          <Badge variant="outline" className="ml-2">
            <span className="truncate max-w-[200px]">
              {references.name ??
                references.title ??
                references.label ??
                references.key}
            </span>
          </Badge>
        ) : null}
      </span>
    </Comp>
  );
};
