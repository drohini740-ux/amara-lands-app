import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

const API_URL = "/super-admin/notifications";

// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

export const fetchNotifications = createAsyncThunk(
  "superAdminNotification/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(API_URL);
      return response.data.notifications || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch notifications."
      );
    }
  }
);

// =====================================================
// GET NOTIFICATION BY ID
// =====================================================

export const fetchNotificationById = createAsyncThunk(
  "superAdminNotification/fetchNotificationById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`${API_URL}/${id}`);
      return response.data.notification;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch notification."
      );
    }
  }
);

// =====================================================
// CREATE NOTIFICATION
// =====================================================

export const createNotification = createAsyncThunk(
  "superAdminNotification/createNotification",
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await API.post(API_URL, notificationData);
      return response.data.notification;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create notification."
      );
    }
  }
);

// =====================================================
// UPDATE NOTIFICATION
// =====================================================

export const updateNotification = createAsyncThunk(
  "superAdminNotification/updateNotification",
  async ({ id, notificationData }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `${API_URL}/${id}`,
        notificationData
      );

      return response.data.notification;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update notification."
      );
    }
  }
);

// =====================================================
// UPDATE READ STATUS
// =====================================================

export const updateNotificationReadStatus = createAsyncThunk(
  "superAdminNotification/updateNotificationReadStatus",
  async ({ id, is_read }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `${API_URL}/${id}/read-status`,
        { is_read }
      );

      return response.data.notification;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update notification read status."
      );
    }
  }
);

// =====================================================
// DELETE NOTIFICATION
// =====================================================

export const deleteNotification = createAsyncThunk(
  "superAdminNotification/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete notification."
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
  error: null,
};

// =====================================================
// SLICE
// =====================================================

const superAdminNotificationSlice = createSlice({
  name: "superAdminNotification",
  initialState,

  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },

    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
    },
  },

  extraReducers: (builder) => {
    // FETCH ALL

    builder
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
      });

    // FETCH BY ID

    builder
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.selectedNotification = action.payload;
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.error = action.payload;
      });

    // CREATE

    builder
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          state.notifications.unshift(action.payload);
        }
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE

    builder
      .addCase(updateNotification.fulfilled, (state, action) => {
        const updatedNotification = action.payload;

        if (!updatedNotification) return;

        const index = state.notifications.findIndex(
          (notification) =>
            notification.id === updatedNotification.id
        );

        if (index !== -1) {
          state.notifications[index] = {
            ...state.notifications[index],
            ...updatedNotification,
          };
        }

        if (
          state.selectedNotification?.id ===
          updatedNotification.id
        ) {
          state.selectedNotification = {
            ...state.selectedNotification,
            ...updatedNotification,
          };
        }
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.error = action.payload;
      });

    // READ / UNREAD

    builder
      .addCase(
        updateNotificationReadStatus.fulfilled,
        (state, action) => {
          const updatedNotification = action.payload;

          if (!updatedNotification) return;

          const index = state.notifications.findIndex(
            (notification) =>
              notification.id === updatedNotification.id
          );

          if (index !== -1) {
            state.notifications[index] = {
              ...state.notifications[index],
              ...updatedNotification,
            };
          }

          if (
            state.selectedNotification?.id ===
            updatedNotification.id
          ) {
            state.selectedNotification = {
              ...state.selectedNotification,
              ...updatedNotification,
            };
          }
        }
      )
      .addCase(
        updateNotificationReadStatus.rejected,
        (state, action) => {
          state.error = action.payload;
        }
      );

    // DELETE

    builder
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedId = action.payload;

        state.notifications = state.notifications.filter(
          (notification) => notification.id !== deletedId
        );

        if (state.selectedNotification?.id === deletedId) {
          state.selectedNotification = null;
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearNotificationError,
  clearSelectedNotification,
} = superAdminNotificationSlice.actions;

export default superAdminNotificationSlice.reducer;