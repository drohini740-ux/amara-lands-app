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
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const LegalTeamCaseDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH CASE DETAILS
  // =====================================================

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/legal-team/cases/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Legal Case Details Response:",
        response.data
      );

      if (response.data?.success) {
        setCaseData(response.data.case);
      } else {
        setError(
          response.data?.message ||
            "Unable to load case details."
        );
      }
    } catch (err) {
      console.error(
        "Legal Case Details Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load case details."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD CASE
  // =====================================================

  useEffect(() => {
    if (id) {
      fetchCaseDetails();
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
  // FORMAT DATE + TIME
  // =====================================================

  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // BACK TO CASES
  // =====================================================

  const handleBack = () => {
    navigate("/legal-team/cases");
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
          Loading case details...
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
            border: "1px solid #111111",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Cases
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

  if (!caseData) {
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
          Back to Cases
        </button>

        <div className="alert alert-warning">
          Legal case details are not available.
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
        Back to Cases
      </button>

      {/* ================================================= */}
      {/* CASE HEADER */}
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
                  Legal Case
                </span>
              </div>

              <h3
                className="mb-2"
                style={{
                  fontWeight: "700",
                  color: "#111111",
                }}
              >
                {caseData.case_title ||
                  "Untitled Case"}
              </h3>

              <div
                style={{
                  color: "#777777",
                }}
              >
                Case Number:{" "}
                <strong
                  style={{
                    color: "#111111",
                  }}
                >
                  {caseData.case_number ||
                    `CASE-${caseData.id}`}
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
                    caseData.status || ""
                  ).toLowerCase() ===
                  "in progress"
                    ? "#FFF3CD"
                    : String(
                        caseData.status || ""
                      ).toLowerCase() === "open"
                    ? "#E8F0FE"
                    : "#DFF5E3",

                color:
                  String(
                    caseData.status || ""
                  ).toLowerCase() ===
                  "in progress"
                    ? "#856404"
                    : String(
                        caseData.status || ""
                      ).toLowerCase() === "open"
                    ? "#0D47A1"
                    : "#198754",
              }}
            >
              {caseData.status || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* CUSTOMER + PROPERTY */}
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
                  {caseData.customer_name || "-"}
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

                  {caseData.customer_email || "-"}
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

                  {caseData.customer_mobile || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROPERTY */}

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
              <div className="mb-3">
                <small className="text-muted">
                  Property Name
                </small>

                <div className="fw-semibold mt-1">
                  {caseData.property_name || "-"}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  Survey Number
                </small>

                <div className="mt-1">
                  {caseData.survey_number || "-"}
                </div>
              </div>

              <div>
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
                    caseData.address,
                    caseData.city,
                    caseData.state,
                    caseData.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* CASE INFORMATION */}
      {/* ================================================= */}

      <div className="row g-4 mb-4">
        {/* CASE DESCRIPTION */}

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
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
                Case Description
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
                {caseData.description ||
                  "No case description has been provided."}
              </p>
            </div>
          </div>
        </div>

        {/* COURT */}

        <div className="col-lg-4">
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
                Court Information
              </strong>
            </div>

            <div className="card-body">
              <small className="text-muted">
                Court Name
              </small>

              <div className="fw-semibold mt-2">
                {caseData.court_name || "-"}
              </div>

              <hr />

              <small className="text-muted">
                Advocate
              </small>

              <div className="mt-2">
                {caseData.advocate_name || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* DATES */}
      {/* ================================================= */}

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <FaCalendarAlt
                  style={{
                    color: "#C9A227",
                    fontSize: "25px",
                  }}
                />

                <div className="ms-3">
                  <small className="text-muted">
                    Hearing Date
                  </small>

                  <div className="fw-semibold mt-1">
                    {formatDate(
                      caseData.hearing_date
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <FaClock
                  style={{
                    color: "#C9A227",
                    fontSize: "25px",
                  }}
                />

                <div className="ms-3">
                  <small className="text-muted">
                    Case Created
                  </small>

                  <div className="fw-semibold mt-1">
                    {formatDateTime(
                      caseData.created_at
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* REMARKS */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header bg-white"
          style={{
            borderBottom:
              "2px solid #C9A227",
          }}
        >
          <strong>Legal Remarks</strong>
        </div>

        <div className="card-body">
          <p
            className="mb-0"
            style={{
              color: "#555555",
              lineHeight: "1.7",
            }}
          >
            {caseData.remarks ||
              "No legal remarks have been added."}
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* FOOTER ACTION */}
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
          Back to Cases
        </button>

        <small
          style={{
            color: "#888888",
          }}
        >
          Case ID: {caseData.id}
        </small>
      </div>
    </div>
  );
};

export default LegalTeamCaseDetails;