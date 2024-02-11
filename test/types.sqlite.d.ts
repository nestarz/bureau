type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export interface PublicProjects {
  id?: number;
  title?: string;
  date?: string;
  images_json?: string;
  description?: string;
  url?: string;
  type?: string;
  order?: number;
}
export interface PublicSite {
  id?: number;
  title?: string;
  description?: string;
  instagram?: string;
  email?: string;
  images_json?: string;
  url?: string;
  city_geo?: string;
  keywords?: string;
  subtitle?: string;
  favicon_svg_json?: string;
  logo_full_image_json?: string;
}
export interface PublicStaff {
  id?: number;
  firstname?: string;
  lastname?: string;
  role?: string;
  description?: string;
  images_json?: string;
  url?: string;
  email?: string;
  telephone?: string;
}

export interface Public {
  projects: PublicProjects;
  site: PublicSite;
  staff: PublicStaff;
}

export interface Database {
  public: Public;
}
