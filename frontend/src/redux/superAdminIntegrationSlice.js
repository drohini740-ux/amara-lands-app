import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  "http://localhost:4000/api/v1/super-admin/integrations";

// =====================================================
// GET ALL INTEGRATIONS
// =====================================================

export const fetchIntegrations = createAsyncThunk(
  "superAdminIntegration/fetchIntegrations",
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
      const token = localStorage.getItem("token");

      const response = await axios.post(
        API_URL,
        integrationData,
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
  async (
    { id, integrationData },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/${id}`,
        integrationData,
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
          "Failed to update integration."
      );
    }
  }
);

// =====================================================
// UPDATE STATUS
// =====================================================

export const updateIntegrationStatus =
  createAsyncThunk(
    "superAdminIntegration/updateIntegrationStatus",
    async (
      { id, status },
      { rejectWithValue }
    ) => {
      try {
        const token =
          localStorage.getItem("token");

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
            "Failed to update integration status."
        );
      }
    }
  );

// =====================================================
// TOGGLE ENABLE / DISABLE
// =====================================================

export const toggleIntegration =
  createAsyncThunk(
    "superAdminIntegration/toggleIntegration",
    async (id, { rejectWithValue }) => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await axios.put(
          `${API_URL}/${id}/toggle`,
          {},
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
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/${id}/test`,
        {},
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
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/${id}`,
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

const superAdminIntegrationSlice =
  createSlice({
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

        .addCase(
          fetchIntegrations.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchIntegrations.fulfilled,
          (state, action) => {
            state.loading = false;
            state.integrations =
              action.payload;
          }
        )

        .addCase(
          fetchIntegrations.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        )

        // =========================================
        // FETCH BY ID
        // =========================================

        .addCase(
          fetchIntegrationById.pending,
          (state) => {
            state.actionLoading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchIntegrationById.fulfilled,
          (state, action) => {
            state.actionLoading = false;
            state.selectedIntegration =
              action.payload;
          }
        )

        .addCase(
          fetchIntegrationById.rejected,
          (state, action) => {
            state.actionLoading = false;
            state.error =
              action.payload;
          }
        )

        // =========================================
        // CREATE
        // =========================================

        .addCase(
          createIntegration.pending,
          (state) => {
            state.actionLoading = true;
            state.error = null;
          }
        )

        .addCase(
          createIntegration.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            state.integrations.unshift(
              action.payload
            );
          }
        )

        .addCase(
          createIntegration.rejected,
          (state, action) => {
            state.actionLoading = false;
            state.error =
              action.payload;
          }
        )

        // =========================================
        // UPDATE
        // =========================================

        .addCase(
          updateIntegration.pending,
          (state) => {
            state.actionLoading = true;
            state.error = null;
          }
        )

        .addCase(
          updateIntegration.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            const index =
              state.integrations.findIndex(
                (item) =>
                  item.id ===
                  action.payload.id
              );

            if (index !== -1) {
              state.integrations[index] =
                action.payload;
            }

            state.selectedIntegration =
              action.payload;
          }
        )

        .addCase(
          updateIntegration.rejected,
          (state, action) => {
            state.actionLoading = false;
            state.error =
              action.payload;
          }
        )

        // =========================================
        // STATUS
        // =========================================

        .addCase(
          updateIntegrationStatus.pending,
          (state) => {
            state.actionLoading = true;
            state.error = null;
          }
        )

        .addCase(
          updateIntegrationStatus.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            const index =
              state.integrations.findIndex(
                (item) =>
                  item.id ===
                  action.payload.id
              );

            if (index !== -1) {
              state.integrations[index] =
                action.payload;
            }

            state.selectedIntegration =
              action.payload;
          }
        )

        .addCase(
          updateIntegrationStatus.rejected,
          (state, action) => {
            state.actionLoading = false;
            state.error =
              action.payload;
          }
        )

        // =========================================
        // TOGGLE
        // =========================================

        .addCase(
          toggleIntegration.pending,
          (state) => {
            state.actionLoading = true;
            state.error = null;
          }
        )

        .addCase(
          toggleIntegration.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            const index =
              state.integrations.findIndex(
                (item) =>
                  item.id ===
                  action.payload.id
              );

            if (index !== -1) {
              state.integrations[index] =
                action.payload;
            }

            state.selectedIntegration =
              action.payload;
          }
        )

        .addCase(
          toggleIntegration.rejected,
          (state, action) => {
            state.actionLoading = false;
            state.error =
              action.payload;
          }
        )

        // =========================================
        // TEST
        // =========================================

        .addCase(
          testIntegration.pending,
          (state) => {
            state.actionLoading = true;
            state.error = null;
          }
        )

        .addCase(
          testIntegration.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            const index =
              state.integrations.findIndex(
                (item) =>
                  item.id ===
                  action.payload.id
              );

            if (index !== -1) {
              state.integrations[index] =
                action.payload;
            }

            state.selectedIntegration =
              action.payload;
          }
        )

        .addCase(
          testIntegration.rejected,
          (state, action) => {
            state.actionLoading = false;
            state.error =
              action.payload;
          }
        )

        // =========================================
        // DELETE
        // =========================================

        .addCase(
          deleteIntegration.pending,
          (state) => {
            state.actionLoading = true;
            state.error = null;
          }
        )

        .addCase(
          deleteIntegration.fulfilled,
          (state, action) => {
            state.actionLoading = false;

            state.integrations =
              state.integrations.filter(
                (item) =>
                  item.id !==
                  action.payload
              );

            if (
              state.selectedIntegration
                ?.id === action.payload
            ) {
              state.selectedIntegration =
                null;
            }
          }
        )

        .addCase(
          deleteIntegration.rejected,
          (state, action) => {
            state.actionLoading = false;
            state.error =
              action.payload;
          }
        );
    },
  });

export const {
  clearSelectedIntegration,
  clearIntegrationError,
} =
  superAdminIntegrationSlice.actions;

export default superAdminIntegrationSlice.reducer;