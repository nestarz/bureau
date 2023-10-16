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
  about_by_pk?: Maybe<About>;
  about?: Maybe<Array<Maybe<About>>>;
  about_aggregate?: Maybe<About_Aggregate>;
  works_by_pk?: Maybe<Works>;
  works?: Maybe<Array<Maybe<Works>>>;
  works_aggregate?: Maybe<Works_Aggregate>;
  archives_by_pk?: Maybe<Archives>;
  archives?: Maybe<Array<Maybe<Archives>>>;
  archives_aggregate?: Maybe<Archives_Aggregate>;
};


export type Query_SqlArgs = {
  query: Scalars['String']['input'];
};


export type Query_TableArgs = {
  name: Scalars['String']['input'];
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


export type QueryWorks_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryWorksArgs = {
  where?: InputMaybe<Works_Bool_Exp>;
  order_by?: InputMaybe<Works_Order_By>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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

export type About = {
  __typename?: 'about';
  id?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  logo_image_json?: Maybe<Scalars['JSON']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};


export type AboutTitleArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type AboutDescriptionArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type AboutEmailArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type AboutLogo_Image_JsonArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type AboutUrlArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

export type About_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  logo_image_json?: InputMaybe<String_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
  _or?: InputMaybe<Array<About_Bool_Exp>>;
  _and?: InputMaybe<Array<About_Bool_Exp>>;
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

export type About_Order_By = {
  id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  logo_image_json?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
};

export enum Order_By {
  Asc = 'asc',
  AscNullsFirst = 'asc_nulls_first',
  AscNullsLast = 'asc_nulls_last',
  Desc = 'desc',
  DescNullsFirst = 'desc_nulls_first',
  DescNullsLast = 'desc_nulls_last'
}

export type About_Aggregate = {
  __typename?: 'about_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Aggregate = {
  __typename?: 'aggregate';
  count?: Maybe<Scalars['Int']['output']>;
};

export type Works = {
  __typename?: 'works';
  id?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
  author?: Maybe<Scalars['String']['output']>;
  publisher?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  print_method?: Maybe<Scalars['String']['output']>;
  paper_type?: Maybe<Scalars['String']['output']>;
  page_count?: Maybe<Scalars['Int']['output']>;
  dimensions?: Maybe<Scalars['String']['output']>;
  print_run?: Maybe<Scalars['Int']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  genre?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  images_json?: Maybe<Scalars['JSON']['output']>;
  stripe_price_id?: Maybe<Scalars['String']['output']>;
  stock_quantity?: Maybe<Scalars['Int']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  publication_date?: Maybe<Scalars['String']['output']>;
  textes?: Maybe<Scalars['String']['output']>;
  production?: Maybe<Scalars['String']['output']>;
  nomination?: Maybe<Scalars['String']['output']>;
};


export type WorksTitleArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type WorksAuthorArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type WorksPublisherArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type WorksDescriptionArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type WorksPrint_MethodArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type WorksPaper_TypeArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type WorksDimensionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type WorksLinkArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type WorksGenreArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type WorksLanguageArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type WorksImages_JsonArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type WorksStripe_Price_IdArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type WorksPublication_DateArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type WorksTextesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type WorksProductionArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type WorksNominationArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

export type Works_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  author?: InputMaybe<String_Comparison_Exp>;
  publisher?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  print_method?: InputMaybe<String_Comparison_Exp>;
  paper_type?: InputMaybe<String_Comparison_Exp>;
  page_count?: InputMaybe<Int_Comparison_Exp>;
  dimensions?: InputMaybe<String_Comparison_Exp>;
  print_run?: InputMaybe<Int_Comparison_Exp>;
  link?: InputMaybe<String_Comparison_Exp>;
  genre?: InputMaybe<String_Comparison_Exp>;
  language?: InputMaybe<String_Comparison_Exp>;
  images_json?: InputMaybe<String_Comparison_Exp>;
  stripe_price_id?: InputMaybe<String_Comparison_Exp>;
  stock_quantity?: InputMaybe<Int_Comparison_Exp>;
  order?: InputMaybe<Int_Comparison_Exp>;
  publication_date?: InputMaybe<String_Comparison_Exp>;
  textes?: InputMaybe<String_Comparison_Exp>;
  production?: InputMaybe<String_Comparison_Exp>;
  nomination?: InputMaybe<String_Comparison_Exp>;
  _or?: InputMaybe<Array<Works_Bool_Exp>>;
  _and?: InputMaybe<Array<Works_Bool_Exp>>;
};

export type Works_Order_By = {
  id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  author?: InputMaybe<Order_By>;
  publisher?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  print_method?: InputMaybe<Order_By>;
  paper_type?: InputMaybe<Order_By>;
  page_count?: InputMaybe<Order_By>;
  dimensions?: InputMaybe<Order_By>;
  print_run?: InputMaybe<Order_By>;
  link?: InputMaybe<Order_By>;
  genre?: InputMaybe<Order_By>;
  language?: InputMaybe<Order_By>;
  images_json?: InputMaybe<Order_By>;
  stripe_price_id?: InputMaybe<Order_By>;
  stock_quantity?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  publication_date?: InputMaybe<Order_By>;
  textes?: InputMaybe<Order_By>;
  production?: InputMaybe<Order_By>;
  nomination?: InputMaybe<Order_By>;
};

export type Works_Aggregate = {
  __typename?: 'works_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Archives = {
  __typename?: 'archives';
  id?: Maybe<Scalars['Int']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  images_json?: Maybe<Scalars['JSON']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
};


export type ArchivesContentArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type ArchivesDateArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type ArchivesImages_JsonArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

export type Archives_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  content?: InputMaybe<String_Comparison_Exp>;
  date?: InputMaybe<String_Comparison_Exp>;
  images_json?: InputMaybe<String_Comparison_Exp>;
  order?: InputMaybe<Int_Comparison_Exp>;
  _or?: InputMaybe<Array<Archives_Bool_Exp>>;
  _and?: InputMaybe<Array<Archives_Bool_Exp>>;
};

export type Archives_Order_By = {
  id?: InputMaybe<Order_By>;
  content?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  images_json?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
};

export type Archives_Aggregate = {
  __typename?: 'archives_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Mutation = {
  __typename?: 'Mutation';
  update_about_one?: Maybe<About>;
  delete_about?: Maybe<About>;
  insert_about_one?: Maybe<About>;
  insert_about?: Maybe<Array<Maybe<About>>>;
  update_about_many?: Maybe<Array<Maybe<About_Mutation_Response>>>;
  update_works_one?: Maybe<Works>;
  delete_works?: Maybe<Works>;
  insert_works_one?: Maybe<Works>;
  insert_works?: Maybe<Array<Maybe<Works>>>;
  update_works_many?: Maybe<Array<Maybe<Works_Mutation_Response>>>;
  update_archives_one?: Maybe<Archives>;
  delete_archives?: Maybe<Archives>;
  insert_archives_one?: Maybe<Archives>;
  insert_archives?: Maybe<Array<Maybe<Archives>>>;
  update_archives_many?: Maybe<Array<Maybe<Archives_Mutation_Response>>>;
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


export type MutationUpdate_Works_OneArgs = {
  _set: Works_Set_Input;
  pk_columns?: InputMaybe<Works_Pk_Columns_Input>;
};


export type MutationDelete_WorksArgs = {
  where?: InputMaybe<Works_Bool_Exp>;
};


export type MutationInsert_Works_OneArgs = {
  object: Works_Insert_Input;
  on_conflict?: InputMaybe<Works_On_Conflict>;
};


export type MutationInsert_WorksArgs = {
  objects: Array<InputMaybe<Works_Insert_Input>>;
  on_conflict?: InputMaybe<Works_On_Conflict>;
};


export type MutationUpdate_Works_ManyArgs = {
  updates: Array<Works_Updates_Input>;
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

export type About_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  logo_image_json?: InputMaybe<Scalars['JSON']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type About_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type About_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  logo_image_json?: InputMaybe<Scalars['JSON']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type About_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export enum Conflict_Action {
  Nothing = 'nothing',
  Update = 'update'
}

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

export type Works_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  author?: InputMaybe<Scalars['String']['input']>;
  publisher?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  print_method?: InputMaybe<Scalars['String']['input']>;
  paper_type?: InputMaybe<Scalars['String']['input']>;
  page_count?: InputMaybe<Scalars['Int']['input']>;
  dimensions?: InputMaybe<Scalars['String']['input']>;
  print_run?: InputMaybe<Scalars['Int']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  genre?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  images_json?: InputMaybe<Scalars['JSON']['input']>;
  stripe_price_id?: InputMaybe<Scalars['String']['input']>;
  stock_quantity?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  publication_date?: InputMaybe<Scalars['String']['input']>;
  textes?: InputMaybe<Scalars['String']['input']>;
  production?: InputMaybe<Scalars['String']['input']>;
  nomination?: InputMaybe<Scalars['String']['input']>;
};

export type Works_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type Works_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  author?: InputMaybe<Scalars['String']['input']>;
  publisher?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  print_method?: InputMaybe<Scalars['String']['input']>;
  paper_type?: InputMaybe<Scalars['String']['input']>;
  page_count?: InputMaybe<Scalars['Int']['input']>;
  dimensions?: InputMaybe<Scalars['String']['input']>;
  print_run?: InputMaybe<Scalars['Int']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  genre?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  images_json?: InputMaybe<Scalars['JSON']['input']>;
  stripe_price_id?: InputMaybe<Scalars['String']['input']>;
  stock_quantity?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  publication_date?: InputMaybe<Scalars['String']['input']>;
  textes?: InputMaybe<Scalars['String']['input']>;
  production?: InputMaybe<Scalars['String']['input']>;
  nomination?: InputMaybe<Scalars['String']['input']>;
};

export type Works_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export type Works_Mutation_Response = {
  __typename?: 'works_mutation_response';
  affected_rows?: Maybe<Scalars['Int']['output']>;
  returning: Array<Works>;
};

export type Works_Updates_Input = {
  where?: InputMaybe<Works_Bool_Exp>;
  _inc?: InputMaybe<Works_Inc>;
  _set?: InputMaybe<Works_Set_Input>;
};

export type Works_Inc = {
  id?: InputMaybe<Scalars['Int']['input']>;
  page_count?: InputMaybe<Scalars['Int']['input']>;
  print_run?: InputMaybe<Scalars['Int']['input']>;
  stock_quantity?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type Archives_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  images_json?: InputMaybe<Scalars['JSON']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type Archives_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type Archives_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  images_json?: InputMaybe<Scalars['JSON']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type Archives_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

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
