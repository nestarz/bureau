import { useComputed, useSignal } from "@preact/signals";

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
    if (!acc.map((d) => d[0]).includes(folderOrFile))
      acc.push([folderOrFile, file]);
    return acc;
  }, []);

  return filesAndFolders;
};

const useFileBrowser = ({ initialPath, files, getKey }) => {
  const path = useSignal<string>(initialPath ?? "");
  const isFolder = (item) => {
    const fullPath = path.peek() ? `${path.peek()}/${item}` : item;
    return files.peek().some((file) => getKey(file).startsWith(`${fullPath}/`));
  };
  const currentObjects = useComputed(() =>
    getFilesInPath(files.value, path.value, getKey)
  );
  const fakeFolders = useSignal<string[]>([]);
  const currFakesFolders = useComputed(() =>
    getFilesInPath(
      fakeFolders.value.map((key) => ({ key })),
      path.value,
      ({ key }) => key
    )
  );
  const currentFolders = useComputed(() =>
    [
      ...currentObjects.value.filter(([v]) => isFolder(v)),
      ...currFakesFolders.value,
    ].map(([, d]) => d)
  );
  const currentFiles = useComputed(() =>
    currentObjects.value.filter(([v]) => !isFolder(v)).map(([, d]) => d)
  );

  return {
    path,
    addFolder: (name, slugify = (v) => v) => {
      const folder = [path.peek(), ...name.split("/").map(slugify)].join("/");
      if (name?.trim()) fakeFolders.value = [...fakeFolders.peek(), folder];
    },
    getFolder: (file) => {
      const folderOrFile = getFolder(path.peek(), file, getKey);
      return path.peek() ? `${path.peek()}/${folderOrFile}` : folderOrFile;
    },
    getFolderName: (file) => getFolder(path.peek(), file, getKey),
    goTo: (folderPath) => (path.value = folderPath),
    currentFiles,
    currentFolders,
    goUp: () => {
      path.value = path.peek().split("/").slice(0, -1).join("/");
    },
  };
};

export default useFileBrowser;
