import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

import { useNavigate } from "react-router-dom";

export default function SecurityReports() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { reports, loading } = useSelector(
    (state) => state.securityReports
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchSecurityReports());
  }, [dispatch]);

  const filteredReports = reports?.filter((report) =>
    report.report_type?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmDelete) return;

    try {
      await dispatch(removeSecurityReport(id)).unwrap();

      alert("Security Report Deleted Successfully");
    } catch (error) {
      console.log(error);

      alert("Failed to delete report");
    }
  };

  if (loading) {
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
              placeholder="Search report..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>
      </div>

      <div className="card shadow-sm">

        <div className="card-header bg-white">
          <h5 className="mb-0">Security Report List</h5>
        </div>

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead className="table-dark">

                <tr>
                  <th>Property</th>
                  <th>User</th>
                  <th>Report Type</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredReports?.length > 0 ? (

                  filteredReports.map((report) => (

                    <tr key={report.id}>

                      <td>{report.property_name}</td>

                      <td>{report.user_name}</td>

                      <td>{report.report_type}</td>

                      <td>
                        <span className="badge bg-warning text-dark">
                          {report.report_status}
                        </span>
                      </td>

                      <td>
                        {new Date(report.created_at).toLocaleDateString()}
                      </td>

                      <td>

                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() =>
                            navigate(`/security-reports/view/${report.id}`)
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() =>
                            navigate(`/security-reports/edit/${report.id}`)
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(report.id)}
                        >
                          <FaTrash />
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td colSpan="6" className="text-center">
                      No Security Reports Found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}