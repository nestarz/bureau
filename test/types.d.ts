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
  site_by_pk?: Maybe<Site>;
  site?: Maybe<Array<Maybe<Site>>>;
  site_aggregate?: Maybe<Site_Aggregate>;
  projects_by_pk?: Maybe<Projects>;
  projects?: Maybe<Array<Maybe<Projects>>>;
  projects_aggregate?: Maybe<Projects_Aggregate>;
  staff_by_pk?: Maybe<Staff>;
  staff?: Maybe<Array<Maybe<Staff>>>;
  staff_aggregate?: Maybe<Staff_Aggregate>;
};


export type Query_SqlArgs = {
  query: Scalars['String']['input'];
};


export type Query_TableArgs = {
  name: Scalars['String']['input'];
};


export type QuerySite_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type QuerySiteArgs = {
  where?: InputMaybe<Site_Bool_Exp>;
  order_by?: InputMaybe<Site_Order_By>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProjects_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProjectsArgs = {
  where?: InputMaybe<Projects_Bool_Exp>;
  order_by?: InputMaybe<Projects_Order_By>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStaff_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryStaffArgs = {
  where?: InputMaybe<Staff_Bool_Exp>;
  order_by?: InputMaybe<Staff_Order_By>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Site = {
  __typename?: 'site';
  id?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  instagram?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  images_json?: Maybe<Scalars['JSON']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  city_geo?: Maybe<Scalars['String']['output']>;
  keywords?: Maybe<Scalars['String']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  favicon_svg_json?: Maybe<Scalars['JSON']['output']>;
  logo_full_image_json?: Maybe<Scalars['JSON']['output']>;
};


export type SiteTitleArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type SiteDescriptionArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type SiteInstagramArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type SiteEmailArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type SiteImages_JsonArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type SiteUrlArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type SiteCity_GeoArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type SiteKeywordsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type SiteSubtitleArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type SiteFavicon_Svg_JsonArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type SiteLogo_Full_Image_JsonArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

export type Site_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  instagram?: InputMaybe<String_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  images_json?: InputMaybe<String_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
  city_geo?: InputMaybe<String_Comparison_Exp>;
  keywords?: InputMaybe<String_Comparison_Exp>;
  subtitle?: InputMaybe<String_Comparison_Exp>;
  favicon_svg_json?: InputMaybe<String_Comparison_Exp>;
  logo_full_image_json?: InputMaybe<String_Comparison_Exp>;
  _or?: InputMaybe<Array<Site_Bool_Exp>>;
  _and?: InputMaybe<Array<Site_Bool_Exp>>;
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

export type Site_Order_By = {
  id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  instagram?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  images_json?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
  city_geo?: InputMaybe<Order_By>;
  keywords?: InputMaybe<Order_By>;
  subtitle?: InputMaybe<Order_By>;
  favicon_svg_json?: InputMaybe<Order_By>;
  logo_full_image_json?: InputMaybe<Order_By>;
};

export enum Order_By {
  Asc = 'asc',
  AscNullsFirst = 'asc_nulls_first',
  AscNullsLast = 'asc_nulls_last',
  Desc = 'desc',
  DescNullsFirst = 'desc_nulls_first',
  DescNullsLast = 'desc_nulls_last'
}

export type Site_Aggregate = {
  __typename?: 'site_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Aggregate = {
  __typename?: 'aggregate';
  count?: Maybe<Scalars['Int']['output']>;
};

export type Projects = {
  __typename?: 'projects';
  id?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
  date: Scalars['String']['output'];
  images_json?: Maybe<Scalars['JSON']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
};


export type ProjectsTitleArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type ProjectsDateArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type ProjectsImages_JsonArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type ProjectsDescriptionArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type ProjectsUrlArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type ProjectsTypeArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

export type Projects_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  date?: InputMaybe<String_Comparison_Exp>;
  images_json?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  order?: InputMaybe<Int_Comparison_Exp>;
  _or?: InputMaybe<Array<Projects_Bool_Exp>>;
  _and?: InputMaybe<Array<Projects_Bool_Exp>>;
};

export type Projects_Order_By = {
  id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  images_json?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
};

export type Projects_Aggregate = {
  __typename?: 'projects_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Staff = {
  __typename?: 'staff';
  id?: Maybe<Scalars['Int']['output']>;
  firstname: Scalars['String']['output'];
  lastname?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  images_json?: Maybe<Scalars['JSON']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  telephone?: Maybe<Scalars['String']['output']>;
};


export type StaffFirstnameArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type StaffLastnameArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type StaffRoleArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type StaffDescriptionArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type StaffImages_JsonArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type StaffUrlArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type StaffEmailArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type StaffTelephoneArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

export type Staff_Bool_Exp = {
  id?: InputMaybe<Int_Comparison_Exp>;
  firstname?: InputMaybe<String_Comparison_Exp>;
  lastname?: InputMaybe<String_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  images_json?: InputMaybe<String_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  telephone?: InputMaybe<String_Comparison_Exp>;
  _or?: InputMaybe<Array<Staff_Bool_Exp>>;
  _and?: InputMaybe<Array<Staff_Bool_Exp>>;
};

export type Staff_Order_By = {
  id?: InputMaybe<Order_By>;
  firstname?: InputMaybe<Order_By>;
  lastname?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  images_json?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  telephone?: InputMaybe<Order_By>;
};

export type Staff_Aggregate = {
  __typename?: 'staff_aggregate';
  aggregate?: Maybe<Aggregate>;
};

export type Mutation = {
  __typename?: 'Mutation';
  update_site_one?: Maybe<Site>;
  delete_site?: Maybe<Site>;
  insert_site_one?: Maybe<Site>;
  insert_site?: Maybe<Array<Maybe<Site>>>;
  update_site_many?: Maybe<Array<Maybe<Site_Mutation_Response>>>;
  update_projects_one?: Maybe<Projects>;
  delete_projects?: Maybe<Projects>;
  insert_projects_one?: Maybe<Projects>;
  insert_projects?: Maybe<Array<Maybe<Projects>>>;
  update_projects_many?: Maybe<Array<Maybe<Projects_Mutation_Response>>>;
  update_staff_one?: Maybe<Staff>;
  delete_staff?: Maybe<Staff>;
  insert_staff_one?: Maybe<Staff>;
  insert_staff?: Maybe<Array<Maybe<Staff>>>;
  update_staff_many?: Maybe<Array<Maybe<Staff_Mutation_Response>>>;
};


export type MutationUpdate_Site_OneArgs = {
  _set: Site_Set_Input;
  pk_columns?: InputMaybe<Site_Pk_Columns_Input>;
};


export type MutationDelete_SiteArgs = {
  where?: InputMaybe<Site_Bool_Exp>;
};


export type MutationInsert_Site_OneArgs = {
  object: Site_Insert_Input;
  on_conflict?: InputMaybe<Site_On_Conflict>;
};


export type MutationInsert_SiteArgs = {
  objects: Array<InputMaybe<Site_Insert_Input>>;
  on_conflict?: InputMaybe<Site_On_Conflict>;
};


export type MutationUpdate_Site_ManyArgs = {
  updates: Array<Site_Updates_Input>;
};


export type MutationUpdate_Projects_OneArgs = {
  _set: Projects_Set_Input;
  pk_columns?: InputMaybe<Projects_Pk_Columns_Input>;
};


export type MutationDelete_ProjectsArgs = {
  where?: InputMaybe<Projects_Bool_Exp>;
};


export type MutationInsert_Projects_OneArgs = {
  object: Projects_Insert_Input;
  on_conflict?: InputMaybe<Projects_On_Conflict>;
};


export type MutationInsert_ProjectsArgs = {
  objects: Array<InputMaybe<Projects_Insert_Input>>;
  on_conflict?: InputMaybe<Projects_On_Conflict>;
};


export type MutationUpdate_Projects_ManyArgs = {
  updates: Array<Projects_Updates_Input>;
};


export type MutationUpdate_Staff_OneArgs = {
  _set: Staff_Set_Input;
  pk_columns?: InputMaybe<Staff_Pk_Columns_Input>;
};


export type MutationDelete_StaffArgs = {
  where?: InputMaybe<Staff_Bool_Exp>;
};


export type MutationInsert_Staff_OneArgs = {
  object: Staff_Insert_Input;
  on_conflict?: InputMaybe<Staff_On_Conflict>;
};


export type MutationInsert_StaffArgs = {
  objects: Array<InputMaybe<Staff_Insert_Input>>;
  on_conflict?: InputMaybe<Staff_On_Conflict>;
};


export type MutationUpdate_Staff_ManyArgs = {
  updates: Array<Staff_Updates_Input>;
};

export type Site_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  instagram?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  images_json?: InputMaybe<Scalars['JSON']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  city_geo?: InputMaybe<Scalars['String']['input']>;
  keywords?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  favicon_svg_json?: InputMaybe<Scalars['JSON']['input']>;
  logo_full_image_json?: InputMaybe<Scalars['JSON']['input']>;
};

export type Site_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type Site_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  instagram?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  images_json?: InputMaybe<Scalars['JSON']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  city_geo?: InputMaybe<Scalars['String']['input']>;
  keywords?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  favicon_svg_json?: InputMaybe<Scalars['JSON']['input']>;
  logo_full_image_json?: InputMaybe<Scalars['JSON']['input']>;
};

export type Site_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export enum Conflict_Action {
  Nothing = 'nothing',
  Update = 'update'
}

export type Site_Mutation_Response = {
  __typename?: 'site_mutation_response';
  affected_rows?: Maybe<Scalars['Int']['output']>;
  returning: Array<Site>;
};

export type Site_Updates_Input = {
  where?: InputMaybe<Site_Bool_Exp>;
  _inc?: InputMaybe<Site_Inc>;
  _set?: InputMaybe<Site_Set_Input>;
};

export type Site_Inc = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Projects_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  images_json?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type Projects_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type Projects_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  date: Scalars['String']['input'];
  images_json?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type Projects_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export type Projects_Mutation_Response = {
  __typename?: 'projects_mutation_response';
  affected_rows?: Maybe<Scalars['Int']['output']>;
  returning: Array<Projects>;
};

export type Projects_Updates_Input = {
  where?: InputMaybe<Projects_Bool_Exp>;
  _inc?: InputMaybe<Projects_Inc>;
  _set?: InputMaybe<Projects_Set_Input>;
};

export type Projects_Inc = {
  id?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type Staff_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  images_json?: InputMaybe<Scalars['JSON']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  telephone?: InputMaybe<Scalars['String']['input']>;
};

export type Staff_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

export type Staff_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  firstname: Scalars['String']['input'];
  lastname?: InputMaybe<Scalars['String']['input']>;
  role: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  images_json?: InputMaybe<Scalars['JSON']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  telephone?: InputMaybe<Scalars['String']['input']>;
};

export type Staff_On_Conflict = {
  constraint?: InputMaybe<Scalars['String']['input']>;
  action: Conflict_Action;
};

export type Staff_Mutation_Response = {
  __typename?: 'staff_mutation_response';
  affected_rows?: Maybe<Scalars['Int']['output']>;
  returning: Array<Staff>;
};

export type Staff_Updates_Input = {
  where?: InputMaybe<Staff_Bool_Exp>;
  _inc?: InputMaybe<Staff_Inc>;
  _set?: InputMaybe<Staff_Set_Input>;
};

export type Staff_Inc = {
  id?: InputMaybe<Scalars['Int']['input']>;
};
