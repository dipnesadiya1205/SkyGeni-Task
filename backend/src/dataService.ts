import fs from "fs/promises";
import path from "path";
import {
  AnalyticsData,
  CustomerTypeRecord,
  ACVRangeRecord,
  AccountIndustryRecord,
  TeamRecord,
  DashboardSummary,
  QuarterData,
} from "./types";

export class DataService {
  private dataPath: string;

  constructor() {
    this.dataPath = path.join(__dirname, "..", "data");
  }

  private async readJsonFile<T>(filename: string): Promise<T[]> {
    try {
      const filePath = path.join(this.dataPath, filename);
      const fileContent = await fs.readFile(filePath, "utf-8");
      return JSON.parse(fileContent) as T[];
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return [];
    }
  }

  public async getAllData(): Promise<AnalyticsData> {
    const [customerTypes, acvRanges, accountIndustries, teams] =
      await Promise.all([
        this.readJsonFile<CustomerTypeRecord>("customer_type.json"),
        this.readJsonFile<ACVRangeRecord>("acv_range.json"),
        this.readJsonFile<AccountIndustryRecord>("account_industry.json"),
        this.readJsonFile<TeamRecord>("team.json"),
      ]);
    return { customerTypes, acvRanges, accountIndustries, teams };
  }

  public async getDashboardSummary(): Promise<DashboardSummary> {
    const data = await this.getAllData();

    // Calculate totals
    const totalDeals = data.customerTypes.reduce(
      (sum, record) => sum + record.count,
      0
    );
    const totalACV = data.customerTypes.reduce(
      (sum, record) => sum + record.acv,
      0
    );
    const averageACV = totalDeals > 0 ? totalACV / totalDeals : 0;

    // Get unique quarters
    const quarters = [
      ...new Set(
        data.customerTypes.map((record) => record.closed_fiscal_quarter)
      ),
    ].sort();

    // Calculate top industries
    const industryMap = new Map<
      string,
      { totalACV: number; dealCount: number }
    >();
    data.accountIndustries.forEach((record) => {
      const existing = industryMap.get(record.Acct_Industry) || {
        totalACV: 0,
        dealCount: 0,
      };
      industryMap.set(record.Acct_Industry, {
        totalACV: existing.totalACV + record.acv,
        dealCount: existing.dealCount + record.count,
      });
    });

    const topIndustries = Array.from(industryMap.entries())
      .map(([industry, stats]) => ({ industry, ...stats }))
      .sort((a, b) => b.totalACV - a.totalACV)
      .slice(0, 5);

    // Calculate top teams
    const teamMap = new Map<string, { totalACV: number; dealCount: number }>();
    data.teams.forEach((record) => {
      const existing = teamMap.get(record.Team) || {
        totalACV: 0,
        dealCount: 0,
      };
      teamMap.set(record.Team, {
        totalACV: existing.totalACV + record.acv,
        dealCount: existing.dealCount + record.count,
      });
    });

    const topTeams = Array.from(teamMap.entries())
      .map(([team, stats]) => ({ team, ...stats }))
      .sort((a, b) => b.totalACV - a.totalACV)
      .slice(0, 5);

    return {
      totalDeals,
      totalACV,
      averageACV,
      quarters,
      topIndustries,
      topTeams,
    };
  }

  public async getQuarterData(quarter: string): Promise<QuarterData | null> {
    const data = await this.getAllData();

    const customerTypes = data.customerTypes.filter(
      (record) => record.closed_fiscal_quarter === quarter
    );
    const acvRanges = data.acvRanges.filter(
      (record) => record.closed_fiscal_quarter === quarter
    );
    const industries = data.accountIndustries.filter(
      (record) => record.closed_fiscal_quarter === quarter
    );
    const teams = data.teams.filter(
      (record) => record.closed_fiscal_quarter === quarter
    );

    if (
      customerTypes.length === 0 &&
      acvRanges.length === 0 &&
      industries.length === 0 &&
      teams.length === 0
    ) {
      return null;
    }

    return {
      quarter,
      customerTypes,
      acvRanges,
      industries,
      teams,
    };
  }

  public async getAvailableQuarters(): Promise<string[]> {
    const data = await this.getAllData();
    return [
      ...new Set(
        data.customerTypes.map((record) => record.closed_fiscal_quarter)
      ),
    ].sort();
  }

  public async getCustomerTypeData(): Promise<CustomerTypeRecord[]> {
    return this.readJsonFile<CustomerTypeRecord>("customer_type.json");
  }

  public async getACVRangeData(): Promise<ACVRangeRecord[]> {
    return this.readJsonFile<ACVRangeRecord>("acv_range.json");
  }

  public async getAccountIndustryData(): Promise<AccountIndustryRecord[]> {
    return this.readJsonFile<AccountIndustryRecord>("account_industry.json");
  }

  public async getTeamData(): Promise<TeamRecord[]> {
    return this.readJsonFile<TeamRecord>("team.json");
  }
}
