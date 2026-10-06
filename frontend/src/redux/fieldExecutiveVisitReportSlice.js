
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH MY VISIT REPORTS
// =====================================================

export const fetchFieldExecutiveVisitReports =
  createAsyncThunk(
    "fieldExecutiveVisitReport/fetchReports",
    async (_, { rejectWithValue }) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/field/visit-reports`,
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
            "Unable to fetch visit reports."
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to fetch visit reports."
        );
      }
    }
  );

// =====================================================
// FETCH VISIT REPORT BY ID
// =====================================================

export const fetchFieldExecutiveVisitReportById =
  createAsyncThunk(
    "fieldExecutiveVisitReport/fetchReportById",
    async (id, { rejectWithValue }) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/field/visit-reports/${id}`,
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
            "Unable to fetch visit report."
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to fetch visit report."
        );
      }
    }
  );

// =====================================================
// UPDATE VISIT REPORT
// =====================================================

export const updateFieldExecutiveVisitReport =
  createAsyncThunk(
    "fieldExecutiveVisitReport/updateReport",
    async (
      { id, data },
      { rejectWithValue }
    ) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.put(
          `${API_URL}/field/visit-reports/${id}`,
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
            "Unable to update visit report."
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to update visit report."
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

const fieldExecutiveVisitReportSlice =
  createSlice({
    name: "fieldExecutiveVisitReport",

    initialState,

    reducers: {
      clearSelectedVisitReport: (state) => {
        state.selectedReport = null;
      },

      clearVisitReportError: (state) => {
        state.error = null;
        state.detailsError = null;
        state.actionError = null;
      },

      clearVisitReportSuccess: (state) => {
        state.successMessage = null;
      },
    },

    extraReducers: (builder) => {
      // =================================================
      // FETCH REPORTS
      // =================================================

      builder
        .addCase(
          fetchFieldExecutiveVisitReports.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchFieldExecutiveVisitReports.fulfilled,
          (state, action) => {
            state.loading = false;
            state.reports =
              action.payload || [];
          }
        )

        .addCase(
          fetchFieldExecutiveVisitReports.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload ||
              "Unable to fetch visit reports.";
          }
        );

      // =================================================
      // FETCH REPORT BY ID
      // =================================================

      builder
        .addCase(
          fetchFieldExecutiveVisitReportById.pending,
          (state) => {
            state.detailsLoading = true;
            state.detailsError = null;
          }
        )

        .addCase(
          fetchFieldExecutiveVisitReportById.fulfilled,
          (state, action) => {
            state.detailsLoading = false;
            state.selectedReport =
              action.payload;
          }
        )

        .addCase(
          fetchFieldExecutiveVisitReportById.rejected,
          (state, action) => {
            state.detailsLoading = false;
            state.detailsError =
              action.payload ||
              "Unable to fetch visit report.";
          }
        );

      // =================================================
      // UPDATE REPORT
      // =================================================

      builder
        .addCase(
          updateFieldExecutiveVisitReport.pending,
          (state) => {
            state.actionLoading = true;
            state.actionError = null;
            state.successMessage = null;
          }
        )

        .addCase(
          updateFieldExecutiveVisitReport.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            state.successMessage =
              "Visit report updated successfully.";

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
          updateFieldExecutiveVisitReport.rejected,
          (state, action) => {
            state.actionLoading = false;
            state.actionError =
              action.payload ||
              "Unable to update visit report.";
          }
        );
    },
  });

export const {
  clearSelectedVisitReport,
  clearVisitReportError,
  clearVisitReportSuccess,
} =
  fieldExecutiveVisitReportSlice.actions;

export default fieldExecutiveVisitReportSlice.reducer;

