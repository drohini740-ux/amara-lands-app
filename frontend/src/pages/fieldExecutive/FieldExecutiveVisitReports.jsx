
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaClipboardList,
  FaSearch,
  FaEye,
  FaEdit,
  FaSync,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";

import {
  fetchFieldExecutiveVisitReports,
  fetchFieldExecutiveVisitReportById,
  updateFieldExecutiveVisitReport,
  clearSelectedVisitReport,
  clearVisitReportError,
  clearVisitReportSuccess,
} from "../../redux/fieldExecutiveVisitReportSlice";

const FieldExecutiveVisitReports = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      state.fieldExecutiveVisitReport
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [showModal, setShowModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editRemarks, setEditRemarks] =
    useState("");

  const [editStatus, setEditStatus] =
    useState("");

  // =====================================================
  // LOAD REPORTS
  // =====================================================

  useEffect(() => {
    dispatch(
      fetchFieldExecutiveVisitReports()
    );
  }, [dispatch]);

  // =====================================================
  // CLEAR SUCCESS MESSAGE
  // =====================================================

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      dispatch(clearVisitReportSuccess());
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, dispatch]);

  // =====================================================
  // VIEW REPORT
  // =====================================================

  const handleView = (id) => {
    dispatch(
      fetchFieldExecutiveVisitReportById(id)
    );

    setShowModal(true);
  };

  // =====================================================
  // EDIT REPORT
  // =====================================================

  const handleEdit = (report) => {
    dispatch(
      fetchFieldExecutiveVisitReportById(
        report.id
      )
    );

    setEditRemarks(
      report.remarks || ""
    );

    setEditStatus(
      report.visit_status || "Pending"
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
      updateFieldExecutiveVisitReport({
        id: selectedReport.id,
        data: {
          remarks: editRemarks,
          visit_status: editStatus,
        },
      })
    );

    if (
      updateFieldExecutiveVisitReport.fulfilled.match(
        result
      )
    ) {
      setShowEditModal(false);

      dispatch(
        fetchFieldExecutiveVisitReports()
      );
    }
  };

  // =====================================================
  // CLOSE VIEW MODAL
  // =====================================================

  const handleCloseView = () => {
    setShowModal(false);
    dispatch(clearSelectedVisitReport());
  };

  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  const handleCloseEdit = () => {
    setShowEditModal(false);
    dispatch(clearSelectedVisitReport());
    dispatch(clearVisitReportError());
  };

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
  // FORMAT DATE + TIME
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

    return status;
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const normalized =
      String(status || "").toLowerCase();

    if (normalized === "completed") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (normalized === "in progress") {
      return {
        backgroundColor: "#FFF3CD",
        color: "#856404",
      };
    }

    if (normalized === "cancelled") {
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
        String(report.address || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(report.city || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(report.remarks || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(
          report.customer_name || ""
        )
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        String(report.visit_status || "")
          .toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    reports,
    search,
    statusFilter,
  ]);

  // =====================================================
  // SUMMARY COUNTS
  // =====================================================

  const totalReports = reports.length;

  const completedReports =
    reports.filter(
      (report) =>
        String(
          report.visit_status
        ).toLowerCase() ===
        "completed"
    ).length;

  const pendingReports =
    reports.filter(
      (report) =>
        String(
          report.visit_status
        ).toLowerCase() ===
        "pending"
    ).length;

  const inProgressReports =
    reports.filter(
      (report) =>
        String(
          report.visit_status
        ).toLowerCase() ===
        "in progress"
    ).length;

  // =====================================================
  // GOOGLE MAPS
  // =====================================================

  const handleNavigate = (report) => {
    if (
      !report.latitude ||
      !report.longitude
    ) {
      alert(
        "Location coordinates are not available for this property."
      );

      return;
    }

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${report.latitude},${report.longitude}` +
      `&travelmode=driving`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // GO TO VISIT DETAILS
  // =====================================================

  const handleVisitDetails = (id) => {
    navigate(`/field/visits/${id}`);
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
            Visit Reports
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Review and manage reports from your
            field visits.
          </p>
        </div>

        <button
          className="btn"
          onClick={() =>
            dispatch(
              fetchFieldExecutiveVisitReports()
            )
          }
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

              <FaClipboardList
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* COMPLETED */}

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
                  Completed
                </small>

                <h3 className="mb-0 mt-2">
                  {completedReports}
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
      </div>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* SEARCH */}

            <div className="col-md-8">
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
                  placeholder="Search property, survey number, location, customer or remarks..."
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

            <div className="col-md-4">
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

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
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
              Field Visit Reports
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
                Loading visit reports...
              </p>
            </div>
          ) : filteredReports.length ===
            0 ? (
            <div className="text-center py-5">
              <FaClipboardList
                style={{
                  fontSize: "40px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No visit reports found.
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
                      Property
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Visit Date
                    </th>

                    <th>
                      Check In
                    </th>

                    <th>
                      Check Out
                    </th>

                    <th>
                      Status
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

                        {/* LOCATION */}

                        <td>
                          <div>
                            {report.city ||
                              "-"}
                            {report.state
                              ? `, ${report.state}`
                              : ""}
                          </div>

                          <small
                            className="text-muted"
                          >
                            {report.address ||
                              "-"}
                          </small>
                        </td>

                        {/* VISIT DATE */}

                        <td
                          style={{
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatDate(
                            report.visit_date
                          )}
                        </td>

                        {/* CHECK IN */}

                        <td
                          style={{
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {report.check_in ||
                            "-"}
                        </td>

                        {/* CHECK OUT */}

                        <td
                          style={{
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {report.check_out ||
                            "-"}
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className="badge"
                            style={{
                              ...getStatusStyle(
                                report.visit_status
                              ),
                            }}
                          >
                            {formatStatus(
                              report.visit_status
                            )}
                          </span>
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
      {/* VIEW REPORT MODAL */}
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
                  Visit Report Details
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
                    {/* REPORT ID */}

                    <div className="col-md-6">
                      <strong>
                        Report ID
                      </strong>

                      <div>
                        {selectedReport.id}
                      </div>
                    </div>

                    {/* STATUS */}

                    <div className="col-md-6">
                      <strong>
                        Status
                      </strong>

                      <div className="mt-1">
                        <span
                          className="badge"
                          style={{
                            ...getStatusStyle(
                              selectedReport.visit_status
                            ),
                          }}
                        >
                          {
                            selectedReport.visit_status
                          }
                        </span>
                      </div>
                    </div>

                    {/* PROPERTY */}

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

                    {/* SURVEY */}

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

                    {/* PROPERTY TYPE */}

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

                    {/* AREA */}

                    <div className="col-md-6">
                      <strong>
                        Area
                      </strong>

                      <div>
                        {selectedReport.area ||
                          "-"}
                      </div>
                    </div>

                    {/* VISIT DATE */}

                    <div className="col-md-6">
                      <strong>
                        Visit Date
                      </strong>

                      <div>
                        {formatDate(
                          selectedReport.visit_date
                        )}
                      </div>
                    </div>

                    {/* CREATED */}

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

                    {/* CHECK IN */}

                    <div className="col-md-6">
                      <strong>
                        Check In
                      </strong>

                      <div>
                        {selectedReport.check_in ||
                          "-"}
                      </div>
                    </div>

                    {/* CHECK OUT */}

                    <div className="col-md-6">
                      <strong>
                        Check Out
                      </strong>

                      <div>
                        {selectedReport.check_out ||
                          "-"}
                      </div>
                    </div>

                    {/* CUSTOMER */}

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

                    {/* MOBILE */}

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

                    {/* LOCATION */}

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

                    {/* REMARKS */}

                    <div className="col-12">
                      <strong>
                        Visit Remarks
                      </strong>

                      <div className="mt-1 p-3 bg-light rounded">
                        {
                          selectedReport.remarks ||
                          "No remarks added."
                        }
                      </div>
                    </div>

                    {/* COORDINATES */}

                    <div className="col-12">
                      <strong>
                        Coordinates
                      </strong>

                      <div className="mt-1 p-3 bg-light rounded">
                        Latitude:{" "}
                        {
                          selectedReport.latitude ||
                          "-"
                        }

                        <br />

                        Longitude:{" "}
                        {
                          selectedReport.longitude ||
                          "-"
                        }
                      </div>
                    </div>

                    {/* OPEN VISIT */}

                    <div className="col-12">
                      <button
                        type="button"
                        className="btn"
                        onClick={() =>
                          handleVisitDetails(
                            selectedReport.id
                          )
                        }
                        style={{
                          backgroundColor:
                            "#111111",
                          color:
                            "#FFFFFF",
                        }}
                      >
                        Open Visit Details
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    Visit report not found.
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
      {/* EDIT REPORT MODAL */}
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
                  Edit Visit Report
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

              {/* BODY */}

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

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Property
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={
                        selectedReport?.property_name ||
                        ""
                      }
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Visit Status
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

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Visit Remarks
                    </label>

                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Enter visit remarks..."
                      value={editRemarks}
                      onChange={(e) =>
                        setEditRemarks(
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

export default FieldExecutiveVisitReports;

