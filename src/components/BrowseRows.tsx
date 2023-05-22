import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { useCallback, useEffect } from "preact/hooks";
import { Fragment, h, hydrate } from "preact";
import { Link } from "wouter";
export { h, hydrate };

import type { Column, TableInfo, Row } from "../utils/useStore.ts";
import findForeignKeyFields, {
  findKeyColumn,
  findTable,
} from "../utils/findForeignKeyFields.ts";
import { useQuery, gqlify, useLazyQuery, debounce } from "../utils/useHttp.ts";
import { toArray } from "../utils/utils.ts";
import DisplayObject from "./DisplayObject.tsx";
import DraggableList from "./DraggableList.tsx";
import { useStore, useSignalEffectWithInputs } from "../utils/useStore.ts";
import Alert from "./Alert.tsx";

interface InfoRecordProps {
  label: string;
  value?: string;
}

export const InfoRecord = ({ label, value }: InfoRecordProps) => (
  <span className="flex gap-1 items-center text-[10px]">
    <span className="flex leading-normal text-[9px] font-medium bg-slate-100 px-1 py-[1px] uppercase rounded">
      {label}
    </span>
    {typeof value !== "undefined" && value !== null && <span>{value}</span>}
  </span>
);

export const findNested = (
  tables: TableInfo[],
  column: Column,
  cell: Record<string, any>,
  depth: number
) => {
  const ftable = findTable(tables, column.references);
  const fcolumn = ftable ? findKeyColumn(ftable.columns) : null;
  const nestedCell = cell?.[`${column.name}_by_fk`];
  const nestedCellValue = fcolumn ? nestedCell?.[fcolumn?.name] : null;
  return {
    column: fcolumn,
    cell: nestedCell,
    name: column.name,
    value: nestedCellValue,
    children: (depth <= 0 ? [] : ftable?.columns ?? [])
      .filter((fcolumn) => fcolumn.references)
      .map((fcolumn) =>
        findNested(tables, fcolumn, nestedCell, (depth ?? 1) - 1)
      ),
  };
};

interface TableProps {
  params: {
    tableName: string;
  };
}

export default ({ params: { tableName } }: TableProps) => {
  const tables = useStore().getTables();
  const addNotifyTableListener = useStore().addNotifyListener;

  const { columns = [] } = tables.find(({ name }) => name === tableName) ?? {};
  const sortColumn = columns.find((d) => /order/g.test(d.name));
  const {
    data: { [tableName]: table = [] } = {},
    error,
    loading,
    refetch,
  } = useQuery(
    gqlify({
      query: {
        [gqlify(tableName, {
          limit: 500,
          ...(sortColumn ? { order_by: { [sortColumn.name]: "asc" } } : {}),
        })]: {
          ...Object.fromEntries(columns.map(({ name }) => [name, true])),
          ...columns.reduce(findForeignKeyFields(tables, 2), {}),
        },
      },
    })
  );

  useSignalEffectWithInputs(() => {
    const remove = addNotifyTableListener(tableName, () => refetch());
    return remove;
  }, [refetch]);

  const pk = columns.find((d) => d.pk);
  const [remove, removeState] = useLazyQuery(
    gqlify({
      [gqlify("mutation", { $in: "[Int!]" })]: {
        [gqlify("delete_".concat(tableName), {
          where: { [pk?.name]: { _in: "$in" } },
        })]: {
          [pk?.name]: true,
        },
      },
    })
  );

  const [reorder, reorderState] = useLazyQuery(
    gqlify({
      [gqlify("mutation", { $updates: `[${tableName}_updates_input!]!` })]: {
        [gqlify("update_".concat(tableName, "_many"), { updates: "$updates" })]:
          { affected_rows: true },
      },
    })
  );

  const indices = useSignal<number[]>([]);
  useEffect(() => {
    indices.value = [...Array(table.length).keys()];
  }, [JSON.stringify(table)]);
  const reorderedTable = useComputed(() =>
    indices.value.map((index) => table[index])
  );

  const saveReorder = useCallback(
    debounce(() => {
      if (pk && sortColumn)
        return reorder({
          variables: {
            updates: indices.peek().map((idx) => ({
              where: {
                [pk.name]: { _eq: reorderedTable.peek()[idx][pk.name] },
              },
              _set: { [sortColumn.name]: idx },
            })),
          },
        });
    }),
    [reorder, JSON.stringify({ pk, table })]
  );

  const hasOrder = !!sortColumn;
  const move = (from: number, to: number) => {
    const newIndices = [...indices.value];
    newIndices.splice(to, 0, newIndices.splice(from, 1)[0]);
    indices.value = newIndices;
    if (hasOrder) saveReorder();
  };

  const onDelete = (row: Row) => () => {
    if (!pk) return;
    const yesOrNo = window
      .prompt(`Remove ${pk.name}: ${row?.[pk.name]}`, "yes")
      ?.includes("y");
    if (yesOrNo) remove({ variables: { in: row?.[pk.name] } });
  };

  return loading ? (
    <Alert loading={loading} error={error} />
  ) : (
    <Fragment>
      <div
        className={`bg-white grid grid-cols-[${
          hasOrder ? "min-content_" : ""
        }min-content_repeat(${
          columns.length - 1
        },_auto)_min-content] overflow-hidden w-full rounded-md border border-slate-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600`}
      >
        {hasOrder && (
          <div className="flex items-start justify-center px-6 py-3 border-b-1 border-slate-200 leading-none"></div>
        )}
        {columns.map(({ name }) => {
          const displayName = name
            .replace(/_json/gi, "")
            .replace(/_/, " ")
            .replace(/^id$/, "ID");
          return (
            <div
              key={name}
              className="px-6 py-3 text-left text-xs leading-4 font-medium text-slate-900 truncate capitalize tracking-wider border-b-1 border-slate-200"
            >
              {displayName}
            </div>
          );
        })}
        <div className="flex items-start justify-center px-6 py-3 border-b-1 border-slate-200"></div>
        <DraggableList onMove={move}>
          {reorderedTable.value.map((row, index) => (
            <Fragment>
              {hasOrder && (
                <div className="font-icon cursor-move flex leading-none justify-center px-6 py-3 border-b-1 border-slate-50 font-icon text-base">
                  {String.fromCodePoint(0xf38f)}
                </div>
              )}
              <Link
                key={index}
                className="group contents"
                href={`/table/${tableName}/update/${row?.id}`}
              >
                {columns.map((column) => {
                  const cellValue = row[column.name];
                  const { value, children } = findNested(
                    tables,
                    column,
                    row,
                    1
                  );
                  const renderChildren = (
                    children: ReturnType<typeof findNested>["children"]
                  ) => {
                    return children?.map(({ name, value, children }, index) => (
                      <Fragment key={index}>
                        {typeof value !== "undefined" && value !== null && (
                          <InfoRecord label={name} value={value} />
                        )}
                        {renderChildren(children)}
                      </Fragment>
                    ));
                  };

                  return (
                    <div
                      key={column.name}
                      className="truncate flex flex-col gap-1 px-6 py-3 whitespace-no-wrap text-sm leading-5 text-gray-500 group-hover:bg-gray-50 border-b-1 border-slate-50"
                    >
                      <div className="flex gap-1">
                        {column.references || column.pk ? (
                          <InfoRecord label={cellValue} />
                        ) : (
                          toArray(cellValue).map((value, i) => (
                            <DisplayObject
                              key={i}
                              className="w-5 h-5 object-cover rounded-sm ring-1 ring-slate-200"
                              value={value}
                              asAsset
                            />
                          ))
                        )}
                        <span>{value}</span>
                      </div>
                      <div>{renderChildren(children)}</div>
                    </div>
                  );
                })}
              </Link>
              <button
                className="flex items-center justify-center px-6 py-3 border-b-1 border-slate-50 font-icon text-red-800 text-xs hover:text-gray-600"
                onClick={onDelete(row)}
                type="button"
              >
                {String.fromCodePoint(0xec2a)}
              </button>
            </Fragment>
          ))}
        </DraggableList>
      </div>
      <Alert {...removeState} />
      <Alert {...reorderState} />
    </Fragment>
  );
};
