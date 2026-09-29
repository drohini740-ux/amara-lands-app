import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaKey,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const SuperAdminRolePermissions = () => {
  const navigate = useNavigate();
  const { roleId } = useParams();

  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [assignedPermissions, setAssignedPermissions] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  // FETCH ALL PERMISSIONS
  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/super-admin/permissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setPermissions(
          response.data.permissions || []
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load permissions."
      );
    }
  };

  // FETCH ROLE PERMISSIONS
  const fetchRolePermissions = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/super-admin/permissions/role/${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setRole(response.data.role);

        setAssignedPermissions(
          response.data.permissions || []
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load role permissions."
      );
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchPermissions(),
        fetchRolePermissions(),
      ]);

      setLoading(false);
    };

    loadData();
  }, [roleId]);

  // CHECK WHETHER PERMISSION IS ASSIGNED
  const isPermissionAssigned = (permissionId) => {
    return assignedPermissions.some(
      (permission) =>
        Number(permission.id) === Number(permissionId)
    );
  };

  // ASSIGN / REMOVE PERMISSION
  const handlePermissionToggle = async (
    permission
  ) => {
    const assigned = isPermissionAssigned(
      permission.id
    );

    try {
      setProcessingId(permission.id);

      const token = localStorage.getItem("token");

      if (!assigned) {
        // ASSIGN
        const response = await axios.post(
          `${API_URL}/super-admin/permissions/role/${roleId}`,
          {
            permission_id: permission.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data?.success) {
          await fetchRolePermissions();
        } else {
          alert(
            response.data?.message ||
              "Failed to assign permission."
          );
        }
      } else {
        // REMOVE
        const confirmed = window.confirm(
          `Remove "${permission.permission_name}" from this role?`
        );

        if (!confirmed) {
          setProcessingId(null);
          return;
        }

        const response = await axios.delete(
          `${API_URL}/super-admin/permissions/role/${roleId}/permission/${permission.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.success) {
          await fetchRolePermissions();
        } else {
          alert(
            response.data?.message ||
              "Failed to remove permission."
          );
        }
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update permission."
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3
            className="mb-1"
            style={{
              fontWeight: "700",
              color: "#111111",
            }}
          >
            Role Permissions
          </h3>

          <p
            className="mb-0"
            style={{ color: "#777777" }}
          >
            Assign and manage permissions for this role.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={() =>
            navigate("/super-admin/roles")
          }
          style={{
            backgroundColor: "#FFFFFF",
            color: "#111111",
            border: "1px solid #111111",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Roles
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ROLE INFORMATION */}
      {role && (
        <div
          className="card border-0 shadow-sm mb-4"
          style={{
            borderRadius: "10px",
            backgroundColor: "#111111",
          }}
        >
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div
                className="d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#C9A227",
                  color: "#111111",
                  fontSize: "20px",
                }}
              >
                <FaKey />
              </div>

              <div>
                <small
                  style={{
                    color: "#C9A227",
                  }}
                >
                  Selected Role
                </small>

                <h4
                  className="mb-0"
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "700",
                  }}
                >
                  {role.role_name}
                </h4>
              </div>

              <div className="ms-auto text-end">
                <small
                  style={{
                    color: "#AAAAAA",
                  }}
                >
                  Assigned Permissions
                </small>

                <h4
                  className="mb-0"
                  style={{
                    color: "#C9A227",
                    fontWeight: "700",
                  }}
                >
                  {assignedPermissions.length}
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PERMISSIONS */}
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
          <h5 className="mb-0">
            Available Permissions
          </h5>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{
                  color: "#C9A227",
                }}
              />

              <p className="mt-3 mb-0">
                Loading permissions...
              </p>
            </div>
          ) : permissions.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-0">
                No permissions found.
              </p>
            </div>
          ) : (
            <div className="row g-3">
              {permissions.map((permission) => {
                const assigned =
                  isPermissionAssigned(
                    permission.id
                  );

                const processing =
                  processingId === permission.id;

                return (
                  <div
                    className="col-md-6 col-lg-4"
                    key={permission.id}
                  >
                    <div
                      className="border rounded p-3 h-100"
                      style={{
                        borderColor: assigned
                          ? "#C9A227"
                          : "#DDDDDD",
                        backgroundColor: assigned
                          ? "#FFFDF3"
                          : "#FFFFFF",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div
                            style={{
                              fontWeight: "700",
                              color: "#111111",
                            }}
                          >
                            {permission.permission_name}
                          </div>

                          <small
                            style={{
                              color: "#777777",
                            }}
                          >
                            {permission.description}
                          </small>
                        </div>

                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: assigned
                              ? "#198754"
                              : "#777777",
                          }}
                        >
                          {assigned
                            ? "Assigned"
                            : "Not Assigned"}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm w-100 mt-3"
                        disabled={processing}
                        onClick={() =>
                          handlePermissionToggle(
                            permission
                          )
                        }
                        style={{
                          backgroundColor: assigned
                            ? "#FFFFFF"
                            : "#111111",
                          color: assigned
                            ? "#dc3545"
                            : "#FFFFFF",
                          border: assigned
                            ? "1px solid #dc3545"
                            : "1px solid #111111",
                        }}
                      >
                        {processing ? (
                          "Processing..."
                        ) : assigned ? (
                          <>
                            <FaTimes className="me-2" />
                            Remove Permission
                          </>
                        ) : (
                          <>
                            <FaCheck className="me-2" />
                            Assign Permission
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminRolePermissions;