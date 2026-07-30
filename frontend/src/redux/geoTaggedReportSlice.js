import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getGeoReports,
  getGeoReport,
  addGeoReport,
  updateGeoReport,
  deleteGeoReport,
} from "../services/geoTaggedReportService";

// Get All
export const fetchGeoReports = createAsyncThunk(
  "geoReports/fetchGeoReports",
  async () => {
    return await getGeoReports();
  }
);

// Get Single
export const fetchGeoReport = createAsyncThunk(
  "geoReports/fetchGeoReport",
  async (id) => {
    return await getGeoReport(id);
  }
);

// Add
export const createGeoReport = createAsyncThunk(
  "geoReports/createGeoReport",
  async (reportData) => {
    return await addGeoReport(reportData);
  }
);

// Update
export const editGeoReport = createAsyncThunk(
  "geoReports/editGeoReport",
  async ({ id, reportData }) => {
    return await updateGeoReport(id, reportData);
  }
);

// Delete
export const removeGeoReport = createAsyncThunk(
  "geoReports/removeGeoReport",
  async (id) => {
    await deleteGeoReport(id);
    return id;
  }
);

const geoTaggedReportSlice = createSlice({
  name: "geoReports",

  initialState: {
    reports: [],
    report: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchGeoReports.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchGeoReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.reports || [];
      })

      .addCase(fetchGeoReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchGeoReport.fulfilled, (state, action) => {
        state.report = action.payload.report;
      })

      .addCase(removeGeoReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter(
          (report) => report.id !== action.payload
        );
      });
  },
});

export default geoTaggedReportSlice.reducer;