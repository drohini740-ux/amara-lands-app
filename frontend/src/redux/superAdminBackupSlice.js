import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

const API_URL = "/super-admin/backup";

// =====================================================
// GET ALL BACKUPS
// =====================================================

export const fetchBackups = createAsyncThunk(
  "superAdminBackup/fetchBackups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(API_URL);
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
      const response = await API.get(`${API_URL}/${id}`);
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
      const response = await API.post(API_URL, backupData);
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
      const response = await API.put(
        `${API_URL}/${id}/status`,
        { status }
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
      await API.delete(`${API_URL}/${id}`);
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

        if (action.payload) {
          state.backups.unshift(action.payload);
        }
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

        const updatedBackup = action.payload;

        if (!updatedBackup) return;

        const index = state.backups.findIndex(
          (backup) => backup.id === updatedBackup.id
        );

        if (index !== -1) {
          state.backups[index] = {
            ...state.backups[index],
            ...updatedBackup,
          };
        }

        if (state.selectedBackup?.id === updatedBackup.id) {
          state.selectedBackup = {
            ...state.selectedBackup,
            ...updatedBackup,
          };
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
          (backup) => Number(backup.id) !== Number(action.payload)
        );

        if (
          Number(state.selectedBackup?.id) ===
          Number(action.payload)
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