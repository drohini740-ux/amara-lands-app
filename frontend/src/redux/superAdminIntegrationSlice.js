import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

const API_URL = "/super-admin/integrations";

// =====================================================
// GET ALL INTEGRATIONS
// =====================================================

export const fetchIntegrations = createAsyncThunk(
  "superAdminIntegration/fetchIntegrations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(API_URL);
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch integrations."
      );
    }
  }
);

// =====================================================
// GET INTEGRATION BY ID
// =====================================================

export const fetchIntegrationById = createAsyncThunk(
  "superAdminIntegration/fetchIntegrationById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch integration."
      );
    }
  }
);

// =====================================================
// CREATE INTEGRATION
// =====================================================

export const createIntegration = createAsyncThunk(
  "superAdminIntegration/createIntegration",
  async (integrationData, { rejectWithValue }) => {
    try {
      const response = await API.post(API_URL, integrationData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create integration."
      );
    }
  }
);

// =====================================================
// UPDATE INTEGRATION
// =====================================================

export const updateIntegration = createAsyncThunk(
  "superAdminIntegration/updateIntegration",
  async ({ id, integrationData }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `${API_URL}/${id}`,
        integrationData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update integration."
      );
    }
  }
);

// =====================================================
// UPDATE STATUS
// =====================================================

export const updateIntegrationStatus = createAsyncThunk(
  "superAdminIntegration/updateIntegrationStatus",
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
          "Failed to update integration status."
      );
    }
  }
);

// =====================================================
// TOGGLE ENABLE / DISABLE
// =====================================================

export const toggleIntegration = createAsyncThunk(
  "superAdminIntegration/toggleIntegration",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `${API_URL}/${id}/toggle`,
        {}
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to toggle integration."
      );
    }
  }
);

// =====================================================
// TEST INTEGRATION
// =====================================================

export const testIntegration = createAsyncThunk(
  "superAdminIntegration/testIntegration",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `${API_URL}/${id}/test`,
        {}
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to test integration."
      );
    }
  }
);

// =====================================================
// DELETE INTEGRATION
// =====================================================

export const deleteIntegration = createAsyncThunk(
  "superAdminIntegration/deleteIntegration",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete integration."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  integrations: [],
  selectedIntegration: null,
  loading: false,
  actionLoading: false,
  error: null,
};

// =====================================================
// SLICE
// =====================================================

const superAdminIntegrationSlice = createSlice({
  name: "superAdminIntegration",
  initialState,

  reducers: {
    clearSelectedIntegration: (state) => {
      state.selectedIntegration = null;
    },

    clearIntegrationError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================================
      // FETCH ALL
      // =========================================

      .addCase(fetchIntegrations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchIntegrations.fulfilled, (state, action) => {
        state.loading = false;
        state.integrations = action.payload;
      })

      .addCase(fetchIntegrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =========================================
      // FETCH BY ID
      // =========================================

      .addCase(fetchIntegrationById.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(fetchIntegrationById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedIntegration = action.payload;
      })

      .addCase(fetchIntegrationById.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // =========================================
      // CREATE
      // =========================================

      .addCase(createIntegration.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(createIntegration.fulfilled, (state, action) => {
        state.actionLoading = false;

        if (action.payload) {
          state.integrations.unshift(action.payload);
        }
      })

      .addCase(createIntegration.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // =========================================
      // UPDATE
      // =========================================

      .addCase(updateIntegration.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(updateIntegration.fulfilled, (state, action) => {
        state.actionLoading = false;

        const updatedIntegration = action.payload;
        if (!updatedIntegration) return;

        const index = state.integrations.findIndex(
          (item) => item.id === updatedIntegration.id
        );

        if (index !== -1) {
          state.integrations[index] = {
            ...state.integrations[index],
            ...updatedIntegration,
          };
        }

        state.selectedIntegration = updatedIntegration;
      })

      .addCase(updateIntegration.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // =========================================
      // STATUS
      // =========================================

      .addCase(updateIntegrationStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(updateIntegrationStatus.fulfilled, (state, action) => {
        state.actionLoading = false;

        const updatedIntegration = action.payload;
        if (!updatedIntegration) return;

        const index = state.integrations.findIndex(
          (item) => item.id === updatedIntegration.id
        );

        if (index !== -1) {
          state.integrations[index] = {
            ...state.integrations[index],
            ...updatedIntegration,
          };
        }

        state.selectedIntegration = updatedIntegration;
      })

      .addCase(updateIntegrationStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // =========================================
      // TOGGLE
      // =========================================

      .addCase(toggleIntegration.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(toggleIntegration.fulfilled, (state, action) => {
        state.actionLoading = false;

        const updatedIntegration = action.payload;
        if (!updatedIntegration) return;

        const index = state.integrations.findIndex(
          (item) => item.id === updatedIntegration.id
        );

        if (index !== -1) {
          state.integrations[index] = {
            ...state.integrations[index],
            ...updatedIntegration,
          };
        }

        state.selectedIntegration = updatedIntegration;
      })

      .addCase(toggleIntegration.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // =========================================
      // TEST
      // =========================================

      .addCase(testIntegration.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(testIntegration.fulfilled, (state, action) => {
        state.actionLoading = false;

        const updatedIntegration = action.payload;
        if (!updatedIntegration) return;

        const index = state.integrations.findIndex(
          (item) => item.id === updatedIntegration.id
        );

        if (index !== -1) {
          state.integrations[index] = {
            ...state.integrations[index],
            ...updatedIntegration,
          };
        }

        state.selectedIntegration = updatedIntegration;
      })

      .addCase(testIntegration.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // =========================================
      // DELETE
      // =========================================

      .addCase(deleteIntegration.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(deleteIntegration.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.integrations = state.integrations.filter(
          (item) => Number(item.id) !== Number(action.payload)
        );

        if (
          Number(state.selectedIntegration?.id) ===
          Number(action.payload)
        ) {
          state.selectedIntegration = null;
        }
      })

      .addCase(deleteIntegration.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSelectedIntegration,
  clearIntegrationError,
} = superAdminIntegrationSlice.actions;

export default superAdminIntegrationSlice.reducer;