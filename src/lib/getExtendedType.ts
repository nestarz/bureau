export const getExtendedType = (
  name: string,
  _type: string,
): string | undefined =>
  [
    { type: "order", re: "order" },
    { type: "html", re: "html" },
    { type: "media", re: "media(s|)_json" },
    { type: "media", re: "file(s|)_json" },
    { type: "image", re: "image(s|)_json" },
    { type: "image", re: "svg(s|)_json" },
    { type: "video", re: "video(s|)_json" },
    { type: "video", re: "mp4(s|)_json" },
    {
      type: "timestamp",
      re: "((timestamp(tz|))|(datetime)|(.*?_at$))",
    },
    { type: "date", re: "date" },
  ].find(({ re }) => new RegExp(`(_|^)${re}(_|$)`, "gi").test(name))?.type;

export default getExtendedType;
