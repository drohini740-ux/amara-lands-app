
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  FaArrowLeft,
  FaFileAlt,
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";
const BACKEND_URL = "http://localhost:4000";

const LegalTeamDocumentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH DOCUMENT
  // =====================================================

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/legal-team/documents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setDocument(response.data.document);
      } else {
        setError(
          response.data?.message ||
            "Failed to fetch document."
        );
      }
    } catch (err) {
      console.error(
        "Legal Team Document Details Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load document."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  // =====================================================
  // OPEN DOCUMENT
  // =====================================================

  const handleOpenDocument = () => {
    if (!document?.file_url) return;

    const fileUrl = document.file_url.startsWith("http")
      ? document.file_url
      : `${BACKEND_URL}${document.file_url}`;

    window.open(fileUrl, "_blank");
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
          Loading document...
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
          onClick={() =>
            navigate("/legal-team/documents")
          }
          style={{
            border: "1px solid #111111",
            color: "#111111",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Documents
        </button>

        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-5">
        <FaFileAlt
          style={{
            fontSize: "50px",
            color: "#CCCCCC",
          }}
        />

        <p className="mt-3 text-muted">
          Document not found.
        </p>
      </div>
    );
  }

  const isVerified =
    String(document.verification_status || "")
      .toLowerCase() === "verified";

  return (
    <div>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            type="button"
            className="btn mb-3"
            onClick={() =>
              navigate("/legal-team/documents")
            }
            style={{
              border: "1px solid #111111",
              color: "#111111",
              backgroundColor: "#FFFFFF",
            }}
          >
            <FaArrowLeft className="me-2" />
            Back to Documents
          </button>

          <h3
            className="mb-1"
            style={{
              fontWeight: "700",
              color: "#111111",
            }}
          >
            Document Details
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            View document, property and customer information.
          </p>
        </div>

        {document.file_url && (
          <button
            type="button"
            className="btn"
            onClick={handleOpenDocument}
            style={{
              backgroundColor: "#111111",
              color: "#FFFFFF",
              border: "1px solid #111111",
            }}
          >
            <FaExternalLinkAlt className="me-2" />
            Open Document
          </button>
        )}
      </div>

      {/* ================================================= */}
      {/* DOCUMENT SUMMARY */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {/* DOCUMENT */}

        <div className="col-md-4">
          <div
            className="bg-white rounded shadow-sm p-4 h-100"
            style={{
              borderLeft: "4px solid #C9A227",
            }}
          >
            <div className="d-flex align-items-center">
              <FaFileAlt
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                  marginRight: "15px",
                }}
              />

              <div>
                <small className="text-muted">
                  Document
                </small>

                <h5 className="mb-0 mt-1">
                  {document.document_name ||
                    "Unnamed Document"}
                </h5>
              </div>
            </div>
          </div>
        </div>

        {/* PROPERTY */}

        <div className="col-md-4">
          <div
            className="bg-white rounded shadow-sm p-4 h-100"
            style={{
              borderLeft: "4px solid #111111",
            }}
          >
            <div className="d-flex align-items-center">
              <FaBuilding
                style={{
                  color: "#111111",
                  fontSize: "28px",
                  marginRight: "15px",
                }}
              />

              <div>
                <small className="text-muted">
                  Property
                </small>

                <h5 className="mb-0 mt-1">
                  {document.property_name || "-"}
                </h5>
              </div>
            </div>
          </div>
        </div>

        {/* STATUS */}

        <div className="col-md-4">
          <div
            className="bg-white rounded shadow-sm p-4 h-100"
            style={{
              borderLeft: `4px solid ${
                isVerified
                  ? "#198754"
                  : "#dc3545"
              }`,
            }}
          >
            <div className="d-flex align-items-center">
              {isVerified ? (
                <FaCheckCircle
                  style={{
                    color: "#198754",
                    fontSize: "28px",
                    marginRight: "15px",
                  }}
                />
              ) : (
                <FaTimesCircle
                  style={{
                    color: "#dc3545",
                    fontSize: "28px",
                    marginRight: "15px",
                  }}
                />
              )}

              <div>
                <small className="text-muted">
                  Property Verification
                </small>

                <h5 className="mb-0 mt-1">
                  {document.verification_status ||
                    "-"}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* DOCUMENT INFORMATION */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header"
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
          }}
        >
          <strong>
            Document Information
          </strong>
        </div>

        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-4">
              <small className="text-muted">
                Document ID
              </small>

              <div className="fw-semibold mt-1">
                {document.id}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Document Name
              </small>

              <div className="fw-semibold mt-1">
                {document.document_name ||
                  "Unnamed Document"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Document Type
              </small>

              <div className="fw-semibold mt-1">
                {document.document_type || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Uploaded Date
              </small>

              <div className="fw-semibold mt-1">
                <FaCalendarAlt
                  className="me-2"
                  style={{
                    color: "#C9A227",
                  }}
                />
                {formatDate(
                  document.uploaded_at
                )}
              </div>
            </div>

            <div className="col-md-8">
              <small className="text-muted">
                File URL
              </small>

              <div
                className="mt-1"
                style={{
                  wordBreak: "break-all",
                  color: "#555555",
                }}
              >
                {document.file_url || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* PROPERTY INFORMATION */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header"
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
          }}
        >
          <strong>
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
                {document.property_name || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Survey Number
              </small>

              <div className="fw-semibold mt-1">
                {document.survey_number || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Property Type
              </small>

              <div className="fw-semibold mt-1">
                {document.property_type || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Area
              </small>

              <div className="fw-semibold mt-1">
                {document.area || "-"}
              </div>
            </div>

            <div className="col-md-8">
              <small className="text-muted">
                Verification Status
              </small>

              <div className="mt-1">
                <span
                  className="badge"
                  style={{
                    backgroundColor: isVerified
                      ? "#DFF5E3"
                      : "#F8D7DA",
                    color: isVerified
                      ? "#198754"
                      : "#842029",
                  }}
                >
                  {document.verification_status ||
                    "-"}
                </span>
              </div>
            </div>

            <div className="col-md-12">
              <small className="text-muted">
                Address
              </small>

              <div className="fw-semibold mt-1">
                <FaMapMarkerAlt
                  className="me-2"
                  style={{
                    color: "#C9A227",
                  }}
                />

                {[
                  document.address,
                  document.city,
                  document.state,
                  document.pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">
                Latitude
              </small>

              <div className="fw-semibold mt-1">
                {document.latitude || "-"}
              </div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">
                Longitude
              </small>

              <div className="fw-semibold mt-1">
                {document.longitude || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* CUSTOMER INFORMATION */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header"
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
          }}
        >
          <strong>
            Customer Information
          </strong>
        </div>

        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-4">
              <small className="text-muted">
                Customer Name
              </small>

              <div className="fw-semibold mt-1">
                <FaUser
                  className="me-2"
                  style={{
                    color: "#C9A227",
                  }}
                />

                {document.customer_name || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Email
              </small>

              <div className="fw-semibold mt-1">
                {document.customer_email || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Mobile
              </small>

              <div className="fw-semibold mt-1">
                {document.customer_mobile || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Customer Role
              </small>

              <div className="fw-semibold mt-1">
                {document.customer_role || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <small className="text-muted">
                Customer Status
              </small>

              <div className="fw-semibold mt-1">
                {document.customer_status || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* OPEN DOCUMENT */}
      {/* ================================================= */}

      {document.file_url && (
        <div
          className="card border-0 shadow-sm"
          style={{
            borderTop: "3px solid #C9A227",
          }}
        >
          <div className="card-body text-center py-4">
            <FaFileAlt
              style={{
                fontSize: "42px",
                color: "#C9A227",
              }}
            />

            <h5 className="mt-3">
              View Uploaded Document
            </h5>

            <p className="text-muted mb-3">
              Open the uploaded file in a new browser tab.
            </p>

            <button
              type="button"
              className="btn"
              onClick={handleOpenDocument}
              style={{
                backgroundColor: "#C9A227",
                color: "#111111",
                border: "1px solid #C9A227",
                fontWeight: "600",
              }}
            >
              <FaExternalLinkAlt className="me-2" />
              Open File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalTeamDocumentDetails;

