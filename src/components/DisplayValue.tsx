import convertToPlain from "outils/convertToPlain.ts";
import Media from "@/src/components/Media.tsx";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

export default ({ value, type }) => {
  return (
    <div className="flex space-x-2">
      <span className="max-w-[500px] truncate font-medium">
        {type === "order"
          ? <DragHandleDots2Icon className="mx-auto" />
          : typeof value === "object"
          ? type === "image"
            ? (
              <div className="flex items-center gap-1">
                {value?.map((media) => (
                  <Media
                    media={media}
                    maxWidth={10}
                    mediaClassName="w-6 rounded object-cover"
                  />
                ))}
              </div>
            )
            : JSON.stringify(value)
          : typeof value === "string"
          ? convertToPlain(value)
          : value}
      </span>
    </div>
  );
};
