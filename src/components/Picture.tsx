import urlcat from "outils/urlcat.ts";
// @deno-types="@types/react"
import React from "react";

interface CreatePictureParams {
  src: string;
  maxWidth?: number;
}

interface PictureSource {
  maxWidth: number;
  srcSet: URL | null;
}

interface CreatePictureReturn {
  src: string | URL;
  sources: PictureSource[];
}

export const createPicture = ({
  src,
  maxWidth = 30,
}: CreatePictureParams): CreatePictureReturn => {
  const sources: PictureSource[] = [maxWidth].map(
    (resize): PictureSource => ({
      maxWidth: resize,
      srcSet: new URL(
        urlcat("/api/transformer", {
          resize,
          toFormat: JSON.stringify(["webp", { quality: 90 }]),
          url: src,
        }),
        "https://remote-sharp.vercel.app/"
      ),
    })
  );
  return {
    src: sources.slice().pop()?.srcSet ?? src,
    sources,
  };
};

interface ImageComponentProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  maxWidth?: number;
  alt?: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  src,
  alt = "",
  maxWidth,
  ...props
}) => {
  const pictureData = src ? createPicture({ src, maxWidth }) : null;
  const filteredSources = pictureData?.sources.filter(
    (v) => v.maxWidth < (maxWidth ?? +Infinity)
  );

  return (
    <picture className="contents">
      {filteredSources?.map(({ maxWidth: _v, ...source }) => (
        <source
          className="hidden"
          key={`${source.srcSet}`}
          srcSet={source.srcSet?.href}
        />
      ))}
      <img
        src={`${filteredSources?.pop()?.srcSet ?? pictureData?.src}`}
        alt={alt}
        tabIndex={0}
        {...props}
      />
    </picture>
  );
};

export default ImageComponent;
