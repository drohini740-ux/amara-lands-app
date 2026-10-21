
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    mobile: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    try {
      const res = await API.post("/auth/register", form);

      toast.success(res.data.message || "Registration successful.");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed."
      );
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-lg-6 d-flex align-items-center justify-content-center">
          <div
            className="card p-5 shadow"
            style={{ width: "500px", maxWidth: "100%" }}
          >
            <h2 className="fw-bold mb-4">Create Account</h2>

            <form onSubmit={handleRegister}>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Full Name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                autoComplete="name"
                required
              />

              <input
                type="tel"
                className="form-control mb-3"
                placeholder="Mobile"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                autoComplete="tel"
                required
              />

              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password (minimum 8 characters)"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <input
                type="password"
                className="form-control mb-4"
                placeholder="Confirm Password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="submit"
                className="btn btn-success w-100"
              >
                Register
              </button>
            </form>

            <div className="text-center mt-4">
              Already have an account?
              <Link to="/login" className="ms-2">
                Login
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-6 bg-success text-white d-none d-lg-flex align-items-center justify-content-center">
          <div>
            <h1 className="display-5">Amara Lands</h1>
            <p>Secure Land Management Solution</p>
          </div>
        </div>
      </div>
    </div>
  );
}
