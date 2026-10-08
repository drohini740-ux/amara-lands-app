
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH MY NOTIFICATIONS
// =====================================================

export const fetchFieldExecutiveNotifications =
  createAsyncThunk(
    "fieldExecutiveNotification/fetchNotifications",
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/field/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data.notifications || [];
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to fetch notifications."
        );
      }
    }
  );

// =====================================================
// CREATE NOTIFICATION
// =====================================================

export const createFieldExecutiveNotification =
  createAsyncThunk(
    "fieldExecutiveNotification/createNotification",
    async (
      {
        title,
        message,
        notification_type,
      },
      { rejectWithValue }
    ) => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
          `${API_URL}/field/notifications`,
          {
            title,
            message,
            notification_type,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data.notification;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to create notification."
        );
      }
    }
  );

// =====================================================
// FETCH NOTIFICATION BY ID
// =====================================================

export const fetchFieldExecutiveNotificationById =
  createAsyncThunk(
    "fieldExecutiveNotification/fetchNotificationById",
    async (id, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/field/notifications/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data.notification;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to fetch notification."
        );
      }
    }
  );

// =====================================================
// UPDATE READ STATUS
// =====================================================

export const updateFieldExecutiveNotificationReadStatus =
  createAsyncThunk(
    "fieldExecutiveNotification/updateReadStatus",
    async (
      { id, is_read },
      { rejectWithValue }
    ) => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.put(
          `${API_URL}/field/notifications/${id}/read`,
          {
            is_read,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data.notification;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to update notification."
        );
      }
    }
  );

// =====================================================
// DELETE NOTIFICATION
// =====================================================

export const deleteFieldExecutiveNotification =
  createAsyncThunk(
    "fieldExecutiveNotification/deleteNotification",
    async (id, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(
          `${API_URL}/field/notifications/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return id;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to delete notification."
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

const fieldExecutiveNotificationSlice =
  createSlice({
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
      // =================================================
      // FETCH NOTIFICATIONS
      // =================================================

      builder
        .addCase(
          fetchFieldExecutiveNotifications.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchFieldExecutiveNotifications.fulfilled,
          (state, action) => {
            state.loading = false;
            state.notifications =
              action.payload;
          }
        )

        .addCase(
          fetchFieldExecutiveNotifications.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // =================================================
      // CREATE NOTIFICATION
      // =================================================

      builder
        .addCase(
          createFieldExecutiveNotification.pending,
          (state) => {
            state.actionLoading = true;
            state.actionError = null;
            state.successMessage = null;
          }
        )

        .addCase(
          createFieldExecutiveNotification.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            state.notifications = [
              action.payload,
              ...state.notifications,
            ];

            state.successMessage =
              "Notification created successfully.";
          }
        )

        .addCase(
          createFieldExecutiveNotification.rejected,
          (state, action) => {
            state.actionLoading = false;
            state.actionError =
              action.payload;
          }
        );

      // =================================================
      // FETCH NOTIFICATION BY ID
      // =================================================

      builder
        .addCase(
          fetchFieldExecutiveNotificationById.pending,
          (state) => {
            state.detailsLoading = true;
            state.detailsError = null;
          }
        )

        .addCase(
          fetchFieldExecutiveNotificationById.fulfilled,
          (state, action) => {
            state.detailsLoading = false;
            state.selectedNotification =
              action.payload;
          }
        )

        .addCase(
          fetchFieldExecutiveNotificationById.rejected,
          (state, action) => {
            state.detailsLoading = false;
            state.detailsError =
              action.payload;
          }
        );

      // =================================================
      // UPDATE READ STATUS
      // =================================================

      builder
        .addCase(
          updateFieldExecutiveNotificationReadStatus.pending,
          (state) => {
            state.actionLoading = true;
            state.actionError = null;
            state.successMessage = null;
          }
        )

        .addCase(
          updateFieldExecutiveNotificationReadStatus.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            const updatedNotification =
              action.payload;

            state.notifications =
              state.notifications.map(
                (notification) =>
                  notification.id ===
                  updatedNotification.id
                    ? updatedNotification
                    : notification
              );

            if (
              state.selectedNotification?.id ===
              updatedNotification.id
            ) {
              state.selectedNotification =
                updatedNotification;
            }

            state.successMessage =
              updatedNotification.is_read
                ? "Notification marked as read."
                : "Notification marked as unread.";
          }
        )

        .addCase(
          updateFieldExecutiveNotificationReadStatus.rejected,
          (state, action) => {
            state.actionLoading = false;
            state.actionError =
              action.payload;
          }
        );

      // =================================================
      // DELETE NOTIFICATION
      // =================================================

      builder
        .addCase(
          deleteFieldExecutiveNotification.pending,
          (state) => {
            state.actionLoading = true;
            state.actionError = null;
            state.successMessage = null;
          }
        )

        .addCase(
          deleteFieldExecutiveNotification.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            state.notifications =
              state.notifications.filter(
                (notification) =>
                  notification.id !==
                  action.payload
              );

            if (
              state.selectedNotification?.id ===
              action.payload
            ) {
              state.selectedNotification = null;
            }

            state.successMessage =
              "Notification deleted successfully.";
          }
        )

        .addCase(
          deleteFieldExecutiveNotification.rejected,
          (state, action) => {
            state.actionLoading = false;
            state.actionError =
              action.payload;
          }
        );
    },
  });

export const {
  clearSelectedNotification,
  clearNotificationError,
  clearNotificationSuccess,
} =
  fieldExecutiveNotificationSlice.actions;

export default fieldExecutiveNotificationSlice.reducer;

