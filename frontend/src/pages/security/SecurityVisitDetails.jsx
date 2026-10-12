
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaClipboardList,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaInfoCircle,
  FaMap,
} from "react-icons/fa";

import {
  fetchSecurityVisitById,
  clearSelectedSecurityVisit,
  clearSecurityVisitErrors,
} from "../../redux/securityVisitSlice";

const SecurityVisitDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectedVisit,
    detailsLoading,
    detailsError,
  } = useSelector((state) => state.securityVisit);

  // =====================================================
  // FETCH VISIT DETAILS
  // =====================================================

  useEffect(() => {
    dispatch(clearSelectedSecurityVisit());
    dispatch(fetchSecurityVisitById(id));

    return () => {
      dispatch(clearSelectedSecurityVisit());
      dispatch(clearSecurityVisitErrors());
    };
  }, [dispatch, id]);

  // =====================================================
  // FORMAT DATE WITHOUT UTC DATE SHIFT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const datePart = String(date).slice(0, 10);
    const parts = datePart.split("-");

    if (parts.length !== 3) return "-";

    const [year, month, day] = parts.map(Number);

    if (!year || !month || !day) return "-";

    const formattedDate = new Date(year, month - 1, day);

    if (Number.isNaN(formattedDate.getTime())) return "-";

    return formattedDate.toLocaleDateString("en-IN");
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "-";

    const parts = String(time).slice(0, 8).split(":");

    if (parts.length < 2) return time;

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return time;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "completed") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (["rejected", "cancelled"].includes(value)) {
      return {
        backgroundColor: "#F8D7DA",
        color: "#842029",
      };
    }

    if (["in_progress", "in progress"].includes(value)) {
      return {
        backgroundColor: "#DDEBFF",
        color: "#084298",
      };
    }

    return {
      backgroundColor: "#FFF3CD",
      color: "#856404",
    };
  };

  // =====================================================
  // REUSABLE INFORMATION FIELD
  // =====================================================

  const InfoField = ({ label, value }) => (
    <div className="col-md-6">
      <small className="text-muted">{label}</small>
      <div
        className="fw-semibold mt-1"
        style={{ overflowWrap: "anywhere" }}
      >
        {value === null || value === undefined || value === ""
          ? "-"
          : value}
      </div>
    </div>
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (detailsLoading && !selectedVisit) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{ color: "#C9A227" }}
        />

        <p className="mt-3 text-muted">
          Loading visit details...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR / NOT FOUND
  // =====================================================

  if (detailsError || (!detailsLoading && !selectedVisit)) {
    return (
      <div>
        <button
          type="button"
          className="btn mb-4"
          onClick={() => navigate("/security/visits")}
          style={{
            color: "#111111",
            backgroundColor: "#FFFFFF",
            border: "1px solid #111111",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Visits
        </button>

        <div className="alert alert-danger">
          {detailsError || "Visit not found."}
        </div>

        <button
          type="button"
          className="btn"
          onClick={() => dispatch(fetchSecurityVisitById(id))}
          style={{
            color: "#FFFFFF",
            backgroundColor: "#111111",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const visit = selectedVisit;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div>
      {/* BACK BUTTON */}

      <button
        type="button"
        className="btn mb-4"
        onClick={() => navigate("/security/visits")}
        style={{
          color: "#111111",
          backgroundColor: "#FFFFFF",
          border: "1px solid #111111",
        }}
      >
        <FaArrowLeft className="me-2" />
        Back to Visits
      </button>

      {/* HEADER */}

      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h3
            className="mb-1"
            style={{
              fontWeight: 700,
              color: "#111111",
            }}
          >
            Security Visit Details
          </h3>

          <p className="mb-0 text-muted">
            Visit ID: #{visit.visit_id}
          </p>
        </div>

        <span
          className="badge px-3 py-2"
          style={getStatusStyle(visit.visit_status)}
        >
          {visit.visit_status || "Unknown"}
        </span>
      </div>

      {/* PROPERTY SUMMARY */}

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header bg-white py-3"
          style={{ borderBottom: "2px solid #C9A227" }}
        >
          <strong>
            <FaBuilding
              className="me-2"
              style={{ color: "#C9A227" }}
            />
            Assigned Property
          </strong>
        </div>

        <div className="card-body">
          <h5 className="mb-2">
            {visit.property_name || "Property"}
          </h5>

          <div className="text-muted">
            Survey Number: {visit.survey_number || "-"}
          </div>

          <div className="mt-2">
            <span
              className="badge"
              style={{
                backgroundColor: "#F5E8B0",
                color: "#111111",
              }}
            >
              {visit.assignment_type || "Security Assignment"}
            </span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* LEFT COLUMN */}

        <div className="col-lg-8">
          {/* VISIT INFORMATION */}

          <div className="card border-0 shadow-sm mb-4">
            <div
              className="card-header bg-white py-3"
              style={{ borderBottom: "2px solid #C9A227" }}
            >
              <strong>
                <FaClipboardList
                  className="me-2"
                  style={{ color: "#C9A227" }}
                />
                Visit Information
              </strong>
            </div>

            <div className="card-body">
              <div className="row g-4">
                <InfoField
                  label="Visit ID"
                  value={`#${visit.visit_id}`}
                />

                <InfoField
                  label="Property ID"
                  value={visit.property_id}
                />

                <InfoField
                  label="Visit Date"
                  value={formatDate(visit.visit_date)}
                />

                <InfoField
                  label="Property Type"
                  value={visit.property_type}
                />

                <InfoField
                  label="Check-In Time"
                  value={formatTime(visit.check_in)}
                />

                <InfoField
                  label="Check-Out Time"
                  value={formatTime(visit.check_out)}
                />

                <InfoField
                  label="Visit Status"
                  value={visit.visit_status}
                />

                <InfoField
                  label="Record Created"
                  value={formatDate(visit.created_at)}
                />

                <InfoField
                  label="Property Area"
                  value={
                    visit.area !== null &&
                    visit.area !== undefined &&
                    visit.area !== ""
                      ? `${visit.area} acres`
                      : "-"
                  }
                />

                <InfoField
                  label="Property Verification"
                  value={visit.verification_status}
                />
              </div>
            </div>
          </div>

          {/* ADDRESS */}

          <div className="card border-0 shadow-sm mb-4">
            <div
              className="card-header bg-white py-3"
              style={{ borderBottom: "2px solid #C9A227" }}
            >
              <strong>
                <FaMapMarkerAlt
                  className="me-2"
                  style={{ color: "#C9A227" }}
                />
                Property Address
              </strong>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">Address</small>

                <div className="fw-semibold mt-1">
                  {visit.address || "-"}
                </div>
              </div>

              <div className="row g-4">
                <InfoField label="City" value={visit.city} />
                <InfoField label="State" value={visit.state} />
                <InfoField label="Pincode" value={visit.pincode} />
              </div>
            </div>
          </div>

          {/* REMARKS */}

          <div className="card border-0 shadow-sm mb-4">
            <div
              className="card-header bg-white py-3"
              style={{ borderBottom: "2px solid #C9A227" }}
            >
              <strong>
                <FaInfoCircle
                  className="me-2"
                  style={{ color: "#C9A227" }}
                />
                Visit Remarks
              </strong>
            </div>

            <div className="card-body">
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor: "#F8F9FA",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                {visit.remarks || "No remarks recorded for this visit."}
              </div>
            </div>
          </div>

          {/* COORDINATES */}

          <div className="card border-0 shadow-sm">
            <div
              className="card-header bg-white py-3"
              style={{ borderBottom: "2px solid #C9A227" }}
            >
              <strong>
                <FaMap
                  className="me-2"
                  style={{ color: "#C9A227" }}
                />
                Location Coordinates
              </strong>
            </div>

            <div className="card-body">
              <div className="row g-4">
                <InfoField
                  label="Latitude"
                  value={visit.latitude}
                />

                <InfoField
                  label="Longitude"
                  value={visit.longitude}
                />
              </div>

              {visit.latitude !== null &&
                visit.latitude !== undefined &&
                visit.latitude !== "" &&
                visit.longitude !== null &&
                visit.longitude !== undefined &&
                visit.longitude !== "" && (
                  <a
                    className="btn btn-sm mt-3"
                    href={`https://www.google.com/maps?q=${encodeURIComponent(
                      `${visit.latitude},${visit.longitude}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#FFFFFF",
                      backgroundColor: "#111111",
                    }}
                  >
                    <FaMapMarkerAlt className="me-2" />
                    Open Location in Maps
                  </a>
                )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}

        <div className="col-lg-4">
          {/* VISIT STATUS */}

          <div className="card border-0 shadow-sm mb-4">
            <div
              className="card-header bg-white py-3"
              style={{ borderBottom: "2px solid #C9A227" }}
            >
              <strong>
                <FaCheckCircle
                  className="me-2"
                  style={{ color: "#C9A227" }}
                />
                Visit Status
              </strong>
            </div>

            <div className="card-body">
              <small className="text-muted">
                Current Status
              </small>

              <div className="mt-2 mb-3">
                <span
                  className="badge px-3 py-2"
                  style={getStatusStyle(visit.visit_status)}
                >
                  {visit.visit_status || "Unknown"}
                </span>
              </div>

              <hr />

              <div className="mb-3">
                <small className="text-muted">
                  <FaCalendarAlt className="me-2" />
                  Scheduled Date
                </small>

                <div className="fw-semibold mt-1">
                  {formatDate(visit.visit_date)}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  <FaClock className="me-2" />
                  Check In
                </small>

                <div className="fw-semibold mt-1">
                  {formatTime(visit.check_in)}
                </div>
              </div>

              <div>
                <small className="text-muted">
                  <FaClock className="me-2" />
                  Check Out
                </small>

                <div className="fw-semibold mt-1">
                  {formatTime(visit.check_out)}
                </div>
              </div>
            </div>
          </div>

          {/* ASSIGNMENT INFORMATION */}

          <div className="card border-0 shadow-sm">
            <div
              className="card-header bg-white py-3"
              style={{ borderBottom: "2px solid #C9A227" }}
            >
              <strong>Assignment Information</strong>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">
                  Assignment Type
                </small>

                <div className="fw-semibold mt-1">
                  {visit.assignment_type || "-"}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  Assignment Date
                </small>

                <div className="fw-semibold mt-1">
                  {formatDate(visit.assignment_date)}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  Assignment Status
                </small>

                <div className="mt-1">
                  <span
                    className="badge"
                    style={getStatusStyle(visit.assignment_status)}
                  >
                    {visit.assignment_status || "-"}
                  </span>
                </div>
              </div>

              <div>
                <small className="text-muted">
                  Assignment Notes
                </small>

                <div
                  className="mt-1"
                  style={{ overflowWrap: "anywhere" }}
                >
                  {visit.assignment_notes || "No assignment notes."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INFORMATION NOTE */}

      <div
        className="alert mt-4"
        style={{
          backgroundColor: "#FFFDF5",
          border: "1px solid #E6D48A",
          color: "#555555",
        }}
      >
        <FaInfoCircle
          className="me-2"
          style={{ color: "#C9A227" }}
        />

        This page displays visit and property records available to your Security account.
      </div>
    </div>
  );
};

export default SecurityVisitDetails;

