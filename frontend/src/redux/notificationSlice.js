import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as notificationService from "../services/notificationService";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async () => {
    const res = await notificationService.getNotifications();
    return res.data.notifications;
  }
);

export const readNotification = createAsyncThunk(
  "notifications/readNotification",
  async (id) => {
    await notificationService.markAsRead(id);
    return id;
  }
);

export const removeNotification = createAsyncThunk(
  "notifications/removeNotification",
  async (id) => {
    await notificationService.deleteNotification(id);
    return id;
  }
);

const notificationSlice = createSlice({
  name: "notifications",

  initialState: {
    notifications: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })

      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      })

      .addCase(readNotification.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n.id === action.payload
        );

        if (notification) {
          notification.is_read = true;
        }
      })

      .addCase(removeNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n.id !== action.payload
        );
      });
  },
});

export default notificationSlice.reducer;