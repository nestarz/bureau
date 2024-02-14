type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export interface PublicShips {
  id?: number;
  title?: string;
  images_json?: string;
  created_at?: string;
  description_html?: string;
}
export interface PublicSqliteSequence {
  name?: unknown;
  seq?: unknown;
}

export interface Public {
  ships: PublicShips;
  sqlite_sequence: PublicSqliteSequence;
}

export interface Database {
  public: Public;
}
