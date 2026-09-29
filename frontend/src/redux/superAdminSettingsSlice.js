
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// =====================================================
// FETCH ALL SETTINGS
// =====================================================

export const fetchSettings = createAsyncThunk(
  "superAdminSettings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/super-admin/settings`,
        getAuthHeaders()
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch system settings."
      );
    }
  }
);

// =====================================================
// FETCH SETTING BY ID
// =====================================================

export const fetchSettingById = createAsyncThunk(
  "superAdminSettings/fetchSettingById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/super-admin/settings/${id}`,
        getAuthHeaders()
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch system setting."
      );
    }
  }
);

// =====================================================
// CREATE SETTING
// =====================================================

export const createSetting = createAsyncThunk(
  "superAdminSettings/createSetting",
  async (settingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/super-admin/settings`,
        settingData,
        getAuthHeaders()
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create system setting."
      );
    }
  }
);

// =====================================================
// UPDATE SETTING
// =====================================================

export const updateSetting = createAsyncThunk(
  "superAdminSettings/updateSetting",
  async ({ id, settingData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/super-admin/settings/${id}`,
        settingData,
        getAuthHeaders()
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update system setting."
      );
    }
  }
);

// =====================================================
// DELETE SETTING
// =====================================================

export const deleteSetting = createAsyncThunk(
  "superAdminSettings/deleteSetting",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/super-admin/settings/${id}`,
        getAuthHeaders()
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete system setting."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  settings: [],
  selectedSetting: null,
  loading: false,
  error: null,
};

// =====================================================
// SLICE
// =====================================================

const superAdminSettingsSlice = createSlice({
  name: "superAdminSettings",
  initialState,

  reducers: {
    clearSelectedSetting: (state) => {
      state.selectedSetting = null;
    },

    clearSettingsError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // =================================================
    // FETCH ALL
    // =================================================

    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload?.data || [];
      })

      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // =================================================
    // FETCH BY ID
    // =================================================

    builder
      .addCase(fetchSettingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSettingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSetting =
          action.payload?.data || null;
      })

      .addCase(fetchSettingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // =================================================
    // CREATE
    // =================================================

    builder
      .addCase(createSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createSetting.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.data) {
          state.settings.push(action.payload.data);
        }
      })

      .addCase(createSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // =================================================
    // UPDATE
    // =================================================

    builder
      .addCase(updateSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateSetting.fulfilled, (state, action) => {
        state.loading = false;

        const updatedSetting = action.payload?.data;

        if (updatedSetting) {
          const index = state.settings.findIndex(
            (setting) =>
              setting.id === updatedSetting.id
          );

          if (index !== -1) {
            state.settings[index] = updatedSetting;
          }

          state.selectedSetting = updatedSetting;
        }
      })

      .addCase(updateSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // =================================================
    // DELETE
    // =================================================

    builder
      .addCase(deleteSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteSetting.fulfilled, (state, action) => {
        state.loading = false;

        const deletedSetting = action.payload?.data;

        if (deletedSetting) {
          state.settings = state.settings.filter(
            (setting) =>
              setting.id !== deletedSetting.id
          );
        }

        state.selectedSetting = null;
      })

      .addCase(deleteSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSelectedSetting,
  clearSettingsError,
} = superAdminSettingsSlice.actions;

export default superAdminSettingsSlice.reducer;
