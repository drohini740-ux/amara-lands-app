import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import API from "../../../services/api";
import { toast } from "react-toastify";
export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ===========================
  // Fetch Users
  // ===========================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/users");

      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Fetch Users Error:", error);

      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===========================
  // Delete User
  // ===========================
  const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmed) return;

  try {
    const res = await API.delete(
      `/admin/users/${id}`
    );

    if (res.data.success) {
      toast.success("User deleted successfully");

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== id)
      );
    }
  } catch (error) {
    console.error("Delete User Error:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to delete user"
    );
  }
};

  // ===========================
  // Update User Status
  // ===========================
  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const res = await API.put(`/admin/users/${id}/status`, {
        status: newStatus,
      });

      if (res.data.success) {
        toast.success("User status updated");

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id
              ? {
                  ...user,
                  status: newStatus,
                }
              : user,
          ),
        );
      }
    } catch (error) {
      console.error("Status Update Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to update user status",
      );
    }
  };

  // ===========================
  // Search
  // ===========================
  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.mobile?.includes(search),
  );
  // ===========================
  // Update User Role
  // ===========================
  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await API.put(`/admin/users/${id}/role`, {
        role: newRole,
      });

      if (res.data.success) {
        toast.success("User role updated");

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id
              ? {
                  ...user,
                  role: newRole,
                }
              : user,
          ),
        );
      }
    } catch (error) {
      console.error("Role Update Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to update user role",
      );
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* ================= HEADER ================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">User Management</h2>

          <p className="text-muted">Manage all users in the system</p>
        </div>

        <Link to="/admin/users/add" className="btn btn-primary">
          <FaPlus className="me-2" />
          Add User
        </Link>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ================= USERS TABLE ================= */}

      <div className="card shadow">
        <div className="card-header">
          <h5 className="mb-0">Users List</h5>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>

                    <td>{user.full_name}</td>

                    <td>{user.email}</td>

                    <td>{user.mobile}</td>

                    {/* ROLE */}

                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        style={{ width: "150px" }}
                      >
                        <option value="customer">Customer</option>

                        <option value="admin">Admin</option>

                        <option value="legal">Legal</option>

                        <option value="security">Security</option>

                        <option value="field_executive">Field Executive</option>

                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>

                    {/* STATUS */}

                    <td>
                      <button
                        className={`btn btn-sm ${
                          user.status === "active"
                            ? "btn-success"
                            : "btn-danger"
                        }`}
                        onClick={() => handleStatusChange(user.id, user.status)}
                      >
                        {user.status}
                      </button>
                    </td>

                    {/* CREATED */}

                    <td>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <Link
                        to={`/admin/users/view/${user.id}`}
                        className="btn btn-info btn-sm me-1"
                        title="View"
                      >
                        <FaEye />
                      </Link>

                      <Link
                        to={`/admin/users/edit/${user.id}`}
                        className="btn btn-warning btn-sm me-1"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(user.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    No Users Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
