export type Column = {
  name: string;
  references: string;
  to: string;
  pk: boolean;
};
export type Table = { name: string; columns: Column[] };

export const findKeyColumn = (columns: Column[]) =>
  columns.find(({ name }) => /title|name|key/.test(name));

export const findTable = (tables: Table[], columnName: string) =>
  tables.find(({ name }) => name === columnName);

export default function findForeignKeyFields(tables: Table[], depth: number) {
  return (prev: Record<string, any>, column: Column): Record<string, any> => {
    const ftable = findTable(tables, column.references);

    if (!ftable) return prev;

    const fcolumn = findKeyColumn(ftable.columns);

    if (!fcolumn) return prev;

    return {
      ...prev,
      [`${column.name}_by_fk`]: {
        [column.to]: true,
        [fcolumn.name]: true,
        ...(depth <= 0
          ? {}
          : ftable.columns.reduce(findForeignKeyFields(tables, depth - 1), {})),
      },
    };
  };
}
