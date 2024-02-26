type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export interface PublicAbout {
  id?: number;
  url?: string;
  crew_images_json?: string;
}
export interface PublicCrewMembers {
  id?: number;
  first_name?: string;
  last_name?: string;
  description_html?: string;
  created_at?: string;
}
export interface PublicShipModules {
  id?: number;
  ship_id?: number;
  title?: string;
  images_json?: string;
  created_at?: string;
  order?: number;
  row_span?: number;
  column_span?: number;
}
export interface PublicShips {
  id?: number;
  title?: string;
  images_json?: string;
  created_at?: string;
  description_html?: string;
  order?: number;
}
export interface PublicSqliteSequence {
  name?: unknown;
  seq?: unknown;
}

export interface Public {
  about: PublicAbout;
  crew_members: PublicCrewMembers;
  ship_modules: PublicShipModules;
  ships: PublicShips;
  sqlite_sequence: PublicSqliteSequence;
}

export interface Database {
  public: Public;
}
