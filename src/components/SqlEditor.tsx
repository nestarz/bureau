import { h, hydrate } from "preact";
export { h, hydrate };
import { gql, useLazyQuery } from "../utils/useHttp.ts";
import { useForm } from "../utils/useForm.ts";
import Alert from "./Alert.tsx";
import { jsonparse } from "../utils/useSearchParams.ts";
import Download from "./Download.tsx";
import { signal, useSignal } from "@preact/signals";
import { sharp } from "../utils/utils.ts";

type Query = {
  sql: string;
  date: Date;
};

const STORAGE_KEY = "sqlQueries";

// Pure function to get all queries from localStorage
const getAllQueries = (): Query[] => {
  const existingQueriesJson = globalThis.localStorage?.getItem(STORAGE_KEY);
  const existingQueries = existingQueriesJson
    ? JSON.parse(existingQueriesJson)
    : [];
  return existingQueries
    .map(({ sql, date }) => ({
      sql,
      date: new Date(date),
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

const queries = signal<Query[]>(getAllQueries());

// Pure function to save a query to localStorage
const saveQuery = (query: Query): void => {
  const existingQueriesJson = globalThis.localStorage?.getItem(STORAGE_KEY);
  const existingQueries = existingQueriesJson
    ? JSON.parse(existingQueriesJson)
    : [];
  const newQueries = [...existingQueries, query];
  const newQueriesJson = JSON.stringify(newQueries);
  globalThis.localStorage?.setItem(STORAGE_KEY, newQueriesJson);
  queries.value = getAllQueries();
};

const QueryList = ({ onQueryClick }: Props) => {
  const handleQueryClick = (sql: string) => {
    onQueryClick(sql);
  };

  const offset = useSignal(0);
  const limit = useSignal(7);
  return (
    <div className="flex flex-col max-w-sm">
      <h2 className="font-bold mb-2">Past Queries</h2>
      {queries.value.length === 0 && <p>No queries found</p>}
      <ul className="flex flex-col gap-1">
        {queries.value
          .map((query) => (
            <li
              key={query.date?.getTime()}
              className="cursor-pointer py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded flex flex-col justify-center"
              onClick={() => handleQueryClick(query.sql)}
            >
              <span className="truncate">{query.sql}</span>
              <span className="text-xs flex gap-2 truncate">
                <span>{query.date.toLocaleDateString(undefined)}</span>
                <span>{query.date.toLocaleTimeString(undefined)}</span>
              </span>
            </li>
          ))
          .slice(offset.value, offset.value + limit.value)}
      </ul>
      {offset.value < queries.value.length && (
        <button
          type="button"
          onClick={() =>
            (offset.value =
              (offset.peek() + limit.peek()) % queries.peek().length)
          }
        >
          See more
        </button>
      )}
    </div>
  );
};

export default () => {
  const { handleSubmit, register, set } = useForm();
  const [trigger, { data: { _sql: data = "" } = {}, error, loading }] =
    useLazyQuery(
      gql`
        query ($query: String!) {
          _sql(query: $query)
        }
      `
    );

  const columns = (jsonparse(data) ?? []).map((v) => Object.keys(v))?.[0] ?? [];
  const rows = (jsonparse(data) ?? []).map((v) => Object.values(v));

  return (
    <div className="w-full flex pt-10 px-4 gap-4">
      <form
        className="w-full flex flex-col gap-2"
        onSubmit={handleSubmit(async ({ query }) => {
          await trigger({ variables: { query } });
          saveQuery({ sql: query, date: new Date() });
        })}
      >
        <textarea
          type="text"
          {...register("query")}
          rows={20}
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <div className="flex gap-2">
          <button className="hover:bg-gray-300 bg-gray-100 self-start font-bold py-2 px-4 rounded focus:outline-none">
            Run
          </button>
          <Download />
        </div>
        <div className="w-full overflow-auto rounded-lg mt-4">
          {error || loading ? (
            <Alert loading={loading} error={error} />
          ) : (
            <form
              className={`bg-white grid grid-cols-[min-content_repeat(${
                columns.length - 1
              },_auto)] overflow-hidden border-bottom border-gray-200 sm:rounded-lg`}
            >
              {columns.map((column) => (
                <div className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  {column}
                </div>
              ))}
              {rows.map((row) => (
                <div className="contents group">
                  {columns
                    .map((_, i) => jsonparse(row[i]) ?? row[i])
                    .map((value) => (
                      <div className="truncate flex gap-1 px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500 group-hover:bg-gray-50">
                        {(Array.isArray(value)
                          ? value
                          : value
                          ? [value]
                          : []
                        ).map((value) =>
                          typeof value === "object" ? (
                            value?.["content-type"]?.startsWith("image/") ? (
                              <img
                                src={sharp(value?.url, { w: 40 })}
                                className="w-8 h-8 object-contain rounded-sm"
                              />
                            ) : (
                              JSON.stringify(value)
                            )
                          ) : (
                            value
                          )
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </form>
          )}
        </div>
      </form>
      <QueryList onQueryClick={(sql) => set("query", sql)} />
    </div>
  );
};
