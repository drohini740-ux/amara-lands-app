import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaSearch,
  FaCalendarAlt,
  FaUserTie,
  FaGavel,
} from "react-icons/fa";

import { fetchAdminLegalCases } from "../../../redux/adminLegalSlice";

const UpcomingHearings = () => {
  const dispatch = useDispatch();

  const {
    legalCases = [],
    loading,
    error,
  } = useSelector((state) => state.adminLegal);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  // ==========================================
  // FETCH LEGAL CASES
  // ==========================================

  useEffect(() => {
    dispatch(fetchAdminLegalCases());
  }, [dispatch]);

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "No Date";
    }

    const dateString = String(date).substring(0, 10);

    const parsedDate = new Date(
      `${dateString}T00:00:00`
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return dateString;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // GET TODAY
  // ==========================================

  const getTodayString = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ==========================================
  // UPCOMING HEARINGS
  // ==========================================

  const upcomingHearings = useMemo(() => {
    const today = getTodayString();

    return legalCases
      .filter((item) => {
        if (!item.hearing_date) {
          return false;
        }

        const hearingDate = String(
          item.hearing_date
        ).substring(0, 10);

        // Only today and future hearings
        if (hearingDate < today) {
          return false;
        }

        // Search
        const searchText = search
          .trim()
          .toLowerCase();

        const matchesSearch =
          String(item.case_title || "")
            .toLowerCase()
            .includes(searchText) ||
          String(item.case_number || "")
            .toLowerCase()
            .includes(searchText) ||
          String(item.property_name || "")
            .toLowerCase()
            .includes(searchText) ||
          String(item.customer_name || "")
            .toLowerCase()
            .includes(searchText) ||
          String(item.advocate_name || "")
            .toLowerCase()
            .includes(searchText) ||
          String(item.court_name || "")
            .toLowerCase()
            .includes(searchText);

        // Status
        const matchesStatus =
          status === "All" ||
          String(item.status || "")
            .toLowerCase() ===
            status.toLowerCase();

        return (
          matchesSearch &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        const dateA = String(
          a.hearing_date
        ).substring(0, 10);

        const dateB = String(
          b.hearing_date
        ).substring(0, 10);

        return dateA.localeCompare(dateB);
      });
  }, [legalCases, search, status]);

  // ==========================================
  // SUMMARY
  // ==========================================

  const todayString = getTodayString();

  const todayHearings = upcomingHearings.filter(
    (item) =>
      String(item.hearing_date).substring(
        0,
        10
      ) === todayString
  ).length;

  const futureHearings =
    upcomingHearings.filter(
      (item) =>
        String(item.hearing_date).substring(
          0,
          10
        ) > todayString
    ).length;

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (caseStatus) => {
    const value = String(
      caseStatus || ""
    ).toLowerCase();

    if (value === "open") {
      return {
        background: "#fff3cd",
        color: "#856404",
        border: "1px solid #c9a227",
      };
    }

    if (value === "pending") {
      return {
        background: "#f8f9fa",
        color: "#856404",
        border: "1px solid #c9a227",
      };
    }

    if (value === "closed") {
      return {
        background: "#111",
        color: "#fff",
        border: "1px solid #111",
      };
    }

    if (value === "in progress") {
      return {
        background: "#f8f9fa",
        color: "#111",
        border: "1px solid #c9a227",
      };
    }

    if (value === "on hold") {
      return {
        background: "#f8f9fa",
        color: "#856404",
        border: "1px solid #c9a227",
      };
    }

    return {
      background: "#fff",
      color: "#111",
      border: "1px solid #c9a227",
    };
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f7f7",
        padding: "25px",
      }}
    >
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="mb-4">
        <h2
          style={{
            color: "#111",
            fontWeight: "700",
            marginBottom: "5px",
          }}
        >
          Upcoming Hearings
        </h2>

        <p className="text-muted mb-0">
          Monitor today's and upcoming legal
          case hearings.
        </p>
      </div>

      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}

      <div className="row g-3 mb-4">
        {/* Total Upcoming */}

        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderTop:
                "4px solid #c9a227",
            }}
          >
            <div className="card-body">
              <p className="text-muted mb-1">
                Total Upcoming Hearings
              </p>

              <h3
                style={{
                  color: "#111",
                  fontWeight: "700",
                }}
              >
                {upcomingHearings.length}
              </h3>
            </div>
          </div>
        </div>

        {/* Today */}

        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderTop:
                "4px solid #c9a227",
            }}
          >
            <div className="card-body">
              <p className="text-muted mb-1">
                Today's Hearings
              </p>

              <h3
                style={{
                  color: "#111",
                  fontWeight: "700",
                }}
              >
                {todayHearings}
              </h3>
            </div>
          </div>
        </div>

        {/* Future */}

        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderTop:
                "4px solid #111",
            }}
          >
            <div className="card-body">
              <p className="text-muted mb-1">
                Future Hearings
              </p>

              <h3
                style={{
                  color: "#111",
                  fontWeight: "700",
                }}
              >
                {futureHearings}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          SEARCH + FILTER
      ========================================== */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Search */}

            <div className="col-md-8">
              <div className="input-group">
                <span
                  className="input-group-text"
                  style={{
                    background: "#111",
                    color: "#fff",
                    border:
                      "1px solid #111",
                  }}
                >
                  <FaSearch />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by case, property, customer, court or advocate..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>
            </div>

            {/* Status */}

            <div className="col-md-4">
              <select
                className="form-select"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="All">
                  All Status
                </option>

                <option value="Open">
                  Open
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="On Hold">
                  On Hold
                </option>

                <option value="Closed">
                  Closed
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          HEARINGS TABLE
      ========================================== */}

      <div className="card border-0 shadow-sm">
        {/* Header */}

        <div
          className="card-header"
          style={{
            background: "#c9a227",
            color: "#111",
            fontWeight: "700",
            fontSize: "18px",
          }}
        >
          <FaCalendarAlt className="me-2" />
          Upcoming Legal Hearings
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead
                style={{
                  background: "#111",
                  color: "#fff",
                }}
              >
                <tr>
                  <th className="px-3 py-3">
                    Case
                  </th>

                  <th>Property</th>

                  <th>Customer</th>

                  <th>Court</th>

                  <th>Advocate</th>

                  <th>Hearing Date</th>

                  <th>Status</th>

                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-5"
                    >
                      Loading upcoming hearings...
                    </td>
                  </tr>
                ) : upcomingHearings.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-5"
                    >
                      <FaCalendarAlt
                        size={35}
                        style={{
                          color: "#c9a227",
                        }}
                      />

                      <h5 className="mt-3">
                        No Upcoming Hearings
                      </h5>

                      <p className="text-muted mb-0">
                        There are no scheduled
                        hearings matching your
                        search.
                      </p>
                    </td>
                  </tr>
                ) : (
                  upcomingHearings.map(
                    (item) => (
                      <tr key={item.id}>
                        {/* Case */}

                        <td className="px-3">
                          <strong>
                            {item.case_title ||
                              "-"}
                          </strong>

                          {item.case_number && (
                            <div className="small text-muted">
                              #{item.case_number}
                            </div>
                          )}
                        </td>

                        {/* Property */}

                        <td>
                          <strong>
                            {item.property_name ||
                              "-"}
                          </strong>

                          {item.survey_number && (
                            <div className="small text-muted">
                              Survey:{" "}
                              {
                                item.survey_number
                              }
                            </div>
                          )}
                        </td>

                        {/* Customer */}

                        <td>
                          <strong>
                            {item.customer_name ||
                              "-"}
                          </strong>

                          {item.customer_email && (
                            <div className="small text-muted">
                              {
                                item.customer_email
                              }
                            </div>
                          )}
                        </td>

                        {/* Court */}

                        <td>
                          <span>
                            <FaGavel
                              className="me-1"
                              style={{
                                color:
                                  "#c9a227",
                              }}
                            />

                            {item.court_name ||
                              "-"}
                          </span>
                        </td>

                        {/* Advocate */}

                        <td>
                          {item.advocate_name ? (
                            <span>
                              <FaUserTie
                                className="me-1"
                                style={{
                                  color:
                                    "#c9a227",
                                }}
                              />

                              {
                                item.advocate_name
                              }
                            </span>
                          ) : (
                            <span className="text-muted">
                              Not Assigned
                            </span>
                          )}
                        </td>

                        {/* Hearing Date */}

                        <td>
                          <strong>
                            {formatDate(
                              item.hearing_date
                            )}
                          </strong>
                        </td>

                        {/* Status */}

                        <td>
                          <span
                            className="badge px-3 py-2"
                            style={getStatusStyle(
                              item.status
                            )}
                          >
                            {item.status ||
                              "Open"}
                          </span>
                        </td>

                        {/* Remarks */}

                        <td>
                          <span className="small">
                            {item.remarks ||
                              "-"}
                          </span>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


export default UpcomingHearings;