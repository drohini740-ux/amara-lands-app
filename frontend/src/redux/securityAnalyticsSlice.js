
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// Fetch Security Reports & Analytics
export const fetchSecurityAnalytics = createAsyncThunk(
  "securityAnalytics/fetchSecurityAnalytics",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/security/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            from: filters.from || undefined,
            to: filters.to || undefined,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Security Analytics Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch Security Analytics."
      );
    }
  }
);

const initialState = {
  overview: {
    total_reports: 0,
    pending_reports: 0,
    resolved_reports: 0,
    total_incidents: 0,
    total_motion_alerts: 0,
    total_patrols: 0,
    completed_patrols: 0,
    patrol_completion_rate: 0,
  },
  reportsByStatus: [],
  reportsByType: [],
  incidentsByStatus: [],
  motionAlertsByStatus: [],
  patrolsByStatus: [],
  monthlyReportTrend: [],
  filters: {
    from: "",
    to: "",
  },
  loading: false,
  error: null,
};

const securityAnalyticsSlice = createSlice({
  name: "securityAnalytics",
  initialState,
  reducers: {
    clearSecurityAnalyticsError: (state) => {
      state.error = null;
    },
    resetSecurityAnalytics: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSecurityAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSecurityAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const data = action.payload?.data || {};

        state.overview = {
          ...initialState.overview,
          ...(data.overview || {}),
        };

        state.reportsByStatus = data.reports_by_status || [];
        state.reportsByType = data.reports_by_type || [];
        state.incidentsByStatus = data.incidents_by_status || [];
        state.motionAlertsByStatus = data.motion_alerts_by_status || [];
        state.patrolsByStatus = data.patrols_by_status || [];
        state.monthlyReportTrend = data.monthly_report_trend || [];

        state.filters = {
          from: action.payload?.filters?.from || "",
          to: action.payload?.filters?.to || "",
        };
      })
      .addCase(fetchSecurityAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to fetch Security Analytics.";
      });
  },
});

export const {
  clearSecurityAnalyticsError,
  resetSecurityAnalytics,
} = securityAnalyticsSlice.actions;

export default securityAnalyticsSlice.reducer;
