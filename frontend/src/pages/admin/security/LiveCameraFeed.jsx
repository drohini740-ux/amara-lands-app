import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaCamera,
  FaMapMarkerAlt,
  FaSyncAlt,
  FaVideo,
  FaVideoSlash,
  FaCircle,
} from "react-icons/fa";

import {
  getLiveCameras,
} from "../../../redux/liveCameraFeedSlice";

export default function LiveCameraFeed() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    cameras = [],
    loading,
    error,
  } = useSelector(
    (state) => state.liveCameraFeed
  );

  const [selectedCamera, setSelectedCamera] =
    useState(null);

  // ======================================================
  // LOAD CAMERAS
  // ======================================================
  useEffect(() => {
    dispatch(getLiveCameras());
  }, [dispatch]);

  // ======================================================
  // REFRESH
  // ======================================================
  const handleRefresh = () => {
    dispatch(getLiveCameras());
  };

  // ======================================================
  // CAMERA STATUS
  // ======================================================
  const isActive = (camera) => {
    return (
      String(camera.status || "").toLowerCase() ===
      "active"
    );
  };

  // ======================================================
  // BACK
  // ======================================================
  const handleBack = () => {
    navigate("/admin/security");
  };

  return (
    <div
      className="container-fluid p-4"
      style={{
        background: "#f7f7f7",
        minHeight: "100vh",
      }}
    >
      {/* ==================================================
          HEADER
      ================================================== */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={handleBack}
          >
            <FaArrowLeft className="me-2" />
            Back
          </button>

          <h2 className="fw-bold mb-1">
            <FaVideo className="me-2 text-warning" />
            Live Camera Feed
          </h2>

          <p className="text-muted mb-0">
            Monitor surveillance cameras in real time.
          </p>
        </div>

        <button
          className="btn btn-warning"
          onClick={handleRefresh}
          disabled={loading}
        >
          <FaSyncAlt
            className={
              loading
                ? "fa-spin me-2"
                : "me-2"
            }
          />

          Refresh
        </button>
      </div>

      {/* ==================================================
          ERROR
      ================================================== */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ==================================================
          SUMMARY
      ================================================== */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-muted">
                Total Cameras
              </small>

              <h3 className="fw-bold mb-0 mt-2">
                {cameras.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-muted">
                Active Cameras
              </small>

              <h3 className="fw-bold text-success mb-0 mt-2">
                {
                  cameras.filter(
                    (camera) =>
                      isActive(camera)
                  ).length
                }
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-muted">
                Offline Cameras
              </small>

              <h3 className="fw-bold text-danger mb-0 mt-2">
                {
                  cameras.filter(
                    (camera) =>
                      !isActive(camera)
                  ).length
                }
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          CAMERA LIST + LIVE VIEW
      ================================================== */}
      <div className="row">
        {/* =================================================
            CAMERA LIST
        ================================================= */}
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div
              className="card-header fw-bold"
              style={{
                background: "#111",
                color: "#fff",
              }}
            >
              <FaCamera className="me-2 text-warning" />
              Surveillance Cameras
            </div>

            <div className="card-body p-2">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-warning" />

                  <p className="text-muted mt-3">
                    Loading cameras...
                  </p>
                </div>
              ) : cameras.length === 0 ? (
                <div className="text-center py-5">
                  <FaVideoSlash
                    size={45}
                    className="text-muted mb-3"
                  />

                  <h6>No Cameras Available</h6>
                </div>
              ) : (
                cameras.map((camera) => {
                  const active =
                    isActive(camera);

                  const selected =
                    selectedCamera?.id ===
                    camera.id;

                  return (
                    <button
                      key={camera.id}
                      type="button"
                      className="w-100 text-start mb-2 rounded"
                      onClick={() =>
                        setSelectedCamera(camera)
                      }
                      style={{
                        padding: "14px",
                        background: selected
                          ? "#fff3cd"
                          : "#f8f9fa",
                        border: selected
                          ? "2px solid #e0ad2f"
                          : "1px solid #eee",
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="fw-bold mb-1">
                            <FaCamera className="me-2" />

                            {camera.camera_name}
                          </h6>

                          <small className="text-muted d-block">
                            <FaMapMarkerAlt className="me-1" />

                            {camera.camera_location ||
                              "-"}
                          </small>

                          <small className="text-muted d-block mt-1">
                            Property:{" "}
                            {camera.property_name ||
                              `#${camera.property_id}`}
                          </small>

                          <small className="text-muted d-block">
                            Type:{" "}
                            {camera.camera_type ||
                              "-"}
                          </small>
                        </div>

                        <span
                          className={
                            active
                              ? "badge bg-success"
                              : "badge bg-danger"
                          }
                        >
                          <FaCircle
                            size={6}
                            className="me-1"
                          />

                          {active
                            ? "Active"
                            : "Offline"}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            LIVE FEED
        ================================================= */}
        <div className="col-md-8 mb-4">
          <div className="card border-0 shadow-sm">
            <div
              className="card-header d-flex justify-content-between align-items-center"
              style={{
                background: "#111",
                color: "#fff",
              }}
            >
              <strong>
                <FaVideo className="me-2 text-warning" />
                Live Feed
              </strong>

              {selectedCamera && (
                <span
                  className={
                    isActive(selectedCamera)
                      ? "badge bg-success"
                      : "badge bg-danger"
                  }
                >
                  {isActive(selectedCamera)
                    ? "LIVE"
                    : "OFFLINE"}
                </span>
              )}
            </div>

            <div className="card-body p-0">
              {!selectedCamera ? (
                <div
                  className="d-flex flex-column justify-content-center align-items-center"
                  style={{
                    minHeight: "500px",
                    background: "#111",
                    color: "#fff",
                  }}
                >
                  <FaVideo
                    size={65}
                    className="text-warning mb-3"
                  />

                  <h5>Select a Camera</h5>

                  <p className="text-secondary">
                    Select a camera from the list.
                  </p>
                </div>
              ) : (
                <>
                  {/* =====================================
                      VIDEO AREA
                  ====================================== */}
                  <div
                    style={{
                      minHeight: "450px",
                      background: "#111",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div className="text-center text-white">
                      <FaVideo
                        size={70}
                        className="text-warning mb-3"
                      />

                      <h5>
                        Live Feed
                      </h5>

                      <p className="text-secondary mb-0">
                        {selectedCamera.camera_name}
                      </p>

                      <small className="text-secondary">
                        Camera #{selectedCamera.id}
                      </small>

                      <div className="mt-3">
                        <span className="badge bg-warning text-dark">
                          Stream integration pending
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* =====================================
                      CAMERA DETAILS
                  ====================================== */}
                  <div className="p-4">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <small className="text-muted">
                          Camera Name
                        </small>

                        <h6 className="fw-bold">
                          {selectedCamera.camera_name}
                        </h6>
                      </div>

                      <div className="col-md-6 mb-3">
                        <small className="text-muted">
                          Camera ID
                        </small>

                        <h6 className="fw-bold">
                          #{selectedCamera.id}
                        </h6>
                      </div>

                      <div className="col-md-6 mb-3">
                        <small className="text-muted">
                          Location
                        </small>

                        <h6 className="fw-bold">
                          {selectedCamera.camera_location ||
                            "-"}
                        </h6>
                      </div>

                      <div className="col-md-6 mb-3">
                        <small className="text-muted">
                          Camera Type
                        </small>

                        <h6 className="fw-bold">
                          {selectedCamera.camera_type ||
                            "-"}
                        </h6>
                      </div>

                      <div className="col-md-6">
                        <small className="text-muted">
                          Property
                        </small>

                        <h6 className="fw-bold">
                          {selectedCamera.property_name ||
                            `Property #${selectedCamera.property_id}`}
                        </h6>
                      </div>

                      <div className="col-md-6">
                        <small className="text-muted">
                          Status
                        </small>

                        <div>
                          <span
                            className={
                              isActive(
                                selectedCamera
                              )
                                ? "badge bg-success"
                                : "badge bg-danger"
                            }
                          >
                            {selectedCamera.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}