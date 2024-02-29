// @deno-types="@types/react"
import { useMemo, useState } from "react";
import { unique } from "outils/unique.ts";

interface FileBrowserProps<
  T extends { [a: string]: unknown } = { key: string },
> {
  initialPath?: string;
  files: T[];
  getKey: (file: T) => string;
}

const getFolder = <T extends { [a: string]: unknown }>(
  path: string,
  file: T,
  getKey: (file: T) => string,
): string => {
  const relativePath = getKey(file).slice((path.length ?? 0) + (path ? 1 : 0));
  return relativePath.split("/")[0];
};

const getFilesInPath = <T extends { [a: string]: unknown }>(
  files: T[],
  path: string,
  getKey: (file: T) => string,
): [string, T][] => {
  const currFiles = files.filter((file) =>
    getKey(file).startsWith(path ? `${path}/` : "")
  );
  const filesAndFolders = currFiles.reduce<[string, T][]>((acc, file) => {
    const folderOrFile = getFolder(path, file, getKey);
    if (!acc.map((d) => d[0]).includes(folderOrFile)) {
      acc.push([folderOrFile, file]);
    }
    return acc;
  }, []);

  return filesAndFolders;
};

const useFileBrowser = <T extends { [a: string] } = { key: string }>({
  initialPath,
  files,
  getKey,
}: FileBrowserProps<T>) => {
  const [path, setPath] = useState<string>(initialPath ?? "");
  const isFolder = (item: string): boolean => {
    const fullPath = path ? `${path}/${item}` : item;
    return files.some((file) => getKey(file).startsWith(`${fullPath}/`));
  };
  const currentObjects = useMemo(() => getFilesInPath(files, path, getKey), [
    files,
    path,
    getKey,
  ]);
  const [fakeFolders, setFakeFolders] = useState<string[]>([]);
  const currFakesFolders = useMemo(() =>
    getFilesInPath(
      fakeFolders.map((key) => ({ key } as unknown as T)),
      path,
      ({ key }: any) => key,
    ), [fakeFolders, path]);
  const currentFolders = useMemo(() =>
    [
      ...currentObjects.filter(([v]) => isFolder(v)),
      ...currFakesFolders,
    ].map(([, d]) => d).filter(
      unique((file: T) => getFolder(path, file, getKey)),
    ), [currentObjects, currFakesFolders, isFolder, path, getKey]);
  const currentFiles = useMemo(
    () => currentObjects.filter(([v]) => !isFolder(v)).map(([, d]) => d),
    [currentObjects, isFolder],
  );

  return {
    path,
    addFolder: (name: string, slugify = (v: string) => v) => {
      const folder = [path, ...name.split("/").map(slugify)].join("/");
      if (name?.trim()) setFakeFolders((s) => [...s, folder]);
    },
    getFolder: (file: T): string => {
      const folderOrFile = getFolder(path, file, getKey);
      return path ? `${path}/${folderOrFile}` : folderOrFile;
    },
    getFolderName: (file: T): string => getFolder(path, file, getKey),
    goTo: setPath,
    currentFiles,
    currentFolders,
    goUp: () => {
      setPath((s) => s.split("/").slice(0, -1).join("/"));
    },
  };
};

export default useFileBrowser;
