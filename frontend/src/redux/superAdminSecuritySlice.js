import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL =
  "http://localhost:4000/api/v1/super-admin/security";

// =====================================================
// HELPER
// =====================================================

const getToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// =====================================================
// SECURITY REPORTS
// =====================================================

// GET ALL SECURITY REPORTS
export const fetchSuperAdminSecurityReports = createAsyncThunk(
  "superAdminSecurity/fetchReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/reports`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch security reports."
        );
      }

      return data.reports || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// GET SECURITY REPORT BY ID
export const fetchSuperAdminSecurityReportById = createAsyncThunk(
  "superAdminSecurity/fetchReportById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/reports/${id}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch security report."
        );
      }

      return data.report;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATE SECURITY REPORT STATUS
export const updateSuperAdminSecurityReportStatus =
  createAsyncThunk(
    "superAdminSecurity/updateReportStatus",
    async ({ id, report_status }, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${API_URL}/reports/${id}/status`,
          {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({
              report_status,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(
            data.message ||
              "Failed to update security report status."
          );
        }

        return data.report;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

// =====================================================
// SURVEILLANCE CAMERAS
// =====================================================

// GET ALL CAMERAS
export const fetchSuperAdminCameras = createAsyncThunk(
  "superAdminSecurity/fetchCameras",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/cameras`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch surveillance cameras."
        );
      }

      return data.cameras || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATE CAMERA STATUS
export const updateSuperAdminCameraStatus = createAsyncThunk(
  "superAdminSecurity/updateCameraStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/cameras/${id}/status`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to update camera status."
        );
      }

      return data.camera;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// =====================================================
// PATROL LOGS
// =====================================================

// GET ALL PATROL LOGS
export const fetchSuperAdminPatrolLogs = createAsyncThunk(
  "superAdminSecurity/fetchPatrols",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/patrols`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch patrol logs."
        );
      }

      return data.patrols || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATE PATROL STATUS
export const updateSuperAdminPatrolStatus = createAsyncThunk(
  "superAdminSecurity/updatePatrolStatus",
  async ({ id, patrol_status }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/patrols/${id}/status`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            patrol_status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to update patrol status."
        );
      }

      return data.patrol;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// =====================================================
// INTRUSION NOTIFICATIONS
// =====================================================

// GET ALL INTRUSION NOTIFICATIONS
export const fetchSuperAdminIntrusionNotifications =
  createAsyncThunk(
    "superAdminSecurity/fetchIntrusions",
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${API_URL}/intrusions`,
          {
            method: "GET",
            headers: getHeaders(),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(
            data.message ||
              "Failed to fetch intrusion notifications."
          );
        }

        return data.notifications || [];
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

// UPDATE INTRUSION STATUS
export const updateSuperAdminIntrusionStatus =
  createAsyncThunk(
    "superAdminSecurity/updateIntrusionStatus",
    async ({ id, status }, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${API_URL}/intrusions/${id}/status`,
          {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({
              status,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(
            data.message ||
              "Failed to update intrusion notification status."
          );
        }

        return data.notification;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

// =====================================================
// MOTION DETECTION ALERTS
// =====================================================

// GET ALL MOTION ALERTS
export const fetchSuperAdminMotionAlerts = createAsyncThunk(
  "superAdminSecurity/fetchMotionAlerts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/motion-alerts`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message ||
            "Failed to fetch motion detection alerts."
        );
      }

      return data.alerts || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATE MOTION ALERT STATUS
export const updateSuperAdminMotionAlertStatus =
  createAsyncThunk(
    "superAdminSecurity/updateMotionAlertStatus",
    async ({ id, status }, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${API_URL}/motion-alerts/${id}/status`,
          {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({
              status,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(
            data.message ||
              "Failed to update motion detection alert status."
          );
        }

        return data.alert;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

// =====================================================
// STAFF ASSIGNMENTS
// =====================================================

// GET ALL STAFF ASSIGNMENTS
export const fetchSuperAdminStaffAssignments =
  createAsyncThunk(
    "superAdminSecurity/fetchAssignments",
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${API_URL}/assignments`,
          {
            method: "GET",
            headers: getHeaders(),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(
            data.message ||
              "Failed to fetch staff assignments."
          );
        }

        return data.assignments || [];
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

// UPDATE STAFF ASSIGNMENT STATUS
export const updateSuperAdminStaffAssignmentStatus =
  createAsyncThunk(
    "superAdminSecurity/updateAssignmentStatus",
    async ({ id, status }, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${API_URL}/assignments/${id}/status`,
          {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({
              status,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(
            data.message ||
              "Failed to update staff assignment status."
          );
        }

        return data.assignment;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

// =====================================================
// VISIT LOGS
// =====================================================

// GET ALL VISIT LOGS
export const fetchSuperAdminVisitLogs = createAsyncThunk(
  "superAdminSecurity/fetchVisits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/visits`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch visit logs."
        );
      }

      return data.visits || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  reports: [],
  selectedReport: null,

  cameras: [],

  patrols: [],

  intrusions: [],

  motionAlerts: [],

  assignments: [],

  visits: [],

  loading: false,
  updateLoading: false,

  error: null,
};

// =====================================================
// SLICE
// =====================================================

const superAdminSecuritySlice = createSlice({
  name: "superAdminSecurity",
  initialState,

  reducers: {
    clearSelectedSecurityReport: (state) => {
      state.selectedReport = null;
    },

    clearSecurityError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ===================================================
    // SECURITY REPORTS
    // ===================================================

    builder
      .addCase(
        fetchSuperAdminSecurityReports.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchSuperAdminSecurityReports.fulfilled,
        (state, action) => {
          state.loading = false;
          state.reports = action.payload;
        }
      )
      .addCase(
        fetchSuperAdminSecurityReports.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    builder
      .addCase(
        fetchSuperAdminSecurityReportById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchSuperAdminSecurityReportById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedReport = action.payload;
        }
      )
      .addCase(
        fetchSuperAdminSecurityReportById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    builder
      .addCase(
        updateSuperAdminSecurityReportStatus.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
        }
      )
      .addCase(
        updateSuperAdminSecurityReportStatus.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          const updatedReport = action.payload;

          const index = state.reports.findIndex(
            (report) => report.id === updatedReport.id
          );

          if (index !== -1) {
            state.reports[index].report_status =
              updatedReport.report_status;
          }

          if (
            state.selectedReport &&
            state.selectedReport.id === updatedReport.id
          ) {
            state.selectedReport.report_status =
              updatedReport.report_status;
          }
        }
      )
      .addCase(
        updateSuperAdminSecurityReportStatus.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error = action.payload;
        }
      );

    // ===================================================
    // CAMERAS
    // ===================================================

    builder
      .addCase(
        fetchSuperAdminCameras.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchSuperAdminCameras.fulfilled,
        (state, action) => {
          state.loading = false;
          state.cameras = action.payload;
        }
      )
      .addCase(
        fetchSuperAdminCameras.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    builder
      .addCase(
        updateSuperAdminCameraStatus.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
        }
      )
      .addCase(
        updateSuperAdminCameraStatus.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          const updatedCamera = action.payload;

          const index = state.cameras.findIndex(
            (camera) => camera.id === updatedCamera.id
          );

          if (index !== -1) {
            state.cameras[index].status =
              updatedCamera.status;
          }
        }
      )
      .addCase(
        updateSuperAdminCameraStatus.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error = action.payload;
        }
      );

    // ===================================================
    // PATROLS
    // ===================================================

    builder
      .addCase(
        fetchSuperAdminPatrolLogs.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchSuperAdminPatrolLogs.fulfilled,
        (state, action) => {
          state.loading = false;
          state.patrols = action.payload;
        }
      )
      .addCase(
        fetchSuperAdminPatrolLogs.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    builder
      .addCase(
        updateSuperAdminPatrolStatus.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
        }
      )
      .addCase(
        updateSuperAdminPatrolStatus.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          const updatedPatrol = action.payload;

          const index = state.patrols.findIndex(
            (patrol) => patrol.id === updatedPatrol.id
          );

          if (index !== -1) {
            state.patrols[index].patrol_status =
              updatedPatrol.patrol_status;
          }
        }
      )
      .addCase(
        updateSuperAdminPatrolStatus.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error = action.payload;
        }
      );

    // ===================================================
    // INTRUSIONS
    // ===================================================

    builder
      .addCase(
        fetchSuperAdminIntrusionNotifications.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchSuperAdminIntrusionNotifications.fulfilled,
        (state, action) => {
          state.loading = false;
          state.intrusions = action.payload;
        }
      )
      .addCase(
        fetchSuperAdminIntrusionNotifications.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    builder
      .addCase(
        updateSuperAdminIntrusionStatus.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
        }
      )
      .addCase(
        updateSuperAdminIntrusionStatus.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          const updatedNotification =
            action.payload;

          const index = state.intrusions.findIndex(
            (item) =>
              item.id === updatedNotification.id
          );

          if (index !== -1) {
            state.intrusions[index].status =
              updatedNotification.status;
          }
        }
      )
      .addCase(
        updateSuperAdminIntrusionStatus.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error = action.payload;
        }
      );

    // ===================================================
    // MOTION ALERTS
    // ===================================================

    builder
      .addCase(
        fetchSuperAdminMotionAlerts.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchSuperAdminMotionAlerts.fulfilled,
        (state, action) => {
          state.loading = false;
          state.motionAlerts = action.payload;
        }
      )
      .addCase(
        fetchSuperAdminMotionAlerts.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    builder
      .addCase(
        updateSuperAdminMotionAlertStatus.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
        }
      )
      .addCase(
        updateSuperAdminMotionAlertStatus.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          const updatedAlert = action.payload;

          const index = state.motionAlerts.findIndex(
            (alert) => alert.id === updatedAlert.id
          );

          if (index !== -1) {
            state.motionAlerts[index].status =
              updatedAlert.status;
          }
        }
      )
      .addCase(
        updateSuperAdminMotionAlertStatus.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error = action.payload;
        }
      );

    // ===================================================
    // STAFF ASSIGNMENTS
    // ===================================================

    builder
      .addCase(
        fetchSuperAdminStaffAssignments.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchSuperAdminStaffAssignments.fulfilled,
        (state, action) => {
          state.loading = false;
          state.assignments = action.payload;
        }
      )
      .addCase(
        fetchSuperAdminStaffAssignments.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    builder
      .addCase(
        updateSuperAdminStaffAssignmentStatus.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
        }
      )
      .addCase(
        updateSuperAdminStaffAssignmentStatus.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          const updatedAssignment =
            action.payload;

          const index = state.assignments.findIndex(
            (assignment) =>
              assignment.id === updatedAssignment.id
          );

          if (index !== -1) {
            state.assignments[index].status =
              updatedAssignment.status;

            state.assignments[index].updated_at =
              updatedAssignment.updated_at;
          }
        }
      )
      .addCase(
        updateSuperAdminStaffAssignmentStatus.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error = action.payload;
        }
      );

    // ===================================================
    // VISIT LOGS
    // ===================================================

    builder
      .addCase(
        fetchSuperAdminVisitLogs.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchSuperAdminVisitLogs.fulfilled,
        (state, action) => {
          state.loading = false;
          state.visits = action.payload;
        }
      )
      .addCase(
        fetchSuperAdminVisitLogs.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearSelectedSecurityReport,
  clearSecurityError,
} = superAdminSecuritySlice.actions;

export default superAdminSecuritySlice.reducer;