type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export interface PublicAnalyticsEvents {
  id?: number;
  visit_id?: number;
  category?: string;
  action?: string;
  value?: string;
  label?: string;
}
export interface PublicAnalyticsVisits {
  id?: number;
  referrer?: string;
  ip?: string;
  user_agent?: string;
  hostname?: string;
  latitude?: number;
  longitude?: number;
  country_code?: string;
  region_name?: string;
  city_name?: string;
  parameters?: string;
  screen_width?: number;
  screen_height?: number;
  load_time?: number;
  visit_duration?: number;
  path?: string;
  session_id?: number;
  ignore?: number;
}

export interface Public {
  analytics_events: PublicAnalyticsEvents;
  analytics_visits: PublicAnalyticsVisits;
}

export interface Database {
  public: Public;
}
