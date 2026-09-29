
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaMapMarkerAlt,
  FaFileAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/v1";

const LegalTeamAppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH APPOINTMENT
  // =====================================================

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/legal-team/appointments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setAppointment(
          response.data.appointment
        );
      } else {
        setError(
          response.data?.message ||
            "Appointment not found."
        );
      }
    } catch (err) {
      console.error(
        "Legal Team Appointment Details Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

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

    const period =
      hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${hour}:${minute} ${period}`;
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

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
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{
            color: "#C9A227",
          }}
        />

        <p className="mt-3 mb-0">
          Loading appointment...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !appointment) {
    return (
      <div>
        <button
          type="button"
          className="btn mb-4"
          onClick={() =>
            navigate(
              "/legal-team/appointments"
            )
          }
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Appointments
        </button>

        <div className="alert alert-danger">
          {error ||
            "Appointment not found."}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ================================================= */}
      {/* BACK BUTTON */}
      {/* ================================================= */}

      <button
        type="button"
        className="btn mb-4"
        onClick={() =>
          navigate(
            "/legal-team/appointments"
          )
        }
        style={{
          backgroundColor: "#111111",
          color: "#FFFFFF",
          border: "1px solid #111111",
        }}
      >
        <FaArrowLeft className="me-2" />
        Back to Appointments
      </button>

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="bg-white rounded shadow-sm p-4 mb-4"
        style={{
          borderTop: "4px solid #C9A227",
        }}
      >
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <small
              style={{
                color: "#777777",
              }}
            >
              Appointment #{appointment.id}
            </small>

            <h3
              className="mt-1 mb-2"
              style={{
                fontWeight: "700",
                color: "#111111",
              }}
            >
              {appointment.purpose ||
                "Legal Appointment"}
            </h3>

            <div
              style={{
                color: "#777777",
              }}
            >
              {appointment.property_name ||
                "Property not specified"}
            </div>
          </div>

          <span
            className="badge"
            style={{
              ...getStatusStyle(
                appointment.status
              ),
              fontSize: "14px",
              padding: "9px 14px",
            }}
          >
            {appointment.status ||
              "Pending"}
          </span>
        </div>
      </div>

      {/* ================================================= */}
      {/* APPOINTMENT INFORMATION */}
      {/* ================================================= */}

      <div className="row g-4 mb-4">
        {/* DATE & TIME */}

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
              <strong>
                <FaCalendarAlt
                  className="me-2"
                  style={{
                    color: "#C9A227",
                  }}
                />
                Appointment Information
              </strong>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">
                  Appointment Date
                </small>

                <div className="fw-semibold mt-1">
                  {formatDate(
                    appointment.appointment_date
                  )}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  Appointment Time
                </small>

                <div className="fw-semibold mt-1">
                  <FaClock
                    className="me-2"
                    style={{
                      color: "#C9A227",
                    }}
                  />

                  {formatTime(
                    appointment.appointment_time
                  )}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  Purpose
                </small>

                <div className="fw-semibold mt-1">
                  {appointment.purpose ||
                    "-"}
                </div>
              </div>

              <div>
                <small className="text-muted">
                  Service Type
                </small>

                <div className="fw-semibold mt-1">
                  {appointment.service_type ||
                    "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT */}

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
              <strong>
                <FaMoneyBillWave
                  className="me-2"
                  style={{
                    color: "#C9A227",
                  }}
                />
                Payment Information
              </strong>
            </div>

            <div className="card-body">
              <small className="text-muted">
                Payment Status
              </small>

              <div className="mt-2">
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

                    padding:
                      "8px 12px",
                  }}
                >
                  {appointment.payment_status ||
                    "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* CUSTOMER + PROPERTY */}
      {/* ================================================= */}

      <div className="row g-4 mb-4">
        {/* CUSTOMER */}

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
              <strong>
                <FaUser
                  className="me-2"
                  style={{
                    color: "#C9A227",
                  }}
                />
                Customer Information
              </strong>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">
                  Name
                </small>

                <div className="fw-semibold mt-1">
                  {appointment.registered_customer_name ||
                    appointment.customer_name ||
                    "-"}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  Email
                </small>

                <div className="fw-semibold mt-1">
                  <FaEnvelope
                    className="me-2"
                    style={{
                      color: "#C9A227",
                    }}
                  />

                  {appointment.customer_email ||
                    "-"}
                </div>
              </div>

              <div>
                <small className="text-muted">
                  Mobile
                </small>

                <div className="fw-semibold mt-1">
                  <FaPhone
                    className="me-2"
                    style={{
                      color: "#C9A227",
                    }}
                  />

                  {appointment.phone ||
                    appointment.registered_customer_mobile ||
                    "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROPERTY */}

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
              <strong>
                <FaBuilding
                  className="me-2"
                  style={{
                    color: "#C9A227",
                  }}
                />
                Property Information
              </strong>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">
                  Property Name
                </small>

                <div className="fw-semibold mt-1">
                  {appointment.property_name ||
                    "-"}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <small className="text-muted">
                    Survey Number
                  </small>

                  <div className="fw-semibold mt-1">
                    {appointment.survey_number ||
                      "-"}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <small className="text-muted">
                    Property Type
                  </small>

                  <div className="fw-semibold mt-1">
                    {appointment.property_type ||
                      "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Area
                  </small>

                  <div className="fw-semibold mt-1">
                    {appointment.area ||
                      "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">
                    Verification
                  </small>

                  <div className="fw-semibold mt-1">
                    {appointment.verification_status ||
                      "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* PROPERTY ADDRESS */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white">
          <strong>
            <FaMapMarkerAlt
              className="me-2"
              style={{
                color: "#C9A227",
              }}
            />
            Property Address
          </strong>
        </div>

        <div className="card-body">
          <p className="mb-2">
            {appointment.address ||
              "-"}
          </p>

          <p className="mb-0">
            {appointment.city || "-"},{" "}
            {appointment.state || "-"}{" "}
            {appointment.pincode || ""}
          </p>

          <div
            className="mt-3"
            style={{
              fontSize: "13px",
              color: "#777777",
            }}
          >
            Latitude:{" "}
            {appointment.latitude ||
              "-"}
            {" | "}
            Longitude:{" "}
            {appointment.longitude ||
              "-"}
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* REMARKS */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white">
          <strong>
            <FaFileAlt
              className="me-2"
              style={{
                color: "#C9A227",
              }}
            />
            Remarks
          </strong>
        </div>

        <div className="card-body">
          {appointment.remarks ? (
            <p className="mb-0">
              {appointment.remarks}
            </p>
          ) : (
            <span className="text-muted">
              No remarks available.
            </span>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* CREATED DATE */}
      {/* ================================================= */}

      <div
        className="text-muted"
        style={{
          fontSize: "13px",
        }}
      >
        Created:{" "}
        {formatDate(
          appointment.created_at
        )}
      </div>
    </div>
  );
};

export default LegalTeamAppointmentDetails;

