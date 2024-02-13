type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export interface PublicAbout {
  id?: number;
  title?: string;
  content?: string;
  images_json?: string;
  description?: string;
  sizing_guide_pdf_file_json?: string;
  url?: string;
}
export interface PublicArchives {
  id?: number;
  title?: string;
  content?: string;
  images_json?: string;
  order?: number;
}
export interface PublicCategories {
  id?: number;
  name?: string;
  title?: string;
}
export interface PublicCollections {
  id?: number;
  name?: string;
  date?: string;
  title?: string;
}
export interface PublicColors {
  id?: number;
  name?: string;
  color_hex?: string;
}
export interface PublicProductVariantFabrics {
  id?: number;
  product_variant_id?: number;
  color_id?: number;
  description?: string;
}
export interface PublicProductVariantStocks {
  id?: number;
  product_variant_id?: number;
  size_id?: number;
  quantity?: number;
  price?: number;
}
export interface PublicProductVariants {
  id?: number;
  product_id?: number;
  name?: string;
  color_id?: number;
}
export interface PublicProducts {
  id?: number;
  title?: string;
  category_id?: number;
  order?: number;
  description?: string;
  collection_id?: number;
  type_id?: number;
  price?: number;
  main_material_label?: string;
  images_json?: string;
}
export interface PublicSizes {
  id?: number;
  name?: string;
}
export interface PublicTypes {
  id?: number;
  name?: string;
  title?: string;
}

export interface Public {
  about: PublicAbout;
  archives: PublicArchives;
  categories: PublicCategories;
  collections: PublicCollections;
  colors: PublicColors;
  product_variant_fabrics: PublicProductVariantFabrics;
  product_variant_stocks: PublicProductVariantStocks;
  product_variants: PublicProductVariants;
  products: PublicProducts;
  sizes: PublicSizes;
  types: PublicTypes;
}

export interface Database {
  public: Public;
}
