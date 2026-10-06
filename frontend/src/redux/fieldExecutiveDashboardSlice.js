
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH FIELD EXECUTIVE DASHBOARD
// =====================================================

export const fetchFieldExecutiveDashboard =
  createAsyncThunk(
    "fieldExecutiveDashboard/fetchDashboard",
    async (_, { rejectWithValue }) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/field/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data?.success) {
          return rejectWithValue(
            response.data?.message ||
              "Failed to fetch dashboard data."
          );
        }

        return response.data.data;
      } catch (error) {
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

const fieldExecutiveDashboardSlice =
  createSlice({
    name: "fieldExecutiveDashboard",

    initialState,

    reducers: {
      clearDashboardError: (state) => {
        state.error = null;
      },
    },

    extraReducers: (builder) => {
      builder

        // ============================================
        // PENDING
        // ============================================

        .addCase(
          fetchFieldExecutiveDashboard.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        // ============================================
        // SUCCESS
        // ============================================

        .addCase(
          fetchFieldExecutiveDashboard.fulfilled,
          (state, action) => {
            state.loading = false;

            state.overview =
              action.payload?.overview ||
              state.overview;

            state.upcoming_visits =
              action.payload?.upcoming_visits ||
              [];

            state.recent_visits =
              action.payload?.recent_visits ||
              [];

            state.assigned_properties =
              action.payload?.assigned_properties ||
              [];
          }
        )

        // ============================================
        // ERROR
        // ============================================

        .addCase(
          fetchFieldExecutiveDashboard.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Unable to load dashboard.";
          }
        );
    },
  });

export const {
  clearDashboardError,
} =
  fieldExecutiveDashboardSlice.actions;

export default fieldExecutiveDashboardSlice.reducer;

