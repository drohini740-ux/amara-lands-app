
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// FETCH MY NOTIFICATIONS
// =====================================================

export const fetchFieldExecutiveNotifications = createAsyncThunk(
  "fieldExecutiveNotification/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/field/notifications");
      return response.data.notifications || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch notifications."
      );
    }
  }
);

// =====================================================
// CREATE NOTIFICATION
// =====================================================

export const createFieldExecutiveNotification = createAsyncThunk(
  "fieldExecutiveNotification/createNotification",
  async ({ title, message, notification_type }, { rejectWithValue }) => {
    try {
      const response = await API.post("/field/notifications", {
        title,
        message,
        notification_type,
      });

      return response.data.notification;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to create notification."
      );
    }
  }
);

// =====================================================
// FETCH NOTIFICATION BY ID
// =====================================================

export const fetchFieldExecutiveNotificationById = createAsyncThunk(
  "fieldExecutiveNotification/fetchNotificationById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/field/notifications/${id}`);
      return response.data.notification;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch notification."
      );
    }
  }
);

// =====================================================
// UPDATE READ STATUS
// =====================================================

export const updateFieldExecutiveNotificationReadStatus = createAsyncThunk(
  "fieldExecutiveNotification/updateReadStatus",
  async ({ id, is_read }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/field/notifications/${id}/read`, {
        is_read,
      });

      return response.data.notification;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to update notification."
      );
    }
  }
);

// =====================================================
// DELETE NOTIFICATION
// =====================================================

export const deleteFieldExecutiveNotification = createAsyncThunk(
  "fieldExecutiveNotification/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/field/notifications/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to delete notification."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  notifications: [],
  selectedNotification: null,
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

const fieldExecutiveNotificationSlice = createSlice({
  name: "fieldExecutiveNotification",
  initialState,

  reducers: {
    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
      state.detailsError = null;
    },

    clearNotificationError: (state) => {
      state.error = null;
      state.detailsError = null;
      state.actionError = null;
    },

    clearNotificationSuccess: (state) => {
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH NOTIFICATIONS
      .addCase(fetchFieldExecutiveNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFieldExecutiveNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchFieldExecutiveNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch notifications.";
      })

      // CREATE NOTIFICATION
      .addCase(createFieldExecutiveNotification.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(createFieldExecutiveNotification.fulfilled, (state, action) => {
        state.actionLoading = false;

        if (action.payload) {
          state.notifications.unshift(action.payload);
        }

        state.successMessage = "Notification created successfully.";
      })
      .addCase(createFieldExecutiveNotification.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || "Unable to create notification.";
      })

      // FETCH NOTIFICATION BY ID
      .addCase(fetchFieldExecutiveNotificationById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(
        fetchFieldExecutiveNotificationById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.selectedNotification = action.payload;
        }
      )
      .addCase(
        fetchFieldExecutiveNotificationById.rejected,
        (state, action) => {
          state.detailsLoading = false;
          state.detailsError =
            action.payload || "Unable to fetch notification.";
        }
      )

      // UPDATE READ STATUS
      .addCase(updateFieldExecutiveNotificationReadStatus.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(
        updateFieldExecutiveNotificationReadStatus.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const updatedNotification = action.payload;

          if (updatedNotification) {
            state.notifications = state.notifications.map((notification) =>
              notification.id === updatedNotification.id
                ? updatedNotification
                : notification
            );

            if (
              state.selectedNotification?.id === updatedNotification.id
            ) {
              state.selectedNotification = updatedNotification;
            }

            state.successMessage = updatedNotification.is_read
              ? "Notification marked as read."
              : "Notification marked as unread.";
          }
        }
      )
      .addCase(
        updateFieldExecutiveNotificationReadStatus.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.actionError =
            action.payload || "Unable to update notification.";
        }
      )

      // DELETE NOTIFICATION
      .addCase(deleteFieldExecutiveNotification.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(deleteFieldExecutiveNotification.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.notifications = state.notifications.filter(
          (notification) => notification.id !== action.payload
        );

        if (state.selectedNotification?.id === action.payload) {
          state.selectedNotification = null;
        }

        state.successMessage = "Notification deleted successfully.";
      })
      .addCase(deleteFieldExecutiveNotification.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || "Unable to delete notification.";
      });
  },
});

// =====================================================
// EXPORTS
// =====================================================

export const {
  clearSelectedNotification,
  clearNotificationError,
  clearNotificationSuccess,
} = fieldExecutiveNotificationSlice.actions;

export default fieldExecutiveNotificationSlice.reducer;
