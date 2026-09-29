import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const SuperAdminAddUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
    email: "",
    password: "",
    role: "customer",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.full_name ||
      !formData.mobile ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/super-admin/users`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("User added successfully.");

      navigate("/super-admin/users");
    } catch (err) {
      console.error(
        "ADD USER ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to add user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3
            className="mb-1"
            style={{
              fontWeight: "700",
              color: "#111111",
            }}
          >
            Add User
          </h3>

          <p
            className="mb-0"
            style={{ color: "#666666" }}
          >
            Create a new user for the Super Admin system.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={() => navigate("/super-admin/users")}
          style={{
            border: "1px solid #111111",
            color: "#111111",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Users
        </button>
      </div>

      {/* Form Card */}
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
            User Information
          </h5>
        </div>

        <div className="card-body p-4">
          {error && (
            <div
              className="alert alert-danger"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">

              {/* Full Name */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Mobile */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Mobile
                </label>

                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter mobile number"
                  required
                />
              </div>

              {/* Email */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter email"
                  required
                />
              </div>

              {/* Password */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter password"
                  required
                />
              </div>

              {/* Role */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="customer">
                    Customer
                  </option>

                  <option value="field_executive">
                    Field Executive
                  </option>

                  <option value="legal">
                    Legal
                  </option>

                  <option value="security">
                    Security
                  </option>

                  <option value="admin">
                    Admin
                  </option>

                  <option value="super_admin">
                    Super Admin
                  </option>
                </select>
              </div>

              {/* Status */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div
              className="d-flex justify-content-end gap-2 mt-4"
              style={{
                borderTop: "1px solid #EEEEEE",
                paddingTop: "20px",
              }}
            >
              <button
                type="button"
                className="btn"
                onClick={() =>
                  navigate("/super-admin/users")
                }
                disabled={loading}
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
                disabled={loading}
                style={{
                  backgroundColor: "#C9A227",
                  color: "#111111",
                  border: "1px solid #C9A227",
                  fontWeight: "600",
                }}
              >
                <FaSave className="me-2" />

                {loading
                  ? "Saving..."
                  : "Save User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAddUser;