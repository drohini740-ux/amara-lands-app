
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// RESPONSE HELPERS
// =====================================================

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

const getIncidentId = (item) =>
  item?.incident_id ?? item?.id;

const getAlertId = (item) =>
  item?.alert_id ?? item?.motion_alert_id ?? item?.id;

// =====================================================
// FETCH SECURITY INCIDENTS
// =====================================================

export const fetchSecurityIncidents = createAsyncThunk(
  "securityIncident/fetchIncidents",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await API.get(
        "/security/incident-alerts/incidents",
        { params: filters }
      );

      const data = response.data?.data ?? response.data;
      return Array.isArray(data?.incidents)
        ? data.incidents
        : [];
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to fetch incidents.")
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
      const response = await API.get(
        `/security/incident-alerts/incidents/${id}`
      );

      const data = response.data?.data ?? response.data;

      return data?.incident ?? null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to fetch incident details.")
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
      const response = await API.put(
        `/security/incident-alerts/incidents/${id}/status`,
        { status }
      );

      const data = response.data?.data ?? response.data;

      return data?.incident ?? null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to update incident status.")
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
      const response = await API.get(
        "/security/incident-alerts/motion-alerts",
        { params: filters }
      );

      const data = response.data?.data ?? response.data;

      return Array.isArray(data?.alerts)
        ? data.alerts
        : [];
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to fetch motion alerts.")
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
      const response = await API.get(
        `/security/incident-alerts/motion-alerts/${id}`
      );

      const data = response.data?.data ?? response.data;

      return data?.alert ?? null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Unable to fetch motion alert details."
        )
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
      const response = await API.put(
        `/security/incident-alerts/motion-alerts/${id}/status`,
        { status }
      );

      const data = response.data?.data ?? response.data;

      return data?.alert ?? null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Unable to update motion alert status."
        )
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
    builder

      // INCIDENT LIST
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
        state.error =
          action.payload || "Unable to fetch incidents.";
      })

      // INCIDENT DETAILS
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
      })

      // UPDATE INCIDENT STATUS
      .addCase(updateSecurityIncidentStatus.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateSecurityIncidentStatus.fulfilled, (state, action) => {
        state.actionLoading = false;

        const updated = action.payload;

        if (updated) {
          const updatedId = getIncidentId(updated);

          state.incidents = state.incidents.map((item) =>
            String(getIncidentId(item)) === String(updatedId)
              ? { ...item, ...updated }
              : item
          );

          if (
            String(getIncidentId(state.selectedIncident)) ===
            String(updatedId)
          ) {
            state.selectedIncident = {
              ...state.selectedIncident,
              ...updated,
            };
          }
        }
      })
      .addCase(updateSecurityIncidentStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError =
          action.payload || "Unable to update incident status.";
      })

      // MOTION ALERT LIST
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
        state.error =
          action.payload || "Unable to fetch motion alerts.";
      })

      // MOTION ALERT DETAILS
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
      })

      // UPDATE MOTION ALERT STATUS
      .addCase(updateMotionAlertStatus.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateMotionAlertStatus.fulfilled, (state, action) => {
        state.actionLoading = false;

        const updated = action.payload;

        if (updated) {
          const updatedId = getAlertId(updated);

          state.motionAlerts = state.motionAlerts.map((item) =>
            String(getAlertId(item)) === String(updatedId)
              ? { ...item, ...updated }
              : item
          );

          if (
            String(getAlertId(state.selectedMotionAlert)) ===
            String(updatedId)
          ) {
            state.selectedMotionAlert = {
              ...state.selectedMotionAlert,
              ...updated,
            };
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

// =====================================================
// EXPORT ACTIONS
// =====================================================

export const {
  clearSelectedSecurityIncident,
  clearSecurityIncidentErrors,
} = securityIncidentSlice.actions;

export default securityIncidentSlice.reducer;
