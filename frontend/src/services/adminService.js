import API from "./api";

export const getAllUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await API.delete(`/admin/users/${id}`);
  return res.data;
};

export const updateUserStatus = async (id, status) => {
  const res = await API.put(`/admin/users/${id}/status`, {
    status,
  });

  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await API.put(`/admin/users/${id}/role`, {
    role,
  });

  return res.data;
};