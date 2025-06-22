// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

// Base Record Type
export interface BaseRecord {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
}

// Customer Type Data
export interface CustomerTypeRecord extends BaseRecord {
  Cust_Type: string;
}

// ACV Range Data
export interface ACVRangeRecord extends BaseRecord {
  ACV_Range: string;
}

// Account Industry Data
export interface AccountIndustryRecord extends BaseRecord {
  Acct_Industry: string;
  query_key?: string;
  Total_Quantity?: number | null;
}

// Team Data
export interface TeamRecord extends BaseRecord {
  Team: string;
}

// Analytics Data
export interface AnalyticsData {
  customerTypes: CustomerTypeRecord[];
  acvRanges: ACVRangeRecord[];
  accountIndustries: AccountIndustryRecord[];
  teams: TeamRecord[];
}

// Dashboard Summary
export interface DashboardSummary {
  totalDeals: number;
  totalACV: number;
  averageACV: number;
  quarters: string[];
  topIndustries: Array<{
    industry: string;
    totalACV: number;
    dealCount: number;
  }>;
  topTeams: Array<{ team: string; totalACV: number; dealCount: number }>;
}

// Quarter Data
export interface QuarterData {
  quarter: string;
  customerTypes: CustomerTypeRecord[];
  acvRanges: ACVRangeRecord[];
  industries: AccountIndustryRecord[];
  teams: TeamRecord[];
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

export interface DoughnutChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
  }[];
}
