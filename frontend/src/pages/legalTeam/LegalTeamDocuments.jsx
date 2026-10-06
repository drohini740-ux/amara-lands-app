
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaFileAlt,
  FaSearch,
  FaEye,
  FaDownload,
  FaBuilding,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSync,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const LegalTeamDocuments = () => {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // =====================================================
  // FETCH DOCUMENTS
  // =====================================================

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/legal-team/documents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setDocuments(
          response.data.documents || []
        );
      } else {
        setDocuments([]);
        setError(
          response.data?.message ||
            "Unable to load documents."
        );
      }
    } catch (err) {
      console.error(
        "Legal Team Documents Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load documents."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD DOCUMENTS
  // =====================================================

  useEffect(() => {
    fetchDocuments();
  }, []);

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
  // GET STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

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
  // FILTER DOCUMENTS
  // =====================================================

  const filteredDocuments = documents.filter(
    (document) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        String(
          document.document_name || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          document.document_type || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          document.property_name || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          document.survey_number || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          document.customer_name || ""
        )
          .toLowerCase()
          .includes(searchValue);

      const matchesType =
        typeFilter === "all" ||
        String(
          document.document_type || ""
        ).toLowerCase() ===
          typeFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        String(
          document.verification_status || ""
        ).toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    }
  );

  // =====================================================
  // DOCUMENT TYPES
  // =====================================================

  const documentTypes = [
    ...new Set(
      documents
        .map(
          (document) =>
            document.document_type
        )
        .filter(Boolean)
    ),
  ];

  // =====================================================
  // OPEN DOCUMENT
  // =====================================================

  const handleView = (id) => {
    navigate(
      `/legal-team/documents/view/${id}`
    );
  };

  // =====================================================
  // DOWNLOAD / OPEN FILE
  // =====================================================

  const handleOpenFile = (fileUrl) => {
    if (!fileUrl) {
      return;
    }

    const fullUrl = fileUrl.startsWith("http")
      ? fileUrl
      : `http://localhost:4000${fileUrl}`;

    window.open(
      fullUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

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
            Legal Documents
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            View documents associated with legal
            properties and cases.
          </p>
        </div>

        <button
          className="btn"
          onClick={fetchDocuments}
          disabled={loading}
          style={{
            border: "1px solid #C9A227",
            color: "#C9A227",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaSync className="me-2" />
          Refresh
        </button>
      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {/* TOTAL */}

        <div className="col-md-3">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Total Documents
                </small>

                <h3 className="mb-0 mt-2">
                  {documents.length}
                </h3>
              </div>

              <FaFileAlt
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* VERIFIED */}

        <div className="col-md-3">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #28a745",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Verified Properties
                </small>

                <h3 className="mb-0 mt-2">
                  {
                    documents.filter(
                      (document) =>
                        String(
                          document.verification_status
                        ).toLowerCase() ===
                        "verified"
                    ).length
                  }
                </h3>
              </div>

              <FaCheckCircle
                style={{
                  color: "#28a745",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* REJECTED */}

        <div className="col-md-3">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #dc3545",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Rejected Properties
                </small>

                <h3 className="mb-0 mt-2">
                  {
                    documents.filter(
                      (document) =>
                        String(
                          document.verification_status
                        ).toLowerCase() ===
                        "rejected"
                    ).length
                  }
                </h3>
              </div>

              <FaTimesCircle
                style={{
                  color: "#dc3545",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* TYPES */}

        <div className="col-md-3">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #111111",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Document Types
                </small>

                <h3 className="mb-0 mt-2">
                  {documentTypes.length}
                </h3>
              </div>

              <FaBuilding
                style={{
                  color: "#111111",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* SEARCH */}

            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch
                    style={{
                      color: "#C9A227",
                    }}
                  />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search document, property, survey or customer..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* TYPE */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Document Types
                </option>

                {documentTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* STATUS */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Property Status
                </option>

                <option value="verified">
                  Verified
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="rejected">
                  Rejected
                </option>
              </select>
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
      {/* DOCUMENT TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              Property Documents
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              {filteredDocuments.length}{" "}
              documents
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{
                  color: "#C9A227",
                }}
              />

              <p className="mt-3 mb-0">
                Loading documents...
              </p>
            </div>
          ) : filteredDocuments.length ===
            0 ? (
            <div className="text-center py-5">
              <FaFileAlt
                style={{
                  fontSize: "40px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No documents found.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead
                  style={{
                    backgroundColor: "#111111",
                    color: "#FFFFFF",
                  }}
                >
                  <tr>
                    <th className="px-3">
                      ID
                    </th>

                    <th>
                      Document
                    </th>

                    <th>
                      Property
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Property Status
                    </th>

                    <th>
                      Uploaded
                    </th>

                    <th className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDocuments.map(
                    (document) => (
                      <tr
                        key={
                          document.id
                        }
                      >
                        <td className="px-3">
                          {document.id}
                        </td>

                        {/* DOCUMENT */}

                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <FaFileAlt
                              style={{
                                color:
                                  "#C9A227",
                              }}
                            />

                            <div>
                              <strong>
                                {document.document_name ||
                                  "Unnamed Document"}
                              </strong>

                              <div
                                style={{
                                  fontSize:
                                    "12px",
                                  color:
                                    "#777777",
                                }}
                              >
                                Document #
                                {
                                  document.id
                                }
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* PROPERTY */}

                        <td>
                          <strong>
                            {document.property_name ||
                              "-"}
                          </strong>

                          <div
                            style={{
                              fontSize:
                                "12px",
                              color:
                                "#777777",
                            }}
                          >
                            Survey:{" "}
                            {document.survey_number ||
                              "-"}
                          </div>
                        </td>

                        {/* CUSTOMER */}

                        <td>
                          <div>
                            <strong>
                              {document.customer_name ||
                                "-"}
                            </strong>

                            <div
                              style={{
                                fontSize:
                                  "12px",
                                color:
                                  "#777777",
                              }}
                            >
                              {
                                document.customer_email ||
                                "-"
                              }
                            </div>
                          </div>
                        </td>

                        {/* TYPE */}

                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                "#F5E8B0",
                              color:
                                "#111111",
                            }}
                          >
                            {document.document_type ||
                              "-"}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className="badge"
                            style={getStatusStyle(
                              document.verification_status
                            )}
                          >
                            {document.verification_status ||
                              "-"}
                          </span>
                        </td>

                        {/* DATE */}

                        <td>
                          {formatDate(
                            document.uploaded_at
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {/* VIEW */}

                            <button
                              className="btn btn-sm"
                              title="View Document Details"
                              onClick={() =>
                                handleView(
                                  document.id
                                )
                              }
                              style={{
                                color:
                                  "#C9A227",
                                border:
                                  "1px solid #C9A227",
                              }}
                            >
                              <FaEye />
                            </button>

                            {/* OPEN FILE */}

                            <button
                              className="btn btn-sm"
                              title="Open Document"
                              disabled={
                                !document.file_url
                              }
                              onClick={() =>
                                handleOpenFile(
                                  document.file_url
                                )
                              }
                              style={{
                                color:
                                  "#111111",
                                border:
                                  "1px solid #111111",
                              }}
                            >
                              <FaDownload />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalTeamDocuments;

