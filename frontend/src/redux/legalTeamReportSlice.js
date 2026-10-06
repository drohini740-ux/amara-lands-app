
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH LEGAL TEAM REPORTS
// =====================================================

export const fetchLegalReports = createAsyncThunk(
  "legalTeamReport/fetchLegalReports",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/legal-team/reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch Legal Team reports."
      );
    }
  }
);

// =====================================================
// SLICE
// =====================================================

const legalTeamReportSlice = createSlice({
  name: "legalTeamReport",

  initialState: {
    data: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearLegalReportError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH REPORTS
      .addCase(
        fetchLegalReports.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchLegalReports.fulfilled,
        (state, action) => {
          state.loading = false;
          state.data =
            action.payload?.data || null;
        }
      )

      .addCase(
        fetchLegalReports.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to fetch reports.";
        }
      );
  },
});

export const {
  clearLegalReportError,
} = legalTeamReportSlice.actions;

export default legalTeamReportSlice.reducer;

