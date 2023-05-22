import { h } from "preact";
import { convertToPlain, sharp } from "../utils/utils.ts";

export default ({ value, className, sharpOptions = { w: 40 }, asAsset }) => {
  return value?.["content-type"]?.startsWith("image/") ? (
    <img
      src={sharp(value?.url, sharpOptions)}
      className={className}
      title={JSON.stringify(value)}
      loading="lazy"
    />
  ) : value?.["content-type"]?.startsWith("video/") ? (
    <video
      src={value?.url}
      preload="metadata"
      className={className}
      title={JSON.stringify(value)}
    />
  ) : asAsset && ["[", "{"].includes(JSON.stringify(value)[0]) ? (
    <div title={JSON.stringify(value)} className={className}>
      📄
    </div>
  ) : (
    <span className="truncate max-w-xs">
      {typeof value === "object"
        ? JSON.stringify(value)
        : convertToPlain(value)}
    </span>
  );
};
