
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// FETCH ALL AUDIT LOGS
// =====================================================

export const fetchAuditLogs = createAsyncThunk(
  "superAdminAuditLog/fetchAuditLogs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/super-admin/audit-logs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Fetch Audit Logs Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch audit logs."
      );
    }
  }
);

// =====================================================
// FETCH AUDIT LOG BY ID
// =====================================================

export const fetchAuditLogById = createAsyncThunk(
  "superAdminAuditLog/fetchAuditLogById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/super-admin/audit-logs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Fetch Audit Log Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch audit log."
      );
    }
  }
);

// =====================================================
// CREATE AUDIT LOG
// =====================================================

export const createAuditLog = createAsyncThunk(
  "superAdminAuditLog/createAuditLog",
  async (auditData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/super-admin/audit-logs`,
        auditData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Create Audit Log Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create audit log."
      );
    }
  }
);

// =====================================================
// DELETE AUDIT LOG
// =====================================================

export const deleteAuditLog = createAsyncThunk(
  "superAdminAuditLog/deleteAuditLog",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${API_URL}/super-admin/audit-logs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        ...response.data,
        id,
      };
    } catch (error) {
      console.error(
        "Delete Audit Log Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete audit log."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  logs: [],
  selectedLog: null,
  loading: false,
  error: null,
};

// =====================================================
// SLICE
// =====================================================

const superAdminAuditLogSlice = createSlice({
  name: "superAdminAuditLog",
  initialState,

  reducers: {
    clearAuditLogError: (state) => {
      state.error = null;
    },

    clearSelectedAuditLog: (state) => {
      state.selectedLog = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // FETCH ALL
      // =================================================

      .addCase(
        fetchAuditLogs.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchAuditLogs.fulfilled,
        (state, action) => {
          state.loading = false;

          if (action.payload?.success) {
            state.logs =
              action.payload.data || [];
          } else {
            state.logs = [];
            state.error =
              action.payload?.message ||
              "Failed to fetch audit logs.";
          }
        }
      )

      .addCase(
        fetchAuditLogs.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to fetch audit logs.";
        }
      )

      // =================================================
      // FETCH BY ID
      // =================================================

      .addCase(
        fetchAuditLogById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchAuditLogById.fulfilled,
        (state, action) => {
          state.loading = false;

          if (action.payload?.success) {
            state.selectedLog =
              action.payload.data || null;
          } else {
            state.selectedLog = null;
            state.error =
              action.payload?.message ||
              "Failed to fetch audit log.";
          }
        }
      )

      .addCase(
        fetchAuditLogById.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to fetch audit log.";
        }
      )

      // =================================================
      // CREATE
      // =================================================

      .addCase(
        createAuditLog.fulfilled,
        (state, action) => {
          if (
            action.payload?.success &&
            action.payload?.data
          ) {
            state.logs.unshift(
              action.payload.data
            );
          }
        }
      )

      // =================================================
      // DELETE
      // =================================================

      .addCase(
        deleteAuditLog.fulfilled,
        (state, action) => {
          if (action.payload?.success) {
            state.logs =
              state.logs.filter(
                (log) =>
                  log.id !==
                  Number(action.payload.id)
              );

            if (
              state.selectedLog?.id ===
              Number(action.payload.id)
            ) {
              state.selectedLog = null;
            }
          }
        }
      );
  },
});

export const {
  clearAuditLogError,
  clearSelectedAuditLog,
} = superAdminAuditLogSlice.actions;

export default superAdminAuditLogSlice.reducer;

