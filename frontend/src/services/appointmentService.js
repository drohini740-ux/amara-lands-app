import api from "./api";

export const getAppointments = async () => {
  const res = await api.get("/appointments");
  return res.data;
};

export const getAppointment = async (id) => {
  const res = await api.get(`/appointments/${id}`);
  return res.data;
};

export const addAppointment = async (data) => {
  const res = await api.post("/appointments", data);
  return res.data;
};

export const updateAppointment = async (id, data) => {
  const res = await api.put(`/appointments/${id}`, data);
  return res.data;
};

export const deleteAppointment = async (id) => {
  const res = await api.delete(`/appointments/${id}`);
  return res.data;
};