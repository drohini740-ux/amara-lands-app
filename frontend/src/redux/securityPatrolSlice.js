
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

// =====================================================
// AUTH CONFIGURATION
// =====================================================

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// =====================================================
// FETCH PATROLS
// =====================================================

export const fetchSecurityPatrols = createAsyncThunk(
  "securityPatrol/fetchSecurityPatrols",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/security/patrols`,
        getAuthConfig()
      );

      return response.data?.patrols || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch patrols."
      );
    }
  }
);

// =====================================================
// FETCH PATROL REPORTS
// =====================================================

export const fetchSecurityPatrolReports = createAsyncThunk(
  "securityPatrol/fetchSecurityPatrolReports",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/security/patrols/reports`,
        {
          ...getAuthConfig(),
          params: filters,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch security patrol reports."
      );
    }
  }
);

// =====================================================
// FETCH PATROL BY ID
// =====================================================

export const fetchSecurityPatrolById = createAsyncThunk(
  "securityPatrol/fetchSecurityPatrolById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/security/patrols/${id}`,
        getAuthConfig()
      );

      return response.data?.patrol || null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch patrol details."
      );
    }
  }
);

// =====================================================
// FETCH ASSIGNED PROPERTIES
// =====================================================

export const fetchAssignedPatrolProperties = createAsyncThunk(
  "securityPatrol/fetchAssignedPatrolProperties",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/security/patrols/assigned-properties`,
        getAuthConfig()
      );

      return response.data?.properties || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch assigned properties."
      );
    }
  }
);

// =====================================================
// CREATE PATROL
// =====================================================

export const createSecurityPatrol = createAsyncThunk(
  "securityPatrol/createSecurityPatrol",
  async (patrolData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/security/patrols`,
        patrolData,
        getAuthConfig()
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to create patrol."
      );
    }
  }
);

// =====================================================
// UPDATE PATROL
// =====================================================

export const updateSecurityPatrol = createAsyncThunk(
  "securityPatrol/updateSecurityPatrol",
  async ({ id, patrolData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/security/patrols/${id}`,
        patrolData,
        getAuthConfig()
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to update patrol."
      );
    }
  }
);

// =====================================================
// DELETE PATROL
// =====================================================

export const deleteSecurityPatrol = createAsyncThunk(
  "securityPatrol/deleteSecurityPatrol",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/security/patrols/${id}`,
        getAuthConfig()
      );

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to delete patrol."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  patrols: [],
  selectedPatrol: null,
  assignedProperties: [],

  // Reports
  patrolReports: [],
  reportsTotal: 0,
  reportsLoading: false,
  reportsError: null,

  // Loading
  loading: false,
  detailsLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  assignedPropertiesLoading: false,

  // Errors
  error: null,
  detailsError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  assignedPropertiesError: null,

  // Success states
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
};

// =====================================================
// SLICE
// =====================================================

const securityPatrolSlice = createSlice({
  name: "securityPatrol",
  initialState,

  reducers: {
    clearSelectedPatrol: (state) => {
      state.selectedPatrol = null;
      state.detailsError = null;
    },

    clearSecurityPatrolErrors: (state) => {
      state.error = null;
      state.detailsError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.assignedPropertiesError = null;
      state.reportsError = null;
    },

    resetCreateSecurityPatrol: (state) => {
      state.createSuccess = false;
      state.createError = null;
    },

    resetUpdateSecurityPatrol: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    },

    resetDeleteSecurityPatrol: (state) => {
      state.deleteSuccess = false;
      state.deleteError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // FETCH PATROLS
      // =================================================

      .addCase(fetchSecurityPatrols.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSecurityPatrols.fulfilled, (state, action) => {
        state.loading = false;
        state.patrols = action.payload;
      })

      .addCase(fetchSecurityPatrols.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =================================================
      // FETCH PATROL REPORTS
      // =================================================

      .addCase(fetchSecurityPatrolReports.pending, (state) => {
        state.reportsLoading = true;
        state.reportsError = null;
      })

      .addCase(fetchSecurityPatrolReports.fulfilled, (state, action) => {
        state.reportsLoading = false;
        state.patrolReports = action.payload?.reports || [];
        state.reportsTotal = action.payload?.total || 0;
      })

      .addCase(fetchSecurityPatrolReports.rejected, (state, action) => {
        state.reportsLoading = false;
        state.reportsError =
          action.payload || "Unable to fetch security patrol reports.";
      })

      // =================================================
      // FETCH PATROL DETAILS
      // =================================================

      .addCase(fetchSecurityPatrolById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })

      .addCase(fetchSecurityPatrolById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedPatrol = action.payload;
      })

      .addCase(fetchSecurityPatrolById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload;
      })

      // =================================================
      // FETCH ASSIGNED PROPERTIES
      // =================================================

      .addCase(fetchAssignedPatrolProperties.pending, (state) => {
        state.assignedPropertiesLoading = true;
        state.assignedPropertiesError = null;
      })

      .addCase(
        fetchAssignedPatrolProperties.fulfilled,
        (state, action) => {
          state.assignedPropertiesLoading = false;
          state.assignedProperties = action.payload;
        }
      )

      .addCase(
        fetchAssignedPatrolProperties.rejected,
        (state, action) => {
          state.assignedPropertiesLoading = false;
          state.assignedPropertiesError = action.payload;
        }
      )

      // =================================================
      // CREATE PATROL
      // =================================================

      .addCase(createSecurityPatrol.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })

      .addCase(createSecurityPatrol.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
      })

      .addCase(createSecurityPatrol.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })

      // =================================================
      // UPDATE PATROL
      // =================================================

      .addCase(updateSecurityPatrol.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })

      .addCase(updateSecurityPatrol.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;

        const updated = action.payload?.patrol;

        if (updated) {
          const updatedId = updated.patrol_id ?? updated.id;

          state.patrols = state.patrols.map((patrol) => {
            const patrolId = patrol.patrol_id ?? patrol.id;

            return String(patrolId) === String(updatedId)
              ? { ...patrol, ...updated }
              : patrol;
          });

          if (state.selectedPatrol) {
            const selectedId =
              state.selectedPatrol.patrol_id ??
              state.selectedPatrol.id;

            if (String(selectedId) === String(updatedId)) {
              state.selectedPatrol = {
                ...state.selectedPatrol,
                ...updated,
              };
            }
          }
        }
      })

      .addCase(updateSecurityPatrol.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })

      // =================================================
      // DELETE PATROL
      // =================================================

      .addCase(deleteSecurityPatrol.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })

      .addCase(deleteSecurityPatrol.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;

        const deletedId = action.payload?.id;

        state.patrols = state.patrols.filter((patrol) => {
          const patrolId = patrol.patrol_id ?? patrol.id;
          return String(patrolId) !== String(deletedId);
        });

        if (state.selectedPatrol) {
          const selectedId =
            state.selectedPatrol.patrol_id ??
            state.selectedPatrol.id;

          if (String(selectedId) === String(deletedId)) {
            state.selectedPatrol = null;
          }
        }
      })

      .addCase(deleteSecurityPatrol.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

// =====================================================
// EXPORT ACTIONS
// =====================================================

export const {
  clearSelectedPatrol,
  clearSecurityPatrolErrors,
  resetCreateSecurityPatrol,
  resetUpdateSecurityPatrol,
  resetDeleteSecurityPatrol,
} = securityPatrolSlice.actions;

export default securityPatrolSlice.reducer;
