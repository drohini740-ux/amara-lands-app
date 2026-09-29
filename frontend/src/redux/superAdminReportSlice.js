
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH SUPER ADMIN REPORTS
// =====================================================

export const fetchSuperAdminReports = createAsyncThunk(
  "superAdminReport/fetchSuperAdminReports",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/super-admin/reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Super Admin Reports Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch Super Admin reports."
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

const superAdminReportSlice = createSlice({
  name: "superAdminReport",

  initialState,

  reducers: {
    clearReportError: (state) => {
      state.error = null;
    },

    clearReports: (state) => {
      state.data = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // -------------------------------------------------
      // FETCH REPORTS - PENDING
      // -------------------------------------------------

      .addCase(
        fetchSuperAdminReports.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      // -------------------------------------------------
      // FETCH REPORTS - SUCCESS
      // -------------------------------------------------

      .addCase(
        fetchSuperAdminReports.fulfilled,
        (state, action) => {
          state.loading = false;

          if (action.payload?.success) {
            state.data = action.payload.data || null;
          } else {
            state.data = null;
            state.error =
              action.payload?.message ||
              "Failed to fetch reports.";
          }
        }
      )

      // -------------------------------------------------
      // FETCH REPORTS - FAILED
      // -------------------------------------------------

      .addCase(
        fetchSuperAdminReports.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to fetch reports.";
        }
      );
  },
});

// =====================================================
// EXPORT
// =====================================================

export const {
  clearReportError,
  clearReports,
} = superAdminReportSlice.actions;

export default superAdminReportSlice.reducer;
