export interface AnalyticsEvent {
  type: string;
  date: string;
  target_tag: string;
  target_id: string;
  target_class: string;
  target_text: string;
  page_x: number;
  page_y: number;
}

export interface AnalyticsResource {
  url: string;
  date: string;
  type: string;
  duration: number;
  transfer_size: number;
  optimised_size: number;
}

// these views are the object created on the client and sent to the analytics apt
export interface AnalyticsView {
  id: string;
  account_id: string;
  date: string;
  url: string;
  url_hash: string;
  path: string;
  referrer: string;
  title: string;
  events: AnalyticsEvent[];
  screen_width: number;
  screen_height: number;
  device_pixel_ratio: number;
  session_length: number;
  scroll: boolean;
  bot: boolean;
  query: string;
  transfer: number;
  country: string;
  dom_interactive: number;
  dom_complete: number;
  dom_load_event_end: number;
  resources: AnalyticsResource[];
  green: boolean;
  user_agent: string;
}

export interface View {
  id: string;
  account_id: string;
  date: string;
  url: string;
  url_hash: string;
  path: string;
  referrer: string;
  title: string;
  screen_width: number;
  screen_height: number;
  device_pixel_ratio: number;
  session_length: number;
  scroll: boolean;
  bot: boolean;
  query: string;
  transfer: number;
  country: string;
  dom_interactive: number;
  dom_complete: number;
  dom_load_event_end: number;
  green: boolean;
  user_agent: string;
  unique_view: boolean;
}

export interface AnalyticsData {
  // this is the analytics table from pg
  views: View[];
  account: {
    id: string;
  };
}

export type TimePeriod = "week" | "month" | "sixMonth" | "year";

export type CarbonUnit = "g" | "kg" | "t";

export interface CountryDataPoint {
  name: string;
  users: number;
  carbon: number;
  carbon_unit: CarbonUnit;
}
export interface PageDataPoint {
  title: string;
  path: string;
  count: number;
  carbon: number;
  carbon_per_load: number;
  carbon_unit: CarbonUnit;
}

export interface CountryGraphDataPoint {
  feature: string;
  value: string;
}
export interface CountryGraphDataSet {
  data: CountryGraphDataPoint[];
  labels: string[];
}

export interface ForceGraphDataSet {
  links: any[];
  nodes: any[];
}

export interface Data {
  data: AnalyticsData;
  timePeriod: TimePeriod;
  totalCarbonCount: number;
  PC: number;
  figuresUserNum: number;
  figuresVisitsNum: number;
  figuresCo2NumUnit: CarbonUnit;
  figuresRealTimeUsersNum: number;
  figuresRealTimeCarbonNum: number;
  figuresAverageSessionLength: number;
  countriesFound: string[];
  countryArr: CountryDataPoint[];
  pageArr: PageDataPoint[];
  id: string;
  websiteName: string;
  country_graph_dataset: CountryGraphDataSet | undefined;
  force_dataset: ForceGraphDataSet | undefined;
  mode_journey: any;
}
