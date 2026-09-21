import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getSecurityMonitoringDashboard,
} from "../services/admin/securityMonitoringDashboardService";

export const fetchSecurityMonitoringDashboard =
  createAsyncThunk(
    "securityMonitoringDashboard/fetch",
    async (_, { rejectWithValue }) => {
      try {
        const response =
          await getSecurityMonitoringDashboard();

        return response.dashboard;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load security dashboard"
        );
      }
    }
  );

const initialState = {
  dashboard: {
    activeCameras: 0,
    newAlerts: 0,
    highSeverity: 0,
    intrusions: 0,
    patrols: 0,
    securityReports: 0,
    recentIncidents: [],
  },

  loading: false,
  error: null,
};

const securityMonitoringDashboardSlice =
  createSlice({
    name: "securityMonitoringDashboard",

    initialState,

    reducers: {
      clearSecurityDashboardError: (state) => {
        state.error = null;
      },
    },

    extraReducers: (builder) => {
      builder

        .addCase(
          fetchSecurityMonitoringDashboard.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchSecurityMonitoringDashboard.fulfilled,
          (state, action) => {
            state.loading = false;
            state.dashboard = action.payload;
          }
        )

        .addCase(
          fetchSecurityMonitoringDashboard.rejected,
          (state, action) => {
            state.loading = false;
            state.error = action.payload;
          }
        );
    },
  });

export const {
  clearSecurityDashboardError,
} = securityMonitoringDashboardSlice.actions;

export default securityMonitoringDashboardSlice.reducer;