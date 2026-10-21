import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as legalTeamService from "../services/legalTeamService";

// =====================================================
// FETCH ALL LEGAL CASES
// GET /api/v1/legal-team/cases
// =====================================================

export const fetchAllLegalCases = createAsyncThunk(
  "legalTeam/fetchAllLegalCases",
  async (_, { rejectWithValue }) => {
    try {
      const response = await legalTeamService.getAllLegalCases();

      if (!response?.success || !Array.isArray(response.cases)) {
        return rejectWithValue(
          response?.message || "Invalid Legal Team cases response."
        );
      }

      return response.cases;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch Legal Team cases."
      );
    }
  }
);

// =====================================================
// FETCH ONE LEGAL CASE
// GET /api/v1/legal-team/cases/:id
// =====================================================

export const fetchLegalCaseById = createAsyncThunk(
  "legalTeam/fetchLegalCaseById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await legalTeamService.getLegalCaseById(id);

      if (!response?.success || !response.case) {
        return rejectWithValue(
          response?.message || "Legal case not found."
        );
      }

      return response.case;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch legal case details."
      );
    }
  }
);

// =====================================================
// REDUX SLICE
// =====================================================

const legalTeamSlice = createSlice({
  name: "legalTeam",

  initialState: {
    cases: [],
    selectedCase: null,
    loading: false,
    detailsLoading: false,
    error: null,
    detailsError: null,
  },

  reducers: {
    clearSelectedLegalCase: (state) => {
      state.selectedCase = null;
      state.detailsError = null;
    },

    clearLegalTeamError: (state) => {
      state.error = null;
      state.detailsError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch all cases
      .addCase(fetchAllLegalCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLegalCases.fulfilled, (state, action) => {
        state.loading = false;
        state.cases = action.payload;
      })
      .addCase(fetchAllLegalCases.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch Legal Team cases.";
      })

      // Fetch case details
      .addCase(fetchLegalCaseById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchLegalCaseById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedCase = action.payload;
      })
      .addCase(fetchLegalCaseById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError =
          action.payload || "Failed to fetch legal case details.";
      });
  },
});

export const {
  clearSelectedLegalCase,
  clearLegalTeamError,
} = legalTeamSlice.actions;

export default legalTeamSlice.reducer;