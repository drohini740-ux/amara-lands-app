
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH SECURITY VISITS
// =====================================================

export const fetchSecurityVisits = createAsyncThunk(
  "securityVisit/fetchSecurityVisits",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/security/visits`,
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
          "Unable to fetch Security visits."
      );
    }
  }
);

// =====================================================
// FETCH SECURITY VISIT DETAILS
// =====================================================

export const fetchSecurityVisitById = createAsyncThunk(
  "securityVisit/fetchSecurityVisitById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/security/visits/${id}`,
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
          "Unable to fetch visit details."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  visits: [],
  selectedVisit: null,

  loading: false,
  detailsLoading: false,

  error: null,
  detailsError: null,
};

// =====================================================
// SLICE
// =====================================================

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
      // ===============================================
      // FETCH VISITS
      // ===============================================

      .addCase(fetchSecurityVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSecurityVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.visits = action.payload?.visits || [];
      })

      .addCase(fetchSecurityVisits.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to fetch Security visits.";
      })

      // ===============================================
      // FETCH VISIT DETAILS
      // ===============================================

      .addCase(fetchSecurityVisitById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
        state.selectedVisit = null;
      })

      .addCase(fetchSecurityVisitById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedVisit = action.payload?.visit || null;
      })

      .addCase(fetchSecurityVisitById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError =
          action.payload || "Unable to fetch visit details.";
      });
  },
});

// =====================================================
// EXPORTS
// =====================================================

export const {
  clearSelectedSecurityVisit,
  clearSecurityVisitErrors,
} = securityVisitSlice.actions;

export default securityVisitSlice.reducer;

