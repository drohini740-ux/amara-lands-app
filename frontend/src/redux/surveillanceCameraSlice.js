import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getSurveillanceCameras,
  getSurveillanceCamera,
  addSurveillanceCamera,
  updateSurveillanceCamera,
  deleteSurveillanceCamera,
} from "../services/surveillanceCameraService";

// Get All
export const fetchSurveillanceCameras = createAsyncThunk(
  "surveillance/fetchAll",
  async () => {
    return await getSurveillanceCameras();
  }
);

// Get Single
export const fetchSurveillanceCamera = createAsyncThunk(
  "surveillance/fetchOne",
  async (id) => {
    return await getSurveillanceCamera(id);
  }
);

// Add
export const createSurveillanceCamera = createAsyncThunk(
  "surveillance/create",
  async (cameraData) => {
    return await addSurveillanceCamera(cameraData);
  }
);

// Update
export const editSurveillanceCamera = createAsyncThunk(
  "surveillance/update",
  async ({ id, cameraData }) => {
    return await updateSurveillanceCamera(id, cameraData);
  }
);

// Delete
export const removeSurveillanceCamera = createAsyncThunk(
  "surveillance/delete",
  async (id) => {
    await deleteSurveillanceCamera(id);
    return id;
  }
);

const surveillanceCameraSlice = createSlice({
  name: "surveillanceCameras",

  initialState: {
    cameras: [],
    camera: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchSurveillanceCameras.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchSurveillanceCameras.fulfilled, (state, action) => {
        state.loading = false;
        state.cameras = action.payload.cameras || [];
      })

      .addCase(fetchSurveillanceCameras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchSurveillanceCamera.fulfilled, (state, action) => {
        state.camera = action.payload.camera;
      })

      .addCase(removeSurveillanceCamera.fulfilled, (state, action) => {
        state.cameras = state.cameras.filter(
          (camera) => camera.id !== action.payload
        );
      });
  },
});

export default surveillanceCameraSlice.reducer;