
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const SuperAdminEditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
    email: "",
    role: "customer",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH USER
  // =====================================================

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/super-admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Super Admin User Response:",
        response.data
      );

      if (response.data?.success) {
        const user = response.data.user;

        setFormData({
          full_name: user.full_name || "",
          mobile: user.mobile || "",
          email: user.email || "",
          role: user.role || "customer",
          status: user.status || "active",
        });
      } else {
        setError(
          response.data?.message ||
            "Failed to fetch user."
        );
      }
    } catch (err) {
      console.error(
        "FETCH SUPER ADMIN USER ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load user."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    fetchUser();
  }, [id]);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // UPDATE USER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.full_name ||
      !formData.mobile ||
      !formData.email ||
      !formData.role ||
      !formData.status
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/super-admin/users/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Update User Response:",
        response.data
      );

      if (response.data?.success) {
        alert("User updated successfully.");

        navigate("/super-admin/users");
      } else {
        setError(
          response.data?.message ||
            "Failed to update user."
        );
      }
    } catch (err) {
      console.error(
        "UPDATE SUPER ADMIN USER ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to update user."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{
            color: "#C9A227",
          }}
        />

        <p className="mt-3">
          Loading user...
        </p>
      </div>
    );
  }

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
            Edit User
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Update user information and access details.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={() =>
            navigate("/super-admin/users")
          }
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

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* FORM */}
      {/* ================================================= */}

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
          <form onSubmit={handleSubmit}>
            <div className="row">

              {/* FULL NAME */}

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

              {/* MOBILE */}

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

              {/* EMAIL */}

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

              {/* ROLE */}

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

              {/* STATUS */}

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

              {/* USER ID */}

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  User ID
                </label>

                <input
                  type="text"
                  value={id}
                  className="form-control"
                  disabled
                />
              </div>
            </div>

            {/* BUTTONS */}

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
                  ? "Updating..."
                  : "Update User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminEditUser;

