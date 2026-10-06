
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaCamera,
  FaUpload,
  FaTrash,
  FaEye,
  FaTimes,
  FaSpinner,
  FaSignInAlt,
  FaSignOutAlt,
  FaLocationArrow,
} from "react-icons/fa";

import {
  fetchFieldExecutiveVisitById,
  checkInFieldExecutiveVisit,
  checkOutFieldExecutiveVisit,
  clearSelectedVisit,
  clearVisitError,
} from "../../redux/fieldExecutiveVisitSlice";

import {
  recordGeoAttendance,
} from "../../redux/fieldExecutiveGeoAttendanceSlice";

import {
  fetchVisitMedia,
  uploadVisitMedia,
  deleteVisitMedia,
  clearMediaError,
} from "../../redux/fieldExecutiveMediaSlice";

const FieldExecutiveVisitDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  // =====================================================
  // VISIT REDUX STATE
  // =====================================================

  const {
    selectedVisit,
    detailsLoading,
    actionLoading,
    detailsError,
    actionError,
  } = useSelector(
    (state) => state.fieldExecutiveVisit
  );

  // =====================================================
  // MEDIA REDUX STATE
  // =====================================================

  const {
    media,
    loading: mediaLoading,
    uploadLoading,
    deleteLoading,
    error: mediaError,
    uploadError,
    deleteError,
  } = useSelector(
    (state) => state.fieldExecutiveMedia
  );

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [locationError, setLocationError] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [caption, setCaption] =
    useState("");

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [viewMedia, setViewMedia] =
    useState(null);

  // =====================================================
  // LOAD VISIT + MEDIA
  // =====================================================

  useEffect(() => {
    if (!id) return;

    dispatch(fetchFieldExecutiveVisitById(id));

    dispatch(fetchVisitMedia(id));

    return () => {
      dispatch(clearSelectedVisit());
      dispatch(clearVisitError());
      dispatch(clearMediaError());
    };
  }, [dispatch, id]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN"
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // FORMAT DATE TIME
  // =====================================================

  const formatDateTime = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleString(
        "en-IN"
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // FORMAT STATUS
  // =====================================================

  const formatStatus = (status) => {
    if (!status) return "-";

    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // =====================================================
  // GET STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(status || "")
      .toLowerCase();

    if (value === "completed") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (
      value === "in progress" ||
      value === "in_progress"
    ) {
      return {
        backgroundColor: "#FFF3CD",
        color: "#856404",
      };
    }

    if (value === "cancelled") {
      return {
        backgroundColor: "#F8D7DA",
        color: "#842029",
      };
    }

    return {
      backgroundColor: "#F5E8B0",
      color: "#111111",
    };
  };

  // =====================================================
  // GET MEDIA URL
  // =====================================================

  const getMediaUrl = (fileUrl) => {
    if (!fileUrl) return "";

    if (
      fileUrl.startsWith("http://") ||
      fileUrl.startsWith("https://")
    ) {
      return fileUrl;
    }

    return `http://localhost:4000${fileUrl}`;
  };

  // =====================================================
  // GOOGLE MAPS NAVIGATION
  // =====================================================

  const handleNavigate = () => {
    if (
      !selectedVisit?.latitude ||
      !selectedVisit?.longitude
    ) {
      alert(
        "Property location is not available."
      );
      return;
    }

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${selectedVisit.latitude},${selectedVisit.longitude}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // GET CURRENT GPS LOCATION
  // =====================================================

  const getCurrentLocation = () => {
    return new Promise(
      (resolve, reject) => {
        if (!navigator.geolocation) {
          reject(
            new Error(
              "Geolocation is not supported by this browser."
            )
          );
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude:
                position.coords.latitude,
              longitude:
                position.coords.longitude,
              accuracy:
                position.coords.accuracy,
            });
          },
          (error) => {
            let message =
              "Unable to get your current location.";

            if (error.code === 1) {
              message =
                "Location permission was denied. Please allow location access.";
            }

            if (error.code === 2) {
              message =
                "Your current location could not be determined.";
            }

            if (error.code === 3) {
              message =
                "Location request timed out. Please try again.";
            }

            reject(
              new Error(message)
            );
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        );
      }
    );
  };

  // =====================================================
  // CHECK IN
  // =====================================================

  const handleCheckIn = async () => {
    if (!selectedVisit) return;

    try {
      setLocationLoading(true);
      setLocationError("");

      const location =
        await getCurrentLocation();

      await dispatch(
        recordGeoAttendance({
          visitId: selectedVisit.id,
          attendanceType: "check_in",
          latitude: location.latitude,
          longitude: location.longitude,
          accuracyMeters:
            location.accuracy,
        })
      ).unwrap();

      await dispatch(
        checkInFieldExecutiveVisit(
          selectedVisit.id
        )
      ).unwrap();

      await dispatch(
        fetchFieldExecutiveVisitById(
          selectedVisit.id
        )
      ).unwrap();
    } catch (error) {
      console.error(
        "Check-in error:",
        error
      );

      setLocationError(
        error?.message ||
          "Unable to complete check-in."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  // =====================================================
  // CHECK OUT
  // =====================================================

  const handleCheckOut = async () => {
    if (!selectedVisit) return;

    try {
      setLocationLoading(true);
      setLocationError("");

      const location =
        await getCurrentLocation();

      await dispatch(
        recordGeoAttendance({
          visitId: selectedVisit.id,
          attendanceType: "check_out",
          latitude: location.latitude,
          longitude: location.longitude,
          accuracyMeters:
            location.accuracy,
        })
      ).unwrap();

      await dispatch(
        checkOutFieldExecutiveVisit(
          selectedVisit.id
        )
      ).unwrap();

      await dispatch(
        fetchFieldExecutiveVisitById(
          selectedVisit.id
        )
      ).unwrap();
    } catch (error) {
      console.error(
        "Check-out error:",
        error
      );

      setLocationError(
        error?.message ||
          "Unable to complete check-out."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  // =====================================================
  // FILE SELECT
  // =====================================================

  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      alert(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "Image size must be less than 5 MB."
      );

      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    const objectUrl =
      URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  };

  // =====================================================
  // CLEAR SELECTED FILE
  // =====================================================

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");

    const fileInput =
      document.getElementById(
        "fieldVisitMediaFile"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =====================================================
  // UPLOAD MEDIA
  // =====================================================

  const handleUploadMedia = async () => {
    if (!selectedFile) {
      alert(
        "Please select an image first."
      );
      return;
    }

    if (!id) {
      alert(
        "Visit ID is missing."
      );
      return;
    }

    try {
      await dispatch(
        uploadVisitMedia({
          visitId: id,
          file: selectedFile,
          caption,
        })
      ).unwrap();

      setSelectedFile(null);
      setCaption("");
      setPreviewUrl("");

      const fileInput =
        document.getElementById(
          "fieldVisitMediaFile"
        );

      if (fileInput) {
        fileInput.value = "";
      }

      await dispatch(
        fetchVisitMedia(id)
      ).unwrap();
    } catch (error) {
      console.error(
        "Media upload error:",
        error
      );
    }
  };

  // =====================================================
  // DELETE MEDIA
  // =====================================================

  const handleDeleteMedia = async (
    mediaId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this media?"
      );

    if (!confirmed) return;

    try {
      await dispatch(
        deleteVisitMedia(mediaId)
      ).unwrap();

      await dispatch(
        fetchVisitMedia(id)
      ).unwrap();
    } catch (error) {
      console.error(
        "Media delete error:",
        error
      );
    }
  };

  // =====================================================
  // VIEW MEDIA
  // =====================================================

  const handleViewMedia = (item) => {
    setViewMedia(item);
  };

  // =====================================================
  // CLOSE MEDIA MODAL
  // =====================================================

  const handleCloseMediaModal = () => {
    setViewMedia(null);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (detailsLoading && !selectedVisit) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{
            color: "#C9A227",
          }}
        />

        <p className="mt-3 mb-0">
          Loading visit details...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (
    !detailsLoading &&
    !selectedVisit &&
    detailsError
  ) {
    return (
      <div>
        <button
          className="btn mb-4"
          onClick={() =>
            navigate("/field/visits")
          }
          style={{
            border:
              "1px solid #111111",
            color: "#111111",
            backgroundColor:
              "#FFFFFF",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Visits
        </button>

        <div className="alert alert-danger">
          {detailsError}
        </div>
      </div>
    );
  }

  if (!selectedVisit) {
    return (
      <div>
        <button
          className="btn mb-4"
          onClick={() =>
            navigate("/field/visits")
          }
          style={{
            border:
              "1px solid #111111",
            color: "#111111",
            backgroundColor:
              "#FFFFFF",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Visits
        </button>

        <div className="text-center py-5 text-muted">
          Visit not found.
        </div>
      </div>
    );
  }

  // =====================================================
  // VISIT STATUS
  // =====================================================

  const visitStatus =
    String(
      selectedVisit.visit_status ||
        ""
    ).toLowerCase();

  const hasCheckedIn =
    Boolean(
      selectedVisit.check_in
    );

  const hasCheckedOut =
    Boolean(
      selectedVisit.check_out
    );

  const canCheckIn =
    !hasCheckedIn &&
    !hasCheckedOut &&
    visitStatus !==
      "completed";

  const canCheckOut =
    hasCheckedIn &&
    !hasCheckedOut &&
    visitStatus !==
      "completed";

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            className="btn mb-3"
            onClick={() =>
              navigate("/field/visits")
            }
            style={{
              border:
                "1px solid #111111",
              color: "#111111",
              backgroundColor:
                "#FFFFFF",
            }}
          >
            <FaArrowLeft className="me-2" />
            Back to Visits
          </button>

          <h3
            className="mb-1"
            style={{
              fontWeight: "700",
              color: "#111111",
            }}
          >
            Visit Details
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            View visit information,
            attendance and property
            details.
          </p>
        </div>

        <span
          className="badge px-3 py-2"
          style={{
            ...getStatusStyle(
              selectedVisit.visit_status
            ),
            fontSize: "14px",
          }}
        >
          {formatStatus(
            selectedVisit.visit_status
          )}
        </span>
      </div>

      {/* ================================================= */}
      {/* ACTION / ATTENDANCE CARD */}
      {/* ================================================= */}

      <div
        className="card border-0 shadow-sm mb-4"
        style={{
          borderTop:
            "4px solid #C9A227",
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h5
                className="mb-1"
                style={{
                  fontWeight: "700",
                }}
              >
                Visit Attendance
              </h5>

              <p
                className="mb-0 text-muted"
                style={{
                  fontSize: "14px",
                }}
              >
                GPS location will be
                captured during check-in
                and check-out.
              </p>
            </div>

            <div className="d-flex gap-2">
              {canCheckIn && (
                <button
                  className="btn"
                  onClick={
                    handleCheckIn
                  }
                  disabled={
                    actionLoading ||
                    locationLoading
                  }
                  style={{
                    backgroundColor:
                      "#111111",
                    color: "#FFFFFF",
                    border:
                      "1px solid #111111",
                  }}
                >
                  {locationLoading ? (
                    <FaSpinner className="me-2 fa-spin" />
                  ) : (
                    <FaSignInAlt className="me-2" />
                  )}

                  Check In
                </button>
              )}

              {canCheckOut && (
                <button
                  className="btn"
                  onClick={
                    handleCheckOut
                  }
                  disabled={
                    actionLoading ||
                    locationLoading
                  }
                  style={{
                    backgroundColor:
                      "#C9A227",
                    color: "#111111",
                    border:
                      "1px solid #C9A227",
                  }}
                >
                  {locationLoading ? (
                    <FaSpinner className="me-2 fa-spin" />
                  ) : (
                    <FaSignOutAlt className="me-2" />
                  )}

                  Check Out
                </button>
              )}

              {hasCheckedOut && (
                <span
                  className="badge d-flex align-items-center px-3"
                  style={{
                    backgroundColor:
                      "#DFF5E3",
                    color: "#198754",
                  }}
                >
                  <FaCheckCircle className="me-2" />
                  Visit Completed
                </span>
              )}
            </div>
          </div>

          {/* ATTENDANCE TIMES */}

          <div className="row g-3 mt-3">
            <div className="col-md-6">
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor:
                    "#F8F8F8",
                }}
              >
                <small className="text-muted">
                  Check In
                </small>

                <div
                  className="mt-1"
                  style={{
                    fontWeight: "600",
                  }}
                >
                  {selectedVisit.check_in ||
                    "Not checked in"}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor:
                    "#F8F8F8",
                }}
              >
                <small className="text-muted">
                  Check Out
                </small>

                <div
                  className="mt-1"
                  style={{
                    fontWeight: "600",
                  }}
                >
                  {selectedVisit.check_out ||
                    "Not checked out"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* LOCATION ERROR */}
      {/* ================================================= */}

      {locationError && (
        <div className="alert alert-danger">
          <strong>
            Location Error:
          </strong>{" "}
          {locationError}
        </div>
      )}

      {/* ================================================= */}
      {/* ACTION ERROR */}
      {/* ================================================= */}

      {actionError && (
        <div className="alert alert-danger">
          {actionError}
        </div>
      )}

      {/* ================================================= */}
      {/* VISIT INFORMATION */}
      {/* ================================================= */}

      <div className="row g-4">
        {/* VISIT INFORMATION */}

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div
              className="card-header py-3"
              style={{
                backgroundColor:
                  "#111111",
                color: "#FFFFFF",
              }}
            >
              <strong>
                <FaCalendarAlt className="me-2" />
                Visit Information
              </strong>
            </div>

            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <small className="text-muted">
                    Visit ID
                  </small>

                  <div className="fw-bold mt-1">
                    #{selectedVisit.id}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Visit Date
                  </small>

                  <div className="fw-bold mt-1">
                    {formatDate(
                      selectedVisit.visit_date
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Check In
                  </small>

                  <div className="mt-1">
                    <FaClock
                      className="me-2"
                      style={{
                        color:
                          "#C9A227",
                      }}
                    />

                    {selectedVisit.check_in ||
                      "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Check Out
                  </small>

                  <div className="mt-1">
                    <FaClock
                      className="me-2"
                      style={{
                        color:
                          "#C9A227",
                      }}
                    />

                    {selectedVisit.check_out ||
                      "-"}
                  </div>
                </div>

                <div className="col-12">
                  <small className="text-muted">
                    Remarks
                  </small>

                  <div className="mt-2 p-3 bg-light rounded">
                    {selectedVisit.remarks ||
                      "No remarks available."}
                  </div>
                </div>

                <div className="col-12">
                  <small className="text-muted">
                    Created At
                  </small>

                  <div className="mt-1">
                    {formatDateTime(
                      selectedVisit.created_at
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROPERTY INFORMATION */}

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div
              className="card-header py-3"
              style={{
                backgroundColor:
                  "#111111",
                color: "#FFFFFF",
              }}
            >
              <strong>
                <FaBuilding className="me-2" />
                Property Information
              </strong>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">
                  Property Name
                </small>

                <h5 className="mt-1 mb-0">
                  {selectedVisit.property_name ||
                    "-"}
                </h5>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <small className="text-muted">
                    Survey Number
                  </small>

                  <div className="mt-1 fw-bold">
                    {selectedVisit.survey_number ||
                      "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Property Type
                  </small>

                  <div className="mt-1">
                    {selectedVisit.property_type ||
                      "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Area
                  </small>

                  <div className="mt-1">
                    {selectedVisit.area
                      ? `${selectedVisit.area} acres`
                      : "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Verification
                  </small>

                  <div className="mt-1">
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          "#F5E8B0",
                        color:
                          "#111111",
                      }}
                    >
                      {selectedVisit.verification_status ||
                        "-"}
                    </span>
                  </div>
                </div>

                <div className="col-12">
                  <small className="text-muted">
                    Address
                  </small>

                  <div className="mt-1">
                    <FaMapMarkerAlt
                      className="me-2"
                      style={{
                        color:
                          "#C9A227",
                      }}
                    />

                    {[
                      selectedVisit.address,
                      selectedVisit.city,
                      selectedVisit.state,
                      selectedVisit.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ") ||
                      "-"}
                  </div>
                </div>
              </div>

              {/* NAVIGATION */}

              {selectedVisit.latitude &&
                selectedVisit.longitude && (
                  <button
                    className="btn mt-4"
                    onClick={
                      handleNavigate
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
                    Navigate to Property
                  </button>
                )}
            </div>
          </div>
        </div>

        {/* CUSTOMER INFORMATION */}

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div
              className="card-header py-3"
              style={{
                backgroundColor:
                  "#111111",
                color: "#FFFFFF",
              }}
            >
              <strong>
                <FaUser className="me-2" />
                Customer Information
              </strong>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">
                  Customer Name
                </small>

                <h5 className="mt-1 mb-0">
                  {selectedVisit.customer_name ||
                    "-"}
                </h5>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  Email
                </small>

                <div className="mt-1">
                  {selectedVisit.customer_email ||
                    "-"}
                </div>
              </div>

              <div>
                <small className="text-muted">
                  Mobile
                </small>

                <div className="mt-1">
                  {selectedVisit.customer_mobile ||
                    "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GPS LOCATION */}

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div
              className="card-header py-3"
              style={{
                backgroundColor:
                  "#111111",
                color: "#FFFFFF",
              }}
            >
              <strong>
                <FaMapMarkerAlt className="me-2" />
                Property Coordinates
              </strong>
            </div>

            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <small className="text-muted">
                    Latitude
                  </small>

                  <div className="mt-1 fw-bold">
                    {selectedVisit.latitude ||
                      "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Longitude
                  </small>

                  <div className="mt-1 fw-bold">
                    {selectedVisit.longitude ||
                      "-"}
                  </div>
                </div>
              </div>

              {selectedVisit.latitude &&
                selectedVisit.longitude && (
                  <div
                    className="mt-4 p-3 rounded"
                    style={{
                      backgroundColor:
                        "#F5E8B0",
                    }}
                  >
                    <FaMapMarkerAlt
                      className="me-2"
                      style={{
                        color:
                          "#111111",
                      }}
                    />

                    Property GPS location
                    is available.
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* MEDIA UPLOAD */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mt-4">
        <div
          className="card-header py-3"
          style={{
            backgroundColor:
              "#111111",
            color: "#FFFFFF",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              <FaCamera className="me-2" />
              Visit Media
            </strong>

            <span
              style={{
                fontSize: "13px",
                color: "#CCCCCC",
              }}
            >
              JPG, PNG, WEBP • Max 5 MB
            </span>
          </div>
        </div>

        <div className="card-body">
          {/* UPLOAD FORM */}

          <div
            className="p-4 rounded mb-4"
            style={{
              backgroundColor:
                "#F8F8F8",
              border:
                "1px solid #E5E5E5",
            }}
          >
            <div className="row g-3">
              {/* FILE */}

              <div className="col-md-6">
                <label
                  htmlFor="fieldVisitMediaFile"
                  className="form-label fw-bold"
                >
                  Select Image
                </label>

                <input
                  id="fieldVisitMediaFile"
                  type="file"
                  className="form-control"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={
                    handleFileChange
                  }
                  disabled={
                    uploadLoading
                  }
                />

                <small className="text-muted">
                  Only JPG, JPEG, PNG and
                  WEBP images up to 5 MB.
                </small>
              </div>

              {/* CAPTION */}

              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Caption
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter image caption..."
                  value={caption}
                  onChange={(e) =>
                    setCaption(
                      e.target.value
                    )
                  }
                  disabled={
                    uploadLoading
                  }
                />
              </div>

              {/* PREVIEW */}

              {previewUrl && (
                <div className="col-12">
                  <div className="mt-2">
                    <small className="text-muted">
                      Selected Image
                    </small>

                    <div className="mt-2 d-flex align-items-start gap-3">
                      <img
                        src={previewUrl}
                        alt="Selected preview"
                        style={{
                          width: "180px",
                          height: "130px",
                          objectFit:
                            "cover",
                          borderRadius:
                            "8px",
                          border:
                            "1px solid #DDD",
                        }}
                      />

                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={
                          handleClearFile
                        }
                        disabled={
                          uploadLoading
                        }
                        style={{
                          border:
                            "1px solid #dc3545",
                          color:
                            "#dc3545",
                          backgroundColor:
                            "#FFFFFF",
                        }}
                      >
                        <FaTimes className="me-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* UPLOAD */}

              <div className="col-12">
                <button
                  type="button"
                  className="btn"
                  onClick={
                    handleUploadMedia
                  }
                  disabled={
                    !selectedFile ||
                    uploadLoading
                  }
                  style={{
                    backgroundColor:
                      "#C9A227",
                    color: "#111111",
                    border:
                      "1px solid #C9A227",
                  }}
                >
                  {uploadLoading ? (
                    <>
                      <FaSpinner className="me-2 fa-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaUpload className="me-2" />
                      Upload Media
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* MEDIA ERRORS */}

          {(mediaError ||
            uploadError ||
            deleteError) && (
            <div className="alert alert-danger">
              {mediaError ||
                uploadError ||
                deleteError}
            </div>
          )}

          {/* EXISTING MEDIA */}

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6
              className="mb-0"
              style={{
                fontWeight: "700",
              }}
            >
              Uploaded Media
            </h6>

            <span
              className="text-muted"
              style={{
                fontSize: "13px",
              }}
            >
              {media?.length || 0}{" "}
              {media?.length === 1
                ? "file"
                : "files"}
            </span>
          </div>

          {mediaLoading ? (
            <div className="text-center py-4">
              <div
                className="spinner-border"
                style={{
                  color:
                    "#C9A227",
                }}
              />

              <p className="mt-2 mb-0 text-muted">
                Loading media...
              </p>
            </div>
          ) : !media ||
            media.length === 0 ? (
            <div
              className="text-center py-5 rounded"
              style={{
                backgroundColor:
                  "#F8F8F8",
                border:
                  "1px dashed #CCCCCC",
              }}
            >
              <FaCamera
                style={{
                  fontSize:
                    "35px",
                  color:
                    "#CCCCCC",
                }}
              />

              <p className="mt-3 mb-0 text-muted">
                No media uploaded for
                this visit yet.
              </p>
            </div>
          ) : (
            <div className="row g-3">
              {media.map(
                (item) => (
                  <div
                    className="col-sm-6 col-md-4 col-lg-3"
                    key={item.id}
                  >
                    <div
                      className="card h-100"
                      style={{
                        border:
                          "1px solid #E5E5E5",
                      }}
                    >
                      <div
                        style={{
                          position:
                            "relative",
                          backgroundColor:
                            "#F5F5F5",
                        }}
                      >
                        <img
                          src={getMediaUrl(
                            item.file_url
                          )}
                          alt={
                            item.caption ||
                            item.file_name ||
                            "Visit media"
                          }
                          style={{
                            width:
                              "100%",
                            height:
                              "180px",
                            objectFit:
                              "cover",
                            borderTopLeftRadius:
                              "5px",
                            borderTopRightRadius:
                              "5px",
                          }}
                        />
                      </div>

                      <div className="card-body p-3">
                        <div
                          style={{
                            fontSize:
                              "13px",
                            fontWeight:
                              "600",
                            whiteSpace:
                              "nowrap",
                            overflow:
                              "hidden",
                            textOverflow:
                              "ellipsis",
                          }}
                          title={
                            item.file_name
                          }
                        >
                          {item.file_name ||
                            "Image"}
                        </div>

                        {item.caption && (
                          <div
                            className="text-muted mt-1"
                            style={{
                              fontSize:
                                "12px",
                            }}
                          >
                            {item.caption}
                          </div>
                        )}

                        <div
                          className="text-muted mt-2"
                          style={{
                            fontSize:
                              "11px",
                          }}
                        >
                          {formatDateTime(
                            item.created_at
                          )}
                        </div>

                        <div className="d-flex gap-2 mt-3">
                          <button
                            type="button"
                            className="btn btn-sm flex-grow-1"
                            onClick={() =>
                              handleViewMedia(
                                item
                              )
                            }
                            style={{
                              color:
                                "#C9A227",
                              border:
                                "1px solid #C9A227",
                              backgroundColor:
                                "#FFFFFF",
                            }}
                          >
                            <FaEye className="me-1" />
                            View
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm"
                            title="Delete Media"
                            onClick={() =>
                              handleDeleteMedia(
                                item.id
                              )
                            }
                            disabled={
                              deleteLoading
                            }
                            style={{
                              color:
                                "#dc3545",
                              border:
                                "1px solid #dc3545",
                              backgroundColor:
                                "#FFFFFF",
                            }}
                          >
                            {deleteLoading ? (
                              <FaSpinner className="fa-spin" />
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* MEDIA VIEW MODAL */}
      {/* ================================================= */}

      {viewMedia && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.75)",
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
                  color:
                    "#FFFFFF",
                }}
              >
                <h5 className="modal-title">
                  <FaCamera className="me-2" />
                  Visit Media
                </h5>

                <button
                  type="button"
                  className="btn"
                  onClick={
                    handleCloseMediaModal
                  }
                  style={{
                    color:
                      "#FFFFFF",
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              {/* BODY */}

              <div className="modal-body text-center">
                <img
                  src={getMediaUrl(
                    viewMedia.file_url
                  )}
                  alt={
                    viewMedia.caption ||
                    viewMedia.file_name ||
                    "Visit media"
                  }
                  style={{
                    maxWidth:
                      "100%",
                    maxHeight:
                      "65vh",
                    objectFit:
                      "contain",
                    borderRadius:
                      "6px",
                  }}
                />

                <div className="mt-3 text-start">
                  <strong>
                    File:
                  </strong>{" "}
                  {viewMedia.file_name ||
                    "-"}

                  {viewMedia.caption && (
                    <div className="mt-2">
                      <strong>
                        Caption:
                      </strong>{" "}
                      {viewMedia.caption}
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER */}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn"
                  onClick={
                    handleCloseMediaModal
                  }
                  style={{
                    backgroundColor:
                      "#111111",
                    color:
                      "#FFFFFF",
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

export default FieldExecutiveVisitDetails;

