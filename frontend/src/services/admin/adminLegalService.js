import api from "../api";

// ==========================================
// Get All Legal Cases - Admin
// ==========================================

export const getAdminLegalCases = async () => {
  const res = await api.get("/admin/legal");
  return res.data;
};

// ==========================================
// Get Single Legal Case - Admin
// ==========================================

export const getAdminLegalCase = async (id) => {
  const res = await api.get(`/admin/legal/${id}`);
  return res.data;
};

// ==========================================
// Update Legal Case - Admin
// ==========================================

export const updateAdminLegalCase = async (id, data) => {
  const res = await api.put(`/admin/legal/${id}`, data);
  return res.data;
};
export const getCaseTracking = async () => {
  const res = await api.get("/admin/legal/tracking");
  return res.data;
};

// ==========================================
// Delete Legal Case - Admin
// ==========================================

export const deleteAdminLegalCase = async (id) => {
  const res = await api.delete(`/admin/legal/${id}`);
  return res.data;
};