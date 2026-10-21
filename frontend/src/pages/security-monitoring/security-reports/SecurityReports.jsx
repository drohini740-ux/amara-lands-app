import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchSecurityReports,
  removeSecurityReport,
} from "../../../redux/securityReportSlice";

import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
} from "react-icons/fa";

export default function SecurityReports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { reports, loading, error } = useSelector(
    (state) => state.securityReports
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchSecurityReports());
  }, [dispatch]);

  const filteredReports = (reports || []).filter((report) => {
    const searchText = search.toLowerCase();

    return (
      String(report.id).includes(searchText) ||
      report.property_name?.toLowerCase().includes(searchText) ||
      report.user_name?.toLowerCase().includes(searchText) ||
      report.report_type?.toLowerCase().includes(searchText) ||
      report.report_status?.toLowerCase().includes(searchText)
    );
  });

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete security report ID ${id}?`
    );

    if (!confirmDelete) return;

    try {
      await dispatch(removeSecurityReport(id)).unwrap();
      alert(`Security report ID ${id} deleted successfully.`);
    } catch (err) {
      console.error("Delete security report error:", err);
      alert(typeof err === "string" ? err : "Failed to delete report.");
    }
  };

  if (loading && (!reports || reports.length === 0)) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading Security Reports...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Security Reports</h2>
          <p className="text-muted">
            Manage security inspections and field reports
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/security-reports/add")}
        >
          <FaPlus className="me-2" />
          Add Report
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search by ID, property, user, type, or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {typeof error === "string"
            ? error
            : "Failed to load security reports."}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Security Report List</h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Report ID</th>
                  <th>Property</th>
                  <th>User</th>
                  <th>Report Type</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr key={report.id} >
                      <td className="fw-bold">#{report.id}</td>
                      <td>{report.property_name || "N/A"}</td>
                      <td>{report.user_name || "N/A"}</td>
                      <td>{report.report_type || "N/A"}</td>
                      <td>
                        <span className="badge bg-warning text-dark">
                          {report.report_status || "Unknown"}
                        </span>
                      </td>
                      <td>
                        {report.created_at
                          ? new Date(report.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="text-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-info me-2"
                          title={`View report ${report.id}`}
                          onClick={() =>
                            navigate(`/security-reports/view/${report.id}`)
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-warning me-2"
                          title={`Edit report ${report.id}`}
                          onClick={() =>
                            navigate(`/security-reports/edit/${report.id}`)
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          title={`Delete report ${report.id}`}
                          onClick={() => handleDelete(report.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No Security Reports Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="text-muted small">
            Showing {filteredReports.length} of {(reports || []).length} reports
          </div>
        </div>
      </div>
    </div>
  );
}