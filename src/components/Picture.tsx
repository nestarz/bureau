import urlcat from "outils/urlcat.ts";

export const createPicture = ({
  src,
  maxWidth = 30,
}: {
  src: string;
  maxWidth?: number;
}) => {
  const sources = [maxWidth]
    .map((resize, _, arr) => ({
      maxWidth: resize,
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

export default ({ src, sources, alt = "", maxWidth, ...props }) => {
  const filteredSources = (
    createPicture({ src, maxWidth }) ?? []
  ).sources.filter((v) => v.maxWidth < (maxWidth ?? +Infinity));
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
