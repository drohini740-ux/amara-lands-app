
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// FETCH FIELD EXECUTIVE REPORTS
// =====================================================

export const fetchFieldExecutiveReports = createAsyncThunk(
  "fieldExecutiveReport/fetchReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/field/reports");
      const result = response.data;

      if (result?.success === false) {
        return rejectWithValue(
          result.message || "Failed to fetch Field Executive reports."
        );
      }

      return result;
    } catch (error) {
      console.error(
        "Field Executive Reports Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch Field Executive reports."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  overview: {
    total_assigned_properties: 0,
    total_visits: 0,
    completed_visits: 0,
    pending_visits: 0,
    total_security_reports: 0,
  },

  visitStatusBreakdown: [],
  monthlyVisits: [],
  securityReportStatus: [],
  recentVisits: [],
  assignedProperties: [],

  loading: false,
  error: null,
};

// =====================================================
// SLICE
// =====================================================

const fieldExecutiveReportSlice = createSlice({
  name: "fieldExecutiveReport",
  initialState,

  reducers: {
    clearFieldExecutiveReportError: (state) => {
      state.error = null;
    },

    clearFieldExecutiveReports: (state) => {
      state.overview = { ...initialState.overview };
      state.visitStatusBreakdown = [];
      state.monthlyVisits = [];
      state.securityReportStatus = [];
      state.recentVisits = [];
      state.assignedProperties = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFieldExecutiveReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchFieldExecutiveReports.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const data = action.payload?.data ?? action.payload ?? {};

        state.overview = {
          ...initialState.overview,
          ...(data.overview || {}),
        };

        state.visitStatusBreakdown =
          data.visit_status_breakdown || [];

        state.monthlyVisits = data.monthly_visits || [];
        state.securityReportStatus = data.security_report_status || [];
        state.recentVisits = data.recent_visits || [];
        state.assignedProperties = data.assigned_properties || [];
      })

      .addCase(fetchFieldExecutiveReports.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch Field Executive reports.";
      });
  },
});

// =====================================================
// EXPORTS
// =====================================================

export const {
  clearFieldExecutiveReportError,
  clearFieldExecutiveReports,
} = fieldExecutiveReportSlice.actions;

export default fieldExecutiveReportSlice.reducer;
