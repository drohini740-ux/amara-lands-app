import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editGeoReport } from "../../../redux/geoTaggedReportSlice";
import { useNavigate, useParams } from "react-router-dom";
import { getGeoReport } from "../../../services/geoTaggedReportService";

export default function EditGeoTaggedReport() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    property_id: "",
    report_title: "",
    latitude: "",
    longitude: "",
    location_address: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const data = await getGeoReport(id);

      const report = data.report;

      setFormData({
        property_id: report.property_id || "",
        report_title: report.report_title || "",
        latitude: report.latitude || "",
        longitude: report.longitude || "",
        location_address: report.location_address || "",
        description: report.description || "",
        image_url: report.image_url || "",
      });
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
        editGeoReport({
          id,
          reportData: formData,
        })
      ).unwrap();

      alert("Geo Tagged Report Updated Successfully");

      navigate("/geo-tagged-reports");
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

  return (
    <div className="container-fluid p-4">

      <div className="card shadow">

        <div className="card-header bg-warning">
          <h4>Edit Geo Tagged Report</h4>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>Property ID</label>
              <input
                type="number"
                className="form-control"
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Report Title</label>
              <input
                type="text"
                className="form-control"
                name="report_title"
                value={formData.report_title}
                onChange={handleChange}
              />
            </div>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Latitude</label>
                <input
                  type="number"
                  step="0.0000001"
                  className="form-control"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Longitude</label>
                <input
                  type="number"
                  step="0.0000001"
                  className="form-control"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="mb-3">
              <label>Location Address</label>
              <textarea
                className="form-control"
                rows="2"
                name="location_address"
                value={formData.location_address}
                onChange={handleChange}
              />
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

            <div className="mb-3">
              <label>Image URL</label>
              <input
                type="text"
                className="form-control"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
              />
            </div>

            <button
              className="btn btn-success"
              type="submit"
            >
              Update Geo Tagged Report
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}