export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
};

export type Query = {
  __typename?: 'Query';
  _sql?: Maybe<Scalars['JSON']['output']>;
  _tables?: Maybe<Scalars['JSON']['output']>;
  _table?: Maybe<Scalars['JSON']['output']>;
  archives_by_pk?: Maybe<Archives>;
  archives?: Maybe<Array<Maybe<Archives>>>;
  archives_aggregate?: Maybe<Archives_Aggregate>;
  about_by_pk?: Maybe<About>;
  about?: Maybe<Array<Maybe<About>>>;
  about_aggregate?: Maybe<About_Aggregate>;
  categories_by_pk?: Maybe<Categories>;
  categories?: Maybe<Array<Maybe<Categories>>>;
  categories_aggregate?: Maybe<Categories_Aggregate>;
  products_by_pk?: Maybe<Products>;
  products?: Maybe<Array<Maybe<Products>>>;
  products_aggregate?: Maybe<Products_Aggregate>;
  colors_by_pk?: Maybe<Colors>;
  colors?: Maybe<Array<Maybe<Colors>>>;
  colors_aggregate?: Maybe<Colors_Aggregate>;
  collections_by_pk?: Maybe<Collections>;
  collections?: Maybe<Array<Maybe<Collections>>>;
  collections_aggregate?: Maybe<Collections_Aggregate>;
  types_by_pk?: Maybe<Types>;
  types?: Maybe<Array<Maybe<Types>>>;
  types_aggregate?: Maybe<Types_Aggregate>;
  sizes_by_pk?: Maybe<Sizes>;
  sizes?: Maybe<Array<Maybe<Sizes>>>;
  sizes_aggregate?: Maybe<Sizes_Aggregate>;
  product_variant_stocks_by_pk?: Maybe<Product_Variant_Stocks>;
  product_variant_stocks?: Maybe<Array<Maybe<Product_Variant_Stocks>>>;
  product_variant_stocks_aggregate?: Maybe<Product_Variant_Stocks_Aggregate>;
  product_variants_by_pk?: Maybe<Product_Variants>;
  product_variants?: Maybe<Array<Maybe<Product_Variants>>>;
  product_variants_aggregate?: Maybe<Product_Variants_Aggregate>;
  product_variant_fabrics_by_pk?: Maybe<Product_Variant_Fabrics>;
  product_variant_fabrics?: Maybe<Array<Maybe<Product_Variant_Fabrics>>>;
  product_variant_fabrics_aggregate?: Maybe<Product_Variant_Fabrics_Aggregate>;
};


export type Query_SqlArgs = {
  query: Scalars['String']['input'];
};


export type Query_TableArgs = {
  name: Scalars['String']['input'];
};


export type QueryArchives_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryArchivesArgs = {
  where?: InputMaybe<Archives_Bool_Exp>;
  order_by?: InputMaybe<Archives_Order_By>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAbout_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryAboutArgs = {
  where?: InputMaybe<About_Bool_Exp>;
  order_by?: InputMaybe<About_Order_By>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCategories_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCategoriesArgs = {
  where?: InputMaybe<Categories_Bool_Exp>;
  order_by?: InputMaybe<Categories_Order_By>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProducts_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProductsArgs = {
  where?: InputMaybe<Products_Bool_Exp>;
  order_by?: InputMaybe<Products_Order_By>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryColors_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryColorsArgs = {
  where?: InputMaybe<Colors_Bool_Exp>;
  order_by?: InputMaybe<Colors_Order_By>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCollections_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCollectionsArgs = {
  where?: InputMaybe<Collections_Bool_Exp>;
  order_by?: InputMaybe<Collections_Order_By>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTypes_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTypesArgs = {
  where?: InputMaybe<Types_Bool_Exp>;
  order_by?: InputMaybe<Types_Order_By>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySizes_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type QuerySizesArgs = {
  where?: InputMaybe<Sizes_Bool_Exp>;
  order_by?: InputMaybe<Sizes_Order_By>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProduct_Variant_Stocks_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProduct_Variant_StocksArgs = {
  where?: InputMaybe<Product_Variant_Stocks_Bool_Exp>;
  order_by?: InputMaybe<Product_Variant_Stocks_Order_By>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProduct_Variants_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProduct_VariantsArgs = {
  where?: InputMaybe<Product_Variants_Bool_Exp>;
  order_by?: InputMaybe<Product_Variants_Order_By>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProduct_Variant_Fabrics_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProduct_Variant_FabricsArgs = {
  where?: InputMaybe<Product_Variant_Fabrics_Bool_Exp>;
  order_by?: InputMaybe<Product_Variant_Fabrics_Order_By>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Archives = {
  __typename?: 'archives';
  id?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
  content: Scalars['String']['output'];
  images_json?: Maybe<Scalars['JSON']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
};


export type ArchivesTitleArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type ArchivesContentArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type ArchivesImages_JsonArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

export type Archives_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  content?: InputMaybe<String_Comparison_Exp>;
  images_json?: InputMaybe<String_Comparison_Exp>;
  order?: InputMaybe<Int_Comparison_Exp>;
  _or?: InputMaybe<Array<Archives_Bool_Exp>>;
  _and?: InputMaybe<Array<Archives_Bool_Exp>>;
};

export type Int_Comparison_Exp = {
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type String_Comparison_Exp = {
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  _eq?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Archives_Order_By = {
  id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  content?: InputMaybe<Order_By>;
  images_json?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
};

export enum Order_By {
  Asc = 'asc',
  AscNullsFirst = 'asc_nulls_first',
  AscNullsLast = 'asc_nulls_last',
  Desc = 'desc',
  DescNullsFirst = 'desc_nulls_first',
  DescNullsLast = 'desc_nulls_last'
}

export type Archives_Aggregate = {
  __typename?: 'archives_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Aggregate = {
  __typename?: 'aggregate';
  count?: Maybe<Scalars['Int']['output']>;
};

export type About = {
  __typename?: 'about';
  id?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
  content: Scalars['String']['output'];
  images_json?: Maybe<Scalars['JSON']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  sizing_guide_pdf_file_json?: Maybe<Scalars['JSON']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};


export type AboutTitleArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type AboutContentArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type AboutImages_JsonArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type AboutDescriptionArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type AboutSizing_Guide_Pdf_File_JsonArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type AboutUrlArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

export type About_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  content?: InputMaybe<String_Comparison_Exp>;
  images_json?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  sizing_guide_pdf_file_json?: InputMaybe<String_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
  _or?: InputMaybe<Array<About_Bool_Exp>>;
  _and?: InputMaybe<Array<About_Bool_Exp>>;
};

export type About_Order_By = {
  id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  content?: InputMaybe<Order_By>;
  images_json?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  sizing_guide_pdf_file_json?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
};

export type About_Aggregate = {
  __typename?: 'about_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Categories = {
  __typename?: 'categories';
  id?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  products_by_category_id?: Maybe<Array<Maybe<Products>>>;
  products_aggregate?: Maybe<Products_Aggregate>;
};


export type CategoriesNameArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type CategoriesTitleArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type CategoriesProducts_By_Category_IdArgs = {
  order_by?: InputMaybe<Categories_Order_By>;
  where?: InputMaybe<Categories_Bool_Exp>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Products = {
  __typename?: 'products';
  id?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
  category_id?: Maybe<Scalars['Int']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  collection_id?: Maybe<Scalars['Int']['output']>;
  type_id?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Scalars['Int']['output']>;
  main_material_label?: Maybe<Scalars['String']['output']>;
  images_json?: Maybe<Scalars['JSON']['output']>;
  category_id_by_fk?: Maybe<Categories>;
  collection_id_by_fk?: Maybe<Collections>;
  type_id_by_fk?: Maybe<Types>;
  product_variants_by_product_id?: Maybe<Array<Maybe<Product_Variants>>>;
  product_variants_aggregate?: Maybe<Product_Variants_Aggregate>;
};


export type ProductsTitleArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type ProductsDescriptionArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type ProductsMain_Material_LabelArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type ProductsImages_JsonArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type ProductsProduct_Variants_By_Product_IdArgs = {
  order_by?: InputMaybe<Products_Order_By>;
  where?: InputMaybe<Products_Bool_Exp>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Collections = {
  __typename?: 'collections';
  id?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  date: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  products_by_collection_id?: Maybe<Array<Maybe<Products>>>;
  products_aggregate?: Maybe<Products_Aggregate>;
};


export type CollectionsNameArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type CollectionsDateArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type CollectionsTitleArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type CollectionsProducts_By_Collection_IdArgs = {
  order_by?: InputMaybe<Collections_Order_By>;
  where?: InputMaybe<Collections_Bool_Exp>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Collections_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
};

export type Collections_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  date?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  _or?: InputMaybe<Array<Collections_Bool_Exp>>;
  _and?: InputMaybe<Array<Collections_Bool_Exp>>;
};

export type Products_Aggregate = {
  __typename?: 'products_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Types = {
  __typename?: 'types';
  id?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  products_by_type_id?: Maybe<Array<Maybe<Products>>>;
  products_aggregate?: Maybe<Products_Aggregate>;
};


export type TypesNameArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type TypesTitleArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type TypesProducts_By_Type_IdArgs = {
  order_by?: InputMaybe<Types_Order_By>;
  where?: InputMaybe<Types_Bool_Exp>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Types_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
};

export type Types_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  _or?: InputMaybe<Array<Types_Bool_Exp>>;
  _and?: InputMaybe<Array<Types_Bool_Exp>>;
};

export type Product_Variants = {
  __typename?: 'product_variants';
  id?: Maybe<Scalars['Int']['output']>;
  product_id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  color_id: Scalars['Int']['output'];
  product_id_by_fk?: Maybe<Products>;
  color_id_by_fk?: Maybe<Colors>;
  product_variant_stocks_by_product_variant_id?: Maybe<Array<Maybe<Product_Variant_Stocks>>>;
  product_variant_fabrics_by_product_variant_id?: Maybe<Array<Maybe<Product_Variant_Fabrics>>>;
  product_variant_stocks_aggregate?: Maybe<Product_Variant_Stocks_Aggregate>;
  product_variant_fabrics_aggregate?: Maybe<Product_Variant_Fabrics_Aggregate>;
};


export type Product_VariantsNameArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type Product_VariantsProduct_Variant_Stocks_By_Product_Variant_IdArgs = {
  order_by?: InputMaybe<Product_Variants_Order_By>;
  where?: InputMaybe<Product_Variants_Bool_Exp>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type Product_VariantsProduct_Variant_Fabrics_By_Product_Variant_IdArgs = {
  order_by?: InputMaybe<Product_Variants_Order_By>;
  where?: InputMaybe<Product_Variants_Bool_Exp>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Colors = {
  __typename?: 'colors';
  id?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  color_hex?: Maybe<Scalars['String']['output']>;
  product_variants_by_color_id?: Maybe<Array<Maybe<Product_Variants>>>;
  product_variant_fabrics_by_color_id?: Maybe<Array<Maybe<Product_Variant_Fabrics>>>;
  product_variants_aggregate?: Maybe<Product_Variants_Aggregate>;
  product_variant_fabrics_aggregate?: Maybe<Product_Variant_Fabrics_Aggregate>;
};


export type ColorsNameArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type ColorsColor_HexArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type ColorsProduct_Variants_By_Color_IdArgs = {
  order_by?: InputMaybe<Colors_Order_By>;
  where?: InputMaybe<Colors_Bool_Exp>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type ColorsProduct_Variant_Fabrics_By_Color_IdArgs = {
  order_by?: InputMaybe<Colors_Order_By>;
  where?: InputMaybe<Colors_Bool_Exp>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Colors_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  color_hex?: InputMaybe<Order_By>;
};

export type Colors_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  color_hex?: InputMaybe<String_Comparison_Exp>;
  _or?: InputMaybe<Array<Colors_Bool_Exp>>;
  _and?: InputMaybe<Array<Colors_Bool_Exp>>;
};

export type Product_Variant_Fabrics = {
  __typename?: 'product_variant_fabrics';
  id?: Maybe<Scalars['Int']['output']>;
  product_variant_id: Scalars['Int']['output'];
  color_id: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  product_variant_id_by_fk?: Maybe<Product_Variants>;
  color_id_by_fk?: Maybe<Colors>;
};


export type Product_Variant_FabricsDescriptionArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

export type Product_Variants_Aggregate = {
  __typename?: 'product_variants_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Product_Variant_Fabrics_Aggregate = {
  __typename?: 'product_variant_fabrics_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Product_Variant_Stocks = {
  __typename?: 'product_variant_stocks';
  id?: Maybe<Scalars['Int']['output']>;
  product_variant_id: Scalars['Int']['output'];
  size_id: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
  price?: Maybe<Scalars['Int']['output']>;
  product_variant_id_by_fk?: Maybe<Product_Variants>;
  size_id_by_fk?: Maybe<Sizes>;
};

export type Sizes = {
  __typename?: 'sizes';
  id?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  product_variant_stocks_by_size_id?: Maybe<Array<Maybe<Product_Variant_Stocks>>>;
  product_variant_stocks_aggregate?: Maybe<Product_Variant_Stocks_Aggregate>;
};


export type SizesNameArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type SizesProduct_Variant_Stocks_By_Size_IdArgs = {
  order_by?: InputMaybe<Sizes_Order_By>;
  where?: InputMaybe<Sizes_Bool_Exp>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Sizes_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

export type Sizes_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  _or?: InputMaybe<Array<Sizes_Bool_Exp>>;
  _and?: InputMaybe<Array<Sizes_Bool_Exp>>;
};

export type Product_Variant_Stocks_Aggregate = {
  __typename?: 'product_variant_stocks_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Product_Variants_Order_By = {
  id?: InputMaybe<Order_By>;
  product_id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  color_id?: InputMaybe<Order_By>;
};

export type Product_Variants_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  product_id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  color_id?: InputMaybe<Int_Comparison_Exp>;
  _or?: InputMaybe<Array<Product_Variants_Bool_Exp>>;
  _and?: InputMaybe<Array<Product_Variants_Bool_Exp>>;
};

export type Products_Order_By = {
  id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  category_id?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  collection_id?: InputMaybe<Order_By>;
  type_id?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  main_material_label?: InputMaybe<Order_By>;
  images_json?: InputMaybe<Order_By>;
};

export type Products_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  category_id?: InputMaybe<Int_Comparison_Exp>;
  order?: InputMaybe<Int_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  collection_id?: InputMaybe<Int_Comparison_Exp>;
  type_id?: InputMaybe<Int_Comparison_Exp>;
  price?: InputMaybe<Int_Comparison_Exp>;
  main_material_label?: InputMaybe<String_Comparison_Exp>;
  images_json?: InputMaybe<String_Comparison_Exp>;
  _or?: InputMaybe<Array<Products_Bool_Exp>>;
  _and?: InputMaybe<Array<Products_Bool_Exp>>;
};

export type Categories_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
};

export type Categories_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  _or?: InputMaybe<Array<Categories_Bool_Exp>>;
  _and?: InputMaybe<Array<Categories_Bool_Exp>>;
};

export type Categories_Aggregate = {
  __typename?: 'categories_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Colors_Aggregate = {
  __typename?: 'colors_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Collections_Aggregate = {
  __typename?: 'collections_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Types_Aggregate = {
  __typename?: 'types_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Sizes_Aggregate = {
  __typename?: 'sizes_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Product_Variant_Stocks_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  product_variant_id?: InputMaybe<Int_Comparison_Exp>;
  size_id?: InputMaybe<Int_Comparison_Exp>;
  quantity?: InputMaybe<Int_Comparison_Exp>;
  price?: InputMaybe<Int_Comparison_Exp>;
  _or?: InputMaybe<Array<Product_Variant_Stocks_Bool_Exp>>;
  _and?: InputMaybe<Array<Product_Variant_Stocks_Bool_Exp>>;
};

export type Product_Variant_Stocks_Order_By = {
  id?: InputMaybe<Order_By>;
  product_variant_id?: InputMaybe<Order_By>;
  size_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
};

export type Product_Variant_Fabrics_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  product_variant_id?: InputMaybe<Int_Comparison_Exp>;
  color_id?: InputMaybe<Int_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  _or?: InputMaybe<Array<Product_Variant_Fabrics_Bool_Exp>>;
  _and?: InputMaybe<Array<Product_Variant_Fabrics_Bool_Exp>>;
};

export type Product_Variant_Fabrics_Order_By = {
  id?: InputMaybe<Order_By>;
  product_variant_id?: InputMaybe<Order_By>;
  color_id?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
};

export type Mutation = {
  __typename?: 'Mutation';
  update_archives_one?: Maybe<Archives>;
  delete_archives?: Maybe<Archives>;
  insert_archives_one?: Maybe<Archives>;
  insert_archives?: Maybe<Array<Maybe<Archives>>>;
  update_archives_many?: Maybe<Array<Maybe<Archives_Mutation_Response>>>;
  update_about_one?: Maybe<About>;
  delete_about?: Maybe<About>;
  insert_about_one?: Maybe<About>;
  insert_about?: Maybe<Array<Maybe<About>>>;
  update_about_many?: Maybe<Array<Maybe<About_Mutation_Response>>>;
  update_categories_one?: Maybe<Categories>;
  delete_categories?: Maybe<Categories>;
  insert_categories_one?: Maybe<Categories>;
  insert_categories?: Maybe<Array<Maybe<Categories>>>;
  update_categories_many?: Maybe<Array<Maybe<Categories_Mutation_Response>>>;
  update_products_one?: Maybe<Products>;
  delete_products?: Maybe<Products>;
  insert_products_one?: Maybe<Products>;
  insert_products?: Maybe<Array<Maybe<Products>>>;
  update_products_many?: Maybe<Array<Maybe<Products_Mutation_Response>>>;
  update_colors_one?: Maybe<Colors>;
  delete_colors?: Maybe<Colors>;
  insert_colors_one?: Maybe<Colors>;
  insert_colors?: Maybe<Array<Maybe<Colors>>>;
  update_colors_many?: Maybe<Array<Maybe<Colors_Mutation_Response>>>;
  update_collections_one?: Maybe<Collections>;
  delete_collections?: Maybe<Collections>;
  insert_collections_one?: Maybe<Collections>;
  insert_collections?: Maybe<Array<Maybe<Collections>>>;
  update_collections_many?: Maybe<Array<Maybe<Collections_Mutation_Response>>>;
  update_types_one?: Maybe<Types>;
  delete_types?: Maybe<Types>;
  insert_types_one?: Maybe<Types>;
  insert_types?: Maybe<Array<Maybe<Types>>>;
  update_types_many?: Maybe<Array<Maybe<Types_Mutation_Response>>>;
  update_sizes_one?: Maybe<Sizes>;
  delete_sizes?: Maybe<Sizes>;
  insert_sizes_one?: Maybe<Sizes>;
  insert_sizes?: Maybe<Array<Maybe<Sizes>>>;
  update_sizes_many?: Maybe<Array<Maybe<Sizes_Mutation_Response>>>;
  update_product_variant_stocks_one?: Maybe<Product_Variant_Stocks>;
  delete_product_variant_stocks?: Maybe<Product_Variant_Stocks>;
  insert_product_variant_stocks_one?: Maybe<Product_Variant_Stocks>;
  insert_product_variant_stocks?: Maybe<Array<Maybe<Product_Variant_Stocks>>>;
  update_product_variant_stocks_many?: Maybe<Array<Maybe<Product_Variant_Stocks_Mutation_Response>>>;
  update_product_variants_one?: Maybe<Product_Variants>;
  delete_product_variants?: Maybe<Product_Variants>;
  insert_product_variants_one?: Maybe<Product_Variants>;
  insert_product_variants?: Maybe<Array<Maybe<Product_Variants>>>;
  update_product_variants_many?: Maybe<Array<Maybe<Product_Variants_Mutation_Response>>>;
  update_product_variant_fabrics_one?: Maybe<Product_Variant_Fabrics>;
  delete_product_variant_fabrics?: Maybe<Product_Variant_Fabrics>;
  insert_product_variant_fabrics_one?: Maybe<Product_Variant_Fabrics>;
  insert_product_variant_fabrics?: Maybe<Array<Maybe<Product_Variant_Fabrics>>>;
  update_product_variant_fabrics_many?: Maybe<Array<Maybe<Product_Variant_Fabrics_Mutation_Response>>>;
};


export type MutationUpdate_Archives_OneArgs = {
  _set: Archives_Set_Input;
  pk_columns?: InputMaybe<Archives_Pk_Columns_Input>;
};


export type MutationDelete_ArchivesArgs = {
  where?: InputMaybe<Archives_Bool_Exp>;
};


export type MutationInsert_Archives_OneArgs = {
  object: Archives_Insert_Input;
  on_conflict?: InputMaybe<Archives_On_Conflict>;
};


export type MutationInsert_ArchivesArgs = {
  objects: Array<InputMaybe<Archives_Insert_Input>>;
  on_conflict?: InputMaybe<Archives_On_Conflict>;
};


export type MutationUpdate_Archives_ManyArgs = {
  updates: Array<Archives_Updates_Input>;
};


export type MutationUpdate_About_OneArgs = {
  _set: About_Set_Input;
  pk_columns?: InputMaybe<About_Pk_Columns_Input>;
};


export type MutationDelete_AboutArgs = {
  where?: InputMaybe<About_Bool_Exp>;
};


export type MutationInsert_About_OneArgs = {
  object: About_Insert_Input;
  on_conflict?: InputMaybe<About_On_Conflict>;
};


export type MutationInsert_AboutArgs = {
  objects: Array<InputMaybe<About_Insert_Input>>;
  on_conflict?: InputMaybe<About_On_Conflict>;
};


export type MutationUpdate_About_ManyArgs = {
  updates: Array<About_Updates_Input>;
};


export type MutationUpdate_Categories_OneArgs = {
  _set: Categories_Set_Input;
  pk_columns?: InputMaybe<Categories_Pk_Columns_Input>;
};


export type MutationDelete_CategoriesArgs = {
  where?: InputMaybe<Categories_Bool_Exp>;
};


export type MutationInsert_Categories_OneArgs = {
  object: Categories_Insert_Input;
  on_conflict?: InputMaybe<Categories_On_Conflict>;
};


export type MutationInsert_CategoriesArgs = {
  objects: Array<InputMaybe<Categories_Insert_Input>>;
  on_conflict?: InputMaybe<Categories_On_Conflict>;
};


export type MutationUpdate_Categories_ManyArgs = {
  updates: Array<Categories_Updates_Input>;
};


export type MutationUpdate_Products_OneArgs = {
  _set: Products_Set_Input;
  pk_columns?: InputMaybe<Products_Pk_Columns_Input>;
};


export type MutationDelete_ProductsArgs = {
  where?: InputMaybe<Products_Bool_Exp>;
};


export type MutationInsert_Products_OneArgs = {
  object: Products_Insert_Input;
  on_conflict?: InputMaybe<Products_On_Conflict>;
};


export type MutationInsert_ProductsArgs = {
  objects: Array<InputMaybe<Products_Insert_Input>>;
  on_conflict?: InputMaybe<Products_On_Conflict>;
};


export type MutationUpdate_Products_ManyArgs = {
  updates: Array<Products_Updates_Input>;
};


export type MutationUpdate_Colors_OneArgs = {
  _set: Colors_Set_Input;
  pk_columns?: InputMaybe<Colors_Pk_Columns_Input>;
};


export type MutationDelete_ColorsArgs = {
  where?: InputMaybe<Colors_Bool_Exp>;
};


export type MutationInsert_Colors_OneArgs = {
  object: Colors_Insert_Input;
  on_conflict?: InputMaybe<Colors_On_Conflict>;
};


export type MutationInsert_ColorsArgs = {
  objects: Array<InputMaybe<Colors_Insert_Input>>;
  on_conflict?: InputMaybe<Colors_On_Conflict>;
};


export type MutationUpdate_Colors_ManyArgs = {
  updates: Array<Colors_Updates_Input>;
};


export type MutationUpdate_Collections_OneArgs = {
  _set: Collections_Set_Input;
  pk_columns?: InputMaybe<Collections_Pk_Columns_Input>;
};


export type MutationDelete_CollectionsArgs = {
  where?: InputMaybe<Collections_Bool_Exp>;
};


export type MutationInsert_Collections_OneArgs = {
  object: Collections_Insert_Input;
  on_conflict?: InputMaybe<Collections_On_Conflict>;
};


export type MutationInsert_CollectionsArgs = {
  objects: Array<InputMaybe<Collections_Insert_Input>>;
  on_conflict?: InputMaybe<Collections_On_Conflict>;
};


export type MutationUpdate_Collections_ManyArgs = {
  updates: Array<Collections_Updates_Input>;
};


export type MutationUpdate_Types_OneArgs = {
  _set: Types_Set_Input;
  pk_columns?: InputMaybe<Types_Pk_Columns_Input>;
};


export type MutationDelete_TypesArgs = {
  where?: InputMaybe<Types_Bool_Exp>;
};


export type MutationInsert_Types_OneArgs = {
  object: Types_Insert_Input;
  on_conflict?: InputMaybe<Types_On_Conflict>;
};


export type MutationInsert_TypesArgs = {
  objects: Array<InputMaybe<Types_Insert_Input>>;
  on_conflict?: InputMaybe<Types_On_Conflict>;
};


export type MutationUpdate_Types_ManyArgs = {
  updates: Array<Types_Updates_Input>;
};


export type MutationUpdate_Sizes_OneArgs = {
  _set: Sizes_Set_Input;
  pk_columns?: InputMaybe<Sizes_Pk_Columns_Input>;
};


export type MutationDelete_SizesArgs = {
  where?: InputMaybe<Sizes_Bool_Exp>;
};


export type MutationInsert_Sizes_OneArgs = {
  object: Sizes_Insert_Input;
  on_conflict?: InputMaybe<Sizes_On_Conflict>;
};


export type MutationInsert_SizesArgs = {
  objects: Array<InputMaybe<Sizes_Insert_Input>>;
  on_conflict?: InputMaybe<Sizes_On_Conflict>;
};


export type MutationUpdate_Sizes_ManyArgs = {
  updates: Array<Sizes_Updates_Input>;
};


export type MutationUpdate_Product_Variant_Stocks_OneArgs = {
  _set: Product_Variant_Stocks_Set_Input;
  pk_columns?: InputMaybe<Product_Variant_Stocks_Pk_Columns_Input>;
};


export type MutationDelete_Product_Variant_StocksArgs = {
  where?: InputMaybe<Product_Variant_Stocks_Bool_Exp>;
};


export type MutationInsert_Product_Variant_Stocks_OneArgs = {
  object: Product_Variant_Stocks_Insert_Input;
  on_conflict?: InputMaybe<Product_Variant_Stocks_On_Conflict>;
};


export type MutationInsert_Product_Variant_StocksArgs = {
  objects: Array<InputMaybe<Product_Variant_Stocks_Insert_Input>>;
  on_conflict?: InputMaybe<Product_Variant_Stocks_On_Conflict>;
};


export type MutationUpdate_Product_Variant_Stocks_ManyArgs = {
  updates: Array<Product_Variant_Stocks_Updates_Input>;
};


export type MutationUpdate_Product_Variants_OneArgs = {
  _set: Product_Variants_Set_Input;
  pk_columns?: InputMaybe<Product_Variants_Pk_Columns_Input>;
};


export type MutationDelete_Product_VariantsArgs = {
  where?: InputMaybe<Product_Variants_Bool_Exp>;
};


export type MutationInsert_Product_Variants_OneArgs = {
  object: Product_Variants_Insert_Input;
  on_conflict?: InputMaybe<Product_Variants_On_Conflict>;
};


export type MutationInsert_Product_VariantsArgs = {
  objects: Array<InputMaybe<Product_Variants_Insert_Input>>;
  on_conflict?: InputMaybe<Product_Variants_On_Conflict>;
};


export type MutationUpdate_Product_Variants_ManyArgs = {
  updates: Array<Product_Variants_Updates_Input>;
};


export type MutationUpdate_Product_Variant_Fabrics_OneArgs = {
  _set: Product_Variant_Fabrics_Set_Input;
  pk_columns?: InputMaybe<Product_Variant_Fabrics_Pk_Columns_Input>;
};


export type MutationDelete_Product_Variant_FabricsArgs = {
  where?: InputMaybe<Product_Variant_Fabrics_Bool_Exp>;
};


export type MutationInsert_Product_Variant_Fabrics_OneArgs = {
  object: Product_Variant_Fabrics_Insert_Input;
  on_conflict?: InputMaybe<Product_Variant_Fabrics_On_Conflict>;
};


export type MutationInsert_Product_Variant_FabricsArgs = {
  objects: Array<InputMaybe<Product_Variant_Fabrics_Insert_Input>>;
  on_conflict?: InputMaybe<Product_Variant_Fabrics_On_Conflict>;
};


export type MutationUpdate_Product_Variant_Fabrics_ManyArgs = {
  updates: Array<Product_Variant_Fabrics_Updates_Input>;
};

export type Archives_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  images_json?: InputMaybe<Scalars['JSON']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type Archives_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type Archives_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  content: Scalars['String']['input'];
  images_json?: InputMaybe<Scalars['JSON']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type Archives_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export enum Conflict_Action {
  Nothing = 'nothing',
  Update = 'update'
}

export type Archives_Mutation_Response = {
  __typename?: 'archives_mutation_response';
  affected_rows?: Maybe<Scalars['Int']['output']>;
  returning: Array<Archives>;
};

export type Archives_Updates_Input = {
  where?: InputMaybe<Archives_Bool_Exp>;
  _inc?: InputMaybe<Archives_Inc>;
  _set?: InputMaybe<Archives_Set_Input>;
};

export type Archives_Inc = {
  id?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type About_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  images_json?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  sizing_guide_pdf_file_json?: InputMaybe<Scalars['JSON']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type About_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type About_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  content: Scalars['String']['input'];
  images_json?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  sizing_guide_pdf_file_json?: InputMaybe<Scalars['JSON']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type About_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export type About_Mutation_Response = {
  __typename?: 'about_mutation_response';
  affected_rows?: Maybe<Scalars['Int']['output']>;
  returning: Array<About>;
};

export type About_Updates_Input = {
  where?: InputMaybe<About_Bool_Exp>;
  _inc?: InputMaybe<About_Inc>;
  _set?: InputMaybe<About_Set_Input>;
};

export type About_Inc = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Categories_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Categories_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type Categories_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Categories_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export type Categories_Mutation_Response = {
  __typename?: 'categories_mutation_response';
  affected_rows?: Maybe<Scalars['Int']['output']>;
  returning: Array<Categories>;
};

export type Categories_Updates_Input = {
  where?: InputMaybe<Categories_Bool_Exp>;
  _inc?: InputMaybe<Categories_Inc>;
  _set?: InputMaybe<Categories_Set_Input>;
};

export type Categories_Inc = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Products_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  category_id?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  collection_id?: InputMaybe<Scalars['Int']['input']>;
  type_id?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  main_material_label?: InputMaybe<Scalars['String']['input']>;
  images_json?: InputMaybe<Scalars['JSON']['input']>;
};

export type Products_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type Products_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  category_id?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  collection_id?: InputMaybe<Scalars['Int']['input']>;
  type_id?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  main_material_label?: InputMaybe<Scalars['String']['input']>;
  images_json?: InputMaybe<Scalars['JSON']['input']>;
};

export type Products_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export type Products_Mutation_Response = {
  __typename?: 'products_mutation_response';
  affected_rows?: Maybe<Scalars['Int']['output']>;
  returning: Array<Products>;
};

export type Products_Updates_Input = {
  where?: InputMaybe<Products_Bool_Exp>;
  _inc?: InputMaybe<Products_Inc>;
  _set?: InputMaybe<Products_Set_Input>;
};

export type Products_Inc = {
  id?: InputMaybe<Scalars['Int']['input']>;
  category_id?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  collection_id?: InputMaybe<Scalars['Int']['input']>;
  type_id?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
};

export type Colors_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  color_hex?: InputMaybe<Scalars['String']['input']>;
};

export type Colors_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type Colors_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  color_hex?: InputMaybe<Scalars['String']['input']>;
};

export type Colors_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export type Colors_Mutation_Response = {
  __typename?: 'colors_mutation_response';
  affected_rows?: Maybe<Scalars['Int']['output']>;
  returning: Array<Colors>;
};

export type Colors_Updates_Input = {
  where?: InputMaybe<Colors_Bool_Exp>;
  _inc?: InputMaybe<Colors_Inc>;
  _set?: InputMaybe<Colors_Set_Input>;
};

export type Colors_Inc = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Collections_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Collections_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type Collections_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  date: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Collections_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export type Collections_Mutation_Response = {
  __typename?: 'collections_mutation_response';
  affected_rows?: Maybe<Scalars['Int']['output']>;
  returning: Array<Collections>;
};

export type Collections_Updates_Input = {
  where?: InputMaybe<Collections_Bool_Exp>;
  _inc?: InputMaybe<Collections_Inc>;
  _set?: InputMaybe<Collections_Set_Input>;
};

export type Collections_Inc = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Types_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Types_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type Types_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Types_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export type Types_Mutation_Response = {
  __typename?: 'types_mutation_response';
  affected_rows?: Maybe<Scalars['Int']['output']>;
  returning: Array<Types>;
};

export type Types_Updates_Input = {
  where?: InputMaybe<Types_Bool_Exp>;
  _inc?: InputMaybe<Types_Inc>;
  _set?: InputMaybe<Types_Set_Input>;
};

export type Types_Inc = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Sizes_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Sizes_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type Sizes_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type Sizes_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export type Sizes_Mutation_Response = {
  __typename?: 'sizes_mutation_response';
  affected_rows?: Maybe<Scalars['Int']['output']>;
  returning: Array<Sizes>;
};

export type Sizes_Updates_Input = {
  where?: InputMaybe<Sizes_Bool_Exp>;
  _inc?: InputMaybe<Sizes_Inc>;
  _set?: InputMaybe<Sizes_Set_Input>;
};

export type Sizes_Inc = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Product_Variant_Stocks_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  product_variant_id?: InputMaybe<Scalars['Int']['input']>;
  size_id?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
};

export type Product_Variant_Stocks_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type Product_Variant_Stocks_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  product_variant_id: Scalars['Int']['input'];
  size_id: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  price?: InputMaybe<Scalars['Int']['input']>;
};

export type Product_Variant_Stocks_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export type Product_Variant_Stocks_Mutation_Response = {
  __typename?: 'product_variant_stocks_mutation_response';
  affected_rows?: Maybe<Scalars['Int']['output']>;
  returning: Array<Product_Variant_Stocks>;
};

export type Product_Variant_Stocks_Updates_Input = {
  where?: InputMaybe<Product_Variant_Stocks_Bool_Exp>;
  _inc?: InputMaybe<Product_Variant_Stocks_Inc>;
  _set?: InputMaybe<Product_Variant_Stocks_Set_Input>;
};

export type Product_Variant_Stocks_Inc = {
  id?: InputMaybe<Scalars['Int']['input']>;
  product_variant_id?: InputMaybe<Scalars['Int']['input']>;
  size_id?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
};

export type Product_Variants_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  product_id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  color_id?: InputMaybe<Scalars['Int']['input']>;
};

export type Product_Variants_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type Product_Variants_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  product_id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  color_id: Scalars['Int']['input'];
};

export type Product_Variants_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export type Product_Variants_Mutation_Response = {
  __typename?: 'product_variants_mutation_response';
  affected_rows?: Maybe<Scalars['Int']['output']>;
  returning: Array<Product_Variants>;
};

export type Product_Variants_Updates_Input = {
  where?: InputMaybe<Product_Variants_Bool_Exp>;
  _inc?: InputMaybe<Product_Variants_Inc>;
  _set?: InputMaybe<Product_Variants_Set_Input>;
};

export type Product_Variants_Inc = {
  id?: InputMaybe<Scalars['Int']['input']>;
  product_id?: InputMaybe<Scalars['Int']['input']>;
  color_id?: InputMaybe<Scalars['Int']['input']>;
};

export type Product_Variant_Fabrics_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  product_variant_id?: InputMaybe<Scalars['Int']['input']>;
  color_id?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
};

export type Product_Variant_Fabrics_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type Product_Variant_Fabrics_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  product_variant_id: Scalars['Int']['input'];
  color_id: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
};

export type Product_Variant_Fabrics_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export type Product_Variant_Fabrics_Mutation_Response = {
  __typename?: 'product_variant_fabrics_mutation_response';
  affected_rows?: Maybe<Scalars['Int']['output']>;
  returning: Array<Product_Variant_Fabrics>;
};

export type Product_Variant_Fabrics_Updates_Input = {
  where?: InputMaybe<Product_Variant_Fabrics_Bool_Exp>;
  _inc?: InputMaybe<Product_Variant_Fabrics_Inc>;
  _set?: InputMaybe<Product_Variant_Fabrics_Set_Input>;
};

export type Product_Variant_Fabrics_Inc = {
  id?: InputMaybe<Scalars['Int']['input']>;
  product_variant_id?: InputMaybe<Scalars['Int']['input']>;
  color_id?: InputMaybe<Scalars['Int']['input']>;
};
