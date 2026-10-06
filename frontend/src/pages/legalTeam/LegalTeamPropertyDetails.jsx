
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaPhone,
  FaEnvelope,
  FaMap,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const LegalTeamPropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH PROPERTY
  // =====================================================

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/legal-team/properties/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setProperty(response.data.property);
      } else {
        setError(
          response.data?.message ||
            "Unable to load property."
        );
      }
    } catch (err) {
      console.error(
        "Legal Team Property Details Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load property details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN");
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
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

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{
            color: "#C9A227",
          }}
        />

        <p className="mt-3 text-muted">
          Loading property details...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div>
        <button
          className="btn mb-4"
          onClick={() =>
            navigate("/legal-team/properties")
          }
          style={{
            border: "1px solid #111111",
            color: "#111111",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Properties
        </button>

        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  // =====================================================
  // NO PROPERTY
  // =====================================================

  if (!property) {
    return (
      <div className="text-center py-5">
        <FaBuilding
          style={{
            fontSize: "45px",
            color: "#CCCCCC",
          }}
        />

        <p className="mt-3 text-muted">
          Property not found.
        </p>

        <button
          className="btn"
          onClick={() =>
            navigate("/legal-team/properties")
          }
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

  return (
    <div>
      {/* ================================================= */}
      {/* BACK BUTTON */}
      {/* ================================================= */}

      <button
        className="btn mb-4"
        onClick={() =>
          navigate("/legal-team/properties")
        }
        style={{
          border: "1px solid #111111",
          color: "#111111",
          backgroundColor: "#FFFFFF",
        }}
      >
        <FaArrowLeft className="me-2" />
        Back to Properties
      </button>

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
            {property.property_name || "-"}
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Property ID: #{property.id}
          </p>
        </div>

        <span
          className="badge px-3 py-2"
          style={getStatusStyle(
            property.verification_status
          )}
        >
          {property.verification_status || "-"}
        </span>
      </div>

      {/* ================================================= */}
      {/* PROPERTY INFORMATION */}
      {/* ================================================= */}

      <div className="row g-4">
        <div className="col-lg-8">
          {/* PROPERTY DETAILS */}

          <div className="card border-0 shadow-sm mb-4">
            <div
              className="card-header bg-white"
              style={{
                borderBottom:
                  "2px solid #C9A227",
              }}
            >
              <strong>
                <FaBuilding
                  className="me-2"
                  style={{
                    color: "#C9A227",
                  }}
                />
                Property Information
              </strong>
            </div>

            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <small className="text-muted">
                    Property Name
                  </small>

                  <div className="fw-semibold mt-1">
                    {property.property_name || "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Survey Number
                  </small>

                  <div className="fw-semibold mt-1">
                    {property.survey_number || "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Property Type
                  </small>

                  <div className="fw-semibold mt-1">
                    {property.property_type || "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Area
                  </small>

                  <div className="fw-semibold mt-1">
                    {property.area
                      ? `${property.area} acres`
                      : "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Verification Status
                  </small>

                  <div className="mt-1">
                    <span
                      className="badge"
                      style={getStatusStyle(
                        property.verification_status
                      )}
                    >
                      {property.verification_status ||
                        "-"}
                    </span>
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Created Date
                  </small>

                  <div className="fw-semibold mt-1">
                    {formatDate(
                      property.created_at
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ADDRESS */}

          <div className="card border-0 shadow-sm mb-4">
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
                    color: "#C9A227",
                  }}
                />
                Property Address
              </strong>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">
                  Address
                </small>

                <div className="fw-semibold mt-1">
                  {property.address || "-"}
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-4">
                  <small className="text-muted">
                    City
                  </small>

                  <div className="fw-semibold mt-1">
                    {property.city || "-"}
                  </div>
                </div>

                <div className="col-md-4">
                  <small className="text-muted">
                    State
                  </small>

                  <div className="fw-semibold mt-1">
                    {property.state || "-"}
                  </div>
                </div>

                <div className="col-md-4">
                  <small className="text-muted">
                    Pincode
                  </small>

                  <div className="fw-semibold mt-1">
                    {property.pincode || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LOCATION */}

          <div className="card border-0 shadow-sm">
            <div
              className="card-header bg-white"
              style={{
                borderBottom:
                  "2px solid #C9A227",
              }}
            >
              <strong>
                <FaMap
                  className="me-2"
                  style={{
                    color: "#C9A227",
                  }}
                />
                Location Coordinates
              </strong>
            </div>

            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <small className="text-muted">
                    Latitude
                  </small>

                  <div className="fw-semibold mt-1">
                    {property.latitude || "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Longitude
                  </small>

                  <div className="fw-semibold mt-1">
                    {property.longitude || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* CUSTOMER */}
        {/* ================================================= */}

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div
              className="card-header bg-white"
              style={{
                borderBottom:
                  "2px solid #C9A227",
              }}
            >
              <strong>
                <FaUser
                  className="me-2"
                  style={{
                    color: "#C9A227",
                  }}
                />
                Customer Information
              </strong>
            </div>

            <div className="card-body">
              <div className="text-center mb-4">
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    backgroundColor: "#111111",
                    color: "#C9A227",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 15px",
                    fontSize: "28px",
                  }}
                >
                  <FaUser />
                </div>

                <h5 className="mb-1">
                  {property.customer_name ||
                    "Customer"}
                </h5>

                <small className="text-muted">
                  {property.customer_role ||
                    "Customer"}
                </small>
              </div>

              <hr />

              <div className="mb-3">
                <small className="text-muted">
                  <FaEnvelope className="me-2" />
                  Email
                </small>

                <div className="fw-semibold mt-1">
                  {property.customer_email || "-"}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  <FaPhone className="me-2" />
                  Mobile
                </small>

                <div className="fw-semibold mt-1">
                  {property.customer_mobile || "-"}
                </div>
              </div>

              <div>
                <small className="text-muted">
                  Account Status
                </small>

                <div className="mt-1">
                  <span
                    className="badge"
                    style={
                      String(
                        property.customer_status
                      ).toLowerCase() ===
                      "active"
                        ? {
                            backgroundColor:
                              "#DFF5E3",
                            color: "#198754",
                          }
                        : {
                            backgroundColor:
                              "#F8D7DA",
                            color: "#842029",
                          }
                    }
                  >
                    {property.customer_status ||
                      "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* VERIFICATION */}

          <div className="card border-0 shadow-sm">
            <div
              className="card-header bg-white"
              style={{
                borderBottom:
                  "2px solid #C9A227",
              }}
            >
              <strong>
                <FaCheckCircle
                  className="me-2"
                  style={{
                    color: "#C9A227",
                  }}
                />
                Verification
              </strong>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">
                  Current Status
                </small>

                <div className="mt-2">
                  <span
                    className="badge px-3 py-2"
                    style={getStatusStyle(
                      property.verification_status
                    )}
                  >
                    {property.verification_status ||
                      "-"}
                  </span>
                </div>
              </div>

              <div>
                <small className="text-muted">
                  Verified By User ID
                </small>

                <div className="fw-semibold mt-1">
                  {property.verified_by || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* INFORMATION NOTE */}
      {/* ================================================= */}

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
          style={{
            color: "#C9A227",
          }}
        />

        Property information is displayed from the
        Legal Team property records.
      </div>
    </div>
  );
};

export default LegalTeamPropertyDetails;

