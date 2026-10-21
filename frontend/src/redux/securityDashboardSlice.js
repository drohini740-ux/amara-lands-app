
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// FETCH SECURITY DASHBOARD
// =====================================================

export const fetchSecurityDashboard = createAsyncThunk(
  "securityDashboard/fetchSecurityDashboard",
  async (_, { rejectWithValue }) => {
    try {
      // Uses the shared API service and its authentication interceptor.
      const response = await API.get("/security/dashboard");

      return response.data;
    } catch (error) {
      console.error(
        "Security Dashboard Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch Security Dashboard."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const defaultOverview = {
  total_assigned_properties: 0,
  total_security_reports: 0,
  total_patrols: 0,
  completed_patrols: 0,
  total_incidents: 0,
  active_incidents: 0,
  total_motion_alerts: 0,
  active_cameras: 0,
};

const initialState = {
  overview: { ...defaultOverview },
  recentReports: [],
  recentPatrols: [],
  assignedProperties: [],
  loading: false,
  error: null,
};

// =====================================================
// SLICE
// =====================================================

const securityDashboardSlice = createSlice({
  name: "securityDashboard",
  initialState,

  reducers: {
    clearSecurityDashboardError: (state) => {
      state.error = null;
    },

    resetSecurityDashboard: (state) => {
      state.overview = { ...defaultOverview };
      state.recentReports = [];
      state.recentPatrols = [];
      state.assignedProperties = [];
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSecurityDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSecurityDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const payload = action.payload || {};
        const data = payload.data ?? payload;

        state.overview = {
          ...defaultOverview,
          ...(data.overview || {}),
        };

        state.recentReports = data.recent_reports || [];
        state.recentPatrols = data.recent_patrols || [];
        state.assignedProperties = data.assigned_properties || [];
      })

      .addCase(fetchSecurityDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to fetch Security Dashboard.";
      });
  },
});

// =====================================================
// EXPORTS
// =====================================================

export const {
  clearSecurityDashboardError,
  resetSecurityDashboard,
} = securityDashboardSlice.actions;

export default securityDashboardSlice.reducer;
