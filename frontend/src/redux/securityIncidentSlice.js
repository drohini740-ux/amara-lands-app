
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1/security/incident-alerts";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// =====================================================
// FETCH INTRUSION INCIDENTS
// =====================================================

export const fetchSecurityIncidents = createAsyncThunk(
  "securityIncident/fetchIncidents",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/incidents`, {
        ...getAuthConfig(),
        params: filters,
      });

      return response.data?.incidents || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch incidents."
      );
    }
  }
);

// =====================================================
// FETCH INCIDENT DETAILS
// =====================================================

export const fetchSecurityIncidentById = createAsyncThunk(
  "securityIncident/fetchIncidentById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/incidents/${id}`,
        getAuthConfig()
      );

      return response.data?.incident || null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch incident details."
      );
    }
  }
);

// =====================================================
// UPDATE INCIDENT STATUS
// =====================================================

export const updateSecurityIncidentStatus = createAsyncThunk(
  "securityIncident/updateIncidentStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/incidents/${id}/status`,
        { status },
        getAuthConfig()
      );

      return response.data?.incident;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to update incident status."
      );
    }
  }
);

// =====================================================
// FETCH MOTION ALERTS
// =====================================================

export const fetchMotionAlerts = createAsyncThunk(
  "securityIncident/fetchMotionAlerts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/motion-alerts`, {
        ...getAuthConfig(),
        params: filters,
      });

      return response.data?.alerts || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch motion alerts."
      );
    }
  }
);

// =====================================================
// FETCH MOTION ALERT DETAILS
// =====================================================

export const fetchMotionAlertById = createAsyncThunk(
  "securityIncident/fetchMotionAlertById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/motion-alerts/${id}`,
        getAuthConfig()
      );

      return response.data?.alert || null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch motion alert details."
      );
    }
  }
);

// =====================================================
// UPDATE MOTION ALERT STATUS
// =====================================================

export const updateMotionAlertStatus = createAsyncThunk(
  "securityIncident/updateMotionAlertStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/motion-alerts/${id}/status`,
        { status },
        getAuthConfig()
      );

      return response.data?.alert;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to update motion alert status."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  incidents: [],
  motionAlerts: [],
  selectedIncident: null,
  selectedMotionAlert: null,

  incidentsLoading: false,
  alertsLoading: false,
  detailsLoading: false,
  actionLoading: false,

  error: null,
  detailsError: null,
  actionError: null,
};

// =====================================================
// SLICE
// =====================================================

const securityIncidentSlice = createSlice({
  name: "securityIncident",
  initialState,

  reducers: {
    clearSelectedSecurityIncident: (state) => {
      state.selectedIncident = null;
      state.selectedMotionAlert = null;
      state.detailsError = null;
    },

    clearSecurityIncidentErrors: (state) => {
      state.error = null;
      state.detailsError = null;
      state.actionError = null;
    },
  },

  extraReducers: (builder) => {
    // INCIDENT LIST
    builder
      .addCase(fetchSecurityIncidents.pending, (state) => {
        state.incidentsLoading = true;
        state.error = null;
      })
      .addCase(fetchSecurityIncidents.fulfilled, (state, action) => {
        state.incidentsLoading = false;
        state.incidents = action.payload;
      })
      .addCase(fetchSecurityIncidents.rejected, (state, action) => {
        state.incidentsLoading = false;
        state.error = action.payload || "Unable to fetch incidents.";
      });

    // INCIDENT DETAILS
    builder
      .addCase(fetchSecurityIncidentById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchSecurityIncidentById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedIncident = action.payload;
      })
      .addCase(fetchSecurityIncidentById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError =
          action.payload || "Unable to fetch incident details.";
      });

    // UPDATE INCIDENT
    builder
      .addCase(updateSecurityIncidentStatus.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateSecurityIncidentStatus.fulfilled, (state, action) => {
        state.actionLoading = false;

        if (action.payload) {
          state.incidents = state.incidents.map((item) =>
            item.id === action.payload.id ? action.payload : item
          );

          if (state.selectedIncident?.id === action.payload.id) {
            state.selectedIncident = action.payload;
          }
        }
      })
      .addCase(updateSecurityIncidentStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError =
          action.payload || "Unable to update incident status.";
      });

    // MOTION ALERT LIST
    builder
      .addCase(fetchMotionAlerts.pending, (state) => {
        state.alertsLoading = true;
        state.error = null;
      })
      .addCase(fetchMotionAlerts.fulfilled, (state, action) => {
        state.alertsLoading = false;
        state.motionAlerts = action.payload;
      })
      .addCase(fetchMotionAlerts.rejected, (state, action) => {
        state.alertsLoading = false;
        state.error = action.payload || "Unable to fetch motion alerts.";
      });

    // MOTION ALERT DETAILS
    builder
      .addCase(fetchMotionAlertById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchMotionAlertById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedMotionAlert = action.payload;
      })
      .addCase(fetchMotionAlertById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError =
          action.payload || "Unable to fetch motion alert details.";
      });

    // UPDATE MOTION ALERT
    builder
      .addCase(updateMotionAlertStatus.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateMotionAlertStatus.fulfilled, (state, action) => {
        state.actionLoading = false;

        if (action.payload) {
          state.motionAlerts = state.motionAlerts.map((item) =>
            item.id === action.payload.id ? action.payload : item
          );

          if (state.selectedMotionAlert?.id === action.payload.id) {
            state.selectedMotionAlert = action.payload;
          }
        }
      })
      .addCase(updateMotionAlertStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError =
          action.payload || "Unable to update motion alert status.";
      });
  },
});

export const {
  clearSelectedSecurityIncident,
  clearSecurityIncidentErrors,
} = securityIncidentSlice.actions;

export default securityIncidentSlice.reducer;
