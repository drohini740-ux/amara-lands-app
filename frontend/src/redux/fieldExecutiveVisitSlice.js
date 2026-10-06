
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH MY VISITS
// =====================================================

export const fetchFieldExecutiveVisits = createAsyncThunk(
  "fieldExecutiveVisit/fetchFieldExecutiveVisits",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/field/visits`,
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
          "Unable to fetch visits."
      );
    }
  }
);

// =====================================================
// FETCH VISIT BY ID
// =====================================================

export const fetchFieldExecutiveVisitById =
  createAsyncThunk(
    "fieldExecutiveVisit/fetchFieldExecutiveVisitById",
    async (id, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/field/visits/${id}`,
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
// CHECK IN
// =====================================================

export const checkInFieldExecutiveVisit =
  createAsyncThunk(
    "fieldExecutiveVisit/checkInFieldExecutiveVisit",
    async (id, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
          `${API_URL}/field/visits/${id}/check-in`,
          {},
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
            "Unable to check in to visit."
        );
      }
    }
  );

// =====================================================
// CHECK OUT
// =====================================================

export const checkOutFieldExecutiveVisit =
  createAsyncThunk(
    "fieldExecutiveVisit/checkOutFieldExecutiveVisit",
    async (id, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
          `${API_URL}/field/visits/${id}/check-out`,
          {},
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
            "Unable to check out from visit."
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
  actionLoading: false,

  error: null,
  detailsError: null,
  actionError: null,
};

// =====================================================
// SLICE
// =====================================================

const fieldExecutiveVisitSlice =
  createSlice({
    name: "fieldExecutiveVisit",
    initialState,

    reducers: {
      clearSelectedVisit: (state) => {
        state.selectedVisit = null;
        state.detailsError = null;
      },

      clearVisitError: (state) => {
        state.error = null;
        state.detailsError = null;
        state.actionError = null;
      },
    },

    extraReducers: (builder) => {
      // =================================================
      // FETCH VISITS
      // =================================================

      builder
        .addCase(
          fetchFieldExecutiveVisits.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchFieldExecutiveVisits.fulfilled,
          (state, action) => {
            state.loading = false;

            state.visits =
              action.payload?.visits || [];
          }
        )

        .addCase(
          fetchFieldExecutiveVisits.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Unable to fetch visits.";
          }
        );

      // =================================================
      // FETCH VISIT BY ID
      // =================================================

      builder
        .addCase(
          fetchFieldExecutiveVisitById.pending,
          (state) => {
            state.detailsLoading = true;
            state.detailsError = null;
          }
        )

        .addCase(
          fetchFieldExecutiveVisitById.fulfilled,
          (state, action) => {
            state.detailsLoading = false;

            state.selectedVisit =
              action.payload?.visit || null;
          }
        )

        .addCase(
          fetchFieldExecutiveVisitById.rejected,
          (state, action) => {
            state.detailsLoading = false;

            state.detailsError =
              action.payload ||
              "Unable to fetch visit details.";
          }
        );

      // =================================================
      // CHECK IN
      // =================================================

      builder
        .addCase(
          checkInFieldExecutiveVisit.pending,
          (state) => {
            state.actionLoading = true;
            state.actionError = null;
          }
        )

        .addCase(
          checkInFieldExecutiveVisit.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            if (action.payload?.visit) {
              state.selectedVisit = {
                ...state.selectedVisit,
                ...action.payload.visit,
              };
            }
          }
        )

        .addCase(
          checkInFieldExecutiveVisit.rejected,
          (state, action) => {
            state.actionLoading = false;

            state.actionError =
              action.payload ||
              "Unable to check in.";
          }
        );

      // =================================================
      // CHECK OUT
      // =================================================

      builder
        .addCase(
          checkOutFieldExecutiveVisit.pending,
          (state) => {
            state.actionLoading = true;
            state.actionError = null;
          }
        )

        .addCase(
          checkOutFieldExecutiveVisit.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            if (action.payload?.visit) {
              state.selectedVisit = {
                ...state.selectedVisit,
                ...action.payload.visit,
              };
            }
          }
        )

        .addCase(
          checkOutFieldExecutiveVisit.rejected,
          (state, action) => {
            state.actionLoading = false;

            state.actionError =
              action.payload ||
              "Unable to check out.";
          }
        );
    },
  });

export const {
  clearSelectedVisit,
  clearVisitError,
} = fieldExecutiveVisitSlice.actions;

export default fieldExecutiveVisitSlice.reducer;

