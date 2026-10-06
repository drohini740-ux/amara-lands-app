
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// GET MEDIA FOR VISIT
// =====================================================

export const fetchVisitMedia = createAsyncThunk(
  "fieldExecutiveMedia/fetchVisitMedia",
  async (visitId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/field/media/visit/${visitId}`,
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
          "Unable to load visit media."
      );
    }
  }
);

// =====================================================
// UPLOAD MEDIA
// =====================================================

export const uploadVisitMedia = createAsyncThunk(
  "fieldExecutiveMedia/uploadVisitMedia",
  async (
    { visitId, file, caption },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("file", file);

      if (caption) {
        formData.append("caption", caption);
      }

      const response = await axios.post(
        `${API_URL}/field/media/visit/${visitId}`,
        formData,
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
          "Unable to upload media."
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
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${API_URL}/field/media/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to delete media."
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
    // ===================================================
    // FETCH MEDIA
    // ===================================================

    builder
      .addCase(
        fetchVisitMedia.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchVisitMedia.fulfilled,
        (state, action) => {
          state.loading = false;

          state.media =
            action.payload?.data || [];
        }
      )

      .addCase(
        fetchVisitMedia.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Unable to load visit media.";
        }
      );

    // ===================================================
    // UPLOAD MEDIA
    // ===================================================

    builder
      .addCase(
        uploadVisitMedia.pending,
        (state) => {
          state.uploadLoading = true;
          state.uploadError = null;
        }
      )

      .addCase(
        uploadVisitMedia.fulfilled,
        (state, action) => {
          state.uploadLoading = false;

          const uploadedMedia =
            action.payload?.data;

          if (uploadedMedia) {
            state.media.unshift(
              uploadedMedia
            );
          }
        }
      )

      .addCase(
        uploadVisitMedia.rejected,
        (state, action) => {
          state.uploadLoading = false;

          state.uploadError =
            action.payload ||
            "Unable to upload media.";
        }
      );

    // ===================================================
    // DELETE MEDIA
    // ===================================================

    builder
      .addCase(
        deleteVisitMedia.pending,
        (state) => {
          state.deleteLoading = true;
          state.deleteError = null;
        }
      )

      .addCase(
        deleteVisitMedia.fulfilled,
        (state, action) => {
          state.deleteLoading = false;

          state.media =
            state.media.filter(
              (item) =>
                item.id !== action.payload.id
            );
        }
      )

      .addCase(
        deleteVisitMedia.rejected,
        (state, action) => {
          state.deleteLoading = false;

          state.deleteError =
            action.payload ||
            "Unable to delete media.";
        }
      );
  },
});

// =====================================================
// EXPORT ACTIONS
// =====================================================

export const {
  clearMediaError,
  clearVisitMedia,
} =
  fieldExecutiveMediaSlice.actions;

// =====================================================
// EXPORT REDUCER
// =====================================================

export default fieldExecutiveMediaSlice.reducer;
