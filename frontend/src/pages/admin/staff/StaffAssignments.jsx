import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaEye,
  FaPlus,
  FaSearch,
  FaTrash,
  FaSyncAlt,
} from "react-icons/fa";
import API from "../../../services/api";

const statusBadge = {
  Pending: "warning",
  Active: "success",
  Completed: "primary",
  Cancelled: "secondary",
};

const formatRole = (role) =>
  role
    ? role
        .split("_")
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .join(" ")
    : "-";

export default function StaffAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    staff_id: "",
    property_id: "",
  });

  const [staff, setStaff] = useState([]);
  const [properties, setProperties] = useState([]);

  const fetchStaff = async () => {
    const response = await API.get("/admin/staff-assignments/staff");
    setStaff(response.data?.data || []);
  };

  const fetchProperties = async () => {
    const response = await API.get("/admin/staff-assignments/properties");
    setProperties(response.data?.data || []);
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);

      const params = {};

      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.status) params.status = filters.status;
      if (filters.staff_id) params.staff_id = filters.staff_id;
      if (filters.property_id) params.property_id = filters.property_id;

      const response = await API.get("/admin/staff-assignments", { params });

      setAssignments(response.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to load staff assignments"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [assignmentResponse, staffResponse, propertyResponse] =
        await Promise.all([
          API.get("/admin/staff-assignments"),
          API.get("/admin/staff-assignments/staff"),
          API.get("/admin/staff-assignments/properties"),
        ]);

      setAssignments(assignmentResponse.data?.data || []);
      setStaff(staffResponse.data?.data || []);
      setProperties(propertyResponse.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to load staff management data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleFilterChange = (event) => {
    setFilters((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchAssignments();
  };

  const clearFilters = async () => {
    setFilters({
      search: "",
      status: "",
      staff_id: "",
      property_id: "",
    });

    try {
      setLoading(true);
      const response = await API.get("/admin/staff-assignments");
      setAssignments(response.data?.data || []);
    } catch (error) {
      toast.error("Failed to clear filters");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this staff assignment?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await API.delete(`/admin/staff-assignments/${id}`);

      toast.success(response.data?.message || "Assignment deleted");

      setAssignments((previous) =>
        previous.filter((assignment) => assignment.id !== id)
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to delete assignment"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold mb-1">Staff Assignment</h2>
          <p className="text-muted mb-0">
            Assign field executives, legal staff and security staff to properties.
          </p>
        </div>

        <Link to="/admin/staff/add" className="btn btn-dark">
          <FaPlus className="me-2" />
          New Assignment
        </Link>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-lg-4">
                <label className="form-label">Search</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    name="search"
                    className="form-control"
                    placeholder="Staff, property, survey number..."
                    value={filters.search}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              <div className="col-lg-2 col-md-4">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="col-lg-3 col-md-4">
                <label className="form-label">Staff</label>
                <select
                  name="staff_id"
                  className="form-select"
                  value={filters.staff_id}
                  onChange={handleFilterChange}
                >
                  <option value="">All Staff</option>
                  {staff.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.full_name} - {formatRole(item.role)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-lg-3 col-md-4">
                <label className="form-label">Property</label>
                <select
                  name="property_id"
                  className="form-select"
                  value={filters.property_id}
                  onChange={handleFilterChange}
                >
                  <option value="">All Properties</option>
                  {properties.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.property_name} - {item.survey_number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-dark">
                  <FaSearch className="me-2" />
                  Search
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                >
                  Clear
                </button>

                <button
                  type="button"
                  className="btn btn-outline-primary ms-auto"
                  onClick={loadInitialData}
                  title="Refresh"
                >
                  <FaSyncAlt />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Staff</th>
                  <th>Property</th>
                  <th>Assignment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      Loading staff assignments...
                    </td>
                  </tr>
                ) : assignments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No staff assignments found.
                    </td>
                  </tr>
                ) : (
                  assignments.map((assignment, index) => (
                    <tr key={assignment.id}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="fw-semibold">
                          {assignment.staff_name}
                        </div>
                        <small className="text-muted">
                          {formatRole(assignment.staff_role)}
                        </small>
                        <br />
                        <small className="text-muted">
                          {assignment.staff_email}
                        </small>
                      </td>

                      <td>
                        <div className="fw-semibold">
                          {assignment.property_name}
                        </div>
                        <small className="text-muted">
                          Survey: {assignment.survey_number}
                        </small>
                        <br />
                        <small className="text-muted">
                          {assignment.city || "-"}
                        </small>
                      </td>

                      <td>{assignment.assignment_type}</td>

                      <td>
                        {assignment.assignment_date
                          ? new Date(
                              `${assignment.assignment_date}T00:00:00`
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <span
                          className={`badge text-bg-${
                            statusBadge[assignment.status] || "secondary"
                          }`}
                        >
                          {assignment.status}
                        </span>
                      </td>

                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Link
                            to={`/admin/staff/view/${assignment.id}`}
                            className="btn btn-sm btn-outline-primary"
                            title="View"
                          >
                            <FaEye />
                          </Link>

                          <Link
                            to={`/admin/staff/edit/${assignment.id}`}
                            className="btn btn-sm btn-outline-warning"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            disabled={deletingId === assignment.id}
                            onClick={() => handleDelete(assignment.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
