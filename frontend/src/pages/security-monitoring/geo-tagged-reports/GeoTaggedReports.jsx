import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGeoReports,
  removeGeoReport,
} from "../../../redux/geoTaggedReportSlice";

import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function GeoTaggedReports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { reports, loading } = useSelector(
    (state) => state.geoReports
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchGeoReports());
  }, [dispatch]);

  const filteredReports = reports?.filter((report) =>
    report.report_title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;

    try {
      await dispatch(removeGeoReport(id)).unwrap();
      alert("Geo Tagged Report Deleted Successfully");
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading Geo Tagged Reports...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold">Geo Tagged Reports</h2>
          <p className="text-muted">
            Manage Geo Tagged Reports
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/geo-tagged-reports/add")}
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
              placeholder="Search Report..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

      </div>

      <div className="card shadow-sm">

        <div className="card-header">
          <h5 className="mb-0">Geo Tagged Reports</h5>
        </div>

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-hover">

              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Property</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredReports?.length > 0 ? (

                  filteredReports.map((report) => (

                    <tr key={report.id}>

                      <td>{report.report_title}</td>

                      <td>{report.property_name}</td>

                      <td>{report.latitude}</td>

                      <td>{report.longitude}</td>

                      <td>

                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() =>
                            navigate(`/geo-tagged-reports/view/${report.id}`)
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() =>
                            navigate(`/geo-tagged-reports/edit/${report.id}`)
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(report.id)}
                        >
                          <FaTrash />
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td colSpan="5" className="text-center">
                      No Geo Tagged Reports Found
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