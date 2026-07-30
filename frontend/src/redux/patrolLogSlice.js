import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getPatrolLogs,
  getPatrolLog,
  addPatrolLog,
  updatePatrolLog,
  deletePatrolLog,
} from "../services/patrolLogService";

// Get All
export const fetchPatrolLogs = createAsyncThunk(
  "patrolLogs/fetchPatrolLogs",
  async () => {
    return await getPatrolLogs();
  }
);

// Get Single
export const fetchPatrolLog = createAsyncThunk(
  "patrolLogs/fetchPatrolLog",
  async (id) => {
    return await getPatrolLog(id);
  }
);

// Add
export const createPatrolLog = createAsyncThunk(
  "patrolLogs/createPatrolLog",
  async (logData) => {
    return await addPatrolLog(logData);
  }
);

// Update
export const editPatrolLog = createAsyncThunk(
  "patrolLogs/editPatrolLog",
  async ({ id, logData }) => {
    return await updatePatrolLog(id, logData);
  }
);

// Delete
export const removePatrolLog = createAsyncThunk(
  "patrolLogs/removePatrolLog",
  async (id) => {
    await deletePatrolLog(id);
    return id;
  }
);

const patrolLogSlice = createSlice({
  name: "patrolLogs",

  initialState: {
    logs: [],
    log: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchPatrolLogs.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchPatrolLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.logs || [];
      })

      .addCase(fetchPatrolLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchPatrolLog.fulfilled, (state, action) => {
        state.log = action.payload.log;
      })

      .addCase(removePatrolLog.fulfilled, (state, action) => {
        state.logs = state.logs.filter(
          (log) => log.id !== action.payload
        );
      });
  },
});

export default patrolLogSlice.reducer;