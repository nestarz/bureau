import clsx from "clsx";
import { h, hydrate } from "preact";
import { useEffect } from "preact/hooks";

import { Signal, useComputed, useSignal } from "@preact/signals";

import { useForm } from "../utils/useForm.ts";
import { gqlify, useLazyQuery, useQuery } from "../utils/useHttp.ts";
import { DatabaseTypes, useStore } from "../utils/useStore.ts";
import { convertToPlain, toArray } from "../utils/utils.ts";
import Alert from "./Alert.tsx";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "./Combobox.tsx";
import Editor from "./Editor.tsx";
import MediaManager from "./MediaManager.tsx";

export { h, hydrate };

type ModeType = {
  Component: string;
  props: Record<string, any>;
};

const isNumeric = (n: any): boolean => !isNaN(parseFloat(n)) && isFinite(n);
const toNumeric = (value: any): number | null =>
  isNumeric(value) ? Number(value) : null;
const toText = (value: any): string | null =>
  typeof value !== "string" && value !== null && value !== undefined
    ? JSON.stringify(value)
    : value;

export const transformInput = {
  INTEGER: { transform: toNumeric },
  REAL: { transform: toNumeric },
  TEXT: { transform: toText },
};

const typeToInputProps: Record<string, ModeType> = {
  BLOB: { Component: "input", props: { type: "file" } },
  INTEGER: { Component: "input", props: { type: "number" } },
  TEXT: { Component: "textarea", props: { rows: 1 } },
  REAL: {
    Component: "input",
    props: { type: "number", inputmode: "numeric", step: "any" },
  },
};

type ChooseInputProps = {
  id: string;
  name: string;
  value?: { value: any };
  onChange?: (value: any) => void;
};

const regex: { type: Mode; re: RegExp }[] = [
  {
    type: "IMAGE",
    re: /\b(?:((?:\w*_)*)(image|image|video|drawing|images|videos|drawings|svg)((?:_\w*)*))\b/,
  },
  {
    type: "DATE",
    re: /(\b(?:((?:\w*_)*)(date)((?:_\w*)*))\b)|(\b(?:((?:\w*_)*)(datetime|created_at|updated_at|time)((?:_\w*)*))\b)/,
  },
];

type Mode = "IMAGES" | "IMAGE" | "DATE" | "DATETIME" | "HTML" | "TEXT";

const startsWithImageOrVideo = (value: string): boolean =>
  value?.startsWith("image/") || value?.startsWith("video/");

const isImageOrVideo = (value: DatabaseTypes): boolean =>
  toArray(value).some(
    (v) => typeof v === "object" && startsWithImageOrVideo(v?.["content-type"])
  );

const getModeFromValue = (value: DatabaseTypes, name: string): Mode => {
  if (isImageOrVideo(value)) return Array.isArray(value) ? "IMAGES" : "IMAGE";
  for (const { type, re } of regex) if (re.exec(name)) return type;
  return typeof value === "string" &&
    (convertToPlain(value || "")?.trim() || "").length !==
      ((value || "")?.trim?.() || "").length
    ? "HTML"
    : "TEXT";
};

const modeTypes = {
  TEXT: { Component: "textarea", props: { rows: 1 } },
  DATE: { Component: "input", props: { type: "date" } },
  DATETIME: { Component: "input", props: { type: "datetime-local" } },
  TIME: { Component: "input", props: { type: "time" } },
};

const ChooseInput = ({ id, name, ...props }: ChooseInputProps) => {
  const initMode = useComputed(() =>
    getModeFromValue(props?.value?.value, name)
  );
  const acceptedModes = useComputed<Mode[]>(() => {
    return isImageOrVideo(props?.value?.value)
      ? Array.isArray(props?.value?.value)
        ? ["IMAGES"]
        : ["IMAGE"]
      : ["DATETIME", "DATE", "TEXT", "HTML"];
  });

  const mode = useSignal(initMode.peek());
  useEffect(() => void (mode.value = initMode.value), [initMode.value]);

  const modeType =
    modeTypes[mode.value as keyof typeof modeTypes] ?? modeTypes.TEXT;
  return (
    <div className="flex flex-col relative w-full flex-1">
      <select
        value={mode}
        onChange={(e) => (mode.value = e.target.value)}
        className="flex-none h-fit self-start ml-auto text-right pr-1 py-[0.15rem] w-20 absolute -mt-8 text-xs bg-transparent -right-2 text-slate-400"
      >
        {["TEXT", "HTML", "IMAGE", "IMAGES", "DATE", "DATETIME", "TIME"].map(
          (value) => (
            <option key={value} disabled={!acceptedModes.value.includes(value)}>
              {value}
            </option>
          )
        )}
      </select>
      {mode.value === "HTML" ? (
        <Editor
          className="w-full prose prose-sm focus:outline-none px-2"
          containerClassName="flex flex-col w-full gap-2 px-1 max-h-[60vh] overflow-y-auto"
          {...props}
        />
      ) : mode.value?.includes?.("IMAGE") ? (
        <MediaManager
          {...props}
          onChange={(v) => props.onChange?.(v ? v : null)}
          value={props.value.value}
          multiple={true}
        />
      ) : (
        <modeType.Component
          className="w-full px-2"
          {...modeType.props}
          {...props}
        />
      )}
    </div>
  );
};

const ForeignInput = ({ tables, references, to, register, name, control }) => {
  const table = tables.find((table) => table.name === references);
  const currFieldName = useSignal(
    table.columns.find(({ name }) => /title|name|key/.test(name))?.name ?? to
  );

  const {
    data: { [references]: options = [] } = {},
    loading,
    error,
  } = useQuery(
    gqlify({
      query: {
        [references]: {
          [to]: true,
          [currFieldName.value]: true,
          ...Object.fromEntries(
            table.columns
              .filter((column) => column.references)
              .map((column) => {
                const table = tables.find((table) => table.name === references);
                const fcolumn = table.columns.find(({ name }) =>
                  /title|name|key/.test(name)
                );
                return [
                  `${column.name}_by_fk`,
                  {
                    [column.to]: true,
                    ...(fcolumn.name ? { [fcolumn.name]: true } : {}),
                  },
                ];
              })
          ),
        },
      },
    })
  );
  const currRow = useComputed(() =>
    options.find(({ [to]: v }) => control.value[name] === v)
  );
  const query: Signal<string> = useSignal("");

  return loading || error ? (
    <Alert error={error} loading={loading} />
  ) : (
    <div className="flex gap-2">
      <Combobox
        className="group relative flex items-center justify-center w-full cursor-default"
        {...register(name, { valueAsNumber: true })}
      >
        <div className="sm:(py-2 text-sm leading-6) focus:(ring-2 ring-inset ring-indigo-600) placeholder:text-gray-400 flex px-2 gap-1 align-center w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
          <span className="flex self-center leading-normal text-[10px] font-medium bg-slate-100 px-1 py-[1px] uppercase rounded">
            {currRow.value?.[to]}
          </span>
          <ComboboxInput
            className="appearance-none flex-1 leading-none flex gap-2 items-center cursor-default focus:(outline-none ring-0)"
            displayValue={(value) => {
              return options.find(({ [to]: v }) => value === v)?.[
                currFieldName.value
              ];
            }}
          />
          <div className="flex gap-1 text-[10px] leading-none">
            {table.columns
              .filter((column) => column.references)
              .filter(
                (column) => !!currRow[column.name + "_by_fk"]?.[column.to]
              )
              .map((column) => {
                const fkname = tables
                  .find((table) => table.name === column.references)
                  .columns.find((col) => /title|name|key/.test(col.name));
                return (
                  <div className="flex gap-1 items-center">
                    {[
                      column.name,
                      currRow.value?.[column.name + "_by_fk"][column.to],
                    ].map((value) => (
                      <span className="flex leading-normal text-[9px] font-medium bg-slate-100 px-1 py-[1px] uppercase rounded">
                        {value}
                      </span>
                    ))}
                    {fkname?.name && (
                      <span className="truncate">
                        {currRow.value?.[column.name + "_by_fk"][fkname.name]}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
        <ComboboxOptions className="hidden top-full group-focus-within:(absolute min-w-max left-0 z-10 flex flex-col mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm)">
          {options
            .filter(
              (v) =>
                query.value === "" ||
                String(v[currFieldName.value])
                  ?.toLowerCase?.()
                  .includes(query.value?.toLowerCase())
            )
            .map((row) => (
              <ComboboxOption
                className="font-sans-serif leading-none gap-2 relative flex justify-between items-center cursor-default select-none p-2 text-gray-900 cursor-pointer hover:(bg-slate-100 text-slate-800)"
                key={row[to]}
                value={row[to]}
              >
                <span className="text-[10px] font-medium bg-slate-100 px-1 py-[1px] uppercase rounded">
                  {row[to]}
                </span>
                <span className="mr-auto">{row[currFieldName.value]}</span>
                <div className="flex gap-1 text-[10px]">
                  {table.columns
                    .filter((column) => column.references)
                    .filter(
                      (column) => !!row[column.name + "_by_fk"]?.[column.to]
                    )
                    .map((column) => {
                      const fkname = tables
                        .find((table) => table.name === column.references)
                        .columns.find((col) => /title|name|key/.test(col.name));
                      return (
                        <div className="flex gap-1 items-center">
                          {[
                            column.name,
                            row[column.name + "_by_fk"][column.to],
                          ].map((value) => (
                            <span className="flex leading-normal text-[9px] font-medium bg-slate-100 px-1 py-[1px] uppercase rounded">
                              {value}
                            </span>
                          ))}
                          {fkname?.name && (
                            <span>
                              {row[column.name + "_by_fk"][fkname.name]}
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              </ComboboxOption>
            ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
};

const Field = ({
  tables,
  control,
  register,
  id,
  pk,
  name,
  notnull,
  type,
  references,
  to,
}) => {
  const required = Boolean(notnull && !(pk && type === "INTEGER"));
  const current = typeToInputProps[type] ?? typeToInputProps.TEXT;
  return (
    <label key={name} className="flex flex-col gap-2" for={id}>
      <span
        className="block text-xs font-medium text-slate-900 flex gap-3 items-center capitalize"
        title={name}
      >
        {`${name?.replace(/_/g, " ").replace(/\bid\b/, "ID")}`}
        {required ? (
          <span className="text-[10px] font-medium bg-slate-100 px-1 py-[1px] capitalize rounded">
            required
          </span>
        ) : null}
      </span>
      {references ? (
        <ForeignInput
          tables={tables}
          control={control}
          register={register}
          name={name}
          references={references}
          to={to}
        />
      ) : (
        <div
          className={clsx(
            "flex px-1 items-center w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6",
            name === "id" && "bg-gray-50"
          )}
        >
          {type === "TEXT" ? (
            <ChooseInput id={id} {...register(name)} required={required} />
          ) : (
            <current.Component
              {...register(name)}
              id={id}
              className="w-full px-2 disabled:bg-transparent"
              placeholder={name}
              required={required}
              disabled={name === "id"}
              {...(current.props ?? {})}
            />
          )}
        </div>
      )}
    </label>
  );
};

interface UpsertRowProps {
  params: {
    tableName: string;
    pk?: number;
  };
}

export default ({ params: { tableName, pk } }: UpsertRowProps) => {
  const tables = useStore().getTables();
  const notifyTableUpdate = useStore().notify;
  const { columns = [] } = tables.find(({ name }) => name === tableName) ?? {};
  const pks = columns.filter(({ pk }) => !!pk);
  const pk_columns = pks.reduce(
    (acc, { name, type }) => ({
      ...acc,
      [name]: transformInput[type]?.transform?.(pk) ?? pk,
    }),
    {}
  );

  const [trigger, { data: { row = {} } = {}, error, loading }] = useLazyQuery(
    gqlify({
      [gqlify(
        "query",
        pks.reduce(
          (acc, { name, gqltype }) => ({
            ...acc,
            [`$${name}`]: gqltype.replace(/(\w+)/g, "$1!"),
          }),
          {}
        )
      )]: {
        [gqlify(
          `row: ${tableName}_by_pk`,
          pks.reduce((acc, { name }) => ({ ...acc, [name]: `$${name}` }), {})
        )]: columns.reduce(
          (acc, { name }) => ({
            ...acc,
            [name]: true,
          }),
          {}
        ),
      },
    }),
    { variables: pk_columns }
  );

  useEffect(() => {
    if (pk) trigger({ variables: pk_columns });
  }, [JSON.stringify({ pk, pk_columns })]);

  const [insert, state] = useLazyQuery(
    gqlify({
      [gqlify("mutation", {
        $_set: pk ? `${tableName}_set_input!` : `${tableName}_insert_input!`,
        $pk_columns: pk ? `${tableName}_pk_columns_input!` : undefined,
      })]: {
        [gqlify(pk ? `update_${tableName}_one` : `insert_${tableName}_one`, {
          [pk ? "_set" : "object"]: "$_set",
          pk_columns: pk ? "$pk_columns" : undefined,
        })]: {
          [columns[0]?.name]: true,
        },
      },
    })
  );
  const { handleSubmit, register, reset, control } = useForm({
    initialState: row,
  });
  useEffect(() => void reset(pk ? row : {}), [JSON.stringify({ row, pk })]);

  return error || loading ? (
    <Alert loading={loading} error={error} />
  ) : (
    <form
      className="flex gap-2 flex-col px-4"
      onSubmit={handleSubmit(
        async (object) =>
          void (await insert({
            variables: {
              pk_columns,
              _set: Object.fromEntries(
                Object.entries(object).map(([columnName, value]) => [
                  columnName,
                  transformInput[
                    columns.find(({ name }) => columnName === name)
                      .type as string
                  ]?.transform?.(value) ?? value,
                ])
              ),
            },
          })?.then?.(() => notifyTableUpdate(tableName)))
      )}
    >
      <div className="flex gap-4 flex-col max-w-3xl">
        {columns.map((column, i) => (
          <Field
            key={i}
            control={control}
            register={register}
            id={`_for_${column.name}${i}`}
            tables={tables}
            {...column}
          />
        ))}
      </div>
      <button className="self-start inline-flex px-4 py-2 rounded hover:text-gray-600 group bg-slate-50 mt-4 text-sm font-medium">
        {pk ? "Update" : "Insert"}
      </button>
      <Alert {...state} />
    </form>
  );
};
