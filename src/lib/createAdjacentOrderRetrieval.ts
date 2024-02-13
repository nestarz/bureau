import { type SelectQueryBuilder, sql } from "npm:kysely";

export const createAdjacentOrderRetrieval = (
  targetName: string,
  fromName: string,
  primaryKeys: Record<string, any>,
  orderKey: string | null | undefined,
) =>
(direction: "asc" | "desc") =>
(wb: SelectQueryBuilder<any, any, any>) => {
  const operation = direction === "asc" ? ">" : "<";
  const keys = orderKey
    ? { [orderKey]: sql.ref(`${targetName}.${orderKey}`) }
    : primaryKeys;
  for (const [key, value] of Object.entries(keys)) {
    wb = wb.where(({ eb, and, or }) =>
      or([
        and([
          eb(sql.ref(`${fromName}.${key}`), "!=", value),
          eb(sql.ref(`${fromName}.${key}`), operation, value),
        ]),
        and(
          !orderKey ? [] : [
            eb(sql.ref(`${fromName}.${key}`), "=", value),
            ...Object.keys(primaryKeys).map((key) =>
              eb(
                sql.ref(`${fromName}.${key}`),
                operation,
                sql.ref(`${targetName}.${key}`),
              )
            ),
          ],
        ),
      ])
    );
    wb = wb.orderBy(sql.ref(`${fromName}.${key}`), direction);
    if (orderKey) {
      for (const key of Object.keys(primaryKeys)) {
        wb = wb.orderBy(
          (eb) =>
            eb
              .case()
              .when(
                sql.ref(`${fromName}.${orderKey}`),
                "!=",
                sql.ref(`${targetName}.${orderKey}`),
              )
              .then(sql.ref(`${fromName}.${orderKey}`))
              .else(sql.ref(`${fromName}.${key}`))
              .end(),
          direction,
        );
      }
    }
  }
  return wb.limit(1);
};

export default createAdjacentOrderRetrieval;
