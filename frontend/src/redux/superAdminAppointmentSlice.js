import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  "http://localhost:4000/api/v1/super-admin/appointments";

// ==========================================
// GET ALL APPOINTMENTS
// ==========================================
export const fetchSuperAdminAppointments = createAsyncThunk(
  "superAdminAppointment/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.appointments || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch appointments."
      );
    }
  }
);

// ==========================================
// GET APPOINTMENT BY ID
// ==========================================
export const fetchSuperAdminAppointmentById = createAsyncThunk(
  "superAdminAppointment/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.appointment;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch appointment."
      );
    }
  }
);

// ==========================================
// UPDATE APPOINTMENT STATUS
// ==========================================
export const updateSuperAdminAppointmentStatus =
  createAsyncThunk(
    "superAdminAppointment/updateStatus",
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
            },
          }
        );

        return response.data.appointment;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update appointment status."
        );
      }
    }
  );

// ==========================================
// UPDATE APPOINTMENT REMARKS
// ==========================================
export const updateSuperAdminAppointmentRemarks =
  createAsyncThunk(
    "superAdminAppointment/updateRemarks",
    async ({ id, remarks }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.put(
          `${API_URL}/${id}/remarks`,
          {
            remarks,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data.appointment;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update appointment remarks."
        );
      }
    }
  );

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
  appointments: [],
  selectedAppointment: null,

  loading: false,
  updateLoading: false,

  error: null,
};

// ==========================================
// SLICE
// ==========================================
const superAdminAppointmentSlice = createSlice({
  name: "superAdminAppointment",
  initialState,

  reducers: {
    clearSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    },

    clearAppointmentError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ======================================
    // GET ALL
    // ======================================
    builder
      .addCase(
        fetchSuperAdminAppointments.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSuperAdminAppointments.fulfilled,
        (state, action) => {
          state.loading = false;
          state.appointments = action.payload;
        }
      )

      .addCase(
        fetchSuperAdminAppointments.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // ======================================
    // GET BY ID
    // ======================================
    builder
      .addCase(
        fetchSuperAdminAppointmentById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSuperAdminAppointmentById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedAppointment = action.payload;
        }
      )

      .addCase(
        fetchSuperAdminAppointmentById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // ======================================
    // UPDATE STATUS
    // ======================================
    builder
      .addCase(
        updateSuperAdminAppointmentStatus.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
        }
      )

      .addCase(
        updateSuperAdminAppointmentStatus.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          const updatedAppointment = action.payload;

          const index = state.appointments.findIndex(
            (appointment) =>
              appointment.id === updatedAppointment.id
          );

          if (index !== -1) {
            state.appointments[index] = {
              ...state.appointments[index],
              ...updatedAppointment,
            };
          }

          if (
            state.selectedAppointment?.id ===
            updatedAppointment.id
          ) {
            state.selectedAppointment = {
              ...state.selectedAppointment,
              ...updatedAppointment,
            };
          }
        }
      )

      .addCase(
        updateSuperAdminAppointmentStatus.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error = action.payload;
        }
      );

    // ======================================
    // UPDATE REMARKS
    // ======================================
    builder
      .addCase(
        updateSuperAdminAppointmentRemarks.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
        }
      )

      .addCase(
        updateSuperAdminAppointmentRemarks.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          const updatedAppointment = action.payload;

          const index = state.appointments.findIndex(
            (appointment) =>
              appointment.id === updatedAppointment.id
          );

          if (index !== -1) {
            state.appointments[index] = {
              ...state.appointments[index],
              ...updatedAppointment,
            };
          }

          if (
            state.selectedAppointment?.id ===
            updatedAppointment.id
          ) {
            state.selectedAppointment = {
              ...state.selectedAppointment,
              ...updatedAppointment,
            };
          }
        }
      )

      .addCase(
        updateSuperAdminAppointmentRemarks.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearSelectedAppointment,
  clearAppointmentError,
} = superAdminAppointmentSlice.actions;

export default superAdminAppointmentSlice.reducer;