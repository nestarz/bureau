import Picture from "@/src/components/Picture.tsx";
import { cn } from "@/src/lib/utils.ts";

export const Media = ({
  className,
  mediaClassName,
  media,
  maxWidth,
}: {
  media: { key: string; "content-type": string };
  maxWidth: number;
}) => (
  <div className={className}>
    {/image\//.test(media["content-type"])
      ? (
        <Picture
          src={media.url}
          maxWidth={maxWidth}
          className={cn(
            "aspect-square object-contain w-full h-auto",
            mediaClassName,
          )}
        />
      )
      : <div className="aspect-square w-full bg-foreground" />}
  </div>
);

export default Media;
