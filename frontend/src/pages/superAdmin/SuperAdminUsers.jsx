import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaUsers,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBan,
  FaCheckCircle,
  FaUserPlus,
  FaSync,
  FaKey,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const SuperAdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/super-admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Super Admin Users Response:", response.data);

      if (response.data?.success) {
        setUsers(response.data.users || response.data.data || []);
      } else {
        setUsers([]);
        setError(response.data?.message || "Failed to fetch users.");
      }
    } catch (err) {
      console.error(
        "Super Admin Users Error:",
        err.response?.data || err.message,
      );

      setError(err.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD USERS
  // =====================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      String(user.full_name || user.name || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(user.email || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(user.mobile || user.phone || "")
        .toLowerCase()
        .includes(searchValue);

    const matchesRole =
      roleFilter === "all" ||
      String(user.role || "").toLowerCase() === roleFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" ||
      String(user.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  // =====================================================
  // FORMAT ROLE
  // =====================================================

  const formatRole = (role) => {
    if (!role) return "-";

    return role
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString("en-IN");
    } catch {
      return "-";
    }
  };

  // =====================================================
  // ADD USER
  // =====================================================

  const handleAddUser = () => {
    navigate("/super-admin/users/add");
  };
  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";

    const action = newStatus === "inactive" ? "block" : "unblock";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.full_name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/super-admin/users/${user.id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Toggle User Status Response:", response.data);

      if (response.data?.success) {
        alert(
          newStatus === "inactive"
            ? "User blocked successfully."
            : "User unblocked successfully.",
        );

        fetchUsers();
      } else {
        alert(response.data?.message || "Failed to update user status.");
      }
    } catch (error) {
      console.error(
        "TOGGLE USER STATUS ERROR:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to update user status.");
    }
  };
  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.full_name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${API_URL}/super-admin/users/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Delete User Response:", response.data);

      if (response.data?.success) {
        alert("User deleted successfully.");

        fetchUsers();
      } else {
        alert(response.data?.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error(
        "DELETE USER ERROR:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to delete user.");
    }
  };
  const handleResetPassword = async () => {
    if (!resetUser) {
      return;
    }

    if (!newPassword) {
      alert("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setResetLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/super-admin/users/${resetUser.id}/reset-password`,
        {
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Reset Password Response:", response.data);

      if (response.data?.success) {
        alert("Password reset successfully.");

        setResetUser(null);
        setNewPassword("");
      } else {
        alert(response.data?.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3
            className="mb-1"
            style={{
              fontWeight: "700",
              color: "#111111",
            }}
          >
            User Management
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Manage all users across the Amara Lands application.
          </p>
        </div>

        <div className="d-flex gap-2">
          {/* REFRESH */}

          <button
            className="btn"
            onClick={fetchUsers}
            disabled={loading}
            style={{
              border: "1px solid #C9A227",
              color: "#C9A227",
              backgroundColor: "#FFFFFF",
            }}
          >
            <FaSync className="me-2" />
            Refresh
          </button>

          {/* ADD USER */}

          <button
            className="btn"
            onClick={handleAddUser}
            style={{
              backgroundColor: "#111111",
              color: "#FFFFFF",
              border: "1px solid #111111",
            }}
          >
            <FaUserPlus className="me-2" />
            Add User
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {/* TOTAL USERS */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft: "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">Total Users</small>

                <h3 className="mb-0 mt-2">{users.length}</h3>
              </div>

              <FaUsers
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* ACTIVE USERS */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft: "4px solid #28a745",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">Active Users</small>

                <h3 className="mb-0 mt-2">
                  {
                    users.filter(
                      (user) => String(user.status).toLowerCase() === "active",
                    ).length
                  }
                </h3>
              </div>

              <FaCheckCircle
                style={{
                  color: "#28a745",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* INACTIVE USERS */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft: "4px solid #dc3545",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">Inactive Users</small>

                <h3 className="mb-0 mt-2">
                  {
                    users.filter(
                      (user) =>
                        String(user.status).toLowerCase() === "inactive",
                    ).length
                  }
                </h3>
              </div>

              <FaBan
                style={{
                  color: "#dc3545",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* SEARCH */}

            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch
                    style={{
                      color: "#C9A227",
                    }}
                  />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email or mobile..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* ROLE */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>

                <option value="customer">Customer</option>

                <option value="field_executive">Field Executive</option>

                <option value="legal">Legal</option>

                <option value="security">Security</option>

                <option value="admin">Admin</option>

                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            {/* STATUS */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>

                <option value="active">Active</option>

                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* ================================================= */}
      {/* USERS TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>All Users</strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing {filteredUsers.length} users
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{
                  color: "#C9A227",
                }}
              />

              <p className="mt-3 mb-0">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <FaUsers
                style={{
                  fontSize: "40px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">No users found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead
                  style={{
                    backgroundColor: "#111111",
                    color: "#FFFFFF",
                  }}
                >
                  <tr>
                    <th className="px-3">ID</th>

                    <th>User</th>

                    <th>Mobile</th>

                    <th>Role</th>

                    <th>Status</th>

                    <th>Created</th>

                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-3">{user.id}</td>

                      <td>
                        <div>
                          <strong>{user.full_name || user.name || "-"}</strong>

                          <div
                            style={{
                              fontSize: "13px",
                              color: "#777777",
                            }}
                          >
                            {user.email || "-"}
                          </div>
                        </div>
                      </td>

                      <td>{user.mobile || user.phone || "-"}</td>

                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: "#F5E8B0",
                            color: "#111111",
                          }}
                        >
                          {formatRole(user.role)}
                        </span>
                      </td>

                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              String(user.status).toLowerCase() === "active"
                                ? "#DFF5E3"
                                : "#F8D7DA",

                            color:
                              String(user.status).toLowerCase() === "active"
                                ? "#198754"
                                : "#842029",
                          }}
                        >
                          {user.status || "-"}
                        </span>
                      </td>

                      <td>{formatDate(user.created_at)}</td>

                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          {/* EDIT */}

                          <button
                            className="btn btn-sm"
                            title="Edit User"
                            onClick={() =>
                              navigate(`/super-admin/users/edit/${user.id}`)
                            }
                            style={{
                              color: "#C9A227",
                              border: "1px solid #C9A227",
                            }}
                          >
                            <FaEdit />
                          </button>

                          {/* BLOCK / UNBLOCK */}

                          <button
                            className="btn btn-sm"
                            title={
                              user.status === "active"
                                ? "Block User"
                                : "Unblock User"
                            }
                            onClick={() => handleToggleStatus(user)}
                            style={{
                              color:
                                user.status === "active"
                                  ? "#dc3545"
                                  : "#198754",
                              border:
                                user.status === "active"
                                  ? "1px solid #dc3545"
                                  : "1px solid #198754",
                            }}
                          >
                            <FaBan />
                          </button>

                          {/* DELETE */}

                          <button
                            className="btn btn-sm"
                            title="Delete User"
                            onClick={() => handleDeleteUser(user)}
                            style={{
                              color: "#111111",
                              border: "1px solid #111111",
                            }}
                          >
                            <FaTrash />
                          </button>
                          <button
                            className="btn btn-sm"
                            title="Reset Password"
                            onClick={() => {
                              setResetUser(user);
                              setNewPassword("");
                            }}
                            style={{
                              color: "#C9A227",
                              border: "1px solid #C9A227",
                            }}
                          >
                            <FaKey />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {resetUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="card shadow"
            style={{
              width: "420px",
              maxWidth: "90%",
              borderRadius: "10px",
              border: "none",
            }}
          >
            <div
              className="card-header"
              style={{
                backgroundColor: "#111111",
                color: "#FFFFFF",
                padding: "16px 20px",
                borderRadius: "10px 10px 0 0",
              }}
            >
              <h5 className="mb-0">Reset Password</h5>
            </div>

            <div className="card-body p-4">
              <p>Reset password for:</p>

              <strong>{resetUser.full_name}</strong>

              <p className="text-muted mb-3" style={{ fontSize: "14px" }}>
                {resetUser.email}
              </p>

              <label className="form-label fw-semibold">New Password</label>

              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <small className="text-muted">Minimum 6 characters.</small>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setResetUser(null);
                    setNewPassword("");
                  }}
                  disabled={resetLoading}
                  style={{
                    border: "1px solid #CCCCCC",
                    backgroundColor: "#FFFFFF",
                    color: "#333333",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn"
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                  style={{
                    backgroundColor: "#C9A227",
                    color: "#111111",
                    border: "1px solid #C9A227",
                    fontWeight: "600",
                  }}
                >
                  <FaKey className="me-2" />

                  {resetLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminUsers;
