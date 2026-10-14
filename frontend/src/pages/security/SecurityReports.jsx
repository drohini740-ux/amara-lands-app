
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaShieldAlt,
  FaSearch,
  FaSync,
  FaDownload,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaTimes,
  FaMapMarkerAlt,
  FaBuilding,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";

import {
  fetchSecurityPortalReports,
  fetchSecurityPortalReportById,
  clearSelectedSecurityPortalReport,
} from "../../redux/securityPortalReportSlice";

const SecurityReports = () => {
  const dispatch = useDispatch();

  const {
    reports = [],
    selectedReport = null,
    loading = false,
    detailsLoading = false,
    error = null,
    detailsError = null,
} = useSelector((state) => state.securityPortalReport || {});

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showDetails, setShowDetails] = useState(false);

  // =====================================================
  // LOAD SECURITY REPORTS
  // =====================================================

  useEffect(() => {
   dispatch(fetchSecurityPortalReports())
  }, [dispatch]);

  // =====================================================
  // FILTER REPORTS
  // =====================================================

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reports.filter((report) => {
      const searchableFields = [
        report.id,
        report.property_id,
        report.user_id,
        report.assigned_to,
        report.property_name,
        report.survey_number,
        report.property_type,
        report.report_type,
        report.description,
        report.security_name,
        report.security_email,
        report.security_mobile,
        report.address,
        report.city,
        report.state,
        report.pincode,
        report.report_status,
        report.latitude,
        report.longitude,
      ];

      const matchesSearch =
        !query ||
        searchableFields.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "all" ||
        String(report.report_status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesType =
        typeFilter === "all" ||
        String(report.report_type || "").toLowerCase() ===
          typeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [reports, search, statusFilter, typeFilter]);

  // =====================================================
  // UNIQUE REPORT TYPES
  // =====================================================

  const reportTypes = useMemo(
    () => [
      ...new Set(
        reports
          .map((report) => report.report_type)
          .filter(Boolean)
      ),
    ],
    [reports]
  );

  // =====================================================
  // SUMMARY
  // =====================================================

  const summary = useMemo(() => {
    const countStatus = (status) =>
      reports.filter(
        (report) =>
          String(report.report_status || "").toLowerCase() === status
      ).length;

    return {
      total: reports.length,
      pending: countStatus("pending"),
      inProgress: countStatus("in progress"),
      resolved: countStatus("resolved"),
    };
  }, [reports]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "resolved" || value === "closed") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (value === "in progress") {
      return {
        backgroundColor: "#DDEBFF",
        color: "#174EA6",
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
  // VIEW REPORT DETAILS
  // =====================================================

  const handleViewReport = (id) => {
    setShowDetails(true);
    dispatch(fetchSecurityPortalReportById(id));
  };

  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  const handleCloseDetails = () => {
    setShowDetails(false);
    dispatch(clearSelectedSecurityPortalReport());
  };

  // =====================================================
  // GOOGLE MAPS LINK
  // =====================================================

  const getMapUrl = (latitude, longitude) => {
    if (latitude == null || longitude == null) {
      return null;
    }

    return `https://www.google.com/maps?q=${encodeURIComponent(
      `${latitude},${longitude}`
    )}`;
  };

  // =====================================================
  // EXPORT CSV
  // =====================================================

  const handleExportCSV = () => {
    const columns = [
      ["Report ID", "id"],
      ["Property ID", "property_id"],
      ["Security User ID", "user_id"],
      ["Assigned To", "assigned_to"],
      ["Property Name", "property_name"],
      ["Survey Number", "survey_number"],
      ["Property Type", "property_type"],
      ["Area (Acres)", "area"],
      ["Report Type", "report_type"],
      ["Description", "description"],
      ["Security Staff", "security_name"],
      ["Security Email", "security_email"],
      ["Security Mobile", "security_mobile"],
      ["Status", "report_status"],
      ["Address", "address"],
      ["City", "city"],
      ["State", "state"],
      ["Pincode", "pincode"],
      ["Incident Latitude", "latitude"],
      ["Incident Longitude", "longitude"],
      ["Property Latitude", "property_latitude"],
      ["Property Longitude", "property_longitude"],
      ["Created Date", "created_at"],
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvRows = [
      columns.map(([label]) => escapeCSV(label)).join(","),

      ...filteredReports.map((report) =>
        columns
          .map(([, key]) => {
            const value =
              key === "created_at"
                ? formatDate(report[key])
                : report[key];

            return escapeCSV(value);
          })
          .join(",")
      ),
    ];

    const blob = new Blob(
      ["\uFEFF" + csvRows.join("\r\n")],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "security-reports.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // REUSABLE DETAIL FIELD
  // =====================================================

  const DetailField = ({ label, value }) => (
    <div className="col-12 col-md-6">
      <small className="text-muted d-block mb-1">
        {label}
      </small>

      <div
        className="fw-semibold"
        style={{ overflowWrap: "anywhere" }}
      >
        {value === null || value === undefined || value === ""
          ? "-"
          : String(value)}
      </div>
    </div>
  );

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3
            className="mb-1"
            style={{ color: "#111111", fontWeight: "700" }}
          >
            Security Reports
          </h3>

          <p className="mb-0 text-muted">
            Monitor security incidents and property safety reports.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn"
            onClick={() => dispatch(fetchSecurityReports())}
            disabled={loading}
            style={{
              color: "#C9A227",
              backgroundColor: "#FFFFFF",
              border: "1px solid #C9A227",
            }}
          >
            <FaSync className="me-2" />
            Refresh
          </button>

          <button
            type="button"
            className="btn"
            onClick={handleExportCSV}
            disabled={filteredReports.length === 0}
            style={{
              color: "#FFFFFF",
              backgroundColor: "#111111",
            }}
          >
            <FaDownload className="me-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {[
          {
            title: "Total Reports",
            value: summary.total,
            icon: <FaShieldAlt />,
            color: "#C9A227",
          },
          {
            title: "Pending",
            value: summary.pending,
            icon: <FaClock />,
            color: "#D39E00",
          },
          {
            title: "In Progress",
            value: summary.inProgress,
            icon: <FaExclamationTriangle />,
            color: "#0D6EFD",
          },
          {
            title: "Resolved",
            value: summary.resolved,
            icon: <FaCheckCircle />,
            color: "#198754",
          },
        ].map((card) => (
          <div
            className="col-12 col-sm-6 col-xl-3"
            key={card.title}
          >
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderLeft: `4px solid ${card.color}`,
              }}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    {card.title}
                  </small>

                  <h3 className="mt-2 mb-0">
                    {card.value}
                  </h3>
                </div>

                <span
                  style={{
                    color: card.color,
                    fontSize: "28px",
                  }}
                >
                  {card.icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================================================= */}
      {/* SEARCH AND FILTERS */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <label className="form-label">
                Search Reports
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch style={{ color: "#C9A227" }} />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search property, ID, staff, address..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label">
                Status
              </label>

              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label">
                Report Type
              </label>

              <select
                className="form-select"
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value)
                }
              >
                <option value="all">All Types</option>

                {reportTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
            <small className="text-muted">
              Showing {filteredReports.length} of {reports.length} reports
            </small>

            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              style={{
                color: "#111111",
                border: "1px solid #111111",
              }}
            >
              <FaTimes className="me-1" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* LIST ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="alert alert-danger">
          {typeof error === "string"
            ? error
            : "Unable to load security reports."}
        </div>
      )}

      {/* ================================================= */}
      {/* REPORTS TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <strong>Security Incident History</strong>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{ color: "#C9A227" }}
              />

              <p className="mt-3 mb-0">
                Loading security reports...
              </p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-5">
              <FaShieldAlt
                size={40}
                color="#CCCCCC"
              />

              <p className="text-muted mt-3 mb-0">
                No security reports found.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead
                  style={{
                    backgroundColor: "#111111",
                    color: "#FFFFFF",
                  }}
                >
                  <tr>
                    <th className="px-3">Report ID</th>
                    <th>Property</th>
                    <th>Property ID</th>
                    <th>Report Type</th>
                    <th>Security Staff</th>
                    <th>Address</th>
                    <th>Incident Coordinates</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-3 text-nowrap">
                        #{report.id}
                      </td>

                      <td>
                        <strong>
                          {report.property_name || "-"}
                        </strong>

                        <div className="small text-muted">
                          Survey: {report.survey_number || "-"}
                        </div>

                        <div className="small text-muted">
                          {report.property_type || "-"}
                        </div>
                      </td>

                      <td>{report.property_id ?? "-"}</td>

                      <td>{report.report_type || "-"}</td>

                      <td>
                        <strong>
                          {report.security_name || "-"}
                        </strong>

                        <div className="small text-muted">
                          {report.security_email || "-"}
                        </div>

                        <div className="small text-muted">
                          {report.security_mobile || ""}
                        </div>
                      </td>

                      <td style={{ minWidth: "180px" }}>
                        <div>{report.address || "-"}</div>

                        <small className="text-muted">
                          {[
                            report.city,
                            report.state,
                            report.pincode,
                          ]
                            .filter(Boolean)
                            .join(", ") || "-"}
                        </small>
                      </td>

                      <td className="text-nowrap">
                        {report.latitude != null &&
                        report.longitude != null ? (
                          <a
                            href={getMapUrl(
                              report.latitude,
                              report.longitude
                            )}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <FaMapMarkerAlt className="me-1" />
                            View Map
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="text-nowrap">
                        {formatDate(report.created_at)}
                      </td>

                      <td>
                        <span
                          className="badge"
                          style={getStatusStyle(
                            report.report_status
                          )}
                        >
                          {report.report_status || "-"}
                        </span>
                      </td>

                      <td
                        style={{
                          minWidth: "180px",
                          maxWidth: "280px",
                        }}
                      >
                        <div
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={report.description || ""}
                        >
                          {report.description || "-"}
                        </div>
                      </td>

                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm"
                          title="View Report Details"
                          onClick={() =>
                            handleViewReport(report.id)
                          }
                          style={{
                            color: "#C9A227",
                            border: "1px solid #C9A227",
                          }}
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* REPORT DETAILS MODAL */}
      {/* ================================================= */}

      {showDetails && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              {/* MODAL HEADER */}

              <div
                className="modal-header"
                style={{
                  backgroundColor: "#111111",
                  color: "#FFFFFF",
                }}
              >
                <div>
                  <h5 className="modal-title mb-1">
                    Security Report Details
                  </h5>

                  <small style={{ color: "#C9A227" }}>
                    Incident ID: #{selectedReport?.id ?? "-"}
                  </small>
                </div>

                <button
                  type="button"
                  className="btn"
                  onClick={handleCloseDetails}
                  aria-label="Close"
                  style={{ color: "#FFFFFF" }}
                >
                  <FaTimes />
                </button>
              </div>

              {/* MODAL BODY */}

              <div className="modal-body">
                {detailsLoading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border"
                      style={{ color: "#C9A227" }}
                    />

                    <p className="mt-3 mb-0">
                      Loading report details...
                    </p>
                  </div>
                ) : detailsError ? (
                  <div className="alert alert-danger">
                    {typeof detailsError === "string"
                      ? detailsError
                      : "Unable to load report details."}
                  </div>
                ) : selectedReport ? (
                  <>
                    {/* REPORT INFORMATION */}

                    <div className="card border-0 bg-light mb-4">
                      <div className="card-body">
                        <h6 className="mb-3">
                          <FaShieldAlt
                            className="me-2"
                            style={{ color: "#C9A227" }}
                          />
                          Incident Information
                        </h6>

                        <div className="row g-3">
                          <DetailField
                            label="Report ID"
                            value={`#${selectedReport.id}`}
                          />

                          <div className="col-12 col-md-6">
                            <small className="text-muted d-block mb-1">
                              Status
                            </small>

                            <span
                              className="badge"
                              style={getStatusStyle(
                                selectedReport.report_status
                              )}
                            >
                              {selectedReport.report_status || "-"}
                            </span>
                          </div>

                          <DetailField
                            label="Report Type"
                            value={selectedReport.report_type}
                          />

                          <DetailField
                            label="Created Date"
                            value={formatDate(
                              selectedReport.created_at
                            )}
                          />

                          <DetailField
                            label="Property ID"
                            value={selectedReport.property_id}
                          />

                          <DetailField
                            label="Security User ID"
                            value={selectedReport.user_id}
                          />

                          <DetailField
                            label="Assigned To"
                            value={selectedReport.assigned_to}
                          />
                        </div>
                      </div>
                    </div>

                    {/* PROPERTY INFORMATION */}

                    <div className="card border-0 shadow-sm mb-4">
                      <div
                        className="card-header bg-white"
                        style={{
                          borderBottom: "2px solid #C9A227",
                        }}
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
                        <div className="row g-3">
                          <DetailField
                            label="Property Name"
                            value={selectedReport.property_name}
                          />

                          <DetailField
                            label="Survey Number"
                            value={selectedReport.survey_number}
                          />

                          <DetailField
                            label="Property Type"
                            value={selectedReport.property_type}
                          />

                          <DetailField
                            label="Property Area"
                            value={
                              selectedReport.area != null
                                ? `${selectedReport.area} acres`
                                : "-"
                            }
                          />

                          <DetailField
                            label="Address"
                            value={selectedReport.address}
                          />

                          <DetailField
                            label="City"
                            value={selectedReport.city}
                          />

                          <DetailField
                            label="State"
                            value={selectedReport.state}
                          />

                          <DetailField
                            label="Pincode"
                            value={selectedReport.pincode}
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECURITY STAFF INFORMATION */}

                    <div className="card border-0 shadow-sm mb-4">
                      <div
                        className="card-header bg-white"
                        style={{
                          borderBottom: "2px solid #C9A227",
                        }}
                      >
                        <strong>
                          <FaUser
                            className="me-2"
                            style={{ color: "#C9A227" }}
                          />
                          Security Staff Information
                        </strong>
                      </div>

                      <div className="card-body">
                        <div className="row g-3">
                          <DetailField
                            label="Staff Name"
                            value={selectedReport.security_name}
                          />

                          <DetailField
                            label="Email"
                            value={selectedReport.security_email}
                          />

                          <DetailField
                            label="Mobile"
                            value={selectedReport.security_mobile}
                          />
                        </div>
                      </div>
                    </div>

                    {/* DESCRIPTION */}

                    <div className="card border-0 shadow-sm mb-4">
                      <div
                        className="card-header bg-white"
                        style={{
                          borderBottom: "2px solid #C9A227",
                        }}
                      >
                        <strong>
                          <FaExclamationTriangle
                            className="me-2"
                            style={{ color: "#C9A227" }}
                          />
                          Incident Description
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
                          {selectedReport.description || "-"}
                        </div>
                      </div>
                    </div>

                    {/* LOCATION INFORMATION */}

                    <div className="card border-0 shadow-sm">
                      <div
                        className="card-header bg-white"
                        style={{
                          borderBottom: "2px solid #C9A227",
                        }}
                      >
                        <strong>
                          <FaMapMarkerAlt
                            className="me-2"
                            style={{ color: "#C9A227" }}
                          />
                          Location Information
                        </strong>
                      </div>

                      <div className="card-body">
                        <h6>Incident Location</h6>

                        <div className="row g-3 mb-3">
                          <DetailField
                            label="Incident Latitude"
                            value={selectedReport.latitude}
                          />

                          <DetailField
                            label="Incident Longitude"
                            value={selectedReport.longitude}
                          />
                        </div>

                        {getMapUrl(
                          selectedReport.latitude,
                          selectedReport.longitude
                        ) && (
                          <a
                            className="btn btn-sm mb-4"
                            href={getMapUrl(
                              selectedReport.latitude,
                              selectedReport.longitude
                            )}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              backgroundColor: "#111111",
                              color: "#FFFFFF",
                            }}
                          >
                            <FaMapMarkerAlt className="me-2" />
                            Open Incident Location
                          </a>
                        )}

                        <hr />

                        <h6>Property Location</h6>

                        <div className="row g-3 mb-3">
                          <DetailField
                            label="Property Latitude"
                            value={selectedReport.property_latitude}
                          />

                          <DetailField
                            label="Property Longitude"
                            value={selectedReport.property_longitude}
                          />
                        </div>

                        {getMapUrl(
                          selectedReport.property_latitude,
                          selectedReport.property_longitude
                        ) && (
                          <a
                            className="btn btn-sm"
                            href={getMapUrl(
                              selectedReport.property_latitude,
                              selectedReport.property_longitude
                            )}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              backgroundColor: "#C9A227",
                              color: "#111111",
                            }}
                          >
                            <FaMapMarkerAlt className="me-2" />
                            Open Property Location
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted py-4">
                    <FaShieldAlt size={35} />

                    <p className="mt-3 mb-0">
                      Security report not found.
                    </p>
                  </div>
                )}
              </div>

              {/* MODAL FOOTER */}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn"
                  onClick={handleCloseDetails}
                  style={{
                    backgroundColor: "#111111",
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
    </div>
  );
};

export default SecurityReports;
