import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../../services/api";
import { updateSecurityReport } from "../../../redux/securityReportSlice";

export default function EditSecurityReport() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);

  const [formData, setFormData] = useState({
    property_id: "",
    report_type: "",
    report_status: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchReport();
    fetchProperties();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await api.get(`/security-reports/${id}`);

      setFormData({
        property_id: res.data.report.property_id,
        report_type: res.data.report.report_type,
        report_status: res.data.report.report_status,
        description: res.data.report.description,
        latitude: res.data.report.latitude,
        longitude: res.data.report.longitude,
      });

    } catch (err) {
      console.log(err);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await api.get("/properties");

      setProperties(res.data.properties);

    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        updateSecurityReport({
          id,
          data: formData,
        })
      ).unwrap();

      alert("Security Report Updated Successfully");

     navigate("/security-reports");

    } catch (err) {
      console.log(err);

      alert("Failed to update report");
    }
  };

  return (
    <div className="container-fluid p-4">

      <div className="card shadow">

        <div className="card-header bg-warning">
          <h4>Edit Security Report</h4>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>Property</label>

              <select
                className="form-select"
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
              >
                <option value="">Select Property</option>

                {properties.map((property) => (
                  <option
                    key={property.id}
                    value={property.id}
                  >
                    {property.property_name}
                  </option>
                ))}

              </select>
            </div>

            <div className="mb-3">
              <label>Report Type</label>

              <input
                className="form-control"
                name="report_type"
                value={formData.report_type}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Status</label>

              <select
                className="form-select"
                name="report_status"
                value={formData.report_status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Description</label>

              <textarea
                className="form-control"
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="row">

              <div className="col-md-6">

                <label>Latitude</label>

                <input
                  className="form-control"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                />

              </div>

              <div className="col-md-6">

                <label>Longitude</label>

                <input
                  className="form-control"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                />

              </div>

            </div>

            <div className="mt-4">

              <button
                type="submit"
                className="btn btn-success me-2"
              >
                Update Report
              </button>

              <button
                type="button"
                className="btn btn-secondary"
               onClick={() => navigate("/security-reports")}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}