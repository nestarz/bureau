import Picture from "@/src/components/Picture.tsx";
import { cn } from "@/src/lib/utils.ts";
import { useRef } from "react";

const Video = ({ media, className }) => {
  const ref = useRef();
  return (
    <video
      ref={ref}
      src={media.url}
      preload="metadata"
      onMouseEnter={() => {
        ref.current.play?.();
      }}
      onMouseLeave={() => {
        ref.current.pause?.();
        ref.current.currentTime = 0;
      }}
      className={cn("aspect-square object-contain w-full h-auto", className)}
    />
  );
};

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
    {/image\//.test(media["content-type"]) ? (
      <Picture
        src={media.url}
        maxWidth={maxWidth}
        className={cn(
          "aspect-square object-contain w-full h-auto",
          mediaClassName
        )}
      />
    ) : /video\//.test(media["content-type"]) ? (
      <Video media={media} className={mediaClassName} />
    ) : (
      <div className="aspect-square w-full bg-foreground" />
    )}
  </div>
);

export default Media;
