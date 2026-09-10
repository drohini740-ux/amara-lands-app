import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaSearch,
  FaUserTie,
  FaCalendarAlt,
} from "react-icons/fa";

import { fetchAdminLegalCases } from "../../../redux/adminLegalSlice";

const CaseTracking = () => {
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
  // FILTER CASES
  // ==========================================

  const filteredCases = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return legalCases.filter((item) => {
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
          .includes(searchText);

      const matchesStatus =
        status === "All" ||
        String(item.status || "").toLowerCase() ===
          status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [legalCases, search, status]);

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (caseStatus) => {
    const value = String(caseStatus || "").toLowerCase();

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f7f7",
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
          }}
        >
          Case Tracking
        </h2>

        <p className="text-muted">
          Track legal cases, advocates, case status and
          upcoming hearings.
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
          FILTERS
      ========================================== */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* SEARCH */}

            <div className="col-md-8">
              <div className="input-group">
                <span
                  className="input-group-text"
                  style={{
                    background: "#111",
                    color: "#fff",
                    border: "1px solid #111",
                  }}
                >
                  <FaSearch />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search cases..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>
            </div>

            {/* STATUS */}

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
          TABLE
      ========================================== */}

      <div className="card border-0 shadow-sm">
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

                <th>Advocate</th>

                <th>
                  <FaCalendarAlt className="me-1" />
                  Hearing
                </th>

                <th>Status</th>

                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-5"
                  >
                    <div
                      className="spinner-border"
                      style={{
                        color: "#c9a227",
                      }}
                    ></div>

                    <div className="mt-2 text-muted">
                      Loading case tracking...
                    </div>
                  </td>
                </tr>
              ) : filteredCases.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-5 text-muted"
                  >
                    No cases found.
                  </td>
                </tr>
              ) : (
                filteredCases.map((item) => (
                  <tr key={item.id}>
                    {/* CASE */}

                    <td className="px-3">
                      <strong>
                        {item.case_title || "-"}
                      </strong>

                      {item.case_number && (
                        <div className="small text-muted">
                          #{item.case_number}
                        </div>
                      )}
                    </td>

                    {/* PROPERTY */}

                    <td>
                      <strong>
                        {item.property_name || "-"}
                      </strong>

                      {item.survey_number && (
                        <div className="small text-muted">
                          Survey:{" "}
                          {item.survey_number}
                        </div>
                      )}
                    </td>

                    {/* CUSTOMER */}

                    <td>
                      {item.customer_name || "-"}
                    </td>

                    {/* ADVOCATE */}

                    <td>
                      {item.advocate_name ? (
                        <span>
                          <FaUserTie
                            className="me-1"
                            style={{
                              color: "#c9a227",
                            }}
                          />

                          {item.advocate_name}
                        </span>
                      ) : (
                        <span className="text-muted">
                          Not Assigned
                        </span>
                      )}
                    </td>

                    {/* HEARING */}

                    <td>
                      {item.hearing_date
                        ? String(
                            item.hearing_date
                          ).substring(0, 10)
                        : "No Date"}
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className="badge px-3 py-2"
                        style={getStatusStyle(
                          item.status
                        )}
                      >
                        {item.status || "Open"}
                      </span>
                    </td>

                    {/* REMARKS */}

                    <td>
                      <span className="small">
                        {item.remarks || "-"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CaseTracking;