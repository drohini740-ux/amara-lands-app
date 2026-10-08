
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";

import { io } from "socket.io-client";

import {
  FaMapMarkerAlt,
  FaLocationArrow,
  FaStopCircle,
  FaSync,
  FaSatellite,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaBroadcastTower,
} from "react-icons/fa";

import {
  updateFieldExecutiveLiveLocation,
  fetchFieldExecutiveLiveLocation,
  stopFieldExecutiveLiveLocation,
  clearLiveLocationError,
  clearLiveLocationSuccess,
} from "../../redux/fieldExecutiveLiveLocationSlice";

const SOCKET_URL = "http://localhost:4000";

const FieldExecutiveLiveLocation = () => {
  const dispatch = useDispatch();

  // =====================================================
  // REDUX
  // =====================================================

  const {
    location,
    loading,
    fetchLoading,
    stopLoading,
    error,
    fetchError,
    stopError,
    successMessage,
  } = useSelector(
    (state) =>
      state.fieldExecutiveLiveLocation
  );

  // =====================================================
  // STATE
  // =====================================================

  const [sharing, setSharing] = useState(false);

  const [gpsError, setGpsError] =
    useState("");

  const [socketConnected, setSocketConnected] =
    useState(false);

  const [
    realtimeLocation,
    setRealtimeLocation,
  ] = useState(null);

  // =====================================================
  // REFS
  // =====================================================

  const watchIdRef = useRef(null);

  const socketRef = useRef(null);

  // =====================================================
  // USER
  // =====================================================

  const userData =
    localStorage.getItem("user");

  let user = null;

  try {
    user = userData
      ? JSON.parse(userData)
      : null;
  } catch (error) {
    console.error(
      "Invalid user data:",
      error
    );
  }

  const userId = user?.id;

  // =====================================================
  // LOAD EXISTING LOCATION
  // =====================================================

  useEffect(() => {
    dispatch(
      fetchFieldExecutiveLiveLocation()
    );
  }, [dispatch]);

  // =====================================================
  // SOCKET.IO CONNECTION
  // =====================================================

  useEffect(() => {
    if (!userId) {
      return;
    }

    const token = localStorage.getItem("token");

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,

  auth: {
    token,
  },
});

    socketRef.current = socket;

    // ===================================================
    // CONNECT
    // ===================================================

    socket.on("connect", () => {
      console.log(
        "✅ Live Location Socket Connected:",
        socket.id
      );

      setSocketConnected(true);

      // Join this Field Executive's room
      socket.emit(
        "joinFieldLocationRoom",
        userId
      );
    });

    // ===================================================
    // LIVE LOCATION UPDATE
    // ===================================================

    socket.on(
      "field:location:update",
      (data) => {
        console.log(
          "📍 Real-time location received:",
          data
        );

        setRealtimeLocation(data);

        // If another update arrives,
        // consider sharing active.
        if (data?.is_sharing) {
          setSharing(true);
        }
      }
    );

    // ===================================================
    // LIVE LOCATION STOP
    // ===================================================

    socket.on(
      "field:location:stop",
      (data) => {
        console.log(
          "🛑 Real-time location stopped:",
          data
        );

        setRealtimeLocation(data);

        setSharing(false);

        if (
          watchIdRef.current !== null &&
          navigator.geolocation
        ) {
          navigator.geolocation.clearWatch(
            watchIdRef.current
          );

          watchIdRef.current = null;
        }
      }
    );

    // ===================================================
    // DISCONNECT
    // ===================================================

    socket.on("disconnect", (reason) => {
      console.log(
        "❌ Live Location Socket Disconnected:",
        reason
      );

      setSocketConnected(false);
    });

    // ===================================================
    // SOCKET ERROR
    // ===================================================

    socket.on("connect_error", (error) => {
      console.error(
        "Live Location Socket Error:",
        error
      );

      setSocketConnected(false);
    });

    // ===================================================
    // CLEANUP
    // ===================================================

    return () => {
      socket.emit(
        "leaveFieldLocationRoom",
        userId
      );

      socket.disconnect();

      socketRef.current = null;
    };
  }, [userId]);

  // =====================================================
  // UPDATE SHARING STATE FROM EXISTING LOCATION
  // =====================================================

  useEffect(() => {
    if (
      location?.is_sharing === true
    ) {
      setSharing(true);
    }

    if (
      location?.is_sharing === false
    ) {
      setSharing(false);
    }
  }, [location]);

  // =====================================================
  // FORMAT LOCATION
  // =====================================================

  const currentLocation =
    realtimeLocation || location;

  // =====================================================
  // GET CURRENT POSITION
  // =====================================================

  const sendCurrentPosition = (
    position
  ) => {
    const latitude =
      position.coords.latitude;

    const longitude =
      position.coords.longitude;

    const accuracy =
      position.coords.accuracy;

    console.log(
      "📍 Browser GPS:",
      {
        latitude,
        longitude,
        accuracy,
      }
    );

    dispatch(
      updateFieldExecutiveLiveLocation({
        latitude,
        longitude,
        accuracy_meters: accuracy,
        is_sharing: true,
      })
    );
  };

  // =====================================================
  // START SHARING
  // =====================================================

  const startLiveLocation = () => {
    if (
      !navigator.geolocation
    ) {
      setGpsError(
        "Geolocation is not supported by this browser."
      );

      return;
    }

    setGpsError("");

    dispatch(clearLiveLocationError());
    dispatch(clearLiveLocationSuccess());

    // =================================================
    // GET FIRST LOCATION
    // =================================================

    navigator.geolocation.getCurrentPosition(
      (position) => {
        sendCurrentPosition(
          position
        );
      },
      (error) => {
        console.error(
          "GPS Error:",
          error
        );

        setGpsError(
          getGpsErrorMessage(error)
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    // =================================================
    // WATCH LOCATION
    // =================================================

    if (
      watchIdRef.current === null
    ) {
      watchIdRef.current =
        navigator.geolocation.watchPosition(
          (position) => {
            sendCurrentPosition(
              position
            );
          },
          (error) => {
            console.error(
              "GPS Watch Error:",
              error
            );

            setGpsError(
              getGpsErrorMessage(error)
            );
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 5000,
          }
        );
    }

    setSharing(true);
  };

  // =====================================================
  // STOP SHARING
  // =====================================================

  const stopLiveLocation = async () => {
    if (
      watchIdRef.current !== null &&
      navigator.geolocation
    ) {
      navigator.geolocation.clearWatch(
        watchIdRef.current
      );

      watchIdRef.current = null;
    }

    setSharing(false);

    setGpsError("");

    await dispatch(
      stopFieldExecutiveLiveLocation()
    );
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const refreshLocation = () => {
    dispatch(
      fetchFieldExecutiveLiveLocation()
    );
  };

  // =====================================================
  // GPS ERROR MESSAGE
  // =====================================================

  const getGpsErrorMessage = (
    error
  ) => {
    if (!error) {
      return "Unable to get your location.";
    }

    switch (error.code) {
      case 1:
        return "Location permission was denied. Please allow location access.";

      case 2:
        return "Your location could not be determined.";

      case 3:
        return "Location request timed out. Please try again.";

      default:
        return "Unable to get your current location.";
    }
  };

  // =====================================================
  // MAP URL
  // =====================================================

  const mapLatitude =
    currentLocation?.latitude;

  const mapLongitude =
    currentLocation?.longitude;

  const googleMapsUrl =
    mapLatitude &&
    mapLongitude
      ? `https://www.google.com/maps/search/?api=1&query=${mapLatitude},${mapLongitude}`
      : null;

  const googleMapsEmbedUrl =
    mapLatitude &&
    mapLongitude
      ? `https://www.google.com/maps?q=${mapLatitude},${mapLongitude}&z=16&output=embed`
      : null;

  // =====================================================
  // CLEANUP GPS ON UNMOUNT
  // =====================================================

  useEffect(() => {
    return () => {
      if (
        watchIdRef.current !== null &&
        navigator.geolocation
      ) {
        navigator.geolocation.clearWatch(
          watchIdRef.current
        );

        watchIdRef.current = null;
      }

      // Important:
      // Make sure backend does not keep
      // showing this Field Executive as sharing.
      dispatch(
        stopFieldExecutiveLiveLocation()
      );
    };
  }, [dispatch]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h3
            className="mb-1"
            style={{
              fontWeight: "700",
              color: "#111111",
            }}
          >
            Live Location
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Share your current location with
            Amara Lands.
          </p>
        </div>

        <button
          className="btn"
          onClick={
            refreshLocation
          }
          disabled={fetchLoading}
          style={{
            border:
              "1px solid #C9A227",
            color: "#C9A227",
            backgroundColor:
              "#FFFFFF",
          }}
        >
          <FaSync className="me-2" />

          Refresh Location
        </button>
      </div>

      {/* ================================================= */}
      {/* ALERTS */}
      {/* ================================================= */}

      {error && (
        <div className="alert alert-danger">
          <FaExclamationTriangle className="me-2" />

          {error}
        </div>
      )}

      {fetchError && (
        <div className="alert alert-danger">
          <FaExclamationTriangle className="me-2" />

          {fetchError}
        </div>
      )}

      {stopError && (
        <div className="alert alert-danger">
          <FaExclamationTriangle className="me-2" />

          {stopError}
        </div>
      )}

      {gpsError && (
        <div className="alert alert-warning">
          <FaExclamationTriangle className="me-2" />

          {gpsError}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          <FaCheckCircle className="me-2" />

          {successMessage}
        </div>
      )}

      {/* ================================================= */}
      {/* SOCKET STATUS */}
      {/* ================================================= */}

      <div
        className="alert d-flex justify-content-between align-items-center"
        style={{
          backgroundColor:
            socketConnected
              ? "#EAF7EE"
              : "#FFF3CD",
          border:
            socketConnected
              ? "1px solid #B7DFC1"
              : "1px solid #E6D48A",
          color:
            socketConnected
              ? "#198754"
              : "#856404",
        }}
      >
        <div>
          <FaBroadcastTower className="me-2" />

          <strong>
            Real-time Connection
          </strong>

          <div
            style={{
              fontSize: "13px",
              marginLeft: "22px",
            }}
          >
            {socketConnected
              ? "Connected to live location service."
              : "Connecting to live location service..."}
          </div>
        </div>

        <span className="badge">
          {socketConnected
            ? "Connected"
            : "Disconnected"}
        </span>
      </div>

      {/* ================================================= */}
      {/* STATUS CARDS */}
      {/* ================================================= */}

      <div className="row g-4 mb-4">
        {/* SHARING STATUS */}

        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderLeft:
                sharing
                  ? "4px solid #28a745"
                  : "4px solid #dc3545",
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    Sharing Status
                  </small>

                  <h4 className="mt-2 mb-0">
                    {sharing
                      ? "Active"
                      : "Stopped"}
                  </h4>
                </div>

                {sharing ? (
                  <FaCheckCircle
                    style={{
                      color:
                        "#28a745",
                      fontSize:
                        "30px",
                    }}
                  />
                ) : (
                  <FaStopCircle
                    style={{
                      color:
                        "#dc3545",
                      fontSize:
                        "30px",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* LATITUDE */}

        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderLeft:
                "4px solid #C9A227",
            }}
          >
            <div className="card-body">
              <small className="text-muted">
                Latitude
              </small>

              <h5 className="mt-2 mb-0">
                {currentLocation
                  ?.latitude ||
                  "-"}
              </h5>
            </div>
          </div>
        </div>

        {/* LONGITUDE */}

        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderLeft:
                "4px solid #C9A227",
            }}
          >
            <div className="card-body">
              <small className="text-muted">
                Longitude
              </small>

              <h5 className="mt-2 mb-0">
                {currentLocation
                  ?.longitude ||
                  "-"}
              </h5>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* CONTROLS */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header bg-white"
          style={{
            borderBottom:
              "2px solid #C9A227",
          }}
        >
          <strong>
            <FaLocationArrow
              className="me-2"
              style={{
                color: "#C9A227",
              }}
            />

            Location Sharing Controls
          </strong>
        </div>

        <div className="card-body">
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn"
              onClick={
                startLiveLocation
              }
              disabled={
                sharing ||
                loading
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
              <FaLocationArrow className="me-2" />

              {loading
                ? "Starting..."
                : "Start Sharing"}
            </button>

            <button
              className="btn"
              onClick={
                stopLiveLocation
              }
              disabled={
                !sharing ||
                stopLoading
              }
              style={{
                backgroundColor:
                  "#FFFFFF",
                color:
                  "#dc3545",
                border:
                  "1px solid #dc3545",
              }}
            >
              <FaStopCircle className="me-2" />

              {stopLoading
                ? "Stopping..."
                : "Stop Sharing"}
            </button>

            <button
              className="btn"
              onClick={
                refreshLocation
              }
              disabled={
                fetchLoading
              }
              style={{
                backgroundColor:
                  "#FFFFFF",
                color:
                  "#C9A227",
                border:
                  "1px solid #C9A227",
              }}
            >
              <FaSync className="me-2" />

              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* CURRENT LOCATION */}
      {/* ================================================= */}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div
              className="card-header bg-white"
              style={{
                borderBottom:
                  "2px solid #C9A227",
              }}
            >
              <strong>
                <FaSatellite
                  className="me-2"
                  style={{
                    color:
                      "#C9A227",
                  }}
                />

                Current Location
              </strong>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">
                  Latitude
                </small>

                <div className="fw-semibold mt-1">
                  {currentLocation
                    ?.latitude ||
                    "-"}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  Longitude
                </small>

                <div className="fw-semibold mt-1">
                  {currentLocation
                    ?.longitude ||
                    "-"}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  GPS Accuracy
                </small>

                <div className="fw-semibold mt-1">
                  {currentLocation
                    ?.accuracy_meters
                    ? `${currentLocation.accuracy_meters} meters`
                    : "-"}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  Last Updated
                </small>

                <div className="fw-semibold mt-1">
                  {currentLocation
                    ?.last_updated_at
                    ? new Date(
                        currentLocation.last_updated_at
                      ).toLocaleString(
                        "en-IN"
                      )
                    : "-"}
                </div>
              </div>

              <div>
                <small className="text-muted">
                  Sharing
                </small>

                <div className="mt-1">
                  <span
                    className="badge"
                    style={
                      currentLocation
                        ?.is_sharing
                        ? {
                            backgroundColor:
                              "#DFF5E3",
                            color:
                              "#198754",
                          }
                        : {
                            backgroundColor:
                              "#F8D7DA",
                            color:
                              "#842029",
                          }
                    }
                  >
                    {currentLocation
                      ?.is_sharing
                      ? "Active"
                      : "Stopped"}
                  </span>
                </div>
              </div>

              {googleMapsUrl && (
                <a
                  href={
                    googleMapsUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn mt-4"
                  style={{
                    backgroundColor:
                      "#111111",
                    color:
                      "#FFFFFF",
                  }}
                >
                  <FaExternalLinkAlt className="me-2" />

                  Open in Google Maps
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* MAP */}
        {/* ================================================= */}

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div
              className="card-header bg-white"
              style={{
                borderBottom:
                  "2px solid #C9A227",
              }}
            >
              <strong>
                <FaMapMarkerAlt
                  className="me-2"
                  style={{
                    color:
                      "#C9A227",
                  }}
                />

                Location Map
              </strong>
            </div>

            <div className="card-body p-0">
              {googleMapsEmbedUrl ? (
                <iframe
                  title="Field Executive Live Location"
                  src={
                    googleMapsEmbedUrl
                  }
                  width="100%"
                  height="450"
                  style={{
                    border: 0,
                  }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center text-muted"
                  style={{
                    height:
                      "450px",
                  }}
                >
                  <div className="text-center">
                    <FaMapMarkerAlt
                      style={{
                        fontSize:
                          "40px",
                        color:
                          "#CCCCCC",
                      }}
                    />

                    <p className="mt-3 mb-0">
                      Start location
                      sharing to
                      display your
                      location.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* INFORMATION */}
      {/* ================================================= */}

      <div
        className="alert mt-4"
        style={{
          backgroundColor:
            "#FFFDF5",
          border:
            "1px solid #E6D48A",
          color: "#555555",
        }}
      >
        <FaBroadcastTower
          className="me-2"
          style={{
            color:
              "#C9A227",
          }}
        />

        Your live location is updated through
        GPS and delivered in real time using
        Socket.IO.
      </div>
    </div>
  );
};

export default FieldExecutiveLiveLocation;

