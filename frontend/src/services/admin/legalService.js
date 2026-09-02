import api from "../api";

// ==========================================
// GET ALL LEGAL CASES - ADMIN
// ==========================================

export const getAdminLegalCases = async () => {
  const res = await api.get("/admin/legal");
  return res.data;
};

// ==========================================
// GET SINGLE LEGAL CASE - ADMIN
// ==========================================

export const getAdminLegalCase = async (id) => {
  const res = await api.get(`/admin/legal/${id}`);
  return res.data;
};

// ==========================================
// UPDATE LEGAL CASE - ADMIN
// ==========================================

export const updateAdminLegalCase = async (id, data) => {
  const res = await api.put(`/admin/legal/${id}`, data);
  return res.data;
};

// ==========================================
// DELETE LEGAL CASE - ADMIN
// ==========================================

export const deleteAdminLegalCase = async (id) => {
  const res = await api.delete(`/admin/legal/${id}`);
  return res.data;
};
export const assignAdminAdvocate = async (id, advocate_name) => {
  const res = await api.put(
    `/admin/legal/${id}/assign-advocate`,
    { advocate_name }
  );

  return res.data;
};