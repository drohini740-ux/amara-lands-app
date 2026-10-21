
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// FETCH MY VISIT REPORTS
// =====================================================

export const fetchFieldExecutiveVisitReports = createAsyncThunk(
  "fieldExecutiveVisitReport/fetchReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/field/visit-reports");

      if (response.data?.success) {
        return response.data.reports || [];
      }

      return rejectWithValue(
        response.data?.message || "Unable to fetch visit reports."
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch visit reports."
      );
    }
  }
);

// =====================================================
// FETCH VISIT REPORT BY ID
// =====================================================

export const fetchFieldExecutiveVisitReportById = createAsyncThunk(
  "fieldExecutiveVisitReport/fetchReportById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/field/visit-reports/${id}`);

      if (response.data?.success) {
        return response.data.report;
      }

      return rejectWithValue(
        response.data?.message || "Unable to fetch visit report."
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch visit report."
      );
    }
  }
);

// =====================================================
// UPDATE VISIT REPORT
// =====================================================

export const updateFieldExecutiveVisitReport = createAsyncThunk(
  "fieldExecutiveVisitReport/updateReport",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/field/visit-reports/${id}`, data);

      if (response.data?.success) {
        return response.data.report;
      }

      return rejectWithValue(
        response.data?.message || "Unable to update visit report."
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to update visit report."
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

const fieldExecutiveVisitReportSlice = createSlice({
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
    builder
      // FETCH REPORTS
      .addCase(fetchFieldExecutiveVisitReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFieldExecutiveVisitReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchFieldExecutiveVisitReports.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to fetch visit reports.";
      })

      // FETCH REPORT BY ID
      .addCase(fetchFieldExecutiveVisitReportById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(
        fetchFieldExecutiveVisitReportById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.selectedReport = action.payload;
        }
      )
      .addCase(
        fetchFieldExecutiveVisitReportById.rejected,
        (state, action) => {
          state.detailsLoading = false;
          state.detailsError =
            action.payload || "Unable to fetch visit report.";
        }
      )

      // UPDATE REPORT
      .addCase(updateFieldExecutiveVisitReport.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(updateFieldExecutiveVisitReport.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.successMessage = "Visit report updated successfully.";
        state.selectedReport = action.payload;

        if (action.payload) {
          const index = state.reports.findIndex(
            (report) => report.id === action.payload.id
          );

          if (index !== -1) {
            state.reports[index] = action.payload;
          }
        }
      })
      .addCase(updateFieldExecutiveVisitReport.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError =
          action.payload || "Unable to update visit report.";
      });
  },
});

// =====================================================
// EXPORTS
// =====================================================

export const {
  clearSelectedVisitReport,
  clearVisitReportError,
  clearVisitReportSuccess,
} = fieldExecutiveVisitReportSlice.actions;

export default fieldExecutiveVisitReportSlice.reducer;
