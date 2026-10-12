
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH SECURITY DASHBOARD
// =====================================================

export const fetchSecurityDashboard = createAsyncThunk(
  "securityDashboard/fetchSecurityDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/security/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

const initialState = {
  overview: {
    total_assigned_properties: 0,
    total_security_reports: 0,
    total_patrols: 0,
    completed_patrols: 0,
    total_incidents: 0,
    active_incidents: 0,
    total_motion_alerts: 0,
    active_cameras: 0,
  },

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
    // =================================================
    // CLEAR ERROR
    // =================================================

    clearSecurityDashboardError: (state) => {
      state.error = null;
    },

    // =================================================
    // RESET DASHBOARD
    // =================================================

    resetSecurityDashboard: (state) => {
      state.overview = {
        total_assigned_properties: 0,
        total_security_reports: 0,
        total_patrols: 0,
        completed_patrols: 0,
        total_incidents: 0,
        active_incidents: 0,
        total_motion_alerts: 0,
        active_cameras: 0,
      };

      state.recentReports = [];
      state.recentPatrols = [];
      state.assignedProperties = [];

      state.loading = false;
      state.error = null;
    },
  },

  // ===================================================
  // ASYNC ACTIONS
  // ===================================================

  extraReducers: (builder) => {
    builder

      // =================================================
      // FETCH PENDING
      // =================================================

      .addCase(
        fetchSecurityDashboard.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      // =================================================
      // FETCH SUCCESS
      // =================================================

      .addCase(
        fetchSecurityDashboard.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          const data =
            action.payload?.data || {};

          state.overview =
            data.overview || {
              total_assigned_properties: 0,
              total_security_reports: 0,
              total_patrols: 0,
              completed_patrols: 0,
              total_incidents: 0,
              active_incidents: 0,
              total_motion_alerts: 0,
              active_cameras: 0,
            };

          state.recentReports =
            data.recent_reports || [];

          state.recentPatrols =
            data.recent_patrols || [];

          state.assignedProperties =
            data.assigned_properties || [];
        }
      )

      // =================================================
      // FETCH FAILED
      // =================================================

      .addCase(
        fetchSecurityDashboard.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Unable to fetch Security Dashboard.";
        }
      );
  },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
  clearSecurityDashboardError,
  resetSecurityDashboard,
} = securityDashboardSlice.actions;

// =====================================================
// REDUCER
// =====================================================

export default securityDashboardSlice.reducer;

