import api from "./api";

export const getPayments = () =>
  api.get("/payments");

export const getPayment = (id) =>
  api.get(`/payments/${id}`);

export const addPayment = (data) =>
  api.post("/payments", data);

export const updatePayment = (id, data) =>
  api.put(`/payments/${id}`, data);

export const deletePayment = (id) =>
  api.delete(`/payments/${id}`);

export const createOrder = (data) =>
  api.post("/payments/create-order", data);

export const verifyPayment = (data) =>
  api.post("/payments/verify-payment", data);