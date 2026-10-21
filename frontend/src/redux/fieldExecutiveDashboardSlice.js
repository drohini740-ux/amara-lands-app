
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// FETCH FIELD EXECUTIVE DASHBOARD
// =====================================================

export const fetchFieldExecutiveDashboard = createAsyncThunk(
  "fieldExecutiveDashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/field/dashboard");
      const result = response.data;

      if (result?.success === false) {
        return rejectWithValue(
          result.message || "Failed to fetch dashboard data."
        );
      }

      // Support both { success: true, data: {...} }
      // and a direct dashboard response.
      return result?.data ?? result;
    } catch (error) {
      console.error(
        "Field Executive Dashboard Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to load Field Executive dashboard."
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
    total_visits: 0,
    completed_visits: 0,
    pending_visits: 0,
    total_security_reports: 0,
  },

  upcoming_visits: [],
  recent_visits: [],
  assigned_properties: [],

  loading: false,
  error: null,
};

// =====================================================
// SLICE
// =====================================================

const fieldExecutiveDashboardSlice = createSlice({
  name: "fieldExecutiveDashboard",
  initialState,

  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },

    resetFieldExecutiveDashboard: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFieldExecutiveDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchFieldExecutiveDashboard.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          const data = action.payload || {};

          state.overview = {
            ...initialState.overview,
            ...(data.overview || {}),
          };

          state.upcoming_visits = Array.isArray(data.upcoming_visits)
            ? data.upcoming_visits
            : [];

          state.recent_visits = Array.isArray(data.recent_visits)
            ? data.recent_visits
            : [];

          state.assigned_properties = Array.isArray(
            data.assigned_properties
          )
            ? data.assigned_properties
            : [];
        }
      )

      .addCase(
        fetchFieldExecutiveDashboard.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload || "Unable to load dashboard.";
        }
      );
  },
});

// =====================================================
// EXPORTS
// =====================================================

export const {
  clearDashboardError,
  resetFieldExecutiveDashboard,
} = fieldExecutiveDashboardSlice.actions;

export default fieldExecutiveDashboardSlice.reducer;
