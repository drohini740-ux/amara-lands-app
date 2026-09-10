import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaVideo,
  FaCamera,
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  fetchSurveillanceCameras,
  removeSurveillanceCamera,
} from "../../../redux/surveillanceCameraSlice";

export default function SurveillanceCameras() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cameras, loading } = useSelector(
    (state) => state.surveillanceCameras
  );

  const [search, setSearch] = useState("");
  const [selectedCamera, setSelectedCamera] = useState(null);

  useEffect(() => {
    dispatch(fetchSurveillanceCameras());
  }, [dispatch]);

  // --------------------------------------------------
  // Camera Statistics
  // --------------------------------------------------

  const totalCameras = cameras?.length || 0;

  const onlineCameras =
    cameras?.filter(
      (camera) =>
        camera.status?.toLowerCase() === "online" ||
        camera.status?.toLowerCase() === "active"
    ).length || 0;

  const offlineCameras = totalCameras - onlineCameras;

  const alertCameras =
    cameras?.filter(
      (camera) =>
        camera.status?.toLowerCase() === "alert" ||
        camera.status?.toLowerCase() === "warning"
    ).length || 0;

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const filteredCameras = useMemo(() => {
    if (!cameras) return [];

    const searchValue = search.toLowerCase();

    return cameras.filter(
      (camera) =>
        camera.camera_name?.toLowerCase().includes(searchValue) ||
        camera.camera_location?.toLowerCase().includes(searchValue) ||
        camera.camera_type?.toLowerCase().includes(searchValue)
    );
  }, [cameras, search]);

  // --------------------------------------------------
  // Delete Camera
  // --------------------------------------------------

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this camera?")) {
      return;
    }

    try {
      await dispatch(removeSurveillanceCamera(id)).unwrap();
      alert("Camera deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete camera.");
    }
  };

  // --------------------------------------------------
  // Camera Feed
  // --------------------------------------------------

  const handleOpenFeed = (camera) => {
    setSelectedCamera(camera);
  };

  const closeFeed = () => {
    setSelectedCamera(null);
  };

  // --------------------------------------------------
  // Snapshot
  // --------------------------------------------------

  const handleSnapshot = (camera) => {
    alert(
      `Live snapshot integration will be connected for "${camera.camera_name}".`
    );
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <h4>Loading Surveillance Cameras...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            <FaVideo className="me-2 text-warning" />
            Surveillance Cameras
          </h2>

          <p className="text-muted mb-0">
            Monitor and manage property surveillance cameras.
          </p>
        </div>

        <button
          className="btn btn-warning"
          onClick={() =>
            navigate("/surveillance-cameras/add")
          }
        >
          <FaVideo className="me-2" />
          Add Camera
        </button>

      </div>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="row mb-4">

        {/* Total */}
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">
                    Total Cameras
                  </p>

                  <h3 className="fw-bold mb-0">
                    {totalCameras}
                  </h3>
                </div>

                <FaVideo
                  size={35}
                  className="text-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Online */}
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">
                    Online Cameras
                  </p>

                  <h3 className="fw-bold text-success mb-0">
                    {onlineCameras}
                  </h3>
                </div>

                <FaCircle
                  size={28}
                  className="text-success"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Offline */}
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">
                    Offline Cameras
                  </p>

                  <h3 className="fw-bold text-danger mb-0">
                    {offlineCameras}
                  </h3>
                </div>

                <FaCircle
                  size={28}
                  className="text-danger"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">
                    Security Alerts
                  </p>

                  <h3 className="fw-bold text-warning mb-0">
                    {alertCameras}
                  </h3>
                </div>

                <FaExclamationTriangle
                  size={32}
                  className="text-warning"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <div className="input-group">

            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search camera, location or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

      </div>

      {/* =====================================================
          CAMERA FEED
      ====================================================== */}

      {selectedCamera && (
        <div className="card shadow-sm mb-4">

          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">

            <h5 className="mb-0">
              <FaVideo className="me-2" />
              Live Camera Feed
            </h5>

            <button
              className="btn btn-sm btn-light"
              onClick={closeFeed}
            >
              Close
            </button>

          </div>

          <div className="card-body">

            <div
              className="bg-dark rounded d-flex flex-column justify-content-center align-items-center"
              style={{
                height: "350px",
                color: "white",
              }}
            >

              <FaVideo size={70} />

              <h5 className="mt-3">
                {selectedCamera.camera_name}
              </h5>

              <p className="text-light mb-0">
                {selectedCamera.camera_location}
              </p>

              <span className="badge bg-warning text-dark mt-3">
                Live Feed Integration Pending
              </span>

            </div>

            <div className="mt-3 d-flex gap-2">

              <button
                className="btn btn-primary"
                onClick={() =>
                  handleSnapshot(selectedCamera)
                }
              >
                <FaCamera className="me-2" />
                Live Snapshot
              </button>

              <span className="badge bg-success d-flex align-items-center">
                <FaCircle className="me-2" size={8} />
                {selectedCamera.status || "Unknown"}
              </span>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          CAMERA TABLE
      ====================================================== */}

      <div className="card shadow-sm">

        <div className="card-header">
          <h5 className="mb-0">
            Camera List
          </h5>
        </div>

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-hover align-middle">

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

                {filteredCameras.length > 0 ? (

                  filteredCameras.map((camera) => (

                    <tr key={camera.id}>

                      <td>
                        <strong>
                          {camera.camera_name}
                        </strong>
                      </td>

                      <td>
                        {camera.camera_location || "-"}
                      </td>

                      <td>
                        {camera.camera_type || "-"}
                      </td>

                      <td>

                        <span
                          className={`badge ${
                            camera.status?.toLowerCase() ===
                              "online" ||
                            camera.status?.toLowerCase() ===
                              "active"
                              ? "bg-success"
                              : camera.status?.toLowerCase() ===
                                  "alert"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                          }`}
                        >
                          {camera.status || "Unknown"}
                        </span>

                      </td>

                      <td>
                        {camera.installation_date || "-"}
                      </td>

                      <td>

                        <button
                          className="btn btn-info btn-sm me-2"
                          title="Live Feed"
                          onClick={() =>
                            handleOpenFeed(camera)
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          className="btn btn-primary btn-sm me-2"
                          title="Snapshot"
                          onClick={() =>
                            handleSnapshot(camera)
                          }
                        >
                          <FaCamera />
                        </button>

                        <button
                          className="btn btn-warning btn-sm me-2"
                          title="Edit"
                          onClick={() =>
                            navigate(
                              `/surveillance-cameras/edit/${camera.id}`
                            )
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          title="Delete"
                          onClick={() =>
                            handleDelete(camera.id)
                          }
                        >
                          <FaTrash />
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4"
                    >
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