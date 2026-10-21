
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as legalService from "../services/legalService";

// Fetch all legal cases
export const fetchLegalCases = createAsyncThunk(
  "legal/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await legalService.getLegalCases();

      if (!response?.success || !Array.isArray(response.legalCases)) {
        return rejectWithValue(
          response?.message || "Invalid legal cases response"
        );
      }

      return response.legalCases;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch legal cases"
      );
    }
  }
);

// Add a legal case
export const createLegalCase = createAsyncThunk(
  "legal/add",
  async (data, { rejectWithValue }) => {
    try {
      return await legalService.addLegalCase(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create legal case"
      );
    }
  }
);

const legalSlice = createSlice({
  name: "legal",

  initialState: {
    legalCases: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchLegalCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLegalCases.fulfilled, (state, action) => {
        state.loading = false;
        state.legalCases = action.payload;
        state.error = null;
      })

      .addCase(fetchLegalCases.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch legal cases";

        // Preserve existing Redux data when a request fails.
      })

      .addCase(createLegalCase.fulfilled, (state, action) => {
        if (action.payload?.legalCase) {
          state.legalCases.unshift(action.payload.legalCase);
        }
      });
  },
});

export default legalSlice.reducer;
