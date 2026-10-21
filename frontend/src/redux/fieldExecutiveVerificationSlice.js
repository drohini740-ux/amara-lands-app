
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

const API_URL = "/field/verification";

// =====================================================
// GET MY VERIFICATION PROPERTIES
// =====================================================

export const fetchFieldExecutiveVerificationProperties = createAsyncThunk(
  "fieldExecutiveVerification/fetchProperties",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch verification properties."
      );
    }
  }
);

// =====================================================
// GET SINGLE PROPERTY
// =====================================================

export const fetchFieldExecutiveVerificationProperty = createAsyncThunk(
  "fieldExecutiveVerification/fetchProperty",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch property."
      );
    }
  }
);

// =====================================================
// VERIFY PROPERTY
// =====================================================

export const verifyFieldExecutiveProperty = createAsyncThunk(
  "fieldExecutiveVerification/verifyProperty",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.put(`${API_URL}/${id}/verify`, {});
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to verify property."
      );
    }
  }
);

// =====================================================
// REJECT PROPERTY
// =====================================================

export const rejectFieldExecutiveProperty = createAsyncThunk(
  "fieldExecutiveVerification/rejectProperty",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.put(`${API_URL}/${id}/reject`, {});
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to reject property."
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
  actionLoading: false,
  error: null,
  detailsError: null,
  actionError: null,
  successMessage: null,
};

// =====================================================
// SLICE
// =====================================================

const fieldExecutiveVerificationSlice = createSlice({
  name: "fieldExecutiveVerification",
  initialState,

  reducers: {
    clearSelectedVerificationProperty: (state) => {
      state.selectedProperty = null;
    },

    clearVerificationError: (state) => {
      state.error = null;
      state.detailsError = null;
      state.actionError = null;
    },

    clearVerificationSuccess: (state) => {
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH PROPERTIES
      .addCase(
        fetchFieldExecutiveVerificationProperties.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchFieldExecutiveVerificationProperties.fulfilled,
        (state, action) => {
          state.loading = false;

          const payload = action.payload;
          const properties = Array.isArray(payload)
            ? payload
            : payload?.properties ?? payload?.data;

          state.properties = Array.isArray(properties) ? properties : [];
        }
      )
      .addCase(
        fetchFieldExecutiveVerificationProperties.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload || "Unable to fetch verification properties.";
        }
      )

      // FETCH SINGLE PROPERTY
      .addCase(
        fetchFieldExecutiveVerificationProperty.pending,
        (state) => {
          state.detailsLoading = true;
          state.detailsError = null;
        }
      )
      .addCase(
        fetchFieldExecutiveVerificationProperty.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.selectedProperty =
            action.payload?.property ??
            action.payload?.data ??
            null;
        }
      )
      .addCase(
        fetchFieldExecutiveVerificationProperty.rejected,
        (state, action) => {
          state.detailsLoading = false;
          state.detailsError =
            action.payload || "Unable to fetch property.";
        }
      )

      // VERIFY PROPERTY
      .addCase(verifyFieldExecutiveProperty.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(verifyFieldExecutiveProperty.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.successMessage =
          action.payload?.message || "Property verified successfully.";

        const updatedProperty = action.payload?.property;

        if (updatedProperty) {
          state.selectedProperty = updatedProperty;

          const index = state.properties.findIndex(
            (property) =>
              Number(property.property_id ?? property.id) ===
              Number(updatedProperty.id ?? updatedProperty.property_id)
          );

          if (index !== -1) {
            state.properties[index] = {
              ...state.properties[index],
              ...updatedProperty,
            };
          }
        }
      })
      .addCase(verifyFieldExecutiveProperty.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError =
          action.payload || "Unable to verify property.";
      })

      // REJECT PROPERTY
      .addCase(rejectFieldExecutiveProperty.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(rejectFieldExecutiveProperty.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.successMessage =
          action.payload?.message || "Property rejected successfully.";

        const updatedProperty = action.payload?.property;

        if (updatedProperty) {
          state.selectedProperty = updatedProperty;

          const index = state.properties.findIndex(
            (property) =>
              Number(property.property_id ?? property.id) ===
              Number(updatedProperty.id ?? updatedProperty.property_id)
          );

          if (index !== -1) {
            state.properties[index] = {
              ...state.properties[index],
              ...updatedProperty,
            };
          }
        }
      })
      .addCase(rejectFieldExecutiveProperty.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError =
          action.payload || "Unable to reject property.";
      });
  },
});

// =====================================================
// EXPORT ACTIONS + REDUCER
// =====================================================

export const {
  clearSelectedVerificationProperty,
  clearVerificationError,
  clearVerificationSuccess,
} = fieldExecutiveVerificationSlice.actions;

export default fieldExecutiveVerificationSlice.reducer;
