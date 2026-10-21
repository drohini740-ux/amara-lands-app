
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// FETCH SUPER ADMIN DASHBOARD
// =====================================================
export const fetchSuperAdminDashboard = createAsyncThunk(
  "superAdminDashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/super-admin/dashboard");
      return response.data;
    } catch (error) {
      console.error(
        "Super Admin Dashboard Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch Super Admin dashboard data."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================
const initialState = {
  data: null,
  loading: false,
  error: null,
};

// =====================================================
// SLICE
// =====================================================
const superAdminDashboardSlice = createSlice({
  name: "superAdminDashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuperAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchSuperAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError } = superAdminDashboardSlice.actions;

export default superAdminDashboardSlice.reducer;
