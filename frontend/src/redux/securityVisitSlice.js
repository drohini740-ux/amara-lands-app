
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

// Fetch Security Visits
export const fetchSecurityVisits = createAsyncThunk(
  "securityVisit/fetchSecurityVisits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/security/visits");
      return response.data;
    } catch (error) {
      console.error(
        "Security Visits Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch Security visits."
      );
    }
  }
);

// Fetch Security Visit Details
export const fetchSecurityVisitById = createAsyncThunk(
  "securityVisit/fetchSecurityVisitById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/security/visits/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Security Visit Details Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch visit details."
      );
    }
  }
);

// Initial State
const initialState = {
  visits: [],
  selectedVisit: null,
  loading: false,
  detailsLoading: false,
  error: null,
  detailsError: null,
};

// Slice
const securityVisitSlice = createSlice({
  name: "securityVisit",
  initialState,

  reducers: {
    clearSelectedSecurityVisit: (state) => {
      state.selectedVisit = null;
      state.detailsError = null;
    },

    clearSecurityVisitErrors: (state) => {
      state.error = null;
      state.detailsError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSecurityVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSecurityVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const payload = action.payload || {};
        const data = payload.data ?? payload;

        state.visits = Array.isArray(data.visits)
          ? data.visits
          : [];
      })

      .addCase(fetchSecurityVisits.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to fetch Security visits.";
      })

      .addCase(fetchSecurityVisitById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
        state.selectedVisit = null;
      })

      .addCase(fetchSecurityVisitById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = null;

        const payload = action.payload || {};
        const data = payload.data ?? payload;

        state.selectedVisit = data.visit || null;
      })

      .addCase(fetchSecurityVisitById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError =
          action.payload || "Unable to fetch visit details.";
      });
  },
});

// Exports
export const {
  clearSelectedSecurityVisit,
  clearSecurityVisitErrors,
} = securityVisitSlice.actions;

export default securityVisitSlice.reducer;
