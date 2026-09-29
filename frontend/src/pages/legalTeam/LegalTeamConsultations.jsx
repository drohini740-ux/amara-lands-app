import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaBalanceScale,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaSearch,
  FaSync,
  FaVideo,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const LegalTeamConsultations = () => {
  const navigate = useNavigate();

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [meetingTypeFilter, setMeetingTypeFilter] =
    useState("all");

  // =====================================================
  // FETCH CONSULTATIONS
  // =====================================================

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/legal-team/consultations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Legal Team Consultations Response:",
        response.data
      );

      if (response.data?.success) {
        setConsultations(
          response.data.consultations || []
        );
      } else {
        setConsultations([]);

        setError(
          response.data?.message ||
            "Unable to fetch consultations."
        );
      }
    } catch (err) {
      console.error(
        "Legal Team Consultations Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load consultations."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD CONSULTATIONS
  // =====================================================

  useEffect(() => {
    fetchConsultations();
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
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    try {
      const [hours, minutes] =
        String(time).split(":");

      const date = new Date();

      date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
      );

      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return time;
    }
  };

  // =====================================================
  // FILTER CONSULTATIONS
  // =====================================================

  const filteredConsultations = useMemo(() => {
    return consultations.filter((item) => {
      const searchValue = search
        .trim()
        .toLowerCase();

      const matchesSearch =
        !searchValue ||
        String(item.customer_name || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(item.customer_email || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(item.case_number || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(item.case_title || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(item.property_name || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        String(item.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesMeetingType =
        meetingTypeFilter === "all" ||
        String(item.meeting_type || "").toLowerCase() ===
          meetingTypeFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMeetingType
      );
    });
  }, [
    consultations,
    search,
    statusFilter,
    meetingTypeFilter,
  ]);

  // =====================================================
  // SUMMARY COUNTS
  // =====================================================

  const totalConsultations =
    consultations.length;

  const pendingConsultations =
    consultations.filter(
      (item) =>
        String(item.status || "").toLowerCase() ===
        "pending"
    ).length;

  const confirmedConsultations =
    consultations.filter(
      (item) =>
        String(item.status || "").toLowerCase() ===
        "confirmed"
    ).length;

  const completedConsultations =
    consultations.filter((item) =>
      ["completed", "closed"].includes(
        String(item.status || "").toLowerCase()
      )
    ).length;

  // =====================================================
  // VIEW CONSULTATION
  // =====================================================

  const handleViewConsultation = (id) => {
    navigate(
      `/legal-team/consultations/view/${id}`
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
            Legal Consultations
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Manage customer legal consultations and meetings.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={fetchConsultations}
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
                  Total Consultations
                </small>

                <h3 className="mb-0 mt-2">
                  {totalConsultations}
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
                  Pending
                </small>

                <h3 className="mb-0 mt-2">
                  {pendingConsultations}
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

        {/* CONFIRMED */}

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
                  Confirmed
                </small>

                <h3 className="mb-0 mt-2">
                  {confirmedConsultations}
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

        {/* COMPLETED */}

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
                  Completed
                </small>

                <h3 className="mb-0 mt-2">
                  {completedConsultations}
                </h3>
              </div>

              <FaCalendarAlt
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

            <div className="col-lg-6">
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
                  placeholder="Search customer, case, property..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>
            </div>

            {/* STATUS */}

            <div className="col-lg-3">
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

                <option value="Pending">
                  Pending
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            {/* MEETING TYPE */}

            <div className="col-lg-3">
              <select
                className="form-select"
                value={meetingTypeFilter}
                onChange={(e) =>
                  setMeetingTypeFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Meeting Types
                </option>

                <option value="Online">
                  Online
                </option>

                <option value="Offline">
                  Offline
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
      {/* CONSULTATION TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              All Consultations
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              {filteredConsultations.length} of{" "}
              {consultations.length}
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
                Loading consultations...
              </p>
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="text-center py-5">
              <FaCalendarAlt
                style={{
                  fontSize: "40px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No consultations found.
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
                      Consultation
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Legal Case
                    </th>

                    <th>
                      Property
                    </th>

                    <th>
                      Date & Time
                    </th>

                    <th>
                      Meeting
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
                  {filteredConsultations.map(
                    (item) => (
                      <tr key={item.id}>
                        <td className="px-3">
                          <strong>
                            #{item.id}
                          </strong>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#777777",
                            }}
                          >
                            Created{" "}
                            {formatDate(
                              item.created_at
                            )}
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
                          <strong>
                            {item.case_number ||
                              "-"}
                          </strong>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#777777",
                            }}
                          >
                            {item.case_title ||
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
                          <strong>
                            {formatDate(
                              item.consultation_date
                            )}
                          </strong>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#777777",
                            }}
                          >
                            {formatTime(
                              item.consultation_time
                            )}
                          </div>
                        </td>

                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                "#F5E8B0",
                              color: "#111111",
                            }}
                          >
                            <FaVideo className="me-1" />
                            {item.meeting_type ||
                              "-"}
                          </span>
                        </td>

                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                String(
                                  item.status || ""
                                ).toLowerCase() ===
                                "confirmed"
                                  ? "#DFF5E3"
                                  : String(
                                      item.status || ""
                                    ).toLowerCase() ===
                                    "pending"
                                  ? "#FFF3CD"
                                  : String(
                                      item.status || ""
                                    ).toLowerCase() ===
                                    "cancelled"
                                  ? "#F8D7DA"
                                  : "#E8E8E8",

                              color:
                                String(
                                  item.status || ""
                                ).toLowerCase() ===
                                "confirmed"
                                  ? "#198754"
                                  : String(
                                      item.status || ""
                                    ).toLowerCase() ===
                                    "pending"
                                  ? "#856404"
                                  : String(
                                      item.status || ""
                                    ).toLowerCase() ===
                                    "cancelled"
                                  ? "#842029"
                                  : "#555555",
                            }}
                          >
                            {item.status || "-"}
                          </span>
                        </td>

                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm"
                            title="View Consultation"
                            onClick={() =>
                              handleViewConsultation(
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

export default LegalTeamConsultations;