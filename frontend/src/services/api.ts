import axios from "axios";
import {
  ApiResponse,
  AnalyticsData,
  DashboardSummary,
  QuarterData,
  CustomerTypeRecord,
  ACVRangeRecord,
  AccountIndustryRecord,
  TeamRecord,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// API service class
export class ApiService {
  // Health check
  static async healthCheck(): Promise<
    ApiResponse<{ status: string; message: string }>
  > {
    const response = await apiClient.get("/health");
    return response.data;
  }

  // Get all analytics data
  static async getAllData(): Promise<ApiResponse<AnalyticsData>> {
    const response = await apiClient.get("/data");
    return response.data;
  }

  // Get dashboard summary
  static async getDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
    const response = await apiClient.get("/dashboard/summary");
    return response.data;
  }

  // Get available quarters
  static async getAvailableQuarters(): Promise<ApiResponse<string[]>> {
    const response = await apiClient.get("/quarters");
    return response.data;
  }

  // Get data for specific quarter
  static async getQuarterData(
    quarter: string
  ): Promise<ApiResponse<QuarterData>> {
    const response = await apiClient.get(`/quarter/${quarter}`);
    return response.data;
  }

  // Get customer type data
  static async getCustomerTypeData(): Promise<
    ApiResponse<CustomerTypeRecord[]>
  > {
    const response = await apiClient.get("/customer-types");
    return response.data;
  }

  // Get ACV range data
  static async getACVRangeData(): Promise<ApiResponse<ACVRangeRecord[]>> {
    const response = await apiClient.get("/acv-ranges");
    return response.data;
  }

  // Get account industry data
  static async getAccountIndustryData(): Promise<
    ApiResponse<AccountIndustryRecord[]>
  > {
    const response = await apiClient.get("/industries");
    return response.data;
  }

  // Get team data
  static async getTeamData(): Promise<ApiResponse<TeamRecord[]>> {
    const response = await apiClient.get("/teams");
    return response.data;
  }
}

export default ApiService;
