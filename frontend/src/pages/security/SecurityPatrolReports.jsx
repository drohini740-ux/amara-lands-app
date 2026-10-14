
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaFileAlt,
  FaSearch,
  FaSync,
  FaDownload,
  FaCheckCircle,
  FaClock,
  FaClipboardList,
  FaBan,
  FaTimes,
} from "react-icons/fa";

import {
  fetchSecurityPatrolReports,
} from "../../redux/securityPatrolSlice";

const SecurityPatrolReports = () => {
  const dispatch = useDispatch();

  // =====================================================
  // REDUX STATE
  // =====================================================

  const {
    patrolReports = [],
    reportsTotal = 0,
    reportsLoading = false,
    reportsError = null,
  } = useSelector((state) => state.securityPatrol || {});

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // =====================================================
  // LOAD REPORTS
  // =====================================================

  useEffect(() => {
    dispatch(fetchSecurityPatrolReports({}));
  }, [dispatch]);

  // =====================================================
  // APPLY SERVER FILTERS
  // =====================================================

  const handleApplyFilters = () => {
    const filters = {};

    if (status !== "all") {
      filters.status = status;
    }

    if (fromDate) {
      filters.from = fromDate;
    }

    if (toDate) {
      filters.to = toDate;
    }

    if (search.trim()) {
      filters.search = search.trim();
    }

    dispatch(fetchSecurityPatrolReports(filters));
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
    setFromDate("");
    setToDate("");

    dispatch(fetchSecurityPatrolReports({}));
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (value) => {
    if (!value) return "-";

    const date = String(value).slice(0, 10);
    const parts = date.split("-");

    if (parts.length !== 3) return "-";

    const [year, month, day] = parts;

    if (!year || !month || !day) return "-";

    return `${day}-${month}-${year}`;
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (value) => {
    if (!value) return "-";

    const [hours, minutes] = String(value).split(":");
    const hour = Number(hours);

    if (
      !Number.isInteger(hour) ||
      hour < 0 ||
      hour > 23 ||
      !minutes
    ) {
      return String(value);
    }

    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${period}`;
  };

  // =====================================================
  // LOCAL SEARCH AND FILTER
  // =====================================================

  const filteredReports = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return patrolReports.filter((report) => {
      const matchesSearch =
        !searchValue ||
        [
          report.patrol_id ?? report.id,
          report.property_name,
          report.survey_number,
          report.security_name,
          report.security_email,
          report.address,
          report.remarks,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(searchValue)
        );

      const matchesStatus =
        status === "all" ||
        String(report.patrol_status || "").toLowerCase() ===
          status.toLowerCase();

      const patrolDate = report.patrol_date
        ? String(report.patrol_date).slice(0, 10)
        : "";

      const matchesFrom =
        !fromDate || patrolDate >= fromDate;

      const matchesTo =
        !toDate || patrolDate <= toDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [
    patrolReports,
    search,
    status,
    fromDate,
    toDate,
  ]);

  // =====================================================
  // SUMMARY COUNTS
  // =====================================================

  const summary = useMemo(() => {
    const countStatus = (value) =>
      patrolReports.filter(
        (report) =>
          String(report.patrol_status || "").toLowerCase() === value
      ).length;

    return {
      total: reportsTotal || patrolReports.length,
      completed: countStatus("completed"),
      pending: countStatus("pending"),
      cancelled: countStatus("cancelled"),
    };
  }, [patrolReports, reportsTotal]);

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (value) => {
    const normalized = String(value || "").toLowerCase();

    if (normalized === "completed") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (normalized === "cancelled") {
      return {
        backgroundColor: "#F8D7DA",
        color: "#842029",
      };
    }

    if (normalized === "in progress") {
      return {
        backgroundColor: "#DDEBFF",
        color: "#174EA6",
      };
    }

    return {
      backgroundColor: "#FFF3CD",
      color: "#856404",
    };
  };

  // =====================================================
  // SUMMARY CARD DATA
  // =====================================================

  const summaryCards = [
    {
      title: "Total Patrols",
      value: summary.total,
      icon: <FaClipboardList />,
      color: "#C9A227",
    },
    {
      title: "Completed",
      value: summary.completed,
      icon: <FaCheckCircle />,
      color: "#198754",
    },
    {
      title: "Pending",
      value: summary.pending,
      icon: <FaClock />,
      color: "#D39E00",
    },
    {
      title: "Cancelled",
      value: summary.cancelled,
      icon: <FaBan />,
      color: "#DC3545",
    },
  ];

  // =====================================================
  // EXPORT CSV
  // =====================================================

  const handleExportCSV = () => {
    const columns = [
      ["Patrol ID", "patrol_id"],
      ["Property Name", "property_name"],
      ["Survey Number", "survey_number"],
      ["Security Staff", "security_name"],
      ["Security Email", "security_email"],
      ["Patrol Date", "patrol_date"],
      ["Check In", "check_in"],
      ["Check Out", "check_out"],
      ["Status", "patrol_status"],
      ["Remarks", "remarks"],
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvRows = [
      columns
        .map(([label]) => escapeCSV(label))
        .join(","),

      ...filteredReports.map((report) =>
        columns
          .map(([, key]) => {
            let value =
              key === "patrol_id"
                ? report.patrol_id ?? report.id
                : report[key];

            if (key === "patrol_date") {
              value = formatDate(value);
            }

            if (key === "check_in" || key === "check_out") {
              value = formatTime(value);
            }

            return escapeCSV(value);
          })
          .join(",")
      ),
    ];

    const csvContent = "\uFEFF" + csvRows.join("\r\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "security-patrol-reports.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div>
      {/* HEADER */}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3
            className="mb-1"
            style={{
              color: "#111111",
              fontWeight: "700",
            }}
          >
            Security Patrol Reports
          </h3>

          <p className="mb-0 text-muted">
            Monitor, filter, and export security patrol activity.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn"
            onClick={handleApplyFilters}
            disabled={reportsLoading}
            style={{
              backgroundColor: "#FFFFFF",
              color: "#C9A227",
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
              backgroundColor: "#111111",
              color: "#FFFFFF",
            }}
          >
            <FaDownload className="me-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div className="row g-3 mb-4">
        {summaryCards.map((card) => (
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

                <div
                  style={{
                    color: card.color,
                    fontSize: "28px",
                  }}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTERS */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-lg-4">
              <label className="form-label">
                Search
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch style={{ color: "#C9A227" }} />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Property, staff, survey or patrol ID..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-2">
              <label className="form-label">
                Status
              </label>

              <select
                className="form-select"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-12 col-sm-6 col-lg-2">
              <label className="form-label">
                From Date
              </label>

              <input
                type="date"
                className="form-control"
                value={fromDate}
                max={toDate || undefined}
                onChange={(event) =>
                  setFromDate(event.target.value)
                }
              />
            </div>

            <div className="col-12 col-sm-6 col-lg-2">
              <label className="form-label">
                To Date
              </label>

              <input
                type="date"
                className="form-control"
                value={toDate}
                min={fromDate || undefined}
                onChange={(event) =>
                  setToDate(event.target.value)
                }
              />
            </div>

            <div className="col-12 col-sm-6 col-lg-2 d-flex align-items-end">
              <button
                type="button"
                className="btn w-100"
                onClick={handleClearFilters}
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#111111",
                  border: "1px solid #111111",
                }}
              >
                <FaTimes className="me-2" />
                Clear
              </button>
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
            <small className="text-muted">
              Showing {filteredReports.length} of {reportsTotal} reports
            </small>

            <button
              type="button"
              className="btn"
              onClick={handleApplyFilters}
              disabled={reportsLoading}
              style={{
                backgroundColor: "#C9A227",
                color: "#111111",
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* ERROR */}

      {reportsError && (
        <div className="alert alert-danger">
          {reportsError}
        </div>
      )}

      {/* REPORT TABLE */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <strong>
            <FaFileAlt
              className="me-2"
              style={{ color: "#C9A227" }}
            />
            Patrol Activity
          </strong>
        </div>

        <div className="card-body p-0">
          {reportsLoading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{ color: "#C9A227" }}
              />

              <p className="mt-3 mb-0">
                Loading patrol reports...
              </p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-5">
              <FaFileAlt
                style={{
                  fontSize: "40px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No patrol reports found.
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
                    <th className="px-3">Patrol ID</th>
                    <th>Property</th>
                    <th>Security Staff</th>
                    <th>Patrol Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.patrol_id ?? report.id}>
                      <td className="px-3">
                        #{report.patrol_id ?? report.id}
                      </td>

                      <td>
                        <strong>
                          {report.property_name || "-"}
                        </strong>

                        <div className="small text-muted">
                          Survey: {report.survey_number || "-"}
                        </div>

                        <div className="small text-muted">
                          {[report.city, report.state]
                            .filter(Boolean)
                            .join(", ") || "-"}
                        </div>
                      </td>

                      <td>
                        <strong>
                          {report.security_name || "-"}
                        </strong>

                        <div className="small text-muted">
                          {report.security_email || "-"}
                        </div>
                      </td>

                      <td className="text-nowrap">
                        {formatDate(report.patrol_date)}
                      </td>

                      <td className="text-nowrap">
                        {formatTime(report.check_in)}
                      </td>

                      <td className="text-nowrap">
                        {formatTime(report.check_out)}
                      </td>

                      <td>
                        <span
                          className="badge"
                          style={getStatusStyle(report.patrol_status)}
                        >
                          {report.patrol_status || "-"}
                        </span>
                      </td>

                      <td style={{ minWidth: "180px" }}>
                        {report.remarks || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityPatrolReports;
