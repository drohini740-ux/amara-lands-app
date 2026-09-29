import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaBalanceScale,
  FaSearch,
  FaEye,
  FaSync,
  FaFolderOpen,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const LegalTeamCases = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =====================================================
  // FETCH LEGAL CASES
  // =====================================================

  const fetchCases = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/legal-team/cases`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Legal Team Cases Response:",
        response.data
      );

      if (response.data?.success) {
        setCases(response.data.cases || []);
      } else {
        setCases([]);

        setError(
          response.data?.message ||
            "Unable to fetch legal cases."
        );
      }
    } catch (err) {
      console.error(
        "Legal Team Cases Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load legal cases."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD CASES
  // =====================================================

  useEffect(() => {
    fetchCases();
  }, []);

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
  // FILTER CASES
  // =====================================================

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const searchValue = search
        .trim()
        .toLowerCase();

      const matchesSearch =
        !searchValue ||
        String(item.case_number || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(item.case_title || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(item.customer_name || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(item.property_name || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(item.court_name || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        String(item.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [cases, search, statusFilter]);

  // =====================================================
  // STATUS COUNTS
  // =====================================================

  const totalCases = cases.length;

  const pendingCases = cases.filter((item) =>
    ["pending", "open"].includes(
      String(item.status || "").toLowerCase()
    )
  ).length;

  const activeCases = cases.filter((item) =>
    ["in progress", "active"].includes(
      String(item.status || "").toLowerCase()
    )
  ).length;

  const closedCases = cases.filter((item) =>
    ["closed", "completed", "resolved"].includes(
      String(item.status || "").toLowerCase()
    )
  ).length;

  // =====================================================
  // VIEW CASE
  // =====================================================

  const handleViewCase = (id) => {
    navigate(`/legal-team/cases/view/${id}`);
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
            Legal Cases
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Manage and review all assigned legal cases.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={fetchCases}
          disabled={loading}
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
            border: "1px solid #111111",
          }}
        >
          <FaSync className="me-2" />
          Refresh
        </button>
      </div>

      {/* ================================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {/* TOTAL */}

        <div className="col-md-3">
          <div
            className="bg-white rounded shadow-sm p-4"
            style={{
              borderLeft: "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Total Cases
                </small>

                <h3 className="mb-0 mt-2">
                  {totalCases}
                </h3>
              </div>

              <FaBalanceScale
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
            className="bg-white rounded shadow-sm p-4"
            style={{
              borderLeft: "4px solid #ffc107",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Pending / Open
                </small>

                <h3 className="mb-0 mt-2">
                  {pendingCases}
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

        {/* ACTIVE */}

        <div className="col-md-3">
          <div
            className="bg-white rounded shadow-sm p-4"
            style={{
              borderLeft: "4px solid #111111",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Active Cases
                </small>

                <h3 className="mb-0 mt-2">
                  {activeCases}
                </h3>
              </div>

              <FaFolderOpen
                style={{
                  color: "#111111",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* CLOSED */}

        <div className="col-md-3">
          <div
            className="bg-white rounded shadow-sm p-4"
            style={{
              borderLeft: "4px solid #198754",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Closed Cases
                </small>

                <h3 className="mb-0 mt-2">
                  {closedCases}
                </h3>
              </div>

              <FaCheckCircle
                style={{
                  color: "#198754",
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
                  placeholder="Search by case number, title, customer, property or court..."
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
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="all">
                  All Status
                </option>

                <option value="Open">
                  Open
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Closed">
                  Closed
                </option>

                <option value="Pending">
                  Pending
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
      {/* CASE TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              All Legal Cases
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing {filteredCases.length} of{" "}
              {cases.length} cases
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
                Loading legal cases...
              </p>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-5">
              <FaTimesCircle
                style={{
                  fontSize: "40px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No legal cases found.
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
                      Case
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Property
                    </th>

                    <th>
                      Court
                    </th>

                    <th>
                      Hearing
                    </th>

                    <th>
                      Status
                    </th>

                    <th className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCases.map(
                    (item) => (
                      <tr key={item.id}>
                        <td className="px-3">
                          <strong>
                            {item.case_number ||
                              `CASE-${item.id}`}
                          </strong>

                          <div
                            style={{
                              fontSize: "13px",
                              color: "#777777",
                            }}
                          >
                            {item.case_title ||
                              "Untitled Case"}
                          </div>
                        </td>

                        <td>
                          <strong>
                            {item.customer_name ||
                              "-"}
                          </strong>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#777777",
                            }}
                          >
                            {item.customer_mobile ||
                              item.customer_email ||
                              "-"}
                          </div>
                        </td>

                        <td>
                          {item.property_name ||
                            "-"}

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#777777",
                            }}
                          >
                            {item.survey_number ||
                              "-"}
                          </div>
                        </td>

                        <td>
                          {item.court_name ||
                            "-"}
                        </td>

                        <td>
                          {formatDate(
                            item.hearing_date
                          )}
                        </td>

                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                String(
                                  item.status || ""
                                ).toLowerCase() ===
                                "in progress"
                                  ? "#FFF3CD"
                                  : String(
                                      item.status || ""
                                    ).toLowerCase() ===
                                    "open"
                                  ? "#E8F0FE"
                                  : "#DFF5E3",

                              color:
                                String(
                                  item.status || ""
                                ).toLowerCase() ===
                                "in progress"
                                  ? "#856404"
                                  : String(
                                      item.status || ""
                                    ).toLowerCase() ===
                                    "open"
                                  ? "#0D47A1"
                                  : "#198754",
                            }}
                          >
                            {item.status ||
                              "-"}
                          </span>
                        </td>

                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm"
                            title="View Case"
                            onClick={() =>
                              handleViewCase(
                                item.id
                              )
                            }
                            style={{
                              color: "#C9A227",
                              border:
                                "1px solid #C9A227",
                              backgroundColor:
                                "#FFFFFF",
                            }}
                          >
                            <FaEye className="me-1" />
                            View
                          </button>
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

export default LegalTeamCases;