import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeoReport } from "../../../redux/geoTaggedReportSlice";
import { useParams, useNavigate } from "react-router-dom";

export default function ViewGeoTaggedReport() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { report } = useSelector((state) => state.geoReports);

  useEffect(() => {
    dispatch(fetchGeoReport(id));
  }, [dispatch, id]);

  if (!report) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">

      <div className="card shadow">

        <div className="card-header bg-info text-white">
          <h4>View Geo Tagged Report</h4>
        </div>

        <div className="card-body">

          <table className="table table-bordered">

            <tbody>

              <tr>
                <th width="250">Report Title</th>
                <td>{report.report_title}</td>
              </tr>

              <tr>
                <th>Property</th>
                <td>{report.property_name}</td>
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
                <th>Location Address</th>
                <td>{report.location_address}</td>
              </tr>

              <tr>
                <th>Description</th>
                <td>{report.description}</td>
              </tr>

              <tr>
                <th>Image URL</th>
                <td>{report.image_url}</td>
              </tr>

              <tr>
                <th>Created At</th>
                <td>{report.created_at}</td>
              </tr>

            </tbody>

          </table>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/geo-tagged-reports")}
          >
            Back
          </button>

        </div>

      </div>

    </div>
  );
}