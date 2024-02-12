import convertToPlain from "outils/convertToPlain.ts";
import Media from "@/src/components/Media.tsx";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Badge } from "@/src/components/ui/badge.tsx";

const MAX = 3;

export default ({ value, type }) => {
  return (
    <div className="flex space-x-2">
      <span className="max-w-[300px] truncate font-medium">
        {type === "order" ? (
          <DragHandleDots2Icon className="mx-auto" />
        ) : typeof value === "object" ? (
          type === "image" ? (
            <div className="flex items-center gap-1 w-max">
              {value?.slice(0, MAX).map((media) => (
                <Media
                  key={media.key}
                  media={media}
                  maxWidth={10}
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
          convertToPlain(value)
        ) : (
          value
        )}
      </span>
    </div>
  );
};
