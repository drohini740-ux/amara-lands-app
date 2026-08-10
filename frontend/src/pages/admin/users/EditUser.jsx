import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import API from "../../../services/api";
import { toast } from "react-toastify";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    mobile: "",
    role: "customer",
    status: "active",
  });

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await API.get(`/admin/users/${id}`);

      if (res.data.success) {
        const user = res.data.user;

        setForm({
          full_name: user.full_name || "",
          email: user.email || "",
          mobile: user.mobile || "",
          role: user.role || "customer",
          status: user.status || "active",
        });
      }
    } catch (error) {
      console.error("Fetch User Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load user"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!form.mobile.trim()) {
      toast.error("Mobile number is required");
      return;
    }

    try {
      setSaving(true);

      const res = await API.put(
        `/admin/users/${id}`,
        form
      );

      if (res.data.success) {
        toast.success("User updated successfully");

        navigate("/admin/users");
      }
    } catch (error) {
      console.error("Update User Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update user"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading user...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold">
            Edit User
          </h2>

          <p className="text-muted">
            Update user information
          </p>
        </div>

        <Link
          to="/admin/users"
          className="btn btn-secondary"
        >
          <FaArrowLeft className="me-2" />
          Back to Users
        </Link>

      </div>

      <div className="card shadow">

        <div className="card-header">
          <h5 className="mb-0">
            User Information
          </h5>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row">

              {/* Full Name */}
              <div className="col-md-6 mb-3">

                <label className="form-label fw-bold">
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter full name"
                />

              </div>

              {/* Email */}
              <div className="col-md-6 mb-3">

                <label className="form-label fw-bold">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter email"
                />

              </div>

              {/* Mobile */}
              <div className="col-md-6 mb-3">

                <label className="form-label fw-bold">
                  Mobile
                </label>

                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter mobile number"
                />

              </div>

              {/* Role */}
              <div className="col-md-6 mb-3">

                <label className="form-label fw-bold">
                  Role
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="customer">
                    Customer
                  </option>

                  <option value="admin">
                    Admin
                  </option>

                  <option value="legal">
                    Legal
                  </option>

                  <option value="security">
                    Security
                  </option>

                  <option value="field_executive">
                    Field Executive
                  </option>

                  <option value="super_admin">
                    Super Admin
                  </option>
                </select>

              </div>

              {/* Status */}
              <div className="col-md-6 mb-4">

                <label className="form-label fw-bold">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
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

            <div className="d-flex gap-2">

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Updating..."
                  : "Update User"}
              </button>

              <Link
                to="/admin/users"
                className="btn btn-secondary"
              >
                Cancel
              </Link>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}