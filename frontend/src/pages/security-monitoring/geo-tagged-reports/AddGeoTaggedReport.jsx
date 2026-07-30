import { useState } from "react";
import { useDispatch } from "react-redux";
import { createGeoReport } from "../../../redux/geoTaggedReportSlice";
import { useNavigate } from "react-router-dom";

export default function AddGeoTaggedReport() {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(createGeoReport(formData)).unwrap();

      alert("Geo Tagged Report Added Successfully");

      navigate("/geo-tagged-reports");
    } catch (err) {
      console.log(err);
      alert("Failed to Add Geo Tagged Report");
    }
  };

  return (
    <div className="container-fluid p-4">

      <div className="card shadow">

        <div className="card-header bg-primary text-white">
          <h4>Add Geo Tagged Report</h4>
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
                required
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
                required
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
                rows="2"
                className="form-control"
                name="location_address"
                value={formData.location_address}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Description</label>
              <textarea
                rows="4"
                className="form-control"
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
              type="submit"
              className="btn btn-success"
            >
              Save Geo Tagged Report
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}