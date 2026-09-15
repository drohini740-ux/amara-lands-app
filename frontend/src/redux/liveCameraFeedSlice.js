import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  fetchLiveCameras,
  fetchLiveCamera,
} from "../services/admin/liveCameraFeedService";

// ======================================================
// GET ALL CAMERAS
// ======================================================
export const getLiveCameras = createAsyncThunk(
  "liveCameraFeed/getLiveCameras",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchLiveCameras();

      return response.cameras || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch live cameras"
      );
    }
  }
);

// ======================================================
// GET SINGLE CAMERA
// ======================================================
export const getLiveCamera = createAsyncThunk(
  "liveCameraFeed/getLiveCamera",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchLiveCamera(id);

      return response.camera;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch camera"
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================
const initialState = {
  cameras: [],
  selectedCamera: null,
  loading: false,
  error: null,
};

// ======================================================
// SLICE
// ======================================================
const liveCameraFeedSlice = createSlice({
  name: "liveCameraFeed",

  initialState,

  reducers: {
    clearSelectedCamera: (state) => {
      state.selectedCamera = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ==================================================
    // ALL CAMERAS
    // ==================================================
    builder
      .addCase(getLiveCameras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getLiveCameras.fulfilled, (state, action) => {
        state.loading = false;
        state.cameras = action.payload;
      })

      .addCase(getLiveCameras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ==================================================
    // SINGLE CAMERA
    // ==================================================
    builder
      .addCase(getLiveCamera.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getLiveCamera.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCamera = action.payload;
      })

      .addCase(getLiveCamera.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSelectedCamera,
  clearError,
} = liveCameraFeedSlice.actions;

export default liveCameraFeedSlice.reducer;