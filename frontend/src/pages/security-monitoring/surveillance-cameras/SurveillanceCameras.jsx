import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSurveillanceCameras,
  removeSurveillanceCamera,
} from "../../../redux/surveillanceCameraSlice";

import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function SurveillanceCameras() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cameras, loading } = useSelector(
    (state) => state.surveillanceCameras
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchSurveillanceCameras());
  }, [dispatch]);

  const filteredCameras = cameras?.filter((camera) =>
    camera.camera_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this camera?")) return;

    try {
      await dispatch(removeSurveillanceCamera(id)).unwrap();
      alert("Camera Deleted Successfully");
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading Cameras...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Surveillance Cameras</h2>
          <p className="text-muted">
            Manage CCTV Cameras
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/surveillance-cameras/add")}
        >
          <FaPlus className="me-2" />
          Add Camera
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
              placeholder="Search Camera..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card shadow-sm">

        <div className="card-header">
          <h5 className="mb-0">Camera List</h5>
        </div>

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-hover">

              <thead className="table-dark">
                <tr>
                  <th>Camera</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Installation</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredCameras?.length > 0 ? (

                  filteredCameras.map((camera) => (

                    <tr key={camera.id}>

                      <td>{camera.camera_name}</td>
                      <td>{camera.camera_location}</td>
                      <td>{camera.camera_type}</td>
                      <td>
                        <span className="badge bg-success">
                          {camera.status}
                        </span>
                      </td>
                      <td>{camera.installation_date}</td>

                      <td>

                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() =>
                            navigate(`/surveillance-cameras/view/${camera.id}`)
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() =>
                            navigate(`/surveillance-cameras/edit/${camera.id}`)
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(camera.id)}
                        >
                          <FaTrash />
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td colSpan="6" className="text-center">
                      No Cameras Found
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