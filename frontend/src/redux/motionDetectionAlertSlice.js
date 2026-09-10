import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getMotionDetectionAlerts,
  getMotionDetectionAlert,
  addMotionDetectionAlert,
  updateMotionDetectionAlert,
  deleteMotionDetectionAlert,
  acknowledgeMotionDetectionAlert,
  resolveMotionDetectionAlert,
} from "../services/admin/motionDetectionAlertService";

// ======================================================
// FETCH ALL ALERTS
// ======================================================
export const fetchMotionDetectionAlerts = createAsyncThunk(
  "motionDetectionAlerts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getMotionDetectionAlerts();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch motion detection alerts"
      );
    }
  }
);

// ======================================================
// FETCH SINGLE ALERT
// ======================================================
export const fetchMotionDetectionAlert = createAsyncThunk(
  "motionDetectionAlerts/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      return await getMotionDetectionAlert(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch motion detection alert"
      );
    }
  }
);

// ======================================================
// CREATE ALERT
// ======================================================
export const createMotionDetectionAlert = createAsyncThunk(
  "motionDetectionAlerts/create",
  async (alertData, { rejectWithValue }) => {
    try {
      return await addMotionDetectionAlert(alertData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create motion detection alert"
      );
    }
  }
);

// ======================================================
// UPDATE ALERT
// ======================================================
export const editMotionDetectionAlert = createAsyncThunk(
  "motionDetectionAlerts/update",
  async ({ id, alertData }, { rejectWithValue }) => {
    try {
      return await updateMotionDetectionAlert(id, alertData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update motion detection alert"
      );
    }
  }
);

// ======================================================
// DELETE ALERT
// ======================================================
export const removeMotionDetectionAlert = createAsyncThunk(
  "motionDetectionAlerts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteMotionDetectionAlert(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete motion detection alert"
      );
    }
  }
);

// ======================================================
// ACKNOWLEDGE ALERT
// ======================================================
export const acknowledgeMotionAlert = createAsyncThunk(
  "motionDetectionAlerts/acknowledge",
  async (id, { rejectWithValue }) => {
    try {
      return await acknowledgeMotionDetectionAlert(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to acknowledge motion detection alert"
      );
    }
  }
);

// ======================================================
// RESOLVE ALERT
// ======================================================
export const resolveMotionAlert = createAsyncThunk(
  "motionDetectionAlerts/resolve",
  async (id, { rejectWithValue }) => {
    try {
      return await resolveMotionDetectionAlert(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to resolve motion detection alert"
      );
    }
  }
);

// ======================================================
// SLICE
// ======================================================
const motionDetectionAlertSlice = createSlice({
  name: "motionDetectionAlerts",

  initialState: {
    alerts: [],
    alert: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearMotionDetectionAlert: (state) => {
      state.alert = null;
    },

    clearMotionDetectionError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==================================================
      // FETCH ALL
      // ==================================================
      .addCase(
        fetchMotionDetectionAlerts.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchMotionDetectionAlerts.fulfilled,
        (state, action) => {
          state.loading = false;
          state.alerts = action.payload.alerts || [];
        }
      )

      .addCase(
        fetchMotionDetectionAlerts.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ==================================================
      // FETCH SINGLE
      // ==================================================
      .addCase(
        fetchMotionDetectionAlert.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchMotionDetectionAlert.fulfilled,
        (state, action) => {
          state.loading = false;
          state.alert = action.payload.alert;
        }
      )

      .addCase(
        fetchMotionDetectionAlert.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ==================================================
      // CREATE
      // ==================================================
      .addCase(
        createMotionDetectionAlert.fulfilled,
        (state, action) => {
          if (action.payload.alert) {
            state.alerts.unshift(action.payload.alert);
          }
        }
      )

      // ==================================================
      // UPDATE
      // ==================================================
      .addCase(
        editMotionDetectionAlert.fulfilled,
        (state, action) => {
          const updatedAlert = action.payload.alert;

          if (!updatedAlert) return;

          const index = state.alerts.findIndex(
            (item) => item.id === updatedAlert.id
          );

          if (index !== -1) {
            state.alerts[index] = {
              ...state.alerts[index],
              ...updatedAlert,
            };
          }

          state.alert = {
            ...state.alert,
            ...updatedAlert,
          };
        }
      )

      // ==================================================
      // DELETE
      // ==================================================
      .addCase(
        removeMotionDetectionAlert.fulfilled,
        (state, action) => {
          state.alerts = state.alerts.filter(
            (item) => item.id !== action.payload
          );

          if (state.alert?.id === action.payload) {
            state.alert = null;
          }
        }
      )

      // ==================================================
      // ACKNOWLEDGE
      // ==================================================
      .addCase(
        acknowledgeMotionAlert.fulfilled,
        (state, action) => {
          const updatedAlert = action.payload.alert;

          if (!updatedAlert) return;

          const index = state.alerts.findIndex(
            (item) => item.id === updatedAlert.id
          );

          if (index !== -1) {
            state.alerts[index] = {
              ...state.alerts[index],
              ...updatedAlert,
            };
          }

          state.alert = {
            ...state.alert,
            ...updatedAlert,
          };
        }
      )

      // ==================================================
      // RESOLVE
      // ==================================================
      .addCase(
        resolveMotionAlert.fulfilled,
        (state, action) => {
          const updatedAlert = action.payload.alert;

          if (!updatedAlert) return;

          const index = state.alerts.findIndex(
            (item) => item.id === updatedAlert.id
          );

          if (index !== -1) {
            state.alerts[index] = {
              ...state.alerts[index],
              ...updatedAlert,
            };
          }

          state.alert = {
            ...state.alert,
            ...updatedAlert,
          };
        }
      )

      // ==================================================
      // STATUS ERRORS
      // ==================================================
      .addCase(
        acknowledgeMotionAlert.rejected,
        (state, action) => {
          state.error = action.payload;
        }
      )

      .addCase(
        resolveMotionAlert.rejected,
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearMotionDetectionAlert,
  clearMotionDetectionError,
} = motionDetectionAlertSlice.actions;

export default motionDetectionAlertSlice.reducer;