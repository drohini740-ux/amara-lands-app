import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  "http://localhost:4000/api/v1/super-admin/backup";

// =====================================================
// GET ALL BACKUPS
// =====================================================

export const fetchBackups = createAsyncThunk(
  "superAdminBackup/fetchBackups",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch backup records."
      );
    }
  }
);

// =====================================================
// GET BACKUP BY ID
// =====================================================

export const fetchBackupById = createAsyncThunk(
  "superAdminBackup/fetchBackupById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch backup record."
      );
    }
  }
);

// =====================================================
// CREATE BACKUP
// =====================================================

export const createBackup = createAsyncThunk(
  "superAdminBackup/createBackup",
  async (backupData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        API_URL,
        backupData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create backup record."
      );
    }
  }
);

// =====================================================
// UPDATE BACKUP STATUS
// =====================================================

export const updateBackupStatus = createAsyncThunk(
  "superAdminBackup/updateBackupStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/${id}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update backup status."
      );
    }
  }
);

// =====================================================
// DELETE BACKUP
// =====================================================

export const deleteBackup = createAsyncThunk(
  "superAdminBackup/deleteBackup",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete backup record."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  backups: [],
  selectedBackup: null,
  loading: false,
  actionLoading: false,
  error: null,
};

// =====================================================
// SLICE
// =====================================================

const superAdminBackupSlice = createSlice({
  name: "superAdminBackup",
  initialState,

  reducers: {
    clearSelectedBackup: (state) => {
      state.selectedBackup = null;
    },

    clearBackupError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // =================================================
    // FETCH ALL
    // =================================================

    builder
      .addCase(fetchBackups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBackups.fulfilled, (state, action) => {
        state.loading = false;
        state.backups = action.payload;
      })

      .addCase(fetchBackups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // =================================================
    // FETCH BY ID
    // =================================================

    builder
      .addCase(fetchBackupById.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(fetchBackupById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedBackup = action.payload;
      })

      .addCase(fetchBackupById.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // =================================================
    // CREATE
    // =================================================

    builder
      .addCase(createBackup.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(createBackup.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.backups.unshift(action.payload);
      })

      .addCase(createBackup.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // =================================================
    // UPDATE STATUS
    // =================================================

    builder
      .addCase(updateBackupStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(updateBackupStatus.fulfilled, (state, action) => {
        state.actionLoading = false;

        const index = state.backups.findIndex(
          (backup) =>
            backup.id === action.payload.id
        );

        if (index !== -1) {
          state.backups[index] = action.payload;
        }

        if (
          state.selectedBackup?.id ===
          action.payload.id
        ) {
          state.selectedBackup = action.payload;
        }
      })

      .addCase(updateBackupStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // =================================================
    // DELETE
    // =================================================

    builder
      .addCase(deleteBackup.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(deleteBackup.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.backups = state.backups.filter(
          (backup) =>
            backup.id !== action.payload
        );

        if (
          state.selectedBackup?.id ===
          action.payload
        ) {
          state.selectedBackup = null;
        }
      })

      .addCase(deleteBackup.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSelectedBackup,
  clearBackupError,
} = superAdminBackupSlice.actions;

export default superAdminBackupSlice.reducer;