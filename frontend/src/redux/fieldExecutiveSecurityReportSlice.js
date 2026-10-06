
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH MY SECURITY REPORTS
// =====================================================

export const fetchFieldExecutiveSecurityReports =
  createAsyncThunk(
    "fieldExecutiveSecurityReport/fetchReports",
    async (_, { rejectWithValue }) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/field/security-reports`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.success) {
          return response.data.reports || [];
        }

        return rejectWithValue(
          response.data?.message ||
            "Unable to fetch security reports."
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to fetch security reports."
        );
      }
    }
  );

// =====================================================
// FETCH SECURITY REPORT BY ID
// =====================================================

export const fetchFieldExecutiveSecurityReportById =
  createAsyncThunk(
    "fieldExecutiveSecurityReport/fetchReportById",
    async (id, { rejectWithValue }) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/field/security-reports/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.success) {
          return response.data.report;
        }

        return rejectWithValue(
          response.data?.message ||
            "Unable to fetch security report."
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to fetch security report."
        );
      }
    }
  );

// =====================================================
// UPDATE SECURITY REPORT
// =====================================================

export const updateFieldExecutiveSecurityReport =
  createAsyncThunk(
    "fieldExecutiveSecurityReport/updateReport",
    async (
      { id, data },
      { rejectWithValue }
    ) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.put(
          `${API_URL}/field/security-reports/${id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        if (response.data?.success) {
          return response.data.report;
        }

        return rejectWithValue(
          response.data?.message ||
            "Unable to update security report."
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to update security report."
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
  actionLoading: false,

  error: null,
  detailsError: null,
  actionError: null,

  successMessage: null,
};

// =====================================================
// SLICE
// =====================================================

const fieldExecutiveSecurityReportSlice =
  createSlice({
    name: "fieldExecutiveSecurityReport",

    initialState,

    reducers: {
      clearSelectedSecurityReport: (
        state
      ) => {
        state.selectedReport = null;
      },

      clearSecurityReportError: (state) => {
        state.error = null;
        state.detailsError = null;
        state.actionError = null;
      },

      clearSecurityReportSuccess: (
        state
      ) => {
        state.successMessage = null;
      },
    },

    extraReducers: (builder) => {
      // =================================================
      // FETCH REPORTS
      // =================================================

      builder
        .addCase(
          fetchFieldExecutiveSecurityReports.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchFieldExecutiveSecurityReports.fulfilled,
          (state, action) => {
            state.loading = false;
            state.reports =
              action.payload || [];
          }
        )

        .addCase(
          fetchFieldExecutiveSecurityReports.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload ||
              "Unable to fetch security reports.";
          }
        );

      // =================================================
      // FETCH REPORT BY ID
      // =================================================

      builder
        .addCase(
          fetchFieldExecutiveSecurityReportById.pending,
          (state) => {
            state.detailsLoading = true;
            state.detailsError = null;
          }
        )

        .addCase(
          fetchFieldExecutiveSecurityReportById.fulfilled,
          (state, action) => {
            state.detailsLoading = false;
            state.selectedReport =
              action.payload;
          }
        )

        .addCase(
          fetchFieldExecutiveSecurityReportById.rejected,
          (state, action) => {
            state.detailsLoading = false;
            state.detailsError =
              action.payload ||
              "Unable to fetch security report.";
          }
        );

      // =================================================
      // UPDATE REPORT
      // =================================================

      builder
        .addCase(
          updateFieldExecutiveSecurityReport.pending,
          (state) => {
            state.actionLoading = true;
            state.actionError = null;
            state.successMessage = null;
          }
        )

        .addCase(
          updateFieldExecutiveSecurityReport.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            state.successMessage =
              "Security report updated successfully.";

            state.selectedReport =
              action.payload;

            const index =
              state.reports.findIndex(
                (report) =>
                  report.id ===
                  action.payload.id
              );

            if (index !== -1) {
              state.reports[index] =
                action.payload;
            }
          }
        )

        .addCase(
          updateFieldExecutiveSecurityReport.rejected,
          (state, action) => {
            state.actionLoading = false;
            state.actionError =
              action.payload ||
              "Unable to update security report.";
          }
        );
    },
  });

export const {
  clearSelectedSecurityReport,
  clearSecurityReportError,
  clearSecurityReportSuccess,
} =
  fieldExecutiveSecurityReportSlice.actions;

export default fieldExecutiveSecurityReportSlice.reducer;

