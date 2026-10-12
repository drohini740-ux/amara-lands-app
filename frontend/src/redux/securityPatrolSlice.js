
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH ALL SECURITY PATROLS
// =====================================================

export const fetchSecurityPatrols = createAsyncThunk(
  "securityPatrol/fetchSecurityPatrols",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/security/patrols`,
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
          "Unable to fetch security patrols."
      );
    }
  }
);

// =====================================================
// FETCH SECURITY PATROL BY ID
// =====================================================

export const fetchSecurityPatrolById = createAsyncThunk(
  "securityPatrol/fetchSecurityPatrolById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/security/patrols/${id}`,
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
          "Unable to fetch patrol details."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  patrols: [],
  selectedPatrol: null,

  loading: false,
  detailsLoading: false,

  error: null,
  detailsError: null,
};

// =====================================================
// SECURITY PATROL SLICE
// =====================================================

const securityPatrolSlice = createSlice({
  name: "securityPatrol",
  initialState,

  reducers: {
    clearSelectedPatrol: (state) => {
      state.selectedPatrol = null;
      state.detailsError = null;
    },

    clearSecurityPatrolErrors: (state) => {
      state.error = null;
      state.detailsError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===============================================
      // FETCH ALL PATROLS
      // ===============================================

      .addCase(
        fetchSecurityPatrols.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSecurityPatrols.fulfilled,
        (state, action) => {
          state.loading = false;
          state.patrols = action.payload?.patrols || [];
        }
      )

      .addCase(
        fetchSecurityPatrols.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Unable to fetch security patrols.";
        }
      )

      // ===============================================
      // FETCH PATROL DETAILS
      // ===============================================

      .addCase(
        fetchSecurityPatrolById.pending,
        (state) => {
          state.detailsLoading = true;
          state.detailsError = null;
          state.selectedPatrol = null;
        }
      )

      .addCase(
        fetchSecurityPatrolById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.selectedPatrol =
            action.payload?.patrol || null;
        }
      )

      .addCase(
        fetchSecurityPatrolById.rejected,
        (state, action) => {
          state.detailsLoading = false;
          state.detailsError =
            action.payload ||
            "Unable to fetch patrol details.";
        }
      );
  },
});

// =====================================================
// EXPORT ACTIONS AND REDUCER
// =====================================================

export const {
  clearSelectedPatrol,
  clearSecurityPatrolErrors,
} = securityPatrolSlice.actions;

export default securityPatrolSlice.reducer;
