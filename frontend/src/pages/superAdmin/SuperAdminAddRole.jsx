import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const SuperAdminAddRole = () => {
  const navigate = useNavigate();

  const [roleName, setRoleName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!roleName.trim()) {
      setError("Please enter a role name.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/super-admin/roles`,
        {
          role_name: roleName.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Create Role Response:",
        response.data
      );

      if (response.data?.success) {
        alert("Role created successfully.");

        navigate("/super-admin/roles");
      } else {
        setError(
          response.data?.message ||
            "Failed to create role."
        );
      }
    } catch (err) {
      console.error(
        "CREATE ROLE ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to create role."
      );
    } finally {
      setSaving(false);
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
            Add Role
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Create a new system role.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={() =>
            navigate("/super-admin/roles")
          }
          style={{
            border: "1px solid #111111",
            color: "#111111",
            backgroundColor: "#FFFFFF",
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

      {/* FORM */}
      <div
        className="card border-0 shadow-sm"
        style={{
          borderRadius: "10px",
          backgroundColor: "#FFFFFF",
          maxWidth: "700px",
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
            Role Information
          </h5>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Role Name
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter role name"
                value={roleName}
                onChange={(e) =>
                  setRoleName(e.target.value)
                }
                required
              />

              <small className="text-muted">
                Example: manager, accountant, support
              </small>
            </div>

            <div
              className="d-flex justify-content-end gap-2"
              style={{
                borderTop: "1px solid #EEEEEE",
                paddingTop: "20px",
              }}
            >
              <button
                type="button"
                className="btn"
                onClick={() =>
                  navigate("/super-admin/roles")
                }
                disabled={saving}
                style={{
                  border: "1px solid #CCCCCC",
                  backgroundColor: "#FFFFFF",
                  color: "#333333",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn"
                disabled={saving}
                style={{
                  backgroundColor: "#C9A227",
                  color: "#111111",
                  border: "1px solid #C9A227",
                  fontWeight: "600",
                }}
              >
                <FaSave className="me-2" />

                {saving
                  ? "Saving..."
                  : "Save Role"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAddRole;