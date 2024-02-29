import React from "react";
import { basicSetup, EditorView } from "codemirror";
import { Compartment, EditorState } from "@codemirror/state";
import { sql, type SQLConfig, SQLDialect } from "@codemirror/lang-sql";

const SQLite: SQLDialect = SQLDialect.define({
  // Based on https://www.sqlite.org/lang_keywords.html based on likely keywords to be used in select queries
  // https://github.com/simonw/datasette/pull/1893#issuecomment-1316401895:
  keywords:
    "select abort action add after all alter always analyze and as asc attach autoincrement before begin between by cascade case cast check collate column commit conflict constraint create cross current current_date current_time current_timestamp database default deferrable deferred delete desc detach distinct do drop each else end escape except exclude exclusive exists explain fail filter first following for foreign from full generated glob group groups having if ignore immediate in index indexed initially inner insert instead intersect into is isnull join key last left like limit match materialized natural no not nothing notnull null nulls of offset on or order others outer over partition plan pragma preceding primary query raise range recursive references regexp reindex release rename replace restrict returning right rollback row rows savepoint select set table temp temporary then ties to transaction trigger unbounded union unique update using vacuum values view virtual when where window with without",
  // https://www.sqlite.org/datatype3.html
  types: "null integer real text blob",
  builtin: "",
  operatorChars: "*+-%<>!=&|/~",
  identifierQuotes: '`"',
  specialVar: "@:?$",
});

const useClient = await import("@/src/lib/useClient.ts").then((v) => v.default(import.meta.url));
export const h = useClient.h;
export const hydrate = useClient.hydrate;

export const SqlInput = ({
  className,
  defaultValue,
  name,
  sqlConfig,
}: {
  className?: string;
  name: string;
  defaultValue?: string;
  sqlConfig?: SQLConfig;
}): React.ReactElement => {
  const ref = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    const language = new Compartment();
    const tabSize = new Compartment();
    if (!ref.current) return;

    const editor = new EditorView({
      state: EditorState.create({
        doc: "",
        extensions: [
          basicSetup,
          language.of(
            sql({ dialect: SQLite, upperCaseKeywords: true, ...sqlConfig }),
          ),
          EditorView.lineWrapping,
          tabSize.of(EditorState.tabSize.of(2)),
          EditorView.updateListener.of((e) => {
            const value = e.state.doc.toString();
            if (!inputRef.current) return;
            inputRef.current.value = value;
          }),
        ],
      }),
      parent: ref.current,
    });
  }, []);
  return (
    <React.Fragment>
      <input
        ref={inputRef}
        type="hidden"
        name={name}
        defaultValue={defaultValue}
      />
      <div ref={ref} className={className} />
    </React.Fragment>
  );
};
export default SqlInput;
