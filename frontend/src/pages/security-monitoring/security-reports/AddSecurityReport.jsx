import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { addSecurityReport } from "../../../redux/securityReportSlice";
export default function AddSecurityReport() {
   const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const [properties, setProperties] = useState([]);

  const [formData, setFormData] = useState({
    property_id: "",
    report_type: "",
    report_status: "Pending",
    description: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await api.get("/properties");

      setProperties(res.data.properties || []);
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
    await dispatch(addSecurityReport(formData)).unwrap();

    alert("Security Report Added Successfully");

    navigate("/security-reports");
  } catch (err) {
    console.log(err);

    alert("Failed to add report");
  }
};

  return (
    <div className="container-fluid p-4">

      <h2 className="mb-4">Add Security Report</h2>

      <div className="card shadow-sm">

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Property</label>

              <select
                className="form-select"
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
                required
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
                type="text"
                className="form-control"
                name="report_type"
                value={formData.report_type}
                onChange={handleChange}
                placeholder="Boundary Inspection"
                required
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
                <option>Pending</option>
                <option>Completed</option>
                <option>Critical</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Description</label>

              <textarea
                className="form-control"
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="row">

              <div className="col-md-6">

                <div className="mb-3">
                  <label>Latitude</label>

                  <input
                    type="text"
                    className="form-control"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="col-md-6">

                <div className="mb-3">
                  <label>Longitude</label>

                  <input
                    type="text"
                    className="form-control"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                  />
                </div>

              </div>

            </div>

            <button className="btn btn-success">
              Save Report
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}