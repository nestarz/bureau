import Picture from "@/src/components/Picture.tsx";
import { cn } from "@/src/lib/utils.ts";
import { useRef } from "react";

const useClient: any = await import("@/src/lib/useClient.ts").then((v) => v.default(import.meta.url));
export const h: any = useClient.h;
export const hydrate: any = useClient.hydrate;

export interface MediaProp {
  key: string;
  "content-type": string;
}

let endpoint: string;
export const MediaContext = (
  { endpoint: value }: { endpoint: string },
): null => {
  endpoint = value;
  return null;
};

const Video = (
  { src, className }: { src?: string; className?: string },
): JSX.Element => {
  const ref = useRef<HTMLVideoElement>(null!);
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
  className?: string;
  mediaClassName?: string;
  media: MediaProp;
  maxWidth: number;
}): JSX.Element => {
  return (
    <div className={className}>
      {/image\//.test(media["content-type"])
        ? (
          <Picture
            src={endpoint ? new URL(media.key, endpoint).href : undefined}
            maxWidth={maxWidth}
            className={cn(
              "aspect-square object-contain w-full h-auto",
              mediaClassName,
            )}
          />
        )
        : /video\//.test(media["content-type"])
        ? (
          <Video
            src={endpoint ? new URL(media.key, endpoint).href : undefined}
            className={mediaClassName}
          />
        )
        : <div className="aspect-square w-full bg-foreground" />}
    </div>
  );
};

export default Media;
