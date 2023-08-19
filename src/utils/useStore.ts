import { effect, signal } from "@preact/signals";
import { gql, useLazyQuery } from "./useHttp.ts";
import { type Inputs, useEffect, useRef } from "preact/hooks";

export type Column = {
  gqltype: string;
  table_name: string;
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string;
  pk: number;
  references: string;
  to: string;
};

export type TableInfo = {
  name: string;
  columns: Array<Column>;
};

export type DatabaseTypes = string | number | JSON | Uint8Array | null;

export interface Row {
  [key: string]: DatabaseTypes | Row;
}

const GET = gql`
  query {
    _tables
  }
`;

export function useSignalEffectWithInputs(
  cb: () => void | (() => void),
  inputs: Inputs = []
) {
  const callback = useRef(cb);
  callback.current = cb;

  useEffect(() => {
    return effect(() => callback.current());
  }, inputs);
}

export const tables = signal<Array<TableInfo>>([]);
const onNotifyFns = signal<Map<number, [string, Function]>>(new Map());
const ID = ((i) => (()=> i++))(0); // prettier-ignore
export const useStore = () => {
  const [query, { loading, error }] = useLazyQuery<{ _tables: TableInfo[] }>(
    GET
  );

  const fetch = async () => {
    const value = await query();
    tables.value = value.data?._tables ?? [] as TableInfo[];
  };

  return {
    fetch,
    tables,
    loading,
    error,
    addNotifyListener: (tableName: string, fn: Function) => {
      const id = ID();
      onNotifyFns.value.set(id, [tableName, fn]);
      return () => void onNotifyFns.value.delete(id);
    },
    getTables: () => tables.value,
    notify: (tableName: string, ...props: any[]) => {
      onNotifyFns.value.forEach((v) => {
        if (v[0] === tableName) v[1](...props);
      });
    },
  };
};
