
import API from "./api";

// Security Portal Appointment API Service

// Get all appointments
const getAppointments = async () => {
  const response = await API.get("/appointments");
  return response.data;
};

// Get one appointment by ID
const getAppointmentById = async (id) => {
  const response = await API.get(`/appointments/${id}`);
  return response.data;
};

// Create an appointment
const createAppointment = async (appointmentData) => {
  const response = await API.post("/appointments", appointmentData);
  return response.data;
};

// Update an appointment
const updateAppointment = async (id, appointmentData) => {
  const response = await API.put(
    `/appointments/${id}`,
    appointmentData
  );
  return response.data;
};

// Delete an appointment
const deleteAppointment = async (id) => {
  const response = await API.delete(`/appointments/${id}`);
  return response.data;
};

const securityAppointmentService = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};

export default securityAppointmentService;
