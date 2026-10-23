
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// FETCH LEGAL TEAM REPORTS
// =====================================================

export const fetchLegalReports = createAsyncThunk(
  "legalTeamReport/fetchLegalReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/legal-team/reports");
      return response.data;
    } catch (error) {
      console.error(
        "Fetch Legal Team Reports Error:",
        error.response?.data || error.message
      );

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
      .addCase(fetchLegalReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLegalReports.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || null;
      })

      .addCase(fetchLegalReports.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch reports.";
      });
  },
});

export const { clearLegalReportError } = legalTeamReportSlice.actions;

export default legalTeamReportSlice.reducer;
