import api from "./api";

// Get All Tickets
export const getTickets = async () => {
  const response = await api.get("/support-tickets");
  return response.data;
};

// Get Single Ticket
export const getTicket = async (id) => {
  const response = await api.get(`/support-tickets/${id}`);
  return response.data;
};

// Add Ticket
export const addTicket = async (ticketData) => {
  const response = await api.post("/support-tickets", ticketData);
  return response.data;
};

// Update Ticket
export const updateTicket = async (id, ticketData) => {
  const response = await api.put(`/support-tickets/${id}`, ticketData);
  return response.data;
};

// Delete Ticket
export const deleteTicket = async (id) => {
  const response = await api.delete(`/support-tickets/${id}`);
  return response.data;
};