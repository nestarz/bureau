const slugify = (text?: string | null): string | undefined | null =>
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
    .filter((file) => file instanceof File && file.name)
    .map((v) => v as File);
};

const getSafeName = (string: string): {
  name: string;
  basename?: string | null;
  extension: string | null;
} => {
  const defaultP = [null, string, ""];
  const [, raw, extension] = /^(.+)(\.[^.]+)$/.exec(string) ?? defaultP;
  const basename = slugify(raw);
  const name = `${basename}${extension}`;
  return { name, basename, extension };
};

interface UseUpload {
  folder?: string;
  onProgress?: (p: number, all: number) => unknown;
  onEnded?: (all: number) => unknown;
  uploadFn: (key: string, file: File) => Promise<unknown>;
}

export default ({ folder, onProgress, uploadFn, onEnded }: UseUpload) => {
  const handleFileSubmit = (fn?: (files: File[]) => any) =>
  (
    e: Event & { target: HTMLFormElement },
  ) => {
    e.preventDefault();
    return fn?.(getFilesFromFormData(new FormData(e.target)));
  };

  const upload = async (files: File[] | FileList) => {
    let i = 0;
    onProgress?.(i, files.length);
    for (const file of files) {
      i += 1;
      const relpath = file.webkitRelativePath?.slice(0, -file.name.length - 1);
      const path = relpath?.split("/").map((v) => slugify(v)) ?? [];
      const { name } = getSafeName(file.name);
      const key = [folder ?? "", ...path, name]
        .filter((v) => v)
        .join("/")
        .replaceAll("//", "/");
      await uploadFn(key, file);
      onProgress?.(i, files.length);
    }
    onEnded?.(files.length);
  };

  return { handleFileSubmit, upload };
};
