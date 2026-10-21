
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

const API_URL = "/field/documents";

// =====================================================
// GET MY DOCUMENTS
// =====================================================

export const fetchFieldExecutiveDocuments = createAsyncThunk(
  "fieldExecutiveDocument/fetchDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(API_URL);
      const result = response.data;

      if (result?.success === false) {
        return rejectWithValue(
          result.message || "Unable to fetch documents."
        );
      }

      return result?.data ?? result;
    } catch (error) {
      console.error(
        "Fetch Field Executive Documents Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch documents."
      );
    }
  }
);

// =====================================================
// GET DOCUMENT BY ID
// =====================================================

export const fetchFieldExecutiveDocumentById = createAsyncThunk(
  "fieldExecutiveDocument/fetchDocumentById",
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Document ID is required.");
      }

      const response = await API.get(
        `${API_URL}/${encodeURIComponent(id)}`
      );
      const result = response.data;

      if (result?.success === false) {
        return rejectWithValue(
          result.message || "Unable to fetch document."
        );
      }

      return result?.data ?? result;
    } catch (error) {
      console.error(
        "Fetch Document Details Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch document."
      );
    }
  }
);

// =====================================================
// UPLOAD DOCUMENT
// =====================================================

export const uploadFieldExecutiveDocument = createAsyncThunk(
  "fieldExecutiveDocument/uploadDocument",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post(API_URL, formData);
      const result = response.data;

      if (result?.success === false) {
        return rejectWithValue(
          result.message || "Unable to upload document."
        );
      }

      return result?.data
        ? { ...result.data, message: result.message }
        : result;
    } catch (error) {
      console.error(
        "Upload Field Executive Document Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message || "Unable to upload document."
      );
    }
  }
);

// =====================================================
// DELETE DOCUMENT
// =====================================================

export const deleteFieldExecutiveDocument = createAsyncThunk(
  "fieldExecutiveDocument/deleteDocument",
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Document ID is required.");
      }

      const response = await API.delete(
        `${API_URL}/${encodeURIComponent(id)}`
      );
      const result = response.data;

      if (result?.success === false) {
        return rejectWithValue(
          result.message || "Unable to delete document."
        );
      }

      return {
        ...(result?.data || {}),
        message: result?.message || result?.data?.message,
        deletedId: id,
      };
    } catch (error) {
      console.error(
        "Delete Field Executive Document Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message || "Unable to delete document."
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
// RESPONSE HELPERS
// =====================================================

const getDocuments = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.documents)) return payload.documents;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const getDocument = (payload) => {
  if (payload?.document) return payload.document;
  if (payload?.data?.document) return payload.data.document;

  // Avoid treating a message-only response as a document.
  if (payload?.id != null) return payload;

  return null;
};

// =====================================================
// SLICE
// =====================================================

const fieldExecutiveDocumentSlice = createSlice({
  name: "fieldExecutiveDocument",
  initialState,

  reducers: {
    clearSelectedDocument: (state) => {
      state.selectedDocument = null;
      state.detailsError = null;
    },

    clearDocumentError: (state) => {
      state.error = null;
      state.detailsError = null;
      state.actionError = null;
    },

    clearDocumentSuccess: (state) => {
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH DOCUMENTS
      .addCase(fetchFieldExecutiveDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFieldExecutiveDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.documents = getDocuments(action.payload);
      })
      .addCase(fetchFieldExecutiveDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to fetch documents.";
      })

      // FETCH DOCUMENT BY ID
      .addCase(fetchFieldExecutiveDocumentById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(
        fetchFieldExecutiveDocumentById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.detailsError = null;
          state.selectedDocument = getDocument(action.payload);
        }
      )
      .addCase(
        fetchFieldExecutiveDocumentById.rejected,
        (state, action) => {
          state.detailsLoading = false;
          state.detailsError =
            action.payload || "Unable to fetch document.";
        }
      )

      // UPLOAD DOCUMENT
      .addCase(uploadFieldExecutiveDocument.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(
        uploadFieldExecutiveDocument.fulfilled,
        (state, action) => {
          state.actionLoading = false;
          state.actionError = null;
          state.successMessage =
            action.payload?.message ||
            "Document uploaded successfully.";

          const document = getDocument(action.payload);

          if (document) {
            const exists = state.documents.some(
              (item) => String(item.id) === String(document.id)
            );

            if (!exists) {
              state.documents.unshift(document);
            }
          }
        }
      )
      .addCase(uploadFieldExecutiveDocument.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError =
          action.payload || "Unable to upload document.";
      })

      // DELETE DOCUMENT
      .addCase(deleteFieldExecutiveDocument.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(
        deleteFieldExecutiveDocument.fulfilled,
        (state, action) => {
          state.actionLoading = false;
          state.actionError = null;
          state.successMessage =
            action.payload?.message ||
            "Document deleted successfully.";

          const deletedId = action.payload?.deletedId;

          state.documents = state.documents.filter(
            (document) => String(document.id) !== String(deletedId)
          );

          if (
            state.selectedDocument &&
            String(state.selectedDocument.id) === String(deletedId)
          ) {
            state.selectedDocument = null;
          }
        }
      )
      .addCase(deleteFieldExecutiveDocument.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError =
          action.payload || "Unable to delete document.";
      });
  },
});

// =====================================================
// EXPORTS
// =====================================================

export const {
  clearSelectedDocument,
  clearDocumentError,
  clearDocumentSuccess,
} = fieldExecutiveDocumentSlice.actions;

export default fieldExecutiveDocumentSlice.reducer;
