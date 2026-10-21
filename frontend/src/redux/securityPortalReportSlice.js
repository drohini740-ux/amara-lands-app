
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// FETCH SECURITY PORTAL REPORTS
// =====================================================

export const fetchSecurityPortalReports = createAsyncThunk(
  "securityPortalReport/fetchReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/security/reports");

      const reports =
        response.data?.reports ??
        response.data?.data?.reports ??
        response.data?.data;

      return Array.isArray(reports) ? reports : [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch security portal reports."
      );
    }
  }
);

// =====================================================
// FETCH REPORT DETAILS
// =====================================================

export const fetchSecurityPortalReportById = createAsyncThunk(
  "securityPortalReport/fetchReportById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/security/reports/${id}`);

      return (
        response.data?.report ??
        response.data?.data?.report ??
        response.data?.data ??
        null
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch report details."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  reports: [],
  selectedReport: null,
  loading: false,
  detailsLoading: false,
  error: null,
  detailsError: null,
};

// =====================================================
// SLICE
// =====================================================

const securityPortalReportSlice = createSlice({
  name: "securityPortalReport",
  initialState,

  reducers: {
    clearSelectedSecurityPortalReport: (state) => {
      state.selectedReport = null;
      state.detailsError = null;
    },

    clearSecurityPortalReportErrors: (state) => {
      state.error = null;
      state.detailsError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH REPORTS
      .addCase(fetchSecurityPortalReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSecurityPortalReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload || [];
      })
      .addCase(fetchSecurityPortalReports.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to fetch reports.";
      })

      // FETCH REPORT DETAILS
      .addCase(fetchSecurityPortalReportById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
        state.selectedReport = null;
      })
      .addCase(
        fetchSecurityPortalReportById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.selectedReport = action.payload;
        }
      )
      .addCase(
        fetchSecurityPortalReportById.rejected,
        (state, action) => {
          state.detailsLoading = false;
          state.detailsError =
            action.payload || "Unable to fetch report details.";
        }
      );
  },
});

// =====================================================
// EXPORT ACTIONS
// =====================================================

export const {
  clearSelectedSecurityPortalReport,
  clearSecurityPortalReportErrors,
} = securityPortalReportSlice.actions;

export default securityPortalReportSlice.reducer;
