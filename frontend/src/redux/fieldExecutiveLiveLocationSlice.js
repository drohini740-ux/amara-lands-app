
import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "axios";

const API_URL =
  "http://localhost:4000/api/v1/field/live-location";

// =====================================================
// UPDATE LIVE LOCATION
// =====================================================

export const updateFieldExecutiveLiveLocation =
  createAsyncThunk(
    "fieldExecutiveLiveLocation/updateLocation",
    async (
      {
        latitude,
        longitude,
        accuracy_meters,
        is_sharing = true,
      },
      { rejectWithValue }
    ) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.post(
          API_URL,
          {
            latitude,
            longitude,
            accuracy_meters,
            is_sharing,
          },
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
            "Unable to update live location."
        );
      }
    }
  );

// =====================================================
// FETCH MY LIVE LOCATION
// =====================================================

export const fetchFieldExecutiveLiveLocation =
  createAsyncThunk(
    "fieldExecutiveLiveLocation/fetchLocation",
    async (_, { rejectWithValue }) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.get(
          API_URL,
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
            "Unable to fetch live location."
        );
      }
    }
  );

// =====================================================
// STOP LIVE LOCATION
// =====================================================

export const stopFieldExecutiveLiveLocation =
  createAsyncThunk(
    "fieldExecutiveLiveLocation/stopLocation",
    async (_, { rejectWithValue }) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.put(
          `${API_URL}/stop`,
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
            "Unable to stop live location."
        );
      }
    }
  );

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  location: null,

  loading: false,
  fetchLoading: false,
  stopLoading: false,

  error: null,
  fetchError: null,
  stopError: null,

  successMessage: null,
};

// =====================================================
// SLICE
// =====================================================

const fieldExecutiveLiveLocationSlice =
  createSlice({
    name: "fieldExecutiveLiveLocation",

    initialState,

    reducers: {
      clearLiveLocationError: (state) => {
        state.error = null;
        state.fetchError = null;
        state.stopError = null;
      },

      clearLiveLocationSuccess: (state) => {
        state.successMessage = null;
      },

      clearLiveLocation: (state) => {
        state.location = null;
        state.error = null;
        state.fetchError = null;
        state.stopError = null;
        state.successMessage = null;
      },
    },

    extraReducers: (builder) => {
      // =================================================
      // UPDATE LOCATION
      // =================================================

      builder
        .addCase(
          updateFieldExecutiveLiveLocation.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          updateFieldExecutiveLiveLocation.fulfilled,
          (state, action) => {
            state.loading = false;

            state.location =
              action.payload?.location ||
              null;

            state.successMessage =
              action.payload?.message ||
              "Live location updated successfully.";
          }
        )

        .addCase(
          updateFieldExecutiveLiveLocation.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Unable to update live location.";
          }
        );

      // =================================================
      // FETCH LOCATION
      // =================================================

      builder
        .addCase(
          fetchFieldExecutiveLiveLocation.pending,
          (state) => {
            state.fetchLoading = true;
            state.fetchError = null;
          }
        )

        .addCase(
          fetchFieldExecutiveLiveLocation.fulfilled,
          (state, action) => {
            state.fetchLoading = false;

            state.location =
              action.payload?.location ||
              null;
          }
        )

        .addCase(
          fetchFieldExecutiveLiveLocation.rejected,
          (state, action) => {
            state.fetchLoading = false;

            state.fetchError =
              action.payload ||
              "Unable to fetch live location.";
          }
        );

      // =================================================
      // STOP LOCATION
      // =================================================

      builder
        .addCase(
          stopFieldExecutiveLiveLocation.pending,
          (state) => {
            state.stopLoading = true;
            state.stopError = null;
          }
        )

        .addCase(
          stopFieldExecutiveLiveLocation.fulfilled,
          (state, action) => {
            state.stopLoading = false;

            state.location =
              action.payload?.location ||
              state.location;

            state.successMessage =
              action.payload?.message ||
              "Live location sharing stopped.";
          }
        )

        .addCase(
          stopFieldExecutiveLiveLocation.rejected,
          (state, action) => {
            state.stopLoading = false;

            state.stopError =
              action.payload ||
              "Unable to stop live location.";
          }
        );
    },
  });

// =====================================================
// ACTIONS
// =====================================================

export const {
  clearLiveLocationError,
  clearLiveLocationSuccess,
  clearLiveLocation,
} =
  fieldExecutiveLiveLocationSlice.actions;

// =====================================================
// REDUCER
// =====================================================

export default fieldExecutiveLiveLocationSlice.reducer;

