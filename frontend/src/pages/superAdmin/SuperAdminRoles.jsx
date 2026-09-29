import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaKey,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const SuperAdminRoles = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/super-admin/roles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setRoles(response.data.roles || []);
      } else {
        setError(
          response.data?.message || "Failed to fetch roles."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load roles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddRole = () => {
    navigate("/super-admin/roles/add");
  };

  const handleEditRole = (role) => {
    navigate(`/super-admin/roles/edit/${role.id}`);
  };

  const handleManagePermissions = (role) => {
    navigate(`/super-admin/roles/${role.id}/permissions`);
  };

  const handleDeleteRole = async (role) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the role "${role.role_name}"?`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${API_URL}/super-admin/roles/${role.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        alert("Role deleted successfully.");
        fetchRoles();
      } else {
        alert(
          response.data?.message ||
            "Failed to delete role."
        );
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete role."
      );
    }
  };

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3
            className="mb-1"
            style={{
              fontWeight: "700",
              color: "#111111",
            }}
          >
            Roles & Permissions
          </h3>

          <p
            className="mb-0"
            style={{ color: "#777777" }}
          >
            Manage system roles and access permissions.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn"
            onClick={() =>
              navigate("/super-admin/dashboard")
            }
            style={{
              border: "1px solid #111111",
              color: "#111111",
              backgroundColor: "#FFFFFF",
            }}
          >
            <FaArrowLeft className="me-2" />
            Dashboard
          </button>

          <button
            type="button"
            className="btn"
            onClick={handleAddRole}
            style={{
              backgroundColor: "#111111",
              color: "#FFFFFF",
              border: "1px solid #111111",
            }}
          >
            <FaPlus className="me-2" />
            Add Role
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ROLES TABLE */}
      <div
        className="card border-0 shadow-sm"
        style={{
          borderRadius: "10px",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div
          className="card-header"
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
            borderRadius: "10px 10px 0 0",
            padding: "16px 20px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              System Roles
            </h5>

            <span
              style={{
                color: "#C9A227",
                fontWeight: "600",
              }}
            >
              {roles.length} Roles
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{ color: "#C9A227" }}
              />

              <p className="mt-3 mb-0">
                Loading roles...
              </p>
            </div>
          ) : roles.length === 0 ? (
            <div className="text-center py-5">
              <p className="mb-0 text-muted">
                No roles found.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead
                  style={{
                    backgroundColor: "#F5F5F5",
                  }}
                >
                  <tr>
                    <th
                      style={{
                        padding: "14px 20px",
                      }}
                    >
                      ID
                    </th>

                    <th
                      style={{
                        padding: "14px 20px",
                      }}
                    >
                      Role Name
                    </th>

                    <th
                      className="text-center"
                      style={{
                        padding: "14px 20px",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id}>
                      <td
                        style={{
                          padding: "14px 20px",
                          fontWeight: "600",
                        }}
                      >
                        {role.id}
                      </td>

                      <td
                        style={{
                          padding: "14px 20px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "600",
                            color: "#111111",
                          }}
                        >
                          {role.role_name}
                        </span>
                      </td>

                      <td
                        className="text-center"
                        style={{
                          padding: "14px 20px",
                        }}
                      >
                        <div className="d-flex justify-content-center gap-2">

                          {/* MANAGE PERMISSIONS */}
                          <button
                            type="button"
                            className="btn btn-sm"
                            title="Manage Permissions"
                            onClick={() =>
                              handleManagePermissions(role)
                            }
                            style={{
                              color: "#111111",
                              border:
                                "1px solid #111111",
                            }}
                          >
                            <FaKey />
                          </button>

                          {/* EDIT */}
                          <button
                            type="button"
                            className="btn btn-sm"
                            title="Edit Role"
                            onClick={() =>
                              handleEditRole(role)
                            }
                            style={{
                              color: "#C9A227",
                              border:
                                "1px solid #C9A227",
                            }}
                          >
                            <FaEdit />
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            className="btn btn-sm"
                            title="Delete Role"
                            onClick={() =>
                              handleDeleteRole(role)
                            }
                            style={{
                              color: "#dc3545",
                              border:
                                "1px solid #dc3545",
                            }}
                          >
                            <FaTrash />
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
    </div>
  );
};

export default SuperAdminRoles;