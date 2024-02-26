import { S3Client } from "@/src/routes/api/medias.ts";
import { Session } from "@/vendor/fresh_session/session.ts";
import { SqliteMiddlewareState } from "jsr:@bureaudouble/outils@0.0.9/database/sqlite/createMiddleware.ts";
import type { PluginMiddleware } from "outils/fresh/types.ts";

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
  dflt_value?: string;
  pk: number;
  references?: string;
  to?: string;
}

interface GqlType {
  type: string;
  nonNull?: boolean;
}

const mapSqliteGraphql = (
  type: string,
  columnName: string,
  notnull?: boolean,
): { type: string; nonNull: boolean | undefined } => {
  const rgx = /\b(?:((?:\w*_)*)(json)((?:_\w*)*))\b/;
  const newType = type === "TEXT" && rgx.test(columnName ?? "") ? "JSON" : type;
  return { type: newType, nonNull: notnull };
};

export type ClientHandlerConfig = {
  basePath?: string;
  databaseKey: string;
  analyticsKey?: string;
  getS3Uri: (str: string) => URL;
  s3Client: any;
};

export type ClientMiddleware =
  & {
    tables: Table[];
    createAdminURL: (tableName: string, rowId: string | number) => string;
    getS3Uri: (arg: string) => URL;
    s3Client?: S3Client;
    databaseKey: string;
    analyticsKey?: string;
  }
  & { session: Session }
  & SqliteMiddlewareState<any>
  & ClientHandlerConfig;

export const createClientMiddleware = ({
  basePath,
  databaseKey,
  analyticsKey,
  getS3Uri,
  s3Client,
}: ClientHandlerConfig): PluginMiddleware<
  ClientMiddleware & { gqlHttpUrl: string } & ClientHandlerConfig
> => {
  return {
    path: "",
    middleware: {
      handler: async (_req, ctx) => {
        ctx.state.databaseKey = databaseKey;
        ctx.state.analyticsKey = analyticsKey;
        ctx.state.getS3Uri = getS3Uri;
        ctx.state.s3Client = s3Client;
        ctx.state.createAdminURL = (
          tableName: string,
          rowId: string | number,
        ) =>
          [basePath, tableName, rowId]
            .map((v) => v?.toString().replace(/\/$/, ""))
            .filter((v) => v)
            .join("/");

        ctx.state.tables = await ctx.state.clientQuery
          .default(() => ({
            query: null!,
            parameters: [],
            sql:
              `  SELECT s.name AS table_name, info.*, fk."table" as "references", fk."to"
  FROM sqlite_schema AS s
  JOIN pragma_table_info(s.name) AS info ON 1=1
  LEFT JOIN pragma_foreign_key_list(s.name) AS fk ON fk."from" = info.name
  WHERE s.type = 'table' AND s.name NOT LIKE 'sqlite_%';`,
          }))
          .then((results) =>
            Array.from(
              Map.groupBy(
                (results ?? []) as (
                  & { table_name: string }
                  & Omit<Column, "gqltype">
                )[],
                ({ table_name }) => table_name,
              ),
            )
          )
          .then((arr) => arr.map(([name, columns]) => ({ name, columns })))
          .then((tables) =>
            tables.map(({ columns, ...obj }) => ({
              ...obj,
              columns: columns.map((obj) => ({
                gqltype: mapSqliteGraphql(obj.type, obj.name, obj.notnull > 0),
                ...obj,
              })),
            }))
          );

        return await ctx.next();
      },
    },
  };
};
