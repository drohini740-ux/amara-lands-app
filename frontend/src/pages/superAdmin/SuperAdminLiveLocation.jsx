
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { io } from "socket.io-client";
import axios from "axios";

import {
  FaMapMarkerAlt,
  FaUsers,
  FaLocationArrow,
  FaStopCircle,
  FaSync,
  FaEye,
  FaMap,
  FaClock,
  FaCrosshairs,
} from "react-icons/fa";

const API_URL =
  "http://localhost:4000/api/v1";

const SOCKET_URL =
  "http://localhost:4000";

const SuperAdminLiveLocation = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedLocation, setSelectedLocation] =
    useState(null);

  const [socketConnected, setSocketConnected] =
    useState(false);

  // =====================================================
  // FETCH LIVE LOCATIONS
  // =====================================================

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/live-location-monitor`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setLocations(
          response.data.locations || []
        );
      } else {
        setLocations([]);
        setError(
          response.data?.message ||
            "Unable to fetch live locations."
        );
      }
    } catch (err) {
      console.error(
        "Super Admin Live Location Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to fetch live locations."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchLocations();
  }, []);

  // =====================================================
  // SOCKET.IO REAL-TIME MONITORING
  // =====================================================

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      return;
    }

    const socket = io(SOCKET_URL, {
      transports: [
        "websocket",
        "polling",
      ],
      withCredentials: true,
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      console.log(
        "🟢 Live Location Monitor Socket Connected:",
        socket.id
      );

      setSocketConnected(true);

      socket.emit(
        "joinLiveLocationMonitor"
      );
    });

    socket.on("disconnect", () => {
      console.log(
        "🔴 Live Location Monitor Socket Disconnected"
      );

      setSocketConnected(false);
    });

    socket.on(
      "connect_error",
      (error) => {
        console.error(
          "Live Location Monitor Socket Error:",
          error.message
        );

        setSocketConnected(false);
      }
    );

    // =================================================
    // LIVE LOCATION UPDATE
    // =================================================

    socket.on(
      "field:location:update",
      (locationData) => {
        console.log(
          "📍 Live Location Update:",
          locationData
        );

        setLocations((previousLocations) => {
          const existingIndex =
            previousLocations.findIndex(
              (location) =>
                String(
                  location.user_id
                ) ===
                String(
                  locationData.user_id
                )
            );

          if (existingIndex === -1) {
            return [
              ...previousLocations,
              locationData,
            ];
          }

          const updatedLocations = [
            ...previousLocations,
          ];

          updatedLocations[
            existingIndex
          ] = {
            ...updatedLocations[
              existingIndex
            ],
            ...locationData,
          };

          return updatedLocations;
        });
      }
    );

    // =================================================
    // LOCATION STOPPED
    // =================================================

    socket.on(
      "field:location:stop",
      (locationData) => {
        console.log(
          "🛑 Live Location Stopped:",
          locationData
        );

        setLocations((previousLocations) =>
          previousLocations.map(
            (location) =>
              String(
                location.user_id
              ) ===
              String(
                locationData.user_id
              )
                ? {
                    ...location,
                    ...locationData,
                    is_sharing: false,
                  }
                : location
          )
        );
      }
    );

    return () => {
      socket.emit(
        "leaveLiveLocationMonitor"
      );

      socket.disconnect();
    };
  }, []);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalFieldExecutives =
    locations.length;

  const currentlySharing =
    locations.filter(
      (location) =>
        location.is_sharing === true
    ).length;

  const stoppedSharing =
    locations.filter(
      (location) =>
        location.is_sharing !== true
    ).length;

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(
        date
      ).toLocaleString("en-IN");
    } catch {
      return "-";
    }
  };

  // =====================================================
  // FORMAT COORDINATE
  // =====================================================

  const formatCoordinate = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return "-";
    }

    return Number(value).toFixed(7);
  };

  // =====================================================
  // GOOGLE MAPS URL
  // =====================================================

  const getGoogleMapsUrl = (
    latitude,
    longitude
  ) => {
    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return "#";
    }

    return (
      `https://www.google.com/maps/search/?api=1` +
      `&query=${latitude},${longitude}`
    );
  };

  // =====================================================
  // SORT
  // =====================================================

  const sortedLocations = useMemo(() => {
    return [...locations].sort(
      (a, b) => {
        if (
          a.is_sharing === true &&
          b.is_sharing !== true
        ) {
          return -1;
        }

        if (
          a.is_sharing !== true &&
          b.is_sharing === true
        ) {
          return 1;
        }

        return String(
          a.full_name || ""
        ).localeCompare(
          String(
            b.full_name || ""
          )
        );
      }
    );
  }, [locations]);

  return (
    <div>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3
            className="mb-1"
            style={{
              fontWeight: "700",
              color: "#111111",
            }}
          >
            Live Location Monitor
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Monitor Field Executive locations
            in real time.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* SOCKET STATUS */}

          <span
            className="badge px-3 py-2"
            style={{
              backgroundColor:
                socketConnected
                  ? "#DFF5E3"
                  : "#F8D7DA",
              color:
                socketConnected
                  ? "#198754"
                  : "#842029",
            }}
          >
            {socketConnected
              ? "● Live"
              : "● Offline"}
          </span>

          {/* REFRESH */}

          <button
            className="btn"
            onClick={fetchLocations}
            disabled={loading}
            style={{
              border:
                "1px solid #C9A227",
              color: "#C9A227",
              backgroundColor:
                "#FFFFFF",
            }}
          >
            <FaSync className="me-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {/* TOTAL */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Total Field Executives
                </small>

                <h3 className="mb-0 mt-2">
                  {totalFieldExecutives}
                </h3>
              </div>

              <FaUsers
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* SHARING */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #28a745",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Currently Sharing
                </small>

                <h3 className="mb-0 mt-2">
                  {currentlySharing}
                </h3>
              </div>

              <FaLocationArrow
                style={{
                  color: "#28a745",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* STOPPED */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #dc3545",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Stopped Sharing
                </small>

                <h3 className="mb-0 mt-2">
                  {stoppedSharing}
                </h3>
              </div>

              <FaStopCircle
                style={{
                  color: "#dc3545",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* LOCATION CARDS */}
      {/* ================================================= */}

      <div className="row g-4">
        {loading &&
        locations.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{
                  color: "#C9A227",
                }}
              />

              <p className="mt-3 text-muted">
                Loading live locations...
              </p>
            </div>
          </div>
        ) : sortedLocations.length ===
          0 ? (
          <div className="col-12">
            <div
              className="card border-0 shadow-sm text-center p-5"
            >
              <FaMapMarkerAlt
                style={{
                  fontSize: "45px",
                  color: "#CCCCCC",
                }}
              />

              <h5 className="mt-3">
                No Live Location Records
              </h5>

              <p className="text-muted mb-0">
                No Field Executive live
                location records are available.
              </p>
            </div>
          </div>
        ) : (
          sortedLocations.map(
            (location) => {
              const isSharing =
                location.is_sharing ===
                true;

              return (
                <div
                  className="col-lg-6"
                  key={location.user_id}
                >
                  <div
                    className="card border-0 shadow-sm h-100"
                    style={{
                      borderTop:
                        isSharing
                          ? "4px solid #28a745"
                          : "4px solid #dc3545",
                    }}
                  >
                    <div className="card-body">
                      {/* CARD HEADER */}

                      <div className="d-flex justify-content-between align-items-start mb-4">
                        <div className="d-flex align-items-center">
                          <div
                            style={{
                              width: "52px",
                              height: "52px",
                              borderRadius:
                                "50%",
                              backgroundColor:
                                "#111111",
                              color:
                                "#C9A227",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              fontSize:
                                "22px",
                              marginRight:
                                "15px",
                            }}
                          >
                            <FaMapMarkerAlt />
                          </div>

                          <div>
                            <h5 className="mb-1">
                              {location.full_name ||
                                "Field Executive"}
                            </h5>

                            <small className="text-muted">
                              User ID:{" "}
                              {location.user_id}
                            </small>
                          </div>
                        </div>

                        <span
                          className="badge px-3 py-2"
                          style={{
                            backgroundColor:
                              isSharing
                                ? "#DFF5E3"
                                : "#F8D7DA",
                            color:
                              isSharing
                                ? "#198754"
                                : "#842029",
                          }}
                        >
                          {isSharing
                            ? "Sharing"
                            : "Stopped"}
                        </span>
                      </div>

                      {/* USER INFO */}

                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <small className="text-muted">
                            Email
                          </small>

                          <div className="fw-semibold mt-1">
                            {location.email ||
                              "-"}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <small className="text-muted">
                            Mobile
                          </small>

                          <div className="fw-semibold mt-1">
                            {location.mobile ||
                              "-"}
                          </div>
                        </div>
                      </div>

                      <hr />

                      {/* LOCATION */}

                      <div className="row g-3">
                        <div className="col-md-6">
                          <small className="text-muted">
                            Latitude
                          </small>

                          <div className="fw-semibold mt-1">
                            {formatCoordinate(
                              location.latitude
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <small className="text-muted">
                            Longitude
                          </small>

                          <div className="fw-semibold mt-1">
                            {formatCoordinate(
                              location.longitude
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <small className="text-muted">
                            GPS Accuracy
                          </small>

                          <div className="fw-semibold mt-1">
                            {location.accuracy_meters
                              ? `${location.accuracy_meters} m`
                              : "-"}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <small className="text-muted">
                            <FaClock className="me-1" />
                            Last Updated
                          </small>

                          <div className="fw-semibold mt-1">
                            {formatDateTime(
                              location.last_updated_at
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="d-flex gap-2 mt-4">
                        <button
                          className="btn flex-grow-1"
                          onClick={() =>
                            setSelectedLocation(
                              location
                            )
                          }
                          style={{
                            backgroundColor:
                              "#111111",
                            color:
                              "#FFFFFF",
                            border:
                              "1px solid #111111",
                          }}
                        >
                          <FaEye className="me-2" />
                          View Details
                        </button>

                        <a
                          href={getGoogleMapsUrl(
                            location.latitude,
                            location.longitude
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn"
                          style={{
                            border:
                              "1px solid #C9A227",
                            color:
                              "#C9A227",
                            backgroundColor:
                              "#FFFFFF",
                          }}
                        >
                          <FaMap className="me-2" />
                          Map
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )
        )}
      </div>

      {/* ================================================= */}
      {/* DETAILS MODAL */}
      {/* ================================================= */}

      {selectedLocation && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              {/* HEADER */}

              <div
                className="modal-header"
                style={{
                  backgroundColor:
                    "#111111",
                  color: "#FFFFFF",
                }}
              >
                <h5 className="modal-title">
                  Live Location Details
                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() =>
                    setSelectedLocation(
                      null
                    )
                  }
                />
              </div>

              {/* BODY */}

              <div className="modal-body">
                <div className="text-center mb-4">
                  <div
                    style={{
                      width: "75px",
                      height: "75px",
                      borderRadius: "50%",
                      backgroundColor:
                        "#111111",
                      color: "#C9A227",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      margin:
                        "0 auto 15px",
                      fontSize: "30px",
                    }}
                  >
                    <FaCrosshairs />
                  </div>

                  <h4 className="mb-1">
                    {selectedLocation.full_name ||
                      "Field Executive"}
                  </h4>

                  <span
                    className="badge px-3 py-2"
                    style={{
                      backgroundColor:
                        selectedLocation.is_sharing
                          ? "#DFF5E3"
                          : "#F8D7DA",
                      color:
                        selectedLocation.is_sharing
                          ? "#198754"
                          : "#842029",
                    }}
                  >
                    {selectedLocation.is_sharing
                      ? "Currently Sharing"
                      : "Sharing Stopped"}
                  </span>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <small className="text-muted">
                      User ID
                    </small>

                    <div className="fw-semibold mt-1">
                      {selectedLocation.user_id}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Account Status
                    </small>

                    <div className="fw-semibold mt-1">
                      {selectedLocation.status ||
                        "-"}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Latitude
                    </small>

                    <div className="fw-semibold mt-1">
                      {formatCoordinate(
                        selectedLocation.latitude
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Longitude
                    </small>

                    <div className="fw-semibold mt-1">
                      {formatCoordinate(
                        selectedLocation.longitude
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      GPS Accuracy
                    </small>

                    <div className="fw-semibold mt-1">
                      {selectedLocation.accuracy_meters
                        ? `${selectedLocation.accuracy_meters} meters`
                        : "-"}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Last Updated
                    </small>

                    <div className="fw-semibold mt-1">
                      {formatDateTime(
                        selectedLocation.last_updated_at
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <div
                      className="p-3 rounded"
                      style={{
                        backgroundColor:
                          "#FFFDF5",
                        border:
                          "1px solid #E6D48A",
                      }}
                    >
                      <FaMapMarkerAlt
                        className="me-2"
                        style={{
                          color:
                            "#C9A227",
                        }}
                      />

                      Current coordinates:
                      <strong className="ms-2">
                        {formatCoordinate(
                          selectedLocation.latitude
                        )}
                        ,{" "}
                        {formatCoordinate(
                          selectedLocation.longitude
                        )}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER */}

              <div className="modal-footer">
                <a
                  href={getGoogleMapsUrl(
                    selectedLocation.latitude,
                    selectedLocation.longitude
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{
                    backgroundColor:
                      "#C9A227",
                    color: "#111111",
                    border:
                      "1px solid #C9A227",
                  }}
                >
                  <FaMap className="me-2" />
                  Open Google Maps
                </a>

                <button
                  type="button"
                  className="btn"
                  onClick={() =>
                    setSelectedLocation(
                      null
                    )
                  }
                  style={{
                    backgroundColor:
                      "#111111",
                    color: "#FFFFFF",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminLiveLocation;

