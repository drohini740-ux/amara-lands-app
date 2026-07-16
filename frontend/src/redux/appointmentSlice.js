import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as appointmentService from "../services/appointmentService";

// Fetch Appointments
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async () => {
    return await appointmentService.getAppointments();
  }
);

// Add Appointment
export const createAppointment = createAsyncThunk(
  "appointments/createAppointment",
  async (data) => {
    return await appointmentService.addAppointment(data);
  }
);

// Update Appointment
export const editAppointment = createAsyncThunk(
  "appointments/editAppointment",
  async ({ id, data }) => {
    return await appointmentService.updateAppointment(id, data);
  }
);

// Delete Appointment
export const removeAppointment = createAsyncThunk(
  "appointments/removeAppointment",
  async (id) => {
    await appointmentService.deleteAppointment(id);
    return id;
  }
);

const appointmentSlice = createSlice({
  name: "appointments",

  initialState: {
    appointments: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.appointments;
      })

      .addCase(fetchAppointments.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createAppointment.fulfilled, (state, action) => {
        state.appointments.unshift(action.payload.appointment);
      })

      .addCase(editAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.map((item) =>
          item.id === action.payload.appointment.id
            ? action.payload.appointment
            : item
        );
      })

      .addCase(removeAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default appointmentSlice.reducer;