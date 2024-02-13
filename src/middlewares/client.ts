import { groupByToArray } from "outils/groupByToMap.ts";
import { FreshContext } from "outils/createRenderPipe.ts";

export interface Table {
  name: string;
  columns: Column[];
}

export interface Column {
  gqltype: GqlType;
  table_name: string;
  cid: number;
  name: string;
  type: "TEXT" | "INTEGER" | "REAL" | "BLOB";
  notnull: number;
  dflt_value: null;
  pk: number;
  references: null;
  to: null;
}

interface GqlType {
  type: string;
  nonNull: number;
}

export type ClientMiddleware = {
  tables: Table[];
  createAdminURL: (tableName: string, rowId: string | number) => string;
};

const mapSqliteGraphql = (
  type: string,
  columnName: string,
  notnull?: boolean,
) => {
  const rgx = /\b(?:((?:\w*_)*)(json)((?:_\w*)*))\b/;
  const newType = type === "TEXT" && rgx.test(columnName ?? "") ? "JSON" : type;
  return { type: newType, nonNull: notnull };
};

export const createHandler = ({
  parentPathSegment,
  databaseKey,
  analyticsKey,
  getS3Uri,
  s3Client,
}) => {
  return async (
    _req: Request,
    ctx: FreshContext<ClientMiddleware & { gqlHttpUrl: string }>,
  ) => {
    ctx.state.databaseKey = databaseKey;
    ctx.state.analyticsKey = analyticsKey;
    ctx.state.getS3Uri = getS3Uri;
    ctx.state.s3Client = s3Client;
    ctx.state.createAdminURL = (tableName: string, rowId: string | number) =>
      [parentPathSegment, tableName, rowId]
        .map((v) => v?.toString().replace(/\/$/, ""))
        .filter((v) => v)
        .join("/");

    ctx.state.tables = await ctx.state
      .clientQuery.default(() => ({
        sql:
          `  SELECT s.name AS table_name, info.*, fk."table" as "references", fk."to"
  FROM sqlite_schema AS s
  JOIN pragma_table_info(s.name) AS info ON 1=1
  LEFT JOIN pragma_foreign_key_list(s.name) AS fk ON fk."from" = info.name
  WHERE s.type = 'table' AND s.name NOT LIKE 'sqlite_%';`,
      }))
      .then((results) =>
        groupByToArray(results ?? [], ({ table_name }) => table_name)
      )
      .then((arr) => arr.map(([name, columns]) => ({ name, columns })))
      .then((tables) =>
        tables.map(({ columns, ...obj }) => ({
          ...obj,
          columns: columns.map((obj) => ({
            gqltype: mapSqliteGraphql(obj.type, obj.pk, obj.notnull),
            ...obj,
          })),
        }))
      );

    return await ctx.next();
  };
};
