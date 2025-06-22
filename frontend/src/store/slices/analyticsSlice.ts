import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  AnalyticsData,
  DashboardSummary,
  QuarterData,
  CustomerTypeRecord,
  ACVRangeRecord,
  AccountIndustryRecord,
  TeamRecord,
} from "../../types";
import ApiService from "../../services/api";

// Async thunks
export const fetchAllData = createAsyncThunk(
  "analytics/fetchAllData",
  async () => {
    const response = await ApiService.getAllData();
    return response.data;
  }
);

export const fetchDashboardSummary = createAsyncThunk(
  "analytics/fetchDashboardSummary",
  async () => {
    const response = await ApiService.getDashboardSummary();
    return response.data;
  }
);

export const fetchAvailableQuarters = createAsyncThunk(
  "analytics/fetchAvailableQuarters",
  async () => {
    const response = await ApiService.getAvailableQuarters();
    return response.data;
  }
);

export const fetchQuarterData = createAsyncThunk(
  "analytics/fetchQuarterData",
  async (quarter: string) => {
    const response = await ApiService.getQuarterData(quarter);
    return response.data;
  }
);

export const fetchCustomerTypeData = createAsyncThunk(
  "analytics/fetchCustomerTypeData",
  async () => {
    const response = await ApiService.getCustomerTypeData();
    return response.data;
  }
);

export const fetchACVRangeData = createAsyncThunk(
  "analytics/fetchACVRangeData",
  async () => {
    const response = await ApiService.getACVRangeData();
    return response.data;
  }
);

export const fetchAccountIndustryData = createAsyncThunk(
  "analytics/fetchAccountIndustryData",
  async () => {
    const response = await ApiService.getAccountIndustryData();
    return response.data;
  }
);

export const fetchTeamData = createAsyncThunk(
  "analytics/fetchTeamData",
  async () => {
    const response = await ApiService.getTeamData();
    return response.data;
  }
);

// State interface
interface AnalyticsState {
  allData: AnalyticsData | null;
  dashboardSummary: DashboardSummary | null;
  quarterData: QuarterData | null;
  customerTypeData: CustomerTypeRecord[];
  acvRangeData: ACVRangeRecord[];
  accountIndustryData: AccountIndustryRecord[];
  teamData: TeamRecord[];
  availableQuarters: string[];
  loading: boolean;
  error: string | null;
  selectedQuarter: string | null;
}

// Initial state
const initialState: AnalyticsState = {
  allData: null,
  dashboardSummary: null,
  quarterData: null,
  customerTypeData: [],
  acvRangeData: [],
  accountIndustryData: [],
  teamData: [],
  availableQuarters: [],
  loading: false,
  error: null,
  selectedQuarter: null,
};

// Analytics slice
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedQuarter: (state, action: PayloadAction<string | null>) => {
      state.selectedQuarter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAllData
    builder
      .addCase(fetchAllData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.loading = false;
        state.allData = action.payload;
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch all data";
      });

    // fetchDashboardSummary
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardSummary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch dashboard summary";
      });

    // fetchAvailableQuarters
    builder
      .addCase(fetchAvailableQuarters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableQuarters.fulfilled, (state, action) => {
        state.loading = false;
        state.availableQuarters = action.payload;
      })
      .addCase(fetchAvailableQuarters.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch available quarters";
      });

    // fetchQuarterData
    builder
      .addCase(fetchQuarterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuarterData.fulfilled, (state, action) => {
        state.loading = false;
        state.quarterData = action.payload;
      })
      .addCase(fetchQuarterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch quarter data";
      });

    // fetchCustomerTypeData
    builder
      .addCase(fetchCustomerTypeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerTypeData.fulfilled, (state, action) => {
        state.loading = false;
        state.customerTypeData = action.payload;
      })
      .addCase(fetchCustomerTypeData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch customer type data";
      });

    // fetchACVRangeData
    builder
      .addCase(fetchACVRangeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchACVRangeData.fulfilled, (state, action) => {
        state.loading = false;
        state.acvRangeData = action.payload;
      })
      .addCase(fetchACVRangeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch ACV range data";
      });

    // fetchAccountIndustryData
    builder
      .addCase(fetchAccountIndustryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountIndustryData.fulfilled, (state, action) => {
        state.loading = false;
        state.accountIndustryData = action.payload;
      })
      .addCase(fetchAccountIndustryData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch account industry data";
      });

    // fetchTeamData
    builder
      .addCase(fetchTeamData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamData.fulfilled, (state, action) => {
        state.loading = false;
        state.teamData = action.payload;
      })
      .addCase(fetchTeamData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch team data";
      });
  },
});

export const { setLoading, setError, setSelectedQuarter, clearError } =
  analyticsSlice.actions;
export default analyticsSlice.reducer;
