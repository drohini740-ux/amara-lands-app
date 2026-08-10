import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import API from "../../../services/api";
import { toast } from "react-toastify";

export default function ViewUser() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await API.get(`/admin/users/${id}`);

      if (res.data.success) {
        setUser(res.data.user);
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

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading user...</h4>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger">
          User not found
        </div>

        <Link
          to="/admin/users"
          className="btn btn-secondary"
        >
          <FaArrowLeft className="me-2" />
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold">
            User Details
          </h2>

          <p className="text-muted">
            View user information
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

          <div className="row">

            <div className="col-md-6 mb-3">
              <label className="fw-bold">
                User ID
              </label>

              <p className="form-control">
                {user.id}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold">
                Full Name
              </label>

              <p className="form-control">
                {user.full_name}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold">
                Email
              </label>

              <p className="form-control">
                {user.email}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold">
                Mobile
              </label>

              <p className="form-control">
                {user.mobile}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold">
                Role
              </label>

              <p>
                <span className="badge bg-primary">
                  {user.role}
                </span>
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold">
                Status
              </label>

              <p>
                <span
                  className={`badge ${
                    user.status === "active"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {user.status}
                </span>
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold">
                Created At
              </label>

              <p className="form-control">
                {new Date(
                  user.created_at
                ).toLocaleString()}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}