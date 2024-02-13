import { useMemo, useState } from "react";
import { unique } from "outils/unique.ts";

const getFolder = (path, file, getKey) => {
  const relativePath = getKey(file).slice((path.length ?? 0) + (path ? 1 : 0));
  return relativePath.split("/")[0];
};

const getFilesInPath = (files, path, getKey) => {
  const currFiles = files.filter((file) =>
    getKey(file).startsWith(path ? `${path}/` : "")
  );
  const filesAndFolders = currFiles.reduce((acc, file) => {
    const folderOrFile = getFolder(path, file, getKey);
    if (!acc.map((d) => d[0]).includes(folderOrFile)) {
      acc.push([folderOrFile, file]);
    }
    return acc;
  }, []);

  return filesAndFolders;
};

const useFileBrowser = ({ initialPath, files, getKey }) => {
  const [path, setPath] = useState<string>(initialPath ?? "");
  const isFolder = (item) => {
    const fullPath = path ? `${path}/${item}` : item;
    return files.some((file) => getKey(file).startsWith(`${fullPath}/`));
  };
  const currentObjects = getFilesInPath(files, path, getKey);
  const [fakeFolders, setFakeFolders] = useState<string[]>([]);
  const currFakesFolders = getFilesInPath(
    fakeFolders.map((key) => ({ key })),
    path,
    ({ key }) => key,
  );
  const currentFolders = [
    ...currentObjects.filter(([v]) => isFolder(v)),
    ...currFakesFolders,
  ].map(([, d]) => d).filter(
    unique((file) => getFolder(path, file, getKey)),
  );
  const currentFiles = currentObjects.filter(([v]) => !isFolder(v)).map((
    [, d],
  ) => d);

  return {
    path,
    addFolder: (name, slugify = (v) => v) => {
      const folder = [path, ...name.split("/").map(slugify)].join("/");
      if (name?.trim()) setFakeFolders((s) => [...s, folder]);
    },
    getFolder: (file) => {
      const folderOrFile = getFolder(path, file, getKey);
      return path ? `${path}/${folderOrFile}` : folderOrFile;
    },
    getFolderName: (file) => getFolder(path, file, getKey),
    goTo: setPath,
    currentFiles,
    currentFolders,
    goUp: () => {
      setPath((s) => s.split("/").slice(0, -1).join("/"));
    },
  };
};

export default useFileBrowser;
