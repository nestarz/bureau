import urlcat from "outils/urlcat.ts";

export const createPicture = ({
  src,
  maxWidth,
}: {
  src: string;
  maxWidth?: number;
}) => {
  const sizes = [320, 480, 768, 1024, 1280, 1920].filter(
    (v) => !maxWidth || v < maxWidth,
  );
  const mediaQueries = {
    320: "(max-width: 320px)",
    480: "(max-width: 480px)",
    768: "(max-width: 768px)",
    1024: "(max-width: 1024px)",
    1280: "(max-width: 1280px)",
    1920: "(max-width: 1920px)",
  };
  const sources = sizes
    .map((resize) => ({
      maxWidth: resize,
      media: mediaQueries[resize as keyof typeof mediaQueries],
      srcSet: urlcat("/api/transformer", {
        resize,
        toFormat: JSON.stringify(["webp", { quality: 90 }]),
        url: src,
      }),
    }))
    .map(({ media, srcSet, maxWidth }) => ({
      maxWidth,
      media,
      srcSet: srcSet
        ? new URL(srcSet, "https://remote-sharp.vercel.app/")
        : null,
    }));
  return {
    src: sources.slice().pop()?.srcSet ?? src,
    sources,
  };
};

export default ({
  src,
  sources,
  alt = "",
  maxWidth,
  ...props
}) => {
  const filteredSources = (createPicture({ src }) ?? []).sources.filter(
    (v) => v.maxWidth < (maxWidth ?? +Infinity),
  );
  return (
    <picture className="contents">
      {filteredSources.map(({ maxWidth: _v, ...source }) => (
        <source className="hidden" key={source.media} {...source} />
      ))}
      <img
        src={filteredSources.pop()?.srcSet ?? createPicture({ src }).src}
        alt={alt}
        tabIndex={0}
        {...props}
      />
    </picture>
  );
};
