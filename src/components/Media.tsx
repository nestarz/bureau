import Picture from "@/src/components/Picture.tsx";
import { cn } from "@/src/lib/utils.ts";
import { useRef } from "react";

export const { h, hydrate } = await import("@/src/lib/useClient.ts").then(
  (v) => v.default(import.meta.url)
);

let endpoint: string;
export const MediaContext = ({ endpoint: value }: { endpoint: string }) => {
  endpoint = value;
  return null;
};

const Video = ({ src, className }) => {
  const ref = useRef();
  return (
    <video
      ref={ref}
      src={src}
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
}) => {
  return (
    <div className={className}>
      {/image\//.test(media["content-type"]) ? (
        <Picture
          src={endpoint ? new URL(media.key, endpoint).href : null}
          maxWidth={maxWidth}
          className={cn(
            "aspect-square object-contain w-full h-auto",
            mediaClassName
          )}
        />
      ) : /video\//.test(media["content-type"]) ? (
        <Video
          src={endpoint ? new URL(media.key, endpoint).href : null}
          className={mediaClassName}
        />
      ) : (
        <div className="aspect-square w-full bg-foreground" />
      )}
    </div>
  );
};

export default Media;
