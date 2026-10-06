
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  "http://localhost:4000/api/v1/field/properties";

// =====================================================
// FETCH MY ASSIGNED PROPERTIES
// =====================================================

export const fetchFieldExecutiveProperties =
  createAsyncThunk(
    "fieldExecutiveProperty/fetchProperties",
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
            "Unable to fetch assigned properties."
        );
      }
    }
  );

// =====================================================
// FETCH PROPERTY BY ID
// =====================================================

export const fetchFieldExecutivePropertyById =
  createAsyncThunk(
    "fieldExecutiveProperty/fetchPropertyById",
    async (id, { rejectWithValue }) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/${id}`,
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
            "Unable to fetch property details."
        );
      }
    }
  );

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  properties: [],
  selectedProperty: null,

  loading: false,
  detailsLoading: false,

  error: null,
  detailsError: null,
};

// =====================================================
// SLICE
// =====================================================

const fieldExecutivePropertySlice =
  createSlice({
    name: "fieldExecutiveProperty",
    initialState,

    reducers: {
      clearSelectedProperty: (state) => {
        state.selectedProperty = null;
        state.detailsError = null;
      },

      clearPropertyError: (state) => {
        state.error = null;
        state.detailsError = null;
      },
    },

    extraReducers: (builder) => {
      // =================================================
      // FETCH ALL PROPERTIES
      // =================================================

      builder
        .addCase(
          fetchFieldExecutiveProperties.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchFieldExecutiveProperties.fulfilled,
          (state, action) => {
            state.loading = false;

            state.properties =
              action.payload?.properties || [];
          }
        )

        .addCase(
          fetchFieldExecutiveProperties.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Unable to fetch assigned properties.";

            state.properties = [];
          }
        );

      // =================================================
      // FETCH PROPERTY BY ID
      // =================================================

      builder
        .addCase(
          fetchFieldExecutivePropertyById.pending,
          (state) => {
            state.detailsLoading = true;
            state.detailsError = null;
          }
        )

        .addCase(
          fetchFieldExecutivePropertyById.fulfilled,
          (state, action) => {
            state.detailsLoading = false;

            state.selectedProperty =
              action.payload?.property || null;
          }
        )

        .addCase(
          fetchFieldExecutivePropertyById.rejected,
          (state, action) => {
            state.detailsLoading = false;

            state.detailsError =
              action.payload ||
              "Unable to fetch property details.";

            state.selectedProperty = null;
          }
        );
    },
  });

export const {
  clearSelectedProperty,
  clearPropertyError,
} =
  fieldExecutivePropertySlice.actions;

export default fieldExecutivePropertySlice.reducer;
