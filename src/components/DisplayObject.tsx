import { h } from "preact";
import { convertToPlain, sharp } from "../utils/utils.ts";
import { useContext } from "preact/hooks";
import { ApiContext } from "../utils/useHttp.ts";

export default ({ value, className, sharpOptions = { w: 40 }, asAsset }) => {
  const { s3PublicUrl } = useContext(ApiContext) ?? {};

  return value?.["content-type"]?.startsWith("image/") ? (
    <img
      src={sharp(
        value?.url
          ? value?.url
          : value?.key && s3PublicUrl
          ? new URL(value.key, s3PublicUrl).href
          : null,
        sharpOptions
      )}
      className={className}
      title={JSON.stringify(value)}
      loading="lazy"
    />
  ) : value?.["content-type"]?.startsWith("video/") ? (
    <video
      src={
        value?.url
          ? value?.url
          : value?.key && s3PublicUrl
          ? new URL(value.key, s3PublicUrl).href
          : null
      }
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
