
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// GET MEDIA FOR VISIT
// =====================================================

export const fetchVisitMedia = createAsyncThunk(
  "fieldExecutiveMedia/fetchVisitMedia",
  async (visitId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/field/media/visit/${visitId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to load visit media."
      );
    }
  }
);

// =====================================================
// UPLOAD MEDIA
// =====================================================

export const uploadVisitMedia = createAsyncThunk(
  "fieldExecutiveMedia/uploadVisitMedia",
  async ({ visitId, file, caption }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      if (caption) {
        formData.append("caption", caption);
      }

      // Shared API handles authentication and FormData headers.
      const response = await API.post(
        `/field/media/visit/${visitId}`,
        formData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to upload media."
      );
    }
  }
);

// =====================================================
// DELETE MEDIA
// =====================================================

export const deleteVisitMedia = createAsyncThunk(
  "fieldExecutiveMedia/deleteVisitMedia",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/field/media/${id}`);

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to delete media."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  media: [],
  loading: false,
  uploadLoading: false,
  deleteLoading: false,
  error: null,
  uploadError: null,
  deleteError: null,
};

// =====================================================
// SLICE
// =====================================================

const fieldExecutiveMediaSlice = createSlice({
  name: "fieldExecutiveMedia",
  initialState,

  reducers: {
    clearMediaError: (state) => {
      state.error = null;
      state.uploadError = null;
      state.deleteError = null;
    },

    clearVisitMedia: (state) => {
      state.media = [];
      state.error = null;
      state.uploadError = null;
      state.deleteError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH MEDIA
      .addCase(fetchVisitMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitMedia.fulfilled, (state, action) => {
        state.loading = false;

        const result = action.payload?.data;
        state.media = Array.isArray(result)
          ? result
          : Array.isArray(action.payload?.media)
            ? action.payload.media
            : [];
      })
      .addCase(fetchVisitMedia.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to load visit media.";
      })

      // UPLOAD MEDIA
      .addCase(uploadVisitMedia.pending, (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
      })
      .addCase(uploadVisitMedia.fulfilled, (state, action) => {
        state.uploadLoading = false;

        const uploadedMedia =
          action.payload?.data ?? action.payload?.media;

        if (uploadedMedia) {
          state.media.unshift(uploadedMedia);
        }
      })
      .addCase(uploadVisitMedia.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadError =
          action.payload || "Unable to upload media.";
      })

      // DELETE MEDIA
      .addCase(deleteVisitMedia.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteVisitMedia.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.media = state.media.filter(
          (item) => item.id !== action.payload.id
        );
      })
      .addCase(deleteVisitMedia.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError =
          action.payload || "Unable to delete media.";
      });
  },
});

// =====================================================
// EXPORT ACTIONS AND REDUCER
// =====================================================

export const { clearMediaError, clearVisitMedia } =
  fieldExecutiveMediaSlice.actions;

export default fieldExecutiveMediaSlice.reducer;
