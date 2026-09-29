import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH SUPER ADMIN DASHBOARD
// =====================================================
export const fetchSuperAdminDashboard = createAsyncThunk(
  "superAdminDashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/super-admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      // Loading
      .addCase(fetchSuperAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Success
      .addCase(
        fetchSuperAdminDashboard.fulfilled,
        (state, action) => {
          state.loading = false;
          state.data = action.payload.data;
        }
      )

      // Error
      .addCase(
        fetchSuperAdminDashboard.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearDashboardError } =
  superAdminDashboardSlice.actions;

export default superAdminDashboardSlice.reducer;