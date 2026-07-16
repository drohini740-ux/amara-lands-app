import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as legalService from "../services/legalService";

// Fetch Legal Cases
export const fetchLegalCases = createAsyncThunk(
  "legal/fetch",
  async () => {
    return await legalService.getLegalCases();
  }
);

// Add Legal Case
export const createLegalCase = createAsyncThunk(
  "legal/add",
  async (data) => {
    return await legalService.addLegalCase(data);
  }
);

const legalSlice = createSlice({
  name: "legal",

  initialState: {
    legalCases: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchLegalCases.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchLegalCases.fulfilled, (state, action) => {
        state.loading = false;
        state.legalCases = action.payload.legalCases;
      })

      .addCase(fetchLegalCases.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createLegalCase.fulfilled, (state, action) => {
        state.legalCases.unshift(action.payload.legalCase);
      });
  },
});

export default legalSlice.reducer;