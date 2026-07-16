import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as documentService from "../services/propertyDocumentService";

// Fetch Documents
export const fetchDocuments = createAsyncThunk(
  "documents/fetch",
  async (propertyId) => {
    return await documentService.getDocuments(propertyId);
  }
);

// Upload Document
export const createDocument = createAsyncThunk(
  "documents/upload",
  async ({ propertyId, formData }) => {
    return await documentService.uploadDocument(propertyId, formData);
  }
);

// Delete Document
export const removeDocument = createAsyncThunk(
  "documents/delete",
  async (id) => {
    await documentService.deleteDocument(id);
    return id;
  }
);


const propertyDocumentSlice = createSlice({
  name: "documents",

  initialState: {
    documents: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.documents;
      })

      .addCase(fetchDocuments.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createDocument.fulfilled, (state, action) => {
        state.documents.push(action.payload.document);
      })

      .addCase(removeDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(
          (doc) => doc.id !== action.payload
        );
      });
  },
});

export default propertyDocumentSlice.reducer;