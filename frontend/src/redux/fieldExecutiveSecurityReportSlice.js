
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// FETCH MY SECURITY REPORTS
// =====================================================

export const fetchFieldExecutiveSecurityReports = createAsyncThunk(
  "fieldExecutiveSecurityReport/fetchReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/field/security-reports");
      return response.data.reports || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch security reports."
      );
    }
  }
);

// =====================================================
// CREATE SECURITY REPORT
// =====================================================

export const createFieldExecutiveSecurityReport = createAsyncThunk(
  "fieldExecutiveSecurityReport/createReport",
  async (
    { property_id, report_type, description, latitude, longitude },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.post("/field/security-reports", {
        property_id,
        report_type,
        description,
        latitude,
        longitude,
      });

      return response.data.report;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to create security report."
      );
    }
  }
);

// =====================================================
// FETCH SECURITY REPORT BY ID
// =====================================================

export const fetchFieldExecutiveSecurityReportById = createAsyncThunk(
  "fieldExecutiveSecurityReport/fetchReportById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/field/security-reports/${id}`);
      return response.data.report;
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

export const updateFieldExecutiveSecurityReport = createAsyncThunk(
  "fieldExecutiveSecurityReport/updateReport",
  async (
    {
      id,
      report_type,
      description,
      latitude,
      longitude,
      report_status,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.put(`/field/security-reports/${id}`, {
        report_type,
        description,
        latitude,
        longitude,
        report_status,
      });

      return response.data.report;
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

const fieldExecutiveSecurityReportSlice = createSlice({
  name: "fieldExecutiveSecurityReport",
  initialState,

  reducers: {
    clearSelectedSecurityReport: (state) => {
      state.selectedReport = null;
      state.detailsError = null;
    },

    clearSecurityReportError: (state) => {
      state.error = null;
      state.detailsError = null;
      state.actionError = null;
    },

    clearSecurityReportSuccess: (state) => {
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH REPORTS
      .addCase(fetchFieldExecutiveSecurityReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFieldExecutiveSecurityReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchFieldExecutiveSecurityReports.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to fetch security reports.";
      })

      // CREATE REPORT
      .addCase(createFieldExecutiveSecurityReport.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(createFieldExecutiveSecurityReport.fulfilled, (state, action) => {
        state.actionLoading = false;

        if (action.payload) {
          state.reports.unshift(action.payload);
        }

        state.successMessage = "Security report created successfully.";
      })
      .addCase(createFieldExecutiveSecurityReport.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError =
          action.payload || "Unable to create security report.";
      })

      // FETCH REPORT BY ID
      .addCase(fetchFieldExecutiveSecurityReportById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
        state.selectedReport = null;
      })
      .addCase(
        fetchFieldExecutiveSecurityReportById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.selectedReport = action.payload;
        }
      )
      .addCase(
        fetchFieldExecutiveSecurityReportById.rejected,
        (state, action) => {
          state.detailsLoading = false;
          state.detailsError =
            action.payload || "Unable to fetch security report.";
        }
      )

      // UPDATE REPORT
      .addCase(updateFieldExecutiveSecurityReport.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(updateFieldExecutiveSecurityReport.fulfilled, (state, action) => {
        state.actionLoading = false;

        const updatedReport = action.payload;

        if (updatedReport) {
          const index = state.reports.findIndex(
            (report) => report.id === updatedReport.id
          );

          if (index !== -1) {
            state.reports[index] = updatedReport;
          }

          if (state.selectedReport?.id === updatedReport.id) {
            state.selectedReport = updatedReport;
          }

          state.successMessage = "Security report updated successfully.";
        }
      })
      .addCase(updateFieldExecutiveSecurityReport.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError =
          action.payload || "Unable to update security report.";
      });
  },
});

// =====================================================
// EXPORTS
// =====================================================

export const {
  clearSelectedSecurityReport,
  clearSecurityReportError,
  clearSecurityReportSuccess,
} = fieldExecutiveSecurityReportSlice.actions;

export default fieldExecutiveSecurityReportSlice.reducer;
