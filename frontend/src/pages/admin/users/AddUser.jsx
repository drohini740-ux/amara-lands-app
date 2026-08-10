import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import { toast } from "react-toastify";

export default function AddUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    mobile: "",
    email: "",
    password: "",
    role: "customer",
    status: "active",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/admin/users", form);

      toast.success("User Added Successfully");

      navigate("/admin/users");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to add user"
      );
    }
  };

  return (
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header">
          <h3>Add User</h3>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>Full Name</label>
              <input
                className="form-control"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Mobile</label>
              <input
                className="form-control"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Role</label>
              <select
                className="form-select"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
                <option value="legal">Legal</option>
                <option value="security">Security</option>
                <option value="field_executive">Field Executive</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Status</label>
              <select
                className="form-select"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button className="btn btn-primary">
              Save User
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}