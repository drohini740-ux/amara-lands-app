
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaFileAlt,
  FaSearch,
  FaEye,
  FaTrash,
  FaSync,
  FaUpload,
  FaDownload,
  FaTimes,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";

import {
  fetchFieldExecutiveDocuments,
  fetchFieldExecutiveDocumentById,
  uploadFieldExecutiveDocument,
  deleteFieldExecutiveDocument,
  clearSelectedDocument,
  clearDocumentError,
  clearDocumentSuccess,
} from "../../redux/fieldExecutiveDocumentSlice";

const API_BASE_URL = "http://localhost:4000";

const FieldExecutiveDocuments = () => {
  const dispatch = useDispatch();

  const {
    documents,
    selectedDocument,
    loading,
    detailsLoading,
    actionLoading,
    error,
    detailsError,
    actionError,
    successMessage,
  } = useSelector(
    (state) =>
      state.fieldExecutiveDocument
  );

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState("all");

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [showUploadModal, setShowUploadModal] =
    useState(false);

  const [documentName, setDocumentName] =
    useState("");

  const [documentType, setDocumentType] =
    useState("");

  const [propertyId, setPropertyId] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState(null);

  // =====================================================
  // LOAD DOCUMENTS
  // =====================================================

  useEffect(() => {
    dispatch(
      fetchFieldExecutiveDocuments()
    );
  }, [dispatch]);

  // =====================================================
  // SUCCESS MESSAGE
  // =====================================================

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      dispatch(clearDocumentSuccess());
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, dispatch]);

  // =====================================================
  // DOCUMENT TYPES
  // =====================================================

  const documentTypes = useMemo(() => {
    return [
      ...new Set(
        documents
          .map(
            (document) =>
              document.document_type
          )
          .filter(Boolean)
      ),
    ];
  }, [documents]);

  // =====================================================
  // FILTER DOCUMENTS
  // =====================================================

  const filteredDocuments = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return documents.filter((document) => {
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
          document.city || ""
        )
          .toLowerCase()
          .includes(searchValue);

      const matchesType =
        typeFilter === "all" ||
        String(
          document.document_type || ""
        ).toLowerCase() ===
          typeFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesType
      );
    });
  }, [
    documents,
    search,
    typeFilter,
  ]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalDocuments =
    documents.length;

  const totalProperties = new Set(
    documents
      .map(
        (document) =>
          document.property_id
      )
      .filter(Boolean)
  ).size;

  // =====================================================
  // VIEW DOCUMENT
  // =====================================================

  const handleView = (id) => {
    dispatch(
      fetchFieldExecutiveDocumentById(id)
    );

    setShowViewModal(true);
  };

  // =====================================================
  // CLOSE VIEW
  // =====================================================

  const handleCloseView = () => {
    setShowViewModal(false);

    dispatch(
      clearSelectedDocument()
    );

    dispatch(
      clearDocumentError()
    );
  };

  // =====================================================
  // OPEN UPLOAD MODAL
  // =====================================================

  const handleOpenUpload = () => {
    setDocumentName("");
    setDocumentType("");
    setPropertyId("");
    setSelectedFile(null);

    dispatch(clearDocumentError());

    setShowUploadModal(true);
  };

  // =====================================================
  // CLOSE UPLOAD MODAL
  // =====================================================

  const handleCloseUpload = () => {
    if (actionLoading) return;

    setShowUploadModal(false);

    setDocumentName("");
    setDocumentType("");
    setPropertyId("");
    setSelectedFile(null);

    dispatch(clearDocumentError());
  };

  // =====================================================
  // FILE SELECT
  // =====================================================

  const handleFileChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "File size must be 10 MB or less."
      );

      e.target.value = "";
      setSelectedFile(null);

      return;
    }

    setSelectedFile(file);
  };

  // =====================================================
  // UPLOAD
  // =====================================================

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!propertyId) {
      alert(
        "Please enter the Property ID."
      );

      return;
    }

    if (!selectedFile) {
      alert(
        "Please select a document file."
      );

      return;
    }

    const formData = new FormData();

    formData.append(
      "property_id",
      propertyId
    );

    formData.append(
      "document_name",
      documentName ||
        selectedFile.name
    );

    formData.append(
      "document_type",
      documentType ||
        "Document"
    );

    formData.append(
      "file",
      selectedFile
    );

    const result = await dispatch(
      uploadFieldExecutiveDocument(
        formData
      )
    );

    if (
      uploadFieldExecutiveDocument.fulfilled.match(
        result
      )
    ) {
      setShowUploadModal(false);

      setDocumentName("");
      setDocumentType("");
      setPropertyId("");
      setSelectedFile(null);

      dispatch(
        fetchFieldExecutiveDocuments()
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (document) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${document.document_name}"?`
    );

    if (!confirmed) return;

    const result = await dispatch(
      deleteFieldExecutiveDocument(
        document.id
      )
    );

    if (
      deleteFieldExecutiveDocument.fulfilled.match(
        result
      )
    ) {
      dispatch(
        fetchFieldExecutiveDocuments()
      );
    }
  };

  // =====================================================
  // FILE URL
  // =====================================================

  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return "";

    if (
      fileUrl.startsWith("http://") ||
      fileUrl.startsWith("https://")
    ) {
      return fileUrl;
    }

    return `${API_BASE_URL}${fileUrl}`;
  };

  // =====================================================
  // OPEN FILE
  // =====================================================

  const handleOpenFile = (document) => {
    const url = getFileUrl(
      document.file_url
    );

    if (!url) {
      alert(
        "Document file is not available."
      );

      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // NAVIGATE
  // =====================================================

  const handleNavigate = (document) => {
    if (
      !document.latitude ||
      !document.longitude
    ) {
      alert(
        "Property location is not available."
      );

      return;
    }

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${document.latitude},${document.longitude}` +
      `&travelmode=driving`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
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
  // RETURN
  // =====================================================

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
            Documents
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Manage documents for your assigned
            properties.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn"
            disabled={loading}
            onClick={() =>
              dispatch(
                fetchFieldExecutiveDocuments()
              )
            }
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

          <button
            type="button"
            className="btn"
            onClick={
              handleOpenUpload
            }
            style={{
              backgroundColor:
                "#111111",
              color: "#FFFFFF",
              border:
                "1px solid #111111",
            }}
          >
            <FaUpload className="me-2" />
            Upload Document
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUCCESS */}
      {/* ================================================= */}

      {successMessage && (
        <div className="alert alert-success">
          <FaCheckCircle className="me-2" />
          {successMessage}
        </div>
      )}

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {(error || actionError) && (
        <div className="alert alert-danger">
          {error || actionError}
        </div>
      )}

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        <div className="col-md-6">
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
                  Total Documents
                </small>

                <h3 className="mb-0 mt-2">
                  {totalDocuments}
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

        <div className="col-md-6">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #111111",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Properties With Documents
                </small>

                <h3 className="mb-0 mt-2">
                  {totalProperties}
                </h3>
              </div>

              <FaCheckCircle
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
            <div className="col-md-7">
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
                  placeholder="Search document, property, survey number or city..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="col-md-5">
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
          </div>
        </div>
      </div>

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
                  fontSize: "42px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 mb-1 text-muted">
                No documents found.
              </p>

              <small className="text-muted">
                Documents for your assigned
                properties will appear here.
              </small>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead
                  style={{
                    backgroundColor:
                      "#111111",
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
                      Survey No.
                    </th>

                    <th>
                      Type
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

                        <td>
                          <strong>
                            {
                              document.document_name
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            document.property_name ||
                            "-"
                          }

                          <div
                            style={{
                              fontSize:
                                "12px",
                              color:
                                "#777777",
                            }}
                          >
                            {
                              document.city ||
                              "-"
                            }
                          </div>
                        </td>

                        <td>
                          {
                            document.survey_number ||
                            "-"
                          }
                        </td>

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
                            {
                              document.document_type ||
                              "Document"
                            }
                          </span>
                        </td>

                        <td
                          style={{
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatDate(
                            document.uploaded_at
                          )}
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              type="button"
                              className="btn btn-sm"
                              title="View Details"
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

                            <button
                              type="button"
                              className="btn btn-sm"
                              title="Open Document"
                              onClick={() =>
                                handleOpenFile(
                                  document
                                )
                              }
                              style={{
                                color:
                                  "#198754",
                                border:
                                  "1px solid #198754",
                              }}
                            >
                              <FaDownload />
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm"
                              title="Delete Document"
                              disabled={
                                actionLoading
                              }
                              onClick={() =>
                                handleDelete(
                                  document
                                )
                              }
                              style={{
                                color:
                                  "#dc3545",
                                border:
                                  "1px solid #dc3545",
                              }}
                            >
                              <FaTrash />
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

      {/* ================================================= */}
      {/* VIEW MODAL */}
      {/* ================================================= */}

      {showViewModal && (
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
              <div
                className="modal-header"
                style={{
                  backgroundColor:
                    "#111111",
                  color: "#FFFFFF",
                }}
              >
                <h5 className="modal-title">
                  Document Details
                </h5>

                <button
                  type="button"
                  className="btn"
                  onClick={
                    handleCloseView
                  }
                  style={{
                    color: "#FFFFFF",
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body">
                {detailsLoading ? (
                  <div className="text-center py-4">
                    <div
                      className="spinner-border"
                      style={{
                        color:
                          "#C9A227",
                      }}
                    />
                  </div>
                ) : detailsError ? (
                  <div className="alert alert-danger">
                    {detailsError}
                  </div>
                ) : selectedDocument ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <strong>
                        Document ID
                      </strong>

                      <div>
                        {
                          selectedDocument.id
                        }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Document Name
                      </strong>

                      <div>
                        {
                          selectedDocument.document_name
                        }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Document Type
                      </strong>

                      <div>
                        {
                          selectedDocument.document_type ||
                          "-"
                        }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Property
                      </strong>

                      <div>
                        {
                          selectedDocument.property_name ||
                          "-"
                        }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Survey Number
                      </strong>

                      <div>
                        {
                          selectedDocument.survey_number ||
                          "-"
                        }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Property Type
                      </strong>

                      <div>
                        {
                          selectedDocument.property_type ||
                          "-"
                        }
                      </div>
                    </div>

                    <div className="col-12">
                      <strong>
                        Property Location
                      </strong>

                      <div className="mt-1 p-3 bg-light rounded">
                        {
                          selectedDocument.address ||
                          "-"
                        }

                        <br />

                        {
                          selectedDocument.city ||
                          "-"
                        }

                        {selectedDocument.state
                          ? `, ${selectedDocument.state}`
                          : ""}

                        <br />

                        Pincode:{" "}
                        {
                          selectedDocument.pincode ||
                          "-"
                        }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Verification Status
                      </strong>

                      <div>
                        {
                          selectedDocument.verification_status ||
                          "-"
                        }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Uploaded At
                      </strong>

                      <div>
                        {formatDate(
                          selectedDocument.uploaded_at
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <strong>
                        File
                      </strong>

                      <div className="mt-2 d-flex gap-2 flex-wrap">
                        <button
                          type="button"
                          className="btn"
                          onClick={() =>
                            handleOpenFile(
                              selectedDocument
                            )
                          }
                          style={{
                            backgroundColor:
                              "#111111",
                            color:
                              "#FFFFFF",
                          }}
                        >
                          <FaDownload className="me-2" />
                          Open Document
                        </button>

                        <button
                          type="button"
                          className="btn"
                          onClick={() =>
                            handleNavigate(
                              selectedDocument
                            )
                          }
                          style={{
                            border:
                              "1px solid #C9A227",
                            color:
                              "#C9A227",
                            backgroundColor:
                              "#FFFFFF",
                          }}
                        >
                          <FaMapMarkerAlt className="me-2" />
                          Property Location
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    Document not found.
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn"
                  onClick={
                    handleCloseView
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

      {/* ================================================= */}
      {/* UPLOAD MODAL */}
      {/* ================================================= */}

      {showUploadModal && (
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
              <div
                className="modal-header"
                style={{
                  backgroundColor:
                    "#111111",
                  color: "#FFFFFF",
                }}
              >
                <h5 className="modal-title">
                  Upload Property Document
                </h5>

                <button
                  type="button"
                  className="btn"
                  onClick={
                    handleCloseUpload
                  }
                  style={{
                    color: "#FFFFFF",
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              <form
                onSubmit={handleUpload}
              >
                <div className="modal-body">
                  {actionError && (
                    <div className="alert alert-danger">
                      {actionError}
                    </div>
                  )}

                  <div className="alert alert-info">
                    Upload a document only for a
                    property assigned to you.
                  </div>

                  {/* PROPERTY ID */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Property ID
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      placeholder="Example: 9"
                      value={propertyId}
                      onChange={(e) =>
                        setPropertyId(
                          e.target.value
                        )
                      }
                      required
                    />

                    <small className="text-muted">
                      Enter the ID of one of your
                      assigned properties.
                    </small>
                  </div>

                  {/* DOCUMENT NAME */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Document Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Example: Property Site Document"
                      value={documentName}
                      onChange={(e) =>
                        setDocumentName(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* DOCUMENT TYPE */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Document Type
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Example: Site Document"
                      value={documentType}
                      onChange={(e) =>
                        setDocumentType(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* FILE */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Select File
                    </label>

                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx"
                      onChange={
                        handleFileChange
                      }
                      required
                    />

                    <small className="text-muted">
                      Maximum file size: 10 MB.
                    </small>
                  </div>

                  {selectedFile && (
                    <div className="p-3 bg-light rounded">
                      <strong>
                        Selected File:
                      </strong>

                      <div className="mt-1">
                        {
                          selectedFile.name
                        }
                      </div>

                      <small className="text-muted">
                        {(
                          selectedFile.size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </small>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    disabled={
                      actionLoading
                    }
                    onClick={
                      handleCloseUpload
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn"
                    disabled={
                      actionLoading
                    }
                    style={{
                      backgroundColor:
                        "#111111",
                      color: "#FFFFFF",
                    }}
                  >
                    {actionLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />

                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload className="me-2" />
                        Upload Document
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldExecutiveDocuments;

