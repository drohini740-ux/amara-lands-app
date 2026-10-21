
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";

// =====================================================
// FETCH MY APPOINTMENTS
// =====================================================

export const fetchFieldExecutiveAppointments = createAsyncThunk(
  "fieldExecutiveAppointment/fetchAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/field/appointments");

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to fetch appointments."
        );
      }

      return response.data.appointments || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch appointments."
      );
    }
  }
);

// =====================================================
// FETCH APPOINTMENT BY ID
// =====================================================

export const fetchFieldExecutiveAppointmentById = createAsyncThunk(
  "fieldExecutiveAppointment/fetchAppointmentById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/field/appointments/${id}`);

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Unable to fetch appointment."
        );
      }

      return response.data.appointment;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch appointment."
      );
    }
  }
);

// =====================================================
// UPDATE APPOINTMENT STATUS
// =====================================================

export const updateFieldExecutiveAppointmentStatus = createAsyncThunk(
  "fieldExecutiveAppointment/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `/field/appointments/${id}/status`,
        { status }
      );

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message ||
            "Unable to update appointment status."
        );
      }

      return response.data.appointment;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to update appointment status."
      );
    }
  }
);

// =====================================================
// SLICE
// =====================================================

const fieldExecutiveAppointmentSlice = createSlice({
  name: "fieldExecutiveAppointment",

  initialState: {
    appointments: [],
    selectedAppointment: null,
    loading: false,
    detailsLoading: false,
    actionLoading: false,
    error: null,
    detailsError: null,
    actionError: null,
    successMessage: null,
  },

  reducers: {
    clearSelectedAppointment: (state) => {
      state.selectedAppointment = null;
      state.detailsError = null;
    },

    clearAppointmentError: (state) => {
      state.error = null;
      state.detailsError = null;
      state.actionError = null;
    },

    clearAppointmentSuccess: (state) => {
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    // FETCH APPOINTMENTS
    builder
      .addCase(fetchFieldExecutiveAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFieldExecutiveAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchFieldExecutiveAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to fetch appointments.";
      });

    // FETCH APPOINTMENT DETAILS
    builder
      .addCase(fetchFieldExecutiveAppointmentById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
        state.selectedAppointment = null;
      })
      .addCase(
        fetchFieldExecutiveAppointmentById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.selectedAppointment = action.payload;
        }
      )
      .addCase(
        fetchFieldExecutiveAppointmentById.rejected,
        (state, action) => {
          state.detailsLoading = false;
          state.detailsError =
            action.payload || "Unable to fetch appointment.";
        }
      );

    // UPDATE APPOINTMENT STATUS
    builder
      .addCase(updateFieldExecutiveAppointmentStatus.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(
        updateFieldExecutiveAppointmentStatus.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const updatedAppointment = action.payload;

          if (!updatedAppointment) {
            state.actionError =
              "Appointment updated, but no appointment data was returned.";
            return;
          }

          state.successMessage =
            "Appointment status updated successfully.";

          state.appointments = state.appointments.map((appointment) =>
            appointment.id === updatedAppointment.id
              ? { ...appointment, ...updatedAppointment }
              : appointment
          );

          if (
            state.selectedAppointment?.id === updatedAppointment.id
          ) {
            state.selectedAppointment = {
              ...state.selectedAppointment,
              ...updatedAppointment,
            };
          }
        }
      )
      .addCase(
        updateFieldExecutiveAppointmentStatus.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.actionError =
            action.payload || "Unable to update appointment status.";
        }
      );
  },
});

export const {
  clearSelectedAppointment,
  clearAppointmentError,
  clearAppointmentSuccess,
} = fieldExecutiveAppointmentSlice.actions;

export default fieldExecutiveAppointmentSlice.reducer;
