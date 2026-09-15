import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getIntrusionNotifications,
  getIntrusionNotification,
  createIntrusionNotification,
  updateIntrusionNotification,
  acknowledgeIntrusionNotification,
  resolveIntrusionNotification,
  deleteIntrusionNotification,
} from "../services/admin/intrusionNotificationService";

// ======================================================
// GET ALL
// ======================================================
export const fetchIntrusionNotifications =
  createAsyncThunk(
    "intrusionNotifications/fetchAll",
    async (_, { rejectWithValue }) => {
      try {
        const data =
          await getIntrusionNotifications();

        return data.notifications || [];
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch intrusion notifications"
        );
      }
    }
  );

// ======================================================
// GET SINGLE
// ======================================================
export const fetchIntrusionNotification =
  createAsyncThunk(
    "intrusionNotifications/fetchOne",
    async (id, { rejectWithValue }) => {
      try {
        const data =
          await getIntrusionNotification(id);

        return data.notification;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch intrusion notification"
        );
      }
    }
  );

// ======================================================
// CREATE
// ======================================================
export const addIntrusionNotification =
  createAsyncThunk(
    "intrusionNotifications/create",
    async (notification, { rejectWithValue }) => {
      try {
        const data =
          await createIntrusionNotification(
            notification
          );

        return data.notification;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to create intrusion notification"
        );
      }
    }
  );

// ======================================================
// UPDATE
// ======================================================
export const editIntrusionNotification =
  createAsyncThunk(
    "intrusionNotifications/update",
    async (
      { id, data: notification },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await updateIntrusionNotification(
            id,
            notification
          );

        return response.notification;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update intrusion notification"
        );
      }
    }
  );

// ======================================================
// ACKNOWLEDGE
// ======================================================
export const acknowledgeNotification =
  createAsyncThunk(
    "intrusionNotifications/acknowledge",
    async (id, { rejectWithValue }) => {
      try {
        const data =
          await acknowledgeIntrusionNotification(id);

        return data.notification;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to acknowledge notification"
        );
      }
    }
  );

// ======================================================
// RESOLVE
// ======================================================
export const resolveNotification =
  createAsyncThunk(
    "intrusionNotifications/resolve",
    async (id, { rejectWithValue }) => {
      try {
        const data =
          await resolveIntrusionNotification(id);

        return data.notification;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to resolve notification"
        );
      }
    }
  );

// ======================================================
// DELETE
// ======================================================
export const removeIntrusionNotification =
  createAsyncThunk(
    "intrusionNotifications/delete",
    async (id, { rejectWithValue }) => {
      try {
        await deleteIntrusionNotification(id);

        return id;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to delete notification"
        );
      }
    }
  );

// ======================================================
// SLICE
// ======================================================
const intrusionNotificationSlice =
  createSlice({
    name: "intrusionNotifications",

    initialState: {
      notifications: [],
      selectedNotification: null,
      loading: false,
      error: null,
    },

    reducers: {
      clearSelectedNotification: (state) => {
        state.selectedNotification = null;
      },

      clearIntrusionNotificationError: (state) => {
        state.error = null;
      },
    },

    extraReducers: (builder) => {
      builder

        // ==========================================
        // GET ALL
        // ==========================================
        .addCase(
          fetchIntrusionNotifications.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchIntrusionNotifications.fulfilled,
          (state, action) => {
            state.loading = false;
            state.notifications = action.payload;
          }
        )

        .addCase(
          fetchIntrusionNotifications.rejected,
          (state, action) => {
            state.loading = false;
            state.error = action.payload;
          }
        )

        // ==========================================
        // GET SINGLE
        // ==========================================
        .addCase(
          fetchIntrusionNotification.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchIntrusionNotification.fulfilled,
          (state, action) => {
            state.loading = false;
            state.selectedNotification =
              action.payload;
          }
        )

        .addCase(
          fetchIntrusionNotification.rejected,
          (state, action) => {
            state.loading = false;
            state.error = action.payload;
          }
        )

        // ==========================================
        // CREATE
        // ==========================================
        .addCase(
          addIntrusionNotification.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          addIntrusionNotification.fulfilled,
          (state, action) => {
            state.loading = false;
            state.notifications.unshift(
              action.payload
            );
          }
        )

        .addCase(
          addIntrusionNotification.rejected,
          (state, action) => {
            state.loading = false;
            state.error = action.payload;
          }
        )

        // ==========================================
        // UPDATE
        // ==========================================
        .addCase(
          editIntrusionNotification.fulfilled,
          (state, action) => {
            const index =
              state.notifications.findIndex(
                (item) =>
                  item.id === action.payload.id
              );

            if (index !== -1) {
              state.notifications[index] =
                action.payload;
            }

            state.selectedNotification =
              action.payload;
          }
        )

        // ==========================================
        // ACKNOWLEDGE
        // ==========================================
        .addCase(
          acknowledgeNotification.fulfilled,
          (state, action) => {
            const index =
              state.notifications.findIndex(
                (item) =>
                  item.id === action.payload.id
              );

            if (index !== -1) {
              state.notifications[index] =
                action.payload;
            }

            if (
              state.selectedNotification?.id ===
              action.payload.id
            ) {
              state.selectedNotification =
                action.payload;
            }
          }
        )

        // ==========================================
        // RESOLVE
        // ==========================================
        .addCase(
          resolveNotification.fulfilled,
          (state, action) => {
            const index =
              state.notifications.findIndex(
                (item) =>
                  item.id === action.payload.id
              );

            if (index !== -1) {
              state.notifications[index] =
                action.payload;
            }

            if (
              state.selectedNotification?.id ===
              action.payload.id
            ) {
              state.selectedNotification =
                action.payload;
            }
          }
        )

        // ==========================================
        // DELETE
        // ==========================================
        .addCase(
          removeIntrusionNotification.fulfilled,
          (state, action) => {
            state.notifications =
              state.notifications.filter(
                (item) => item.id !== action.payload
              );

            if (
              state.selectedNotification?.id ===
              action.payload
            ) {
              state.selectedNotification = null;
            }
          }
        );
    },
  });

export const {
  clearSelectedNotification,
  clearIntrusionNotificationError,
} = intrusionNotificationSlice.actions;

export default intrusionNotificationSlice.reducer;