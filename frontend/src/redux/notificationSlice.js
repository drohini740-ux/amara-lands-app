import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as notificationService from "../services/notificationService";

// ===========================
// Fetch Notifications
// ===========================
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationService.getNotifications();

      return res.data.notifications;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch notifications"
      );
    }
  }
);


// ===========================
// Mark Notification as Read
// ===========================
export const readNotification = createAsyncThunk(
  "notifications/readNotification",
  async (id, { rejectWithValue }) => {
    try {
      const res = await notificationService.markAsRead(id);

      return res.data.notification;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to mark notification as read"
      );
    }
  }
);


// ===========================
// Mark All Notifications as Read
// ===========================
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllNotificationsAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationService.markAllAsRead();

      return res.data.notifications;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to mark all notifications as read"
      );
    }
  }
);


// ===========================
// Delete Notification
// ===========================
export const removeNotification = createAsyncThunk(
  "notifications/removeNotification",
  async (id, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete notification"
      );
    }
  }
);


// ===========================
// Notification Slice
// ===========================
const notificationSlice = createSlice({
  name: "notifications",

  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ===========================
      // Fetch Notifications
      // ===========================
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ===========================
      // Mark One Notification as Read
      // ===========================
      .addCase(readNotification.fulfilled, (state, action) => {
        const updatedNotification = action.payload;

        const index = state.notifications.findIndex(
          (notification) =>
            notification.id === updatedNotification.id
        );

        if (index !== -1) {
          state.notifications[index] = updatedNotification;
        }
      })

      .addCase(readNotification.rejected, (state, action) => {
        state.error = action.payload;
      })


      // ===========================
      // Mark All Notifications as Read
      // ===========================
      .addCase(
        markAllNotificationsAsRead.fulfilled,
        (state, action) => {
          state.notifications = state.notifications.map(
            (notification) => ({
              ...notification,
              is_read: true,
            })
          );
        }
      )

      .addCase(
        markAllNotificationsAsRead.rejected,
        (state, action) => {
          state.error = action.payload;
        }
      )


      // ===========================
      // Delete Notification
      // ===========================
      .addCase(removeNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (notification) =>
            notification.id !== action.payload
        );
      })

      .addCase(removeNotification.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;