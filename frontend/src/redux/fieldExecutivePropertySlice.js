
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// FETCH MY ASSIGNED PROPERTIES
// =====================================================

export const fetchFieldExecutiveProperties = createAsyncThunk(
  "fieldExecutiveProperty/fetchProperties",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/field/properties");
      const result = response.data;

      if (result?.success === false) {
        return rejectWithValue(
          result.message || "Unable to fetch assigned properties."
        );
      }

      return result?.data ?? result;
    } catch (error) {
      console.error(
        "Fetch Field Executive Properties Error:",
        error.response?.data || error.message
      );

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

export const fetchFieldExecutivePropertyById = createAsyncThunk(
  "fieldExecutiveProperty/fetchPropertyById",
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Property ID is required.");
      }

      const response = await API.get(
        `/field/properties/${encodeURIComponent(id)}`
      );
      const result = response.data;

      if (result?.success === false) {
        return rejectWithValue(
          result.message || "Unable to fetch property details."
        );
      }

      return result?.data ?? result;
    } catch (error) {
      console.error(
        "Fetch Field Executive Property Details Error:",
        error.response?.data || error.message
      );

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

const fieldExecutivePropertySlice = createSlice({
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
    builder
      // FETCH ALL ASSIGNED PROPERTIES
      .addCase(fetchFieldExecutiveProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchFieldExecutiveProperties.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          const payload = action.payload;

          state.properties = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.properties)
              ? payload.properties
              : [];
        }
      )

      .addCase(
        fetchFieldExecutiveProperties.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload || "Unable to fetch assigned properties.";
        }
      )

      // FETCH PROPERTY DETAILS
      .addCase(fetchFieldExecutivePropertyById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })

      .addCase(
        fetchFieldExecutivePropertyById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.detailsError = null;

          const payload = action.payload;

          state.selectedProperty =
            payload?.property ??
            payload?.properties ??
            payload ??
            null;
        }
      )

      .addCase(
        fetchFieldExecutivePropertyById.rejected,
        (state, action) => {
          state.detailsLoading = false;
          state.detailsError =
            action.payload || "Unable to fetch property details.";
        }
      );
  },
});

// =====================================================
// EXPORTS
// =====================================================

export const {
  clearSelectedProperty,
  clearPropertyError,
} = fieldExecutivePropertySlice.actions;

export default fieldExecutivePropertySlice.reducer;
