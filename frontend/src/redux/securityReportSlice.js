import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Get All Reports
export const fetchSecurityReports = createAsyncThunk(
  "securityReports/fetch",
  async () => {
    const res = await api.get("/security-reports");
    return res.data.reports;
  }
);

// Get Single Report
export const fetchSecurityReport = createAsyncThunk(
  "securityReports/fetchOne",
  async (id) => {
    const res = await api.get(`/security-reports/${id}`);
    return res.data.report;
  }
);

// Add Report
export const addSecurityReport = createAsyncThunk(
  "securityReports/add",
  async (data) => {
    const res = await api.post("/security-reports", data);
    return res.data.report;
  }
);

// Update Report
export const updateSecurityReport = createAsyncThunk(
  "securityReports/update",
  async ({ id, data }) => {
    const res = await api.put(`/security-reports/${id}`, data);
    return res.data.report;
  }
);

// Delete Report
export const removeSecurityReport = createAsyncThunk(
  "securityReports/delete",
  async (id) => {
    await api.delete(`/security-reports/${id}`);
    return id;
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

  reducers: {},

  extraReducers: (builder) => {

    builder.addCase(fetchSecurityReports.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchSecurityReports.fulfilled, (state, action) => {
      state.loading = false;
      state.reports = action.payload;
    });

    builder.addCase(fetchSecurityReport.fulfilled, (state, action) => {
      state.report = action.payload;
    });

    builder.addCase(addSecurityReport.fulfilled, (state, action) => {
      state.reports.unshift(action.payload);
    });

    builder.addCase(updateSecurityReport.fulfilled, (state, action) => {
      const index = state.reports.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index !== -1) {
        state.reports[index] = action.payload;
      }
    });

    builder.addCase(removeSecurityReport.fulfilled, (state, action) => {
      state.reports = state.reports.filter(
        (item) => item.id !== action.payload
      );
    });

  },
});

export default securityReportSlice.reducer;