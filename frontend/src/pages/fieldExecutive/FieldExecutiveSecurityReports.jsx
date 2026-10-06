
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaShieldAlt,
  FaSearch,
  FaEye,
  FaEdit,
  FaSync,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  fetchFieldExecutiveSecurityReports,
  fetchFieldExecutiveSecurityReportById,
  updateFieldExecutiveSecurityReport,
  clearSelectedSecurityReport,
  clearSecurityReportError,
  clearSecurityReportSuccess,
} from "../../redux/fieldExecutiveSecurityReportSlice";

const FieldExecutiveSecurityReports = () => {
  const dispatch = useDispatch();

  const {
    reports,
    selectedReport,
    loading,
    detailsLoading,
    actionLoading,
    error,
    detailsError,
    actionError,
    successMessage,
  } = useSelector(
    (state) =>
      state.fieldExecutiveSecurityReport
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [reportTypeFilter, setReportTypeFilter] =
    useState("all");

  const [showModal, setShowModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editReportType, setEditReportType] =
    useState("");

  const [editDescription, setEditDescription] =
    useState("");

  const [editStatus, setEditStatus] =
    useState("");

  // =====================================================
  // LOAD REPORTS
  // =====================================================

  useEffect(() => {
    dispatch(
      fetchFieldExecutiveSecurityReports()
    );
  }, [dispatch]);

  // =====================================================
  // CLEAR SUCCESS MESSAGE
  // =====================================================

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      dispatch(
        clearSecurityReportSuccess()
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, dispatch]);

  // =====================================================
  // VIEW REPORT
  // =====================================================

  const handleView = (id) => {
    dispatch(
      fetchFieldExecutiveSecurityReportById(
        id
      )
    );

    setShowModal(true);
  };

  // =====================================================
  // EDIT REPORT
  // =====================================================

  const handleEdit = (report) => {
    dispatch(
      fetchFieldExecutiveSecurityReportById(
        report.id
      )
    );

    setEditReportType(
      report.report_type || ""
    );

    setEditDescription(
      report.description || ""
    );

    setEditStatus(
      report.report_status || "Pending"
    );

    setShowEditModal(true);
  };

  // =====================================================
  // SAVE REPORT
  // =====================================================

  const handleSaveReport = async (e) => {
    e.preventDefault();

    if (!selectedReport) return;

    const result = await dispatch(
      updateFieldExecutiveSecurityReport({
        id: selectedReport.id,
        data: {
          report_type:
            editReportType,
          description:
            editDescription,
          report_status:
            editStatus,
        },
      })
    );

    if (
      updateFieldExecutiveSecurityReport.fulfilled.match(
        result
      )
    ) {
      setShowEditModal(false);

      dispatch(
        fetchFieldExecutiveSecurityReports()
      );
    }
  };

  // =====================================================
  // CLOSE VIEW MODAL
  // =====================================================

  const handleCloseView = () => {
    setShowModal(false);

    dispatch(
      clearSelectedSecurityReport()
    );
  };

  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  const handleCloseEdit = () => {
    setShowEditModal(false);

    dispatch(
      clearSelectedSecurityReport()
    );

    dispatch(
      clearSecurityReportError()
    );
  };

  // =====================================================
  // FORMAT DATE
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
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const normalized =
      String(status || "").toLowerCase();

    if (normalized === "resolved") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (normalized === "closed") {
      return {
        backgroundColor: "#E2E3E5",
        color: "#41464B",
      };
    }

    if (normalized === "in progress") {
      return {
        backgroundColor: "#FFF3CD",
        color: "#856404",
      };
    }

    if (normalized === "rejected") {
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
  // REPORT TYPES
  // =====================================================

  const reportTypes = useMemo(() => {
    return [
      ...new Set(
        reports
          .map(
            (report) =>
              report.report_type
          )
          .filter(Boolean)
      ),
    ];
  }, [reports]);

  // =====================================================
  // FILTER REPORTS
  // =====================================================

  const filteredReports = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return reports.filter((report) => {
      const matchesSearch =
        String(
          report.property_name || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          report.survey_number || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          report.report_type || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          report.description || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          report.customer_name || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(report.city || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        String(
          report.report_status || ""
        ).toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesReportType =
        reportTypeFilter === "all" ||
        String(
          report.report_type || ""
        ).toLowerCase() ===
          reportTypeFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesReportType
      );
    });
  }, [
    reports,
    search,
    statusFilter,
    reportTypeFilter,
  ]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalReports = reports.length;

  const pendingReports =
    reports.filter(
      (report) =>
        String(
          report.report_status
        ).toLowerCase() === "pending"
    ).length;

  const inProgressReports =
    reports.filter(
      (report) =>
        String(
          report.report_status
        ).toLowerCase() ===
        "in progress"
    ).length;

  const resolvedReports =
    reports.filter(
      (report) =>
        String(
          report.report_status
        ).toLowerCase() ===
        "resolved"
    ).length;

  // =====================================================
  // GOOGLE MAPS
  // =====================================================

  const handleNavigate = (report) => {
    const latitude =
      report.property_latitude ||
      report.latitude;

    const longitude =
      report.property_longitude ||
      report.longitude;

    if (!latitude || !longitude) {
      alert(
        "Location coordinates are not available."
      );

      return;
    }

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${latitude},${longitude}` +
      `&travelmode=driving`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
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
            Security Reports
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Monitor and manage security reports
            related to your assigned properties.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          disabled={loading}
          onClick={() =>
            dispatch(
              fetchFieldExecutiveSecurityReports()
            )
          }
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

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

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
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Total Reports
                </small>

                <h3 className="mb-0 mt-2">
                  {totalReports}
                </h3>
              </div>

              <FaShieldAlt
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* PENDING */}

        <div className="col-md-3">
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
                  Pending
                </small>

                <h3 className="mb-0 mt-2">
                  {pendingReports}
                </h3>
              </div>

              <FaClock
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* IN PROGRESS */}

        <div className="col-md-3">
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
                  In Progress
                </small>

                <h3 className="mb-0 mt-2">
                  {inProgressReports}
                </h3>
              </div>

              <FaSpinner
                style={{
                  color: "#111111",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* RESOLVED */}

        <div className="col-md-3">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #28a745",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Resolved
                </small>

                <h3 className="mb-0 mt-2">
                  {resolvedReports}
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
                  placeholder="Search property, report type, customer or description..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />
              </div>
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
                  All Status
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>

                <option value="Closed">
                  Closed
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>
            </div>

            {/* REPORT TYPE */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={reportTypeFilter}
                onChange={(e) =>
                  setReportTypeFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Report Types
                </option>

                {reportTypes.map(
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
      {/* TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              Security Report History
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              {filteredReports.length} reports
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
                Loading security reports...
              </p>
            </div>
          ) : filteredReports.length ===
            0 ? (
            <div className="text-center py-5">
              <FaShieldAlt
                style={{
                  fontSize: "42px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 mb-1 text-muted">
                No security reports found.
              </p>

              <small className="text-muted">
                Security reports created for this
                Field Executive will appear here.
              </small>
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
                      Property
                    </th>

                    <th>
                      Report Type
                    </th>

                    <th>
                      Description
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Created
                    </th>

                    <th className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map(
                    (report) => (
                      <tr key={report.id}>
                        <td className="px-3">
                          {report.id}
                        </td>

                        {/* PROPERTY */}

                        <td>
                          <strong>
                            {report.property_name ||
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
                            {report.survey_number ||
                              "-"}
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
                            {report.report_type ||
                              "-"}
                          </span>
                        </td>

                        {/* DESCRIPTION */}

                        <td>
                          <div
                            style={{
                              maxWidth:
                                "280px",
                              whiteSpace:
                                "nowrap",
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis",
                            }}
                          >
                            {report.description ||
                              "-"}
                          </div>
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className="badge"
                            style={{
                              ...getStatusStyle(
                                report.report_status
                              ),
                            }}
                          >
                            {report.report_status ||
                              "-"}
                          </span>
                        </td>

                        {/* CREATED */}

                        <td
                          style={{
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatDateTime(
                            report.created_at
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {/* VIEW */}

                            <button
                              type="button"
                              className="btn btn-sm"
                              title="View Report"
                              onClick={() =>
                                handleView(
                                  report.id
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

                            {/* EDIT */}

                            <button
                              type="button"
                              className="btn btn-sm"
                              title="Edit Report"
                              onClick={() =>
                                handleEdit(
                                  report
                                )
                              }
                              style={{
                                color:
                                  "#111111",
                                border:
                                  "1px solid #111111",
                              }}
                            >
                              <FaEdit />
                            </button>

                            {/* NAVIGATE */}

                            <button
                              type="button"
                              className="btn btn-sm"
                              title="Navigate"
                              onClick={() =>
                                handleNavigate(
                                  report
                                )
                              }
                              style={{
                                color:
                                  "#198754",
                                border:
                                  "1px solid #198754",
                              }}
                            >
                              <FaMapMarkerAlt />
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

      {showModal && (
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
              {/* HEADER */}

              <div
                className="modal-header"
                style={{
                  backgroundColor:
                    "#111111",
                  color: "#FFFFFF",
                }}
              >
                <h5 className="modal-title">
                  Security Report Details
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

              {/* BODY */}

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
                ) : selectedReport ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <strong>
                        Report ID
                      </strong>

                      <div>
                        {selectedReport.id}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Status
                      </strong>

                      <div className="mt-1">
                        <span
                          className="badge"
                          style={{
                            ...getStatusStyle(
                              selectedReport.report_status
                            ),
                          }}
                        >
                          {
                            selectedReport.report_status
                          }
                        </span>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Property
                      </strong>

                      <div>
                        {
                          selectedReport.property_name
                        }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Survey Number
                      </strong>

                      <div>
                        {
                          selectedReport.survey_number ||
                          "-"
                        }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Report Type
                      </strong>

                      <div>
                        {
                          selectedReport.report_type ||
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
                          selectedReport.property_type ||
                          "-"
                        }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Customer
                      </strong>

                      <div>
                        {
                          selectedReport.customer_name ||
                          "-"
                        }
                      </div>

                      <small className="text-muted">
                        {
                          selectedReport.customer_email ||
                          "-"
                        }
                      </small>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Customer Mobile
                      </strong>

                      <div>
                        {
                          selectedReport.customer_mobile ||
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
                          selectedReport.address ||
                          "-"
                        }

                        <br />

                        {
                          selectedReport.city ||
                          "-"
                        }
                        {selectedReport.state
                          ? `, ${selectedReport.state}`
                          : ""}

                        <br />

                        Pincode:{" "}
                        {
                          selectedReport.pincode ||
                          "-"
                        }
                      </div>
                    </div>

                    <div className="col-12">
                      <strong>
                        Report Description
                      </strong>

                      <div className="mt-1 p-3 bg-light rounded">
                        {
                          selectedReport.description ||
                          "No description available."
                        }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Report Latitude
                      </strong>

                      <div>
                        {
                          selectedReport.latitude ||
                          "-"
                        }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Report Longitude
                      </strong>

                      <div>
                        {
                          selectedReport.longitude ||
                          "-"
                        }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Created At
                      </strong>

                      <div>
                        {formatDateTime(
                          selectedReport.created_at
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Assigned To
                      </strong>

                      <div>
                        {
                          selectedReport.assigned_to ||
                          "Not Assigned"
                        }
                      </div>
                    </div>

                    <div className="col-12">
                      <button
                        type="button"
                        className="btn"
                        onClick={() =>
                          handleNavigate(
                            selectedReport
                          )
                        }
                        style={{
                          backgroundColor:
                            "#111111",
                          color:
                            "#FFFFFF",
                        }}
                      >
                        <FaMapMarkerAlt className="me-2" />
                        Open Location
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    Security report not found.
                  </div>
                )}
              </div>

              {/* FOOTER */}

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
      {/* EDIT MODAL */}
      {/* ================================================= */}

      {showEditModal && (
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
              {/* HEADER */}

              <div
                className="modal-header"
                style={{
                  backgroundColor:
                    "#111111",
                  color: "#FFFFFF",
                }}
              >
                <h5 className="modal-title">
                  Edit Security Report
                </h5>

                <button
                  type="button"
                  className="btn"
                  onClick={
                    handleCloseEdit
                  }
                  style={{
                    color: "#FFFFFF",
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              {/* FORM */}

              <form
                onSubmit={
                  handleSaveReport
                }
              >
                <div className="modal-body">
                  {actionError && (
                    <div className="alert alert-danger">
                      {actionError}
                    </div>
                  )}

                  <div className="alert alert-warning">
                    <FaExclamationTriangle className="me-2" />

                    Only security reports belonging
                    to the logged-in Field Executive
                    can be updated.
                  </div>

                  {/* REPORT TYPE */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Report Type
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Example: Intrusion, Damage, Suspicious Activity"
                      value={
                        editReportType
                      }
                      onChange={(e) =>
                        setEditReportType(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* STATUS */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Report Status
                    </label>

                    <select
                      className="form-select"
                      value={editStatus}
                      onChange={(e) =>
                        setEditStatus(
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Resolved">
                        Resolved
                      </option>

                      <option value="Closed">
                        Closed
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>
                    </select>
                  </div>

                  {/* DESCRIPTION */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Description
                    </label>

                    <textarea
                      className="form-control"
                      rows="6"
                      placeholder="Describe the security issue or observation..."
                      value={
                        editDescription
                      }
                      onChange={(e) =>
                        setEditDescription(
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                {/* FOOTER */}

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={
                      handleCloseEdit
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

                        Saving...
                      </>
                    ) : (
                      <>
                        <FaEdit className="me-2" />

                        Save Changes
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

export default FieldExecutiveSecurityReports;

