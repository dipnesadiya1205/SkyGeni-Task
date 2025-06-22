// Type definitions for the analytics data

export interface BaseRecord {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
}

export interface CustomerTypeRecord extends BaseRecord {
  Cust_Type: string;
}

export interface ACVRangeRecord extends BaseRecord {
  ACV_Range: string;
}

export interface AccountIndustryRecord extends BaseRecord {
  Acct_Industry: string;
  query_key?: string;
  Total_Quantity?: number | null;
}

export interface TeamRecord extends BaseRecord {
  Team: string;
}

export interface AnalyticsData {
  customerTypes: CustomerTypeRecord[];
  acvRanges: ACVRangeRecord[];
  accountIndustries: AccountIndustryRecord[];
  teams: TeamRecord[];
}

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

export interface QuarterData {
  quarter: string;
  customerTypes: CustomerTypeRecord[];
  acvRanges: ACVRangeRecord[];
  industries: AccountIndustryRecord[];
  teams: TeamRecord[];
}
