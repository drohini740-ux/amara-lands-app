
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaCalendarAlt,
  FaSearch,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const LegalTeamAppointments = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // =====================================================
  // FETCH APPOINTMENTS
  // =====================================================

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/legal-team/appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setAppointments(
          response.data.appointments || []
        );
      } else {
        setAppointments([]);
        setError(
          response.data?.message ||
            "Failed to fetch appointments."
        );
      }
    } catch (err) {
      console.error(
        "Legal Team Appointments Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    fetchAppointments();
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
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "-";

    const parts = String(time).split(":");

    if (parts.length < 2) {
      return time;
    }

    let hour = parseInt(parts[0], 10);
    const minute = parts[1];

    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${hour}:${minute} ${period}`;
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "confirmed") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (value === "completed") {
      return {
        backgroundColor: "#E2E3E5",
        color: "#41464B",
      };
    }

    if (
      value === "cancelled" ||
      value === "canceled"
    ) {
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
  // FILTER
  // =====================================================

  const filteredAppointments =
    appointments.filter((appointment) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        String(
          appointment.customer_name || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          appointment.customer_email || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          appointment.phone || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          appointment.property_name || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          appointment.survey_number || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          appointment.purpose || ""
        )
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        String(
          appointment.status || ""
        ).toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesPayment =
        paymentFilter === "all" ||
        String(
          appointment.payment_status || ""
        ).toLowerCase() ===
          paymentFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalAppointments =
    appointments.length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status
        ).toLowerCase() === "pending"
    ).length;

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status
        ).toLowerCase() === "confirmed"
    ).length;

  const completedAppointments =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status
        ).toLowerCase() === "completed"
    ).length;

  // =====================================================
  // VIEW DETAILS
  // =====================================================

  const handleView = (id) => {
    navigate(
      `/legal-team/appointments/view/${id}`
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
            Appointments
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Manage customer appointments related
            to legal services and properties.
          </p>
        </div>

        <button
          className="btn"
          onClick={fetchAppointments}
          disabled={loading}
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
            border: "1px solid #111111",
          }}
        >
          <FaCalendarAlt className="me-2" />

          {loading
            ? "Refreshing..."
            : "Refresh"}
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
              borderLeft:
                "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Total Appointments
                </small>

                <h3 className="mb-0 mt-2">
                  {totalAppointments}
                </h3>
              </div>

              <FaCalendarAlt
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
              borderLeft:
                "4px solid #FFC107",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Pending
                </small>

                <h3 className="mb-0 mt-2">
                  {pendingAppointments}
                </h3>
              </div>

              <FaHourglassHalf
                style={{
                  color: "#FFC107",
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
              borderLeft:
                "4px solid #198754",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Confirmed
                </small>

                <h3 className="mb-0 mt-2">
                  {confirmedAppointments}
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
              borderLeft:
                "4px solid #6C757D",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Completed
                </small>

                <h3 className="mb-0 mt-2">
                  {completedAppointments}
                </h3>
              </div>

              <FaClock
                style={{
                  color: "#6C757D",
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
                  placeholder="Search customer, property, survey number or purpose..."
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

            {/* PAYMENT */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Payment Status
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Success">
                  Success
                </option>

                <option value="Failed">
                  Failed
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
      {/* TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              All Appointments
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              {filteredAppointments.length}{" "}
              appointments
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
                Loading appointments...
              </p>
            </div>
          ) : filteredAppointments.length ===
            0 ? (
            <div className="text-center py-5">
              <FaCalendarAlt
                style={{
                  fontSize: "40px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No appointments found.
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
                      Customer
                    </th>

                    <th>
                      Property
                    </th>

                    <th>
                      Date & Time
                    </th>

                    <th>
                      Purpose
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Payment
                    </th>

                    <th className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppointments.map(
                    (appointment) => (
                      <tr
                        key={
                          appointment.id
                        }
                      >
                        <td className="px-3">
                          <strong>
                            #
                            {
                              appointment.id
                            }
                          </strong>
                        </td>

                        {/* CUSTOMER */}

                        <td>
                          <strong>
                            {
                              appointment.customer_name ||
                              appointment.registered_customer_name ||
                              "-"
                            }
                          </strong>

                          <div
                            style={{
                              fontSize: "13px",
                              color: "#777777",
                            }}
                          >
                            {
                              appointment.customer_email ||
                              "-"
                            }
                          </div>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#999999",
                            }}
                          >
                            {
                              appointment.phone ||
                              appointment.registered_customer_mobile ||
                              "-"
                            }
                          </div>
                        </td>

                        {/* PROPERTY */}

                        <td>
                          <strong>
                            {
                              appointment.property_name ||
                              "-"
                            }
                          </strong>

                          <div
                            style={{
                              fontSize: "13px",
                              color: "#777777",
                            }}
                          >
                            Survey:{" "}
                            {
                              appointment.survey_number ||
                              "-"
                            }
                          </div>
                        </td>

                        {/* DATE */}

                        <td>
                          <strong>
                            {formatDate(
                              appointment.appointment_date
                            )}
                          </strong>

                          <div
                            style={{
                              fontSize: "13px",
                              color: "#777777",
                            }}
                          >
                            <FaClock
                              className="me-1"
                            />

                            {formatTime(
                              appointment.appointment_time
                            )}
                          </div>
                        </td>

                        {/* PURPOSE */}

                        <td>
                          {appointment.purpose ||
                            "-"}
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className="badge"
                            style={getStatusStyle(
                              appointment.status
                            )}
                          >
                            {
                              appointment.status ||
                              "-"
                            }
                          </span>
                        </td>

                        {/* PAYMENT */}

                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                String(
                                  appointment.payment_status
                                ).toLowerCase() ===
                                "success"
                                  ? "#DFF5E3"
                                  : "#FFF3CD",

                              color:
                                String(
                                  appointment.payment_status
                                ).toLowerCase() ===
                                "success"
                                  ? "#198754"
                                  : "#856404",
                            }}
                          >
                            {
                              appointment.payment_status ||
                              "-"
                            }
                          </span>
                        </td>

                        {/* ACTION */}

                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm"
                            title="View Appointment"
                            onClick={() =>
                              handleView(
                                appointment.id
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
                            <FaEye />
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

export default LegalTeamAppointments;

