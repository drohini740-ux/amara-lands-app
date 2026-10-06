
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1/field/verification";

// =====================================================
// GET MY VERIFICATION PROPERTIES
// =====================================================

export const fetchFieldExecutiveVerificationProperties =
  createAsyncThunk(
    "fieldExecutiveVerification/fetchProperties",
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

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
            "Unable to fetch verification properties."
        );
      }
    }
  );

// =====================================================
// GET SINGLE PROPERTY
// =====================================================

export const fetchFieldExecutiveVerificationProperty =
  createAsyncThunk(
    "fieldExecutiveVerification/fetchProperty",
    async (id, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

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
            "Unable to fetch property."
        );
      }
    }
  );

// =====================================================
// VERIFY PROPERTY
// =====================================================

export const verifyFieldExecutiveProperty =
  createAsyncThunk(
    "fieldExecutiveVerification/verifyProperty",
    async (id, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.put(
          `${API_URL}/${id}/verify`,
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
            "Unable to verify property."
        );
      }
    }
  );

// =====================================================
// REJECT PROPERTY
// =====================================================

export const rejectFieldExecutiveProperty =
  createAsyncThunk(
    "fieldExecutiveVerification/rejectProperty",
    async (id, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.put(
          `${API_URL}/${id}/reject`,
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
            "Unable to reject property."
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

const fieldExecutiveVerificationSlice =
  createSlice({
    name: "fieldExecutiveVerification",

    initialState,

    reducers: {
      clearSelectedVerificationProperty: (
        state
      ) => {
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
      // =================================================
      // FETCH PROPERTIES
      // =================================================

      builder
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

            state.properties =
              action.payload?.properties ||
              action.payload?.data ||
              [];
          }
        )

        .addCase(
          fetchFieldExecutiveVerificationProperties.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Unable to fetch verification properties.";
          }
        );

      // =================================================
      // FETCH SINGLE PROPERTY
      // =================================================

      builder
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
              action.payload?.property ||
              action.payload?.data ||
              null;
          }
        )

        .addCase(
          fetchFieldExecutiveVerificationProperty.rejected,
          (state, action) => {
            state.detailsLoading = false;

            state.detailsError =
              action.payload ||
              "Unable to fetch property.";
          }
        );

      // =================================================
      // VERIFY PROPERTY
      // =================================================

      builder
        .addCase(
          verifyFieldExecutiveProperty.pending,
          (state) => {
            state.actionLoading = true;
            state.actionError = null;
            state.successMessage = null;
          }
        )

        .addCase(
          verifyFieldExecutiveProperty.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            state.successMessage =
              action.payload?.message ||
              "Property verified successfully.";

            const updatedProperty =
              action.payload?.property;

            if (updatedProperty) {
              state.selectedProperty =
                updatedProperty;

              const index =
                state.properties.findIndex(
                  (property) =>
                    Number(
                      property.property_id
                    ) ===
                    Number(
                      updatedProperty.id
                    )
                );

              if (index !== -1) {
                state.properties[index] = {
                  ...state.properties[index],
                  verification_status:
                    updatedProperty.verification_status,
                  verified_by:
                    updatedProperty.verified_by,
                };
              }
            }
          }
        )

        .addCase(
          verifyFieldExecutiveProperty.rejected,
          (state, action) => {
            state.actionLoading = false;

            state.actionError =
              action.payload ||
              "Unable to verify property.";
          }
        );

      // =================================================
      // REJECT PROPERTY
      // =================================================

      builder
        .addCase(
          rejectFieldExecutiveProperty.pending,
          (state) => {
            state.actionLoading = true;
            state.actionError = null;
            state.successMessage = null;
          }
        )

        .addCase(
          rejectFieldExecutiveProperty.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            state.successMessage =
              action.payload?.message ||
              "Property rejected successfully.";

            const updatedProperty =
              action.payload?.property;

            if (updatedProperty) {
              state.selectedProperty =
                updatedProperty;

              const index =
                state.properties.findIndex(
                  (property) =>
                    Number(
                      property.property_id
                    ) ===
                    Number(
                      updatedProperty.id
                    )
                );

              if (index !== -1) {
                state.properties[index] = {
                  ...state.properties[index],
                  verification_status:
                    updatedProperty.verification_status,
                  verified_by:
                    updatedProperty.verified_by,
                };
              }
            }
          }
        )

        .addCase(
          rejectFieldExecutiveProperty.rejected,
          (state, action) => {
            state.actionLoading = false;

            state.actionError =
              action.payload ||
              "Unable to reject property.";
          }
        );
    },
  });

// =====================================================
// EXPORT REDUCER + ACTIONS
// =====================================================

export const {
  clearSelectedVerificationProperty,
  clearVerificationError,
  clearVerificationSuccess,
} =
  fieldExecutiveVerificationSlice.actions;

export default fieldExecutiveVerificationSlice.reducer;

