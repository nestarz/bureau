export const formatColumnName = (name: string): string =>
  name
    .replace(/_json/gi, "")
    .replace(/(^|_)id($|_)/gi, "$1ID$2")
    .replace(/(^|_)URL($|_)/gi, "$1URL$2")
    .replace(/_/gi, " ")
    .replace(/^./, (str) => str.toUpperCase());

export default formatColumnName;
