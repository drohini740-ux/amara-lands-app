
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  "http://localhost:4000/api/v1/field/documents";

// =====================================================
// GET MY DOCUMENTS
// =====================================================

export const fetchFieldExecutiveDocuments =
  createAsyncThunk(
    "fieldExecutiveDocument/fetchDocuments",
    async (_, { rejectWithValue }) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.get(
          API_URL,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to fetch documents."
        );
      }
    }
  );

// =====================================================
// GET DOCUMENT BY ID
// =====================================================

export const fetchFieldExecutiveDocumentById =
  createAsyncThunk(
    "fieldExecutiveDocument/fetchDocumentById",
    async (id, { rejectWithValue }) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to fetch document."
        );
      }
    }
  );

// =====================================================
// UPLOAD DOCUMENT
// =====================================================

export const uploadFieldExecutiveDocument =
  createAsyncThunk(
    "fieldExecutiveDocument/uploadDocument",
    async (formData, { rejectWithValue }) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.post(
          API_URL,
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to upload document."
        );
      }
    }
  );

// =====================================================
// DELETE DOCUMENT
// =====================================================

export const deleteFieldExecutiveDocument =
  createAsyncThunk(
    "fieldExecutiveDocument/deleteDocument",
    async (id, { rejectWithValue }) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.delete(
          `${API_URL}/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to delete document."
        );
      }
    }
  );

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  documents: [],
  selectedDocument: null,

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

const fieldExecutiveDocumentSlice =
  createSlice({
    name:
      "fieldExecutiveDocument",

    initialState,

    reducers: {
      clearSelectedDocument: (
        state
      ) => {
        state.selectedDocument =
          null;
      },

      clearDocumentError: (
        state
      ) => {
        state.error = null;
        state.detailsError = null;
        state.actionError = null;
      },

      clearDocumentSuccess: (
        state
      ) => {
        state.successMessage =
          null;
      },
    },

    extraReducers: (builder) => {
      // =================================================
      // FETCH DOCUMENTS
      // =================================================

      builder
        .addCase(
          fetchFieldExecutiveDocuments.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchFieldExecutiveDocuments.fulfilled,
          (state, action) => {
            state.loading = false;

            state.documents =
              action.payload?.documents ||
              action.payload?.data ||
              [];
          }
        )

        .addCase(
          fetchFieldExecutiveDocuments.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Unable to fetch documents.";
          }
        );

      // =================================================
      // FETCH DOCUMENT BY ID
      // =================================================

      builder
        .addCase(
          fetchFieldExecutiveDocumentById.pending,
          (state) => {
            state.detailsLoading = true;
            state.detailsError = null;
          }
        )

        .addCase(
          fetchFieldExecutiveDocumentById.fulfilled,
          (state, action) => {
            state.detailsLoading = false;

            state.selectedDocument =
              action.payload?.document ||
              action.payload?.data ||
              null;
          }
        )

        .addCase(
          fetchFieldExecutiveDocumentById.rejected,
          (state, action) => {
            state.detailsLoading = false;

            state.detailsError =
              action.payload ||
              "Unable to fetch document.";
          }
        );

      // =================================================
      // UPLOAD DOCUMENT
      // =================================================

      builder
        .addCase(
          uploadFieldExecutiveDocument.pending,
          (state) => {
            state.actionLoading = true;
            state.actionError = null;
            state.successMessage = null;
          }
        )

        .addCase(
          uploadFieldExecutiveDocument.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            state.successMessage =
              action.payload?.message ||
              "Document uploaded successfully.";

            if (
              action.payload?.document
            ) {
              state.documents.unshift(
                action.payload.document
              );
            }
          }
        )

        .addCase(
          uploadFieldExecutiveDocument.rejected,
          (state, action) => {
            state.actionLoading = false;

            state.actionError =
              action.payload ||
              "Unable to upload document.";
          }
        );

      // =================================================
      // DELETE DOCUMENT
      // =================================================

      builder
        .addCase(
          deleteFieldExecutiveDocument.pending,
          (state) => {
            state.actionLoading = true;
            state.actionError = null;
            state.successMessage = null;
          }
        )

        .addCase(
          deleteFieldExecutiveDocument.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            state.successMessage =
              action.payload?.message ||
              "Document deleted successfully.";

            const deletedId =
              action.payload?.document?.id;

            if (deletedId) {
              state.documents =
                state.documents.filter(
                  (document) =>
                    document.id !==
                    deletedId
                );
            }
          }
        )

        .addCase(
          deleteFieldExecutiveDocument.rejected,
          (state, action) => {
            state.actionLoading = false;

            state.actionError =
              action.payload ||
              "Unable to delete document.";
          }
        );
    },
  });

export const {
  clearSelectedDocument,
  clearDocumentError,
  clearDocumentSuccess,
} =
  fieldExecutiveDocumentSlice.actions;

export default
  fieldExecutiveDocumentSlice.reducer;

