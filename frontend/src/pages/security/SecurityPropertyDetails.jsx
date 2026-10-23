
import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaBuilding,
  FaMapMarkerAlt,
  FaMap,
  FaClipboardList,
  FaCalendarAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";

//const API_URL = "http://localhost:4000/api/v1";

const SecurityPropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FETCH ASSIGNED PROPERTY DETAILS
  // =========================================

 const fetchPropertyDetails = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await API.get(`/security/properties/${id}`);

    if (response.data?.success) {
      setProperty(response.data.property);
    } else {
      setError(
        response.data?.message || "Unable to load property details."
      );
    }
  } catch (err) {
    console.error(
      "Security Property Details Error:",
      err.response?.data || err.message
    );

    setError(
      err.response?.data?.message || "Unable to load property details."
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================
  // STATUS COLORS
  // =========================================

  const getAssignmentStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "active") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (value === "completed") {
      return {
        backgroundColor: "#DCEBFA",
        color: "#084298",
      };
    }

    if (value === "cancelled") {
      return {
        backgroundColor: "#F8D7DA",
        color: "#842029",
      };
    }

    return {
      backgroundColor: "#FFF3CD",
      color: "#856404",
    };
  };

  const getVerificationStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "verified") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (value === "rejected") {
      return {
        backgroundColor: "#F8D7DA",
        color: "#842029",
      };
    }

    return {
      backgroundColor: "#FFF3CD",
      color: "#856404",
    };
  };

  // =========================================
  // REUSABLE INFORMATION ITEM
  // =========================================

  const InfoItem = ({ label, value }) => (
    <div className="col-md-6 mb-3">
      <small className="text-muted">{label}</small>
      <div
        className="fw-semibold mt-1"
        style={{ color: "#222222", overflowWrap: "anywhere" }}
      >
        {value || "-"}
      </div>
    </div>
  );

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          role="status"
          style={{ color: "#C9A227" }}
        />

        <p className="mt-3 text-muted">
          Loading property details...
        </p>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div>
        <button
          type="button"
          className="btn mb-4"
          onClick={() => navigate("/security/properties")}
          style={{
            backgroundColor: "#FFFFFF",
            color: "#111111",
            border: "1px solid #111111",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Properties
        </button>

        <div className="alert alert-danger">
          {error}
        </div>

        <button
          type="button"
          className="btn"
          onClick={fetchPropertyDetails}
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // =========================================
  // PROPERTY NOT FOUND
  // =========================================

  if (!property) {
    return (
      <div className="text-center py-5">
        <FaBuilding
          style={{ fontSize: 45, color: "#CCCCCC" }}
        />

        <h5 className="mt-3">Property not found</h5>

        <p className="text-muted">
          This property may not be assigned to your account.
        </p>

        <button
          type="button"
          className="btn"
          onClick={() => navigate("/security/properties")}
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
          }}
        >
          Back to Properties
        </button>
      </div>
    );
  }

  const hasCoordinates =
    property.latitude != null &&
    property.longitude != null &&
    property.latitude !== "" &&
    property.longitude !== "";

  const mapUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        `${property.latitude},${property.longitude}`
      )}`
    : null;

  // =========================================
  // MAIN PAGE
  // =========================================

  return (
    <div>
      {/* HEADER */}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <button
            type="button"
            className="btn btn-sm mb-3"
            onClick={() => navigate("/security/properties")}
            style={{
              backgroundColor: "#FFFFFF",
              color: "#111111",
              border: "1px solid #DDDDDD",
            }}
          >
            <FaArrowLeft className="me-2" />
            Back to Properties
          </button>

          <h3
            className="mb-1 fw-bold"
            style={{ color: "#111111" }}
          >
            {property.property_name || "Property Details"}
          </h3>

          <p className="mb-0 text-muted">
            Property ID: #{property.property_id}
            {" • "}
            Survey No: {property.survey_number || "-"}
          </p>
        </div>

        <span
          className="badge px-3 py-2"
          style={getAssignmentStatusStyle(
            property.assignment_status
          )}
        >
          Assignment: {property.assignment_status || "Unknown"}
        </span>
      </div>

      {/* SUMMARY CARDS */}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderTop: "3px solid #C9A227" }}
          >
            <div className="card-body">
              <small className="text-muted">Property Type</small>
              <h5 className="mt-2 mb-0 fw-bold">
                {property.property_type || "-"}
              </h5>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderTop: "3px solid #111111" }}
          >
            <div className="card-body">
              <small className="text-muted">Land Area</small>
              <h5 className="mt-2 mb-0 fw-bold">
                {property.area != null
                  ? `${property.area} acres`
                  : "-"}
              </h5>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderTop: "3px solid #198754" }}
          >
            <div className="card-body">
              <small className="text-muted">
                Verification Status
              </small>

              <div className="mt-2">
                <span
                  className="badge px-3 py-2"
                  style={getVerificationStatusStyle(
                    property.verification_status
                  )}
                >
                  {property.verification_status || "Unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* LEFT COLUMN */}

        <div className="col-lg-8">
          {/* PROPERTY INFORMATION */}

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
                Property Information
              </strong>
            </div>

            <div className="card-body">
              <div className="row">
                <InfoItem
                  label="Property Name"
                  value={property.property_name}
                />

                <InfoItem
                  label="Survey Number"
                  value={property.survey_number}
                />

                <InfoItem
                  label="Property Type"
                  value={property.property_type}
                />

                <InfoItem
                  label="Area"
                  value={
                    property.area != null
                      ? `${property.area} acres`
                      : "-"
                  }
                />

                <InfoItem
                  label="Property Created"
                  value={formatDate(property.created_at)}
                />

                <InfoItem
                  label="Verification Status"
                  value={property.verification_status}
                />
              </div>
            </div>
          </div>

          {/* PROPERTY ADDRESS */}

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
              <div className="mb-4">
                <small className="text-muted">Address</small>
                <div className="fw-semibold mt-1">
                  {property.address || "-"}
                </div>
              </div>

              <div className="row">
                <InfoItem label="City" value={property.city} />
                <InfoItem label="State" value={property.state} />
                <InfoItem label="Pincode" value={property.pincode} />
              </div>
            </div>
          </div>

          {/* LOCATION */}

          <div className="card border-0 shadow-sm mb-4">
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
              {hasCoordinates ? (
                <>
                  <div className="row">
                    <InfoItem
                      label="Latitude"
                      value={property.latitude}
                    />

                    <InfoItem
                      label="Longitude"
                      value={property.longitude}
                    />
                  </div>

                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    style={{
                      backgroundColor: "#111111",
                      color: "#FFFFFF",
                    }}
                  >
                    <FaExternalLinkAlt className="me-2" />
                    Open in Google Maps
                  </a>
                </>
              ) : (
                <p className="text-muted mb-0">
                  Location coordinates are not available for this property.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}

        <div className="col-lg-4">
          {/* ASSIGNMENT INFORMATION */}

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
                Assignment Information
              </strong>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">Assignment ID</small>
                <div className="fw-semibold mt-1">
                  #{property.assignment_id}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">Assignment Type</small>
                <div className="fw-semibold mt-1">
                  {property.assignment_type || "-"}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  <FaCalendarAlt className="me-2" />
                  Assignment Date
                </small>
                <div className="fw-semibold mt-1">
                  {formatDate(property.assignment_date)}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">Status</small>
                <div className="mt-2">
                  <span
                    className="badge px-3 py-2"
                    style={getAssignmentStatusStyle(
                      property.assignment_status
                    )}
                  >
                    {property.assignment_status || "Unknown"}
                  </span>
                </div>
              </div>

              <hr />

              <small className="text-muted">Assignment Notes</small>
              <p className="mt-2 mb-0">
                {property.assignment_notes ||
                  "No assignment notes provided."}
              </p>
            </div>
          </div>

          {/* QUICK INFORMATION */}

          <div className="card border-0 shadow-sm">
            <div
              className="card-header bg-white py-3"
              style={{ borderBottom: "2px solid #C9A227" }}
            >
              <strong>
                <FaInfoCircle
                  className="me-2"
                  style={{ color: "#C9A227" }}
                />
                Security Information
              </strong>
            </div>

            <div className="card-body">
              <p className="text-muted small">
                This property is assigned to your Security account for
                monitoring. Follow your organization's procedures when
                recording observations or incidents.
              </p>

              <div className="d-flex align-items-start gap-2">
                <FaCheckCircle
                  className="mt-1"
                  style={{ color: "#C9A227" }}
                />

                <span className="small">
                  You can access details for properties assigned to your account.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INFORMATION NOTE */}

      <div
        className="alert mt-4 mb-0"
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
        Property details are retrieved from your assigned Security property records.
      </div>
    </div>
  );
};

export default SecurityPropertyDetails;

