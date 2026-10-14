
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getMotionDetectionAlerts,
  getMotionDetectionAlertById,
  updateMotionDetectionAlert,
  createMotionDetectionAlert,
} from "../services/motionDetectionAlertService";

// Fetch all motion alerts.
export const fetchMotionDetectionAlerts = createAsyncThunk(
  "motionDetectionAlerts/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await getMotionDetectionAlerts(filters);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch motion alerts"
      );
    }
  }
);

// Fetch one alert by ID.
export const fetchMotionDetectionAlertById = createAsyncThunk(
  "motionDetectionAlerts/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await getMotionDetectionAlertById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch alert details"
      );
    }
  }
);

// Create a new motion alert.
export const createMotionDetectionAlertRecord = createAsyncThunk(
  "motionDetectionAlerts/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await createMotionDetectionAlert(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create motion detection alert"
      );
    }
  }
);

// Update an alert's status or remarks.
export const updateMotionDetectionAlertById = createAsyncThunk(
  "motionDetectionAlerts/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      return await updateMotionDetectionAlert(id, payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update motion alert"
      );
    }
  }
);

const motionDetectionAlertSlice = createSlice({
  name: "motionDetectionAlerts",

  initialState: {
    alerts: [],
    selectedAlert: null,
    loading: false,
    creating: false,
    updating: false,
    error: null,
    message: null,
  },

  reducers: {
    clearMotionDetectionAlertError: (state) => {
      state.error = null;
    },

    clearSelectedMotionDetectionAlert: (state) => {
      state.selectedAlert = null;
    },

    removeMotionDetectionAlert: (state, action) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload
      );

      if (state.selectedAlert?.id === action.payload) {
        state.selectedAlert = null;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch all alerts.
      .addCase(fetchMotionDetectionAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMotionDetectionAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload?.data || [];
      })
      .addCase(fetchMotionDetectionAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Failed to fetch alerts";
      })

      // Fetch alert details.
      .addCase(fetchMotionDetectionAlertById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMotionDetectionAlertById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAlert = action.payload?.data || null;
      })
      .addCase(fetchMotionDetectionAlertById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error.message ||
          "Failed to fetch alert details";
      })

      // Create a new alert.
      .addCase(createMotionDetectionAlertRecord.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.message = null;
      })
      .addCase(createMotionDetectionAlertRecord.fulfilled, (state, action) => {
        state.creating = false;

        const newAlert = action.payload?.data;

        if (newAlert) {
          // Avoid inserting the same alert twice.
          const alreadyExists = state.alerts.some(
            (alert) => alert.id === newAlert.id
          );

          if (!alreadyExists) {
            state.alerts.unshift(newAlert);
          }
        }

        state.message =
          action.payload?.message ||
          "Motion detection alert created successfully.";
      })
      .addCase(createMotionDetectionAlertRecord.rejected, (state, action) => {
        state.creating = false;
        state.error =
          action.payload ||
          action.error.message ||
          "Failed to create motion detection alert";
      })

      // Update an alert.
      .addCase(updateMotionDetectionAlertById.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateMotionDetectionAlertById.fulfilled, (state, action) => {
        state.updating = false;

        const updatedAlert = action.payload?.data;

        if (!updatedAlert) return;

        state.alerts = state.alerts.map((alert) =>
          alert.id === updatedAlert.id ? updatedAlert : alert
        );

        if (state.selectedAlert?.id === updatedAlert.id) {
          state.selectedAlert = updatedAlert;
        }

        state.message =
          action.payload?.message ||
          "Motion alert updated successfully.";
      })
      .addCase(updateMotionDetectionAlertById.rejected, (state, action) => {
        state.updating = false;
        state.error =
          action.payload ||
          action.error.message ||
          "Failed to update motion alert";
      });
  },
});

export const {
  clearMotionDetectionAlertError,
  clearSelectedMotionDetectionAlert,
  removeMotionDetectionAlert,
} = motionDetectionAlertSlice.actions;

export default motionDetectionAlertSlice.reducer;
