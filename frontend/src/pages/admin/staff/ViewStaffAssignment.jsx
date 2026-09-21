import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import API from "../../../services/api";

const formatRole = (role) =>
  role
    ? role
        .split("_")
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .join(" ")
    : "-";

export default function ViewStaffAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        const response = await API.get(`/admin/staff-assignments/${id}`);
        setAssignment(response.data?.data || null);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to load assignment"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAssignment();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this staff assignment?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await API.delete(`/admin/staff-assignments/${id}`);

      toast.success(response.data?.message || "Assignment deleted");

      navigate("/admin/staff");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to delete assignment"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (!assignment) {
    return (
      <div className="alert alert-warning">
        Staff assignment not found.
        <div className="mt-3">
          <Link to="/admin/staff" className="btn btn-dark">
            Back to Staff Assignment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold mb-1">Staff Assignment Details</h2>
          <p className="text-muted mb-0">
            Assignment #{assignment.id}
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/admin/staff" className="btn btn-outline-secondary">
            <FaArrowLeft className="me-2" />
            Back
          </Link>

          <Link
            to={`/admin/staff/edit/${assignment.id}`}
            className="btn btn-warning"
          >
            <FaEdit className="me-2" />
            Edit
          </Link>

          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            <FaTrash className="me-2" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white">
              Staff Information
            </div>

            <div className="card-body">
              <Detail label="Name" value={assignment.staff_name} />
              <Detail
                label="Role"
                value={formatRole(assignment.staff_role)}
              />
              <Detail label="Email" value={assignment.staff_email} />
              <Detail label="Mobile" value={assignment.staff_mobile} />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white">
              Property Information
            </div>

            <div className="card-body">
              <Detail label="Property" value={assignment.property_name} />
              <Detail
                label="Survey Number"
                value={assignment.survey_number}
              />
              <Detail label="City" value={assignment.city} />
              <Detail label="State" value={assignment.state} />
              <Detail
                label="Verification"
                value={assignment.verification_status}
              />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white">
              Assignment Information
            </div>

            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <Detail
                    label="Assignment Type"
                    value={assignment.assignment_type}
                  />
                </div>

                <div className="col-md-4">
                  <Detail
                    label="Assignment Date"
                    value={
                      assignment.assignment_date
                        ? new Date(
                            `${assignment.assignment_date}T00:00:00`
                          ).toLocaleDateString()
                        : "-"
                    }
                  />
                </div>

                <div className="col-md-4">
                  <Detail label="Status" value={assignment.status} />
                </div>

                <div className="col-12">
                  <Detail
                    label="Notes"
                    value={assignment.notes || "No notes added."}
                  />
                </div>

                <div className="col-md-6">
                  <Detail
                    label="Assigned By"
                    value={assignment.assigned_by_name || "Admin"}
                  />
                </div>

                <div className="col-md-6">
                  <Detail
                    label="Created At"
                    value={
                      assignment.created_at
                        ? new Date(assignment.created_at).toLocaleString()
                        : "-"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="mb-3">
      <div className="small text-muted">{label}</div>
      <div className="fw-semibold">{value || "-"}</div>
    </div>
  );
}
