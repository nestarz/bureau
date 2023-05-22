const slugify = (text) =>
  text
    ?.toString()
    ?.normalize("NFD")
    ?.replace(/[\u0300-\u036f]/g, "")
    ?.toLowerCase()
    ?.trim()
    ?.replace(/\s+/g, "-")
    ?.replace(/[^\w-]+/g, "")
    ?.replace(/--+/g, "-");

const getFilesFromFormData = (formData: FormData): File[] => {
  return [...formData.entries()]
    .map(([, v]) => v)
    .filter((file) => file instanceof File && file.name);
};

const getSafeName = (string: string) => {
  const defaultP = [null, string, ""];
  const [, raw, extension] = /^(.+)(\.[^.]+)$/.exec(string) ?? defaultP;
  const basename = slugify(raw);
  const name = `${basename}${extension}`;
  return { name, basename, extension };
};

interface UseUpload {
  getPrefix: () => string | undefined;
  onProgress?: (p: number, all: number) => unknown;
  onEnded?: () => unknown;
  uploadFn: (key: string, file: File) => Promise<unknown>;
}

export default ({ getPrefix, onProgress, uploadFn, onEnded }: UseUpload) => {
  const handleFileSubmit = (fn) => (e) => {
    e.preventDefault();
    return fn(getFilesFromFormData(new FormData(e.target)));
  };

  const upload = async (files: File[]) => {
    let i = 0;
    onProgress?.(i, files.length);
    for (const file of files) {
      i += 1;
      const relpath = file.webkitRelativePath?.slice(0, -file.name.length - 1);
      const path = relpath?.split("/").map((v) => slugify(v)) ?? [];
      const { name } = getSafeName(file.name);
      const key = [getPrefix?.() ?? "", ...path, name]
        .filter((v) => v)
        .join("/")
        .replaceAll("//", "/");
      await uploadFn(key, file);
      onProgress?.(i, files.length);
    }
    onEnded?.();
  };

  return { handleFileSubmit, upload };
};
