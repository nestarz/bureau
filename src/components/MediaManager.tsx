import { Fragment, h } from "preact";
import {
  type Signal,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
import { useEffect } from "preact/hooks";
import { useRouter } from "wouter";
import { toArray, unique } from "../utils/utils.ts";
import InputFileField, { slugify } from "generic/InputFileField.tsx";
import DisplayObject from "./DisplayObject.tsx";
import Modal from "./Modal.tsx";
import { useForm } from "../utils/useForm.ts";
import useUpload from "../utils/useUpload.ts";
import useFileBrowser from "../utils/useFileBrowser.tsx";

type MediaKey = string;
type MediaType = {
  etag: MediaKey;
  key: string;
  url: string;
  lastModified: string;
};
type MediaValues = Map<MediaKey, MediaType>;
interface MediaForm {
  files: File;
  search: string;
  selected: MediaType[];
}

const setMap = (v, key, value) => new Map(v).set(key, value);
const deleteMap = (v, key) => {
  const newMap = new Map(v);
  return newMap.delete(key), newMap;
};
const toMap = (value) => new Map(toArray(value).map((v) => [v?.key, v]));

export default ({ onClose, onChange, value, multiple }) => {
  const router = useRouter();
  const sortKey: Signal<string> = useSignal("date");
  const values = useSignal<MediaValues>(toMap(value));
  useEffect(() => void (values.value = toMap(value)), [value]);
  const medias = useSignal<MediaType[]>([]);
  const {
    path,
    currentFiles,
    currentFolders,
    goTo,
    getFolder,
    getFolderName,
    addFolder,
  } = useFileBrowser({
    initialPath: "medias",
    files: medias,
    getKey: ({ key }) => key,
  });
  const filteredMedias = useComputed(() =>
    currentFiles.value.sort(
      sortKey.value === "key"
        ? (a, b) => a.key.localeCompare(b.key)
        : (...v) => {
            const [a, b] = v.map((v) => new Date(v.lastModified));
            return b > a ? 1 : -1;
          }
    )
  );
  const search = useSignal<string | null>(null);
  const ilike = useComputed(() =>
    search.value?.trim() ? `%${search.value?.trim()}%` : null
  );
  const refetch = useComputed(() => () => {
    fetch(router.base + "/api/medias", {
      method: "POST",
      body: JSON.stringify({
        ilike: ilike.value,
      }),
    }).then(async (r) => (medias.value = await r.json()));
  });
  useSignalEffect(() => void refetch.value());
  const { control, set, reset } = useForm<MediaForm>({
    initialState: { selected: values.peek() },
  });
  useSignalEffect(() => {
    reset({ selected: values.value });
  });
  const selected = useComputed(() => control.value.selected);
  const handleSelect = (value) => (e) => {
    const map = e.target.checked
      ? setMap(selected.peek(), value.key, value)
      : deleteMap(selected.peek(), value.key);
    return set("selected", map);
  };
  const progress = useSignal<[number, number] | null>(null);
  const { handleFileSubmit, upload } = useUpload({
    getPrefix: () => path.peek(),
    onEnded: () => refetch.peek()(),
    onProgress: (i, total) => (progress.value = [i, total]),
    uploadFn: async (key, body) => {
      const url =
        router.base + `/api/medias?object_name=${encodeURIComponent(key)}`;
      await fetch(await fetch(url, { method: "PUT" }).then((r) => r.text()), {
        method: "PUT",
        body,
      });
    },
  });

  return (
    <Modal
      className="rounded"
      button={({ open }) => (
        <button type="button" className="flex gap-1 flex-1 px-2" onClick={open}>
          {values.value.size > 0
            ? [...values.value].map(([, value]) => (
                <DisplayObject
                  key={value.key}
                  className="w-5 h-5 object-cover rounded-sm ring-1 ring-slate-200 items-center justify-center"
                  value={value}
                  asAsset
                />
              ))
            : "Select"}
        </button>
      )}
    >
      {({ close }) => (
        <Fragment>
          <div className="grid grid-cols-[1fr_4fr] gap-2">
            <div className="flex flex-col gap-2 max-w-xs w-full flex-1 basis-full row-span-2">
              <div className="flex gap-2">
                <label className="flex-1">
                  <span className="block text-xs font-medium text-slate-900 flex gap-3 items-center capitalize">
                    Search...
                  </span>
                  <input
                    placeholder="ex: cat0001.png"
                    className="flex px-2 items-center w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                    onChange={(e) => (search.value = e.target.value)}
                  />
                </label>
                <label className="flex flex-col">
                  <span className="block text-xs font-medium text-slate-900 flex gap-3 items-center capitalize">
                    Sort by
                  </span>
                  <select
                    value={sortKey}
                    onChange={(o) => (sortKey.value = o.target.value ?? "date")}
                    className="flex flex-1 px-2 items-center w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                  >
                    <option value="key">Name</option>
                    <option value="date">Updated at</option>
                  </select>
                </label>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { webkitdirectory: false, label: "File Upload" },
                  { webkitdirectory: true, label: "Folder Upload" },
                ].map(({ webkitdirectory, label }) => (
                  <InputFileField
                    component="form"
                    className="relative bg-slate-100 m-0 inline-flex px-4 py-2 rounded hover:text-gray-600 cursor-pointer basis-0 justify-center grow"
                    role="listitem"
                    onSubmit={handleFileSubmit(upload)}
                    InputProps={{
                      className: "opacity-0 absolute inset-0",
                      name: "assets",
                      onChange: (e) => e.target.form.requestSubmit(),
                      multiple: true,
                      webkitdirectory,
                    }}
                  >
                    <span className="pointer-events-none">{label}</span>
                  </InputFileField>
                ))}
                {progress.value &&
                  (progress.value[0] === progress.value[1] ? (
                    <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50 flex-1 basis-full">
                      <span className="font-medium">
                        {progress.value[1]} items successfully uploaded!
                      </span>
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50 flex-1 basis-full">
                      <span className="font-medium">
                        Uploading... ({progress.value[0]}/{progress.value[1]})
                      </span>
                    </div>
                  ))}
                <button
                  type="button"
                  className="flex-1 text-center relative justify-center bg-slate-100 m-0 inline-flex px-4 py-2 rounded hover:text-gray-600 cursor-pointer basis-full"
                  onClick={() => {
                    const name = prompt("Choose a name");
                    if (name?.trim()) addFolder(name, slugify);
                  }}
                >
                  Create folder
                </button>
              </div>
              <ul className="flex flex-col bg-slate-100 gap-1 p-1 flex-1 w-full rounded max-h-[60vh] overflow-y-scroll">
                {[...selected.value].map(([key, value]) => (
                  <label
                    className="flex relative bg-white p-1 items-center gap-2 rounded"
                    key={key}
                  >
                    <input
                      className="p-2"
                      type="checkbox"
                      checked={!!selected.value.get(value.key)}
                      onChange={handleSelect(value)}
                    />
                    <DisplayObject
                      className="w-5 h-5 rounded aspect-square object-cover"
                      value={value}
                      sharpOptions={{ w: 40 }}
                      asAsset
                    />
                    <span className="inline-grid text-xs">
                      <span className="truncate">
                        {value.key.split("/").pop()}
                      </span>
                      <span className="truncate text-slate-500 leading-none">
                        {value.key.split("/").slice(0, -1).join("/")}
                      </span>
                    </span>
                  </label>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  const reply = window.prompt(
                    [
                      `You are deleting images, they may be associated in somes pages, if so it may break the website, be sure to not use them in the website.`,
                      [...selected.peek().values()]
                        .map(({ key }) => `- ${key}`)
                        .join("\n"),
                      `Are you sure ? [Yes|No]`,
                    ].join("\n\n"),
                    "No"
                  );
                  if (reply?.toLowerCase()?.trim() === "yes")
                    fetch(router.base + "/api/medias", {
                      method: "DELETE",
                      body: JSON.stringify({
                        medias: [...selected.peek().values()],
                      }),
                    }).then(() => refetch.peek()());
                }}
                className="relative justify-center bg-red-100 text-red-800 m-0 inline-flex px-4 py-2 rounded hover:text-gray-600"
              >
                Erase Images
              </button>
            </div>
            <div className="flex gap-2">
              <div className="divide-x divide-slate-100 flex">
                {path.value.split("/").map((folder, i, arr) => (
                  <button
                    type="button"
                    className="bg-white px-4 py-2 font-medium"
                    onClick={() => goTo(arr.slice(0, i + 1).join("/"))}
                  >
                    {folder}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="ml-auto relative justify-center bg-green-100 text-green-800 m-0 inline-flex px-4 py-2 rounded hover:text-gray-600"
                onClick={async () => {
                  const withType = await Promise.all(
                    [...selected.peek()].map(async ([, obj]) => {
                      obj["content-type"] ??= await fetch(obj.url, {
                        method: "HEAD",
                        headers: { "Cache-Control": "no-store" },
                      }).then((r) => r.headers.get("content-type"));
                      obj.metadata = await new Promise((resolve, reject) => {
                        const image = new Image();
                        image.addEventListener("load", () =>
                          resolve({
                            width: image.naturalWidth,
                            height: image.naturalHeight,
                          })
                        );
                        image.addEventListener("error", reject);
                        image.src = obj.url;
                      });

                      return obj;
                    })
                  );
                  onChange?.(multiple ? withType : withType[0]);
                  close();
                  onClose?.();
                }}
              >
                Save
              </button>
              <button
                type="button"
                className="relative justify-center bg-red-100 text-red-800 m-0 inline-flex px-4 py-2 rounded hover:text-gray-600"
                onClick={() => {
                  close();
                  onClose?.();
                }}
              >
                Close
              </button>
            </div>
            <div className="bg-slate-100 p-[1px] overflow-scroll h-[85vh] rounded flex flex-col gap-[1px]">
              <div className="grid gap-[1px] grid-cols-fill-40 auto-rows-min">
                {currentFolders.value
                  .filter(unique((folder) => getFolderName(folder)))
                  .map((folder) => (
                    <button
                      type="button"
                      onClick={() => goTo(getFolder(folder))}
                      className="bg-white rounded px-4 py-2 font-medium"
                    >
                      {getFolderName(folder)}
                    </button>
                  ))}
              </div>
              <ul className="grid gap-[1px] grid-cols-fill-40 w-full auto-rows-min">
                {filteredMedias.value.map((value) => (
                  <label
                    className="flex flex-col gap-1 relative bg-white p-1 text-center"
                    key={value.key}
                  >
                    <DisplayObject
                      className="w-full aspect-square object-contain flex-1 flex items-center justify-center"
                      value={value}
                      sharpOptions={{ w: 200 }}
                      asAsset
                    />
                    <input
                      className="absolute p-2"
                      type="checkbox"
                      checked={!!selected.value.get(value.key)}
                      onChange={handleSelect(value)}
                    />
                    <span className="text-slate-400 text-xs truncate hover:(whitespace-break-spaces break-all)">
                      {value.key.split("/").pop()}
                    </span>
                  </label>
                ))}
              </ul>
            </div>
          </div>
        </Fragment>
      )}
    </Modal>
  );
};
