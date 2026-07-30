import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import { fetchSecurityReport } from "../../../redux/securityReportSlice";

export default function ViewSecurityReport() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { report, loading } = useSelector(
    (state) => state.securityReports
  );

  useEffect(() => {
    dispatch(fetchSecurityReport(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading...</h4>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container-fluid p-4">
        <h4>No Report Found</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">

      <div className="card shadow">

        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">View Security Report</h4>
        </div>

        <div className="card-body">

          <table className="table table-bordered">

            <tbody>

              <tr>
                <th width="250">Property</th>
                <td>{report.property_name}</td>
              </tr>

              <tr>
                <th>User</th>
                <td>{report.user_name}</td>
              </tr>

              <tr>
                <th>Report Type</th>
                <td>{report.report_type}</td>
              </tr>

              <tr>
                <th>Status</th>
                <td>
                  <span className="badge bg-warning text-dark">
                    {report.report_status}
                  </span>
                </td>
              </tr>

              <tr>
                <th>Description</th>
                <td>{report.description}</td>
              </tr>

              <tr>
                <th>Latitude</th>
                <td>{report.latitude}</td>
              </tr>

              <tr>
                <th>Longitude</th>
                <td>{report.longitude}</td>
              </tr>

              <tr>
                <th>Created At</th>
                <td>
                  {new Date(report.created_at).toLocaleString()}
                </td>
              </tr>

            </tbody>

          </table>

          <Link
            to="/security-reports"
            className="btn btn-secondary"
          >
            Back
          </Link>

        </div>

      </div>

    </div>
  );
}