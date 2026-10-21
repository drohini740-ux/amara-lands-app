import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Get all security reports
export const fetchSecurityReports = createAsyncThunk(
  "securityReports/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/security-reports");
      return res.data.reports || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load security reports"
      );
    }
  }
);

// Get one security report by ID
export const fetchSecurityReport = createAsyncThunk(
  "securityReports/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/security-reports/${id}`);

      // Verify that the API returned the requested record.
      const report = res.data.report;

      if (!report || String(report.id) !== String(id)) {
        return rejectWithValue("The requested security report was not returned.");
      }

      return report;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load security report"
      );
    }
  }
);

// Add security report
export const addSecurityReport = createAsyncThunk(
  "securityReports/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/security-reports", data);
      return res.data.report;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add security report"
      );
    }
  }
);

// Update security report
export const updateSecurityReport = createAsyncThunk(
  "securityReports/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/security-reports/${id}`, data);
      const report = res.data.report;

      if (!report || String(report.id) !== String(id)) {
        return rejectWithValue("The updated report ID does not match.");
      }

      return report;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update security report"
      );
    }
  }
);

// Delete security report
export const removeSecurityReport = createAsyncThunk(
  "securityReports/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/security-reports/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete security report"
      );
    }
  }
);

const securityReportSlice = createSlice({
  name: "securityReports",

  initialState: {
    reports: [],
    report: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearSecurityReport(state) {
      state.report = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Fetch all reports
    builder
      .addCase(fetchSecurityReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSecurityReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchSecurityReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // Fetch one report
    builder
      .addCase(fetchSecurityReport.pending, (state) => {
        state.loading = true;
        state.report = null;
        state.error = null;
      })
      .addCase(fetchSecurityReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchSecurityReport.rejected, (state, action) => {
        state.loading = false;
        state.report = null;
        state.error = action.payload || action.error.message;
      });

    // Add report
    builder
      .addCase(addSecurityReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSecurityReport.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.reports.unshift(action.payload);
        }
      })
      .addCase(addSecurityReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // Update report
    builder
      .addCase(updateSecurityReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSecurityReport.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.reports.findIndex(
          (item) => String(item.id) === String(action.payload.id)
        );

        if (index !== -1) {
          state.reports[index] = action.payload;
        }

        if (
          state.report &&
          String(state.report.id) === String(action.payload.id)
        ) {
          state.report = action.payload;
        }
      })
      .addCase(updateSecurityReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // Delete report
    builder
      .addCase(removeSecurityReport.pending, (state) => {
        state.error = null;
      })
      .addCase(removeSecurityReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter(
          (item) => String(item.id) !== String(action.payload)
        );

        if (
          state.report &&
          String(state.report.id) === String(action.payload)
        ) {
          state.report = null;
        }
      })
      .addCase(removeSecurityReport.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearSecurityReport } = securityReportSlice.actions;

export default securityReportSlice.reducer;