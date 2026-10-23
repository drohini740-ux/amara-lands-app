import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// FETCH ALL AUDIT LOGS
// =====================================================

export const fetchAuditLogs = createAsyncThunk(
  "superAdminAuditLog/fetchAuditLogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/super-admin/audit-logs");
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
      const response = await API.get(
        `/super-admin/audit-logs/${id}`
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
      const response = await API.post(
        "/super-admin/audit-logs",
        auditData
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
      const response = await API.delete(
        `/super-admin/audit-logs/${id}`
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

      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.success) {
          state.logs = action.payload.data || [];
        } else {
          state.logs = [];
          state.error =
            action.payload?.message ||
            "Failed to fetch audit logs.";
        }
      })

      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch audit logs.";
      })

      // =================================================
      // FETCH BY ID
      // =================================================

      .addCase(fetchAuditLogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAuditLogById.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.success) {
          state.selectedLog = action.payload.data || null;
        } else {
          state.selectedLog = null;
          state.error =
            action.payload?.message ||
            "Failed to fetch audit log.";
        }
      })

      .addCase(fetchAuditLogById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch audit log.";
      })

      // =================================================
      // CREATE
      // =================================================

      .addCase(createAuditLog.fulfilled, (state, action) => {
        if (
          action.payload?.success &&
          action.payload?.data
        ) {
          state.logs.unshift(action.payload.data);
        }
      })

      // =================================================
      // DELETE
      // =================================================

      .addCase(deleteAuditLog.fulfilled, (state, action) => {
        if (action.payload?.success) {
          state.logs = state.logs.filter(
            (log) => log.id !== Number(action.payload.id)
          );

          if (
            state.selectedLog?.id ===
            Number(action.payload.id)
          ) {
            state.selectedLog = null;
          }
        }
      });
  },
});

export const {
  clearAuditLogError,
  clearSelectedAuditLog,
} = superAdminAuditLogSlice.actions;

export default superAdminAuditLogSlice.reducer;