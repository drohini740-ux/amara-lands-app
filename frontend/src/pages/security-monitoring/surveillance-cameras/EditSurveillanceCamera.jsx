import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editSurveillanceCamera } from "../../../redux/surveillanceCameraSlice";
import { useNavigate, useParams } from "react-router-dom";
import { getSurveillanceCamera } from "../../../services/surveillanceCameraService";

export default function EditSurveillanceCamera() {
  const { id } = useParams();

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

  useEffect(() => {
    loadCamera();
  }, []);

  const loadCamera = async () => {
    try {
      const data = await getSurveillanceCamera(id);

      const camera = data.camera;

      setFormData({
        property_id: camera.property_id || "",
        camera_name: camera.camera_name || "",
        camera_location: camera.camera_location || "",
        camera_type: camera.camera_type || "",
        status: camera.status || "Active",
        installation_date: camera.installation_date?.split("T")[0] || "",
        remarks: camera.remarks || "",
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
        editSurveillanceCamera({
          id,
          cameraData: formData,
        })
      ).unwrap();

      alert("Camera Updated Successfully");

      navigate("/surveillance-cameras");
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

  return (
    <div className="container-fluid p-4">

      <div className="card shadow">

        <div className="card-header bg-warning">
          <h4>Edit Surveillance Camera</h4>
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
                rows="4"
                className="form-control"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>

            <button
              className="btn btn-success"
              type="submit"
            >
              Update Camera
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}