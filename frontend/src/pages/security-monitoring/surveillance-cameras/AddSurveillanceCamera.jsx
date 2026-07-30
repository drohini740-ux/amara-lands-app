import { useState } from "react";
import { useDispatch } from "react-redux";
import { createSurveillanceCamera } from "../../../redux/surveillanceCameraSlice";
import { useNavigate } from "react-router-dom";

export default function AddSurveillanceCamera() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    property_id: "",
    camera_name: "",
    camera_location: "",
    camera_type: "",
    status: "Active",
    installation_date: "",
    remarks: "",
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
      await dispatch(createSurveillanceCamera(formData)).unwrap();

      alert("Camera Added Successfully");

      navigate("/surveillance-cameras");
    } catch (err) {
      console.log(err);
      alert("Failed to Add Camera");
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="card shadow">

        <div className="card-header bg-primary text-white">
          <h4>Add Surveillance Camera</h4>
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
              <label>Camera Name</label>
              <input
                type="text"
                className="form-control"
                name="camera_name"
                value={formData.camera_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Camera Location</label>
              <input
                type="text"
                className="form-control"
                name="camera_location"
                value={formData.camera_location}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Camera Type</label>
              <input
                type="text"
                className="form-control"
                name="camera_type"
                value={formData.camera_type}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Status</label>
              <select
                className="form-control"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Installation Date</label>
              <input
                type="date"
                className="form-control"
                name="installation_date"
                value={formData.installation_date}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Remarks</label>
              <textarea
                className="form-control"
                rows="4"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success"
            >
              Save Camera
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}