import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaBalanceScale,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaEnvelope,
  FaFileAlt,
  FaGavel,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaVideo,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const LegalTeamConsultationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [consultation, setConsultation] =
    useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH CONSULTATION DETAILS
  // =====================================================

  const fetchConsultationDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/legal-team/consultations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Legal Consultation Details Response:",
        response.data
      );

      if (response.data?.success) {
        setConsultation(
          response.data.consultation
        );
      } else {
        setError(
          response.data?.message ||
            "Unable to load consultation details."
        );
      }
    } catch (err) {
      console.error(
        "Legal Consultation Details Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load consultation details."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    if (id) {
      fetchConsultationDetails();
    }
  }, [id]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN"
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    try {
      const [hours, minutes] =
        String(time).split(":");

      const date = new Date();

      date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
      );

      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return time;
    }
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    navigate("/legal-team/consultations");
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

        <p className="mt-3 mb-0">
          Loading consultation details...
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
          type="button"
          className="btn mb-4"
          onClick={handleBack}
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Consultations
        </button>

        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  // =====================================================
  // NO DATA
  // =====================================================

  if (!consultation) {
    return (
      <div>
        <button
          type="button"
          className="btn mb-4"
          onClick={handleBack}
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Consultations
        </button>

        <div className="alert alert-warning">
          Consultation details are not available.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ================================================= */}
      {/* BACK BUTTON */}
      {/* ================================================= */}

      <button
        type="button"
        className="btn mb-4"
        onClick={handleBack}
        style={{
          backgroundColor: "#111111",
          color: "#FFFFFF",
          border: "1px solid #111111",
        }}
      >
        <FaArrowLeft className="me-2" />
        Back to Consultations
      </button>

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="card border-0 shadow-sm mb-4"
        style={{
          borderTop: "4px solid #C9A227",
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaBalanceScale
                  style={{
                    color: "#C9A227",
                    fontSize: "24px",
                  }}
                />

                <span
                  style={{
                    color: "#777777",
                    fontSize: "14px",
                  }}
                >
                  Legal Consultation
                </span>
              </div>

              <h3
                className="mb-2"
                style={{
                  fontWeight: "700",
                  color: "#111111",
                }}
              >
                Consultation #{consultation.id}
              </h3>

              <div
                style={{
                  color: "#777777",
                }}
              >
                Legal Case:{" "}
                <strong
                  style={{
                    color: "#111111",
                  }}
                >
                  {consultation.case_number ||
                    "-"}
                </strong>
              </div>
            </div>

            <span
              className="badge"
              style={{
                fontSize: "14px",
                padding: "10px 14px",
                backgroundColor:
                  String(
                    consultation.status || ""
                  ).toLowerCase() ===
                  "confirmed"
                    ? "#DFF5E3"
                    : String(
                        consultation.status || ""
                      ).toLowerCase() ===
                      "pending"
                    ? "#FFF3CD"
                    : String(
                        consultation.status || ""
                      ).toLowerCase() ===
                      "cancelled"
                    ? "#F8D7DA"
                    : "#E8E8E8",

                color:
                  String(
                    consultation.status || ""
                  ).toLowerCase() ===
                  "confirmed"
                    ? "#198754"
                    : String(
                        consultation.status || ""
                      ).toLowerCase() ===
                      "pending"
                    ? "#856404"
                    : String(
                        consultation.status || ""
                      ).toLowerCase() ===
                      "cancelled"
                    ? "#842029"
                    : "#555555",
              }}
            >
              {consultation.status || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* CONSULTATION SCHEDULE */}
      {/* ================================================= */}

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <FaCalendarAlt
                style={{
                  color: "#C9A227",
                  fontSize: "26px",
                }}
              />

              <small
                className="d-block text-muted mt-3"
              >
                Consultation Date
              </small>

              <h5 className="mt-1 mb-0">
                {formatDate(
                  consultation.consultation_date
                )}
              </h5>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <FaClock
                style={{
                  color: "#C9A227",
                  fontSize: "26px",
                }}
              />

              <small
                className="d-block text-muted mt-3"
              >
                Consultation Time
              </small>

              <h5 className="mt-1 mb-0">
                {formatTime(
                  consultation.consultation_time
                )}
              </h5>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <FaVideo
                style={{
                  color: "#C9A227",
                  fontSize: "26px",
                }}
              />

              <small
                className="d-block text-muted mt-3"
              >
                Meeting Type
              </small>

              <h5 className="mt-1 mb-0">
                {consultation.meeting_type ||
                  "-"}
              </h5>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* CUSTOMER + CASE */}
      {/* ================================================= */}

      <div className="row g-4 mb-4">
        {/* CUSTOMER */}

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
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
              <div className="mb-3">
                <small className="text-muted">
                  Customer Name
                </small>

                <div className="fw-semibold mt-1">
                  {consultation.customer_name ||
                    "-"}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  Email
                </small>

                <div className="mt-1">
                  <FaEnvelope
                    className="me-2"
                    style={{
                      color: "#C9A227",
                    }}
                  />

                  {consultation.customer_email ||
                    "-"}
                </div>
              </div>

              <div>
                <small className="text-muted">
                  Mobile
                </small>

                <div className="mt-1">
                  <FaPhone
                    className="me-2"
                    style={{
                      color: "#C9A227",
                    }}
                  />

                  {consultation.customer_mobile ||
                    "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CASE */}

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div
              className="card-header bg-white"
              style={{
                borderBottom:
                  "2px solid #C9A227",
              }}
            >
              <strong>
                <FaGavel
                  className="me-2"
                  style={{
                    color: "#C9A227",
                  }}
                />
                Legal Case
              </strong>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">
                  Case Number
                </small>

                <div className="fw-semibold mt-1">
                  {consultation.case_number ||
                    "-"}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  Case Title
                </small>

                <div className="mt-1">
                  {consultation.case_title ||
                    "-"}
                </div>
              </div>

              <div>
                <small className="text-muted">
                  Case Status
                </small>

                <div className="mt-1">
                  {consultation.case_status ||
                    "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* PROPERTY */}
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
            <div className="col-md-4">
              <small className="text-muted">
                Property Name
              </small>

              <div className="fw-semibold mt-1">
                {consultation.property_name ||
                  "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Survey Number
              </small>

              <div className="mt-1">
                {consultation.survey_number ||
                  "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Address
              </small>

              <div className="mt-1">
                <FaMapMarkerAlt
                  className="me-2"
                  style={{
                    color: "#C9A227",
                  }}
                />

                {[
                  consultation.address,
                  consultation.city,
                  consultation.state,
                  consultation.pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* REASON */}
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
            <FaFileAlt
              className="me-2"
              style={{
                color: "#C9A227",
              }}
            />
            Consultation Reason
          </strong>
        </div>

        <div className="card-body">
          <p
            className="mb-0"
            style={{
              color: "#555555",
              lineHeight: "1.7",
            }}
          >
            {consultation.reason ||
              "No consultation reason has been provided."}
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* CASE INFORMATION */}
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
            Case Information
          </strong>
        </div>

        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-6">
              <small className="text-muted">
                Advocate
              </small>

              <div className="mt-1">
                {consultation.advocate_name ||
                  "-"}
              </div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">
                Court
              </small>

              <div className="mt-1">
                {consultation.court_name ||
                  "-"}
              </div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">
                Hearing Date
              </small>

              <div className="mt-1">
                {formatDate(
                  consultation.hearing_date
                )}
              </div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">
                Case Remarks
              </small>

              <div className="mt-1">
                {consultation.case_remarks ||
                  "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <div className="d-flex justify-content-between align-items-center">
        <button
          type="button"
          className="btn"
          onClick={handleBack}
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
            border: "1px solid #111111",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Consultations
        </button>

        <small
          style={{
            color: "#888888",
          }}
        >
          Consultation ID: {consultation.id}
        </small>
      </div>
    </div>
  );
};

export default LegalTeamConsultationDetails;