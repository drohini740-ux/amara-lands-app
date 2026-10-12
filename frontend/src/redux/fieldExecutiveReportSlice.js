
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH FIELD EXECUTIVE REPORTS
// =====================================================

export const fetchFieldExecutiveReports =
  createAsyncThunk(
    "fieldExecutiveReport/fetchReports",
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/field/reports`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch Field Executive reports."
        );
      }
    }
  );

// =====================================================
// SLICE
// =====================================================

const fieldExecutiveReportSlice = createSlice({
  name: "fieldExecutiveReport",

  initialState: {
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
  },

  reducers: {
    clearFieldExecutiveReportError: (state) => {
      state.error = null;
    },

    clearFieldExecutiveReports: (state) => {
      state.overview = {
        total_assigned_properties: 0,
        total_visits: 0,
        completed_visits: 0,
        pending_visits: 0,
        total_security_reports: 0,
      };

      state.visitStatusBreakdown = [];
      state.monthlyVisits = [];
      state.securityReportStatus = [];
      state.recentVisits = [];
      state.assignedProperties = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // FETCH REPORTS - PENDING
      // =================================================

      .addCase(
        fetchFieldExecutiveReports.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      // =================================================
      // FETCH REPORTS - SUCCESS
      // =================================================

      .addCase(
        fetchFieldExecutiveReports.fulfilled,
        (state, action) => {
          state.loading = false;

          const data =
            action.payload?.data || {};

          state.overview =
            data.overview || state.overview;

          state.visitStatusBreakdown =
            data.visit_status_breakdown || [];

          state.monthlyVisits =
            data.monthly_visits || [];

          state.securityReportStatus =
            data.security_report_status || [];

          state.recentVisits =
            data.recent_visits || [];

          state.assignedProperties =
            data.assigned_properties || [];
        }
      )

      // =================================================
      // FETCH REPORTS - ERROR
      // =================================================

      .addCase(
        fetchFieldExecutiveReports.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch Field Executive reports.";
        }
      );
  },
});

export const {
  clearFieldExecutiveReportError,
  clearFieldExecutiveReports,
} = fieldExecutiveReportSlice.actions;

export default fieldExecutiveReportSlice.reducer;

