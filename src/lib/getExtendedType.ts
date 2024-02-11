export const getExtendedType = (type: string, name: string) =>
  [
    { type: "order", re: "order" },
    { type: "html", re: "html" },
    { type: "media", re: "media(s|)_json" },
    { type: "image", re: "image(s|)_json" },
    { type: "video", re: "video(s|)_json" },
    { type: "timestamp", re: "((timestamp(tz|))|(datetime))" },
    { type: "date", re: "date" },
  ].find(({ re }) => new RegExp(`(_|^)${re}(_|$)`, "gi").test(name))?.type ??
    type;

export default getExtendedType;
