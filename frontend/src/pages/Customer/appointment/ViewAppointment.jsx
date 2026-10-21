
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAppointment } from "../../../services/appointmentService";

export default function ViewAppointment() {
  const { id } = useParams();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAppointment = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAppointment(id);
      const data = res?.data ?? res;

      setAppointment(data?.appointment ?? data);
    } catch (err) {
      console.error("Failed to load appointment:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to load appointment details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAppointment();
  }, [loadAppointment]);

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "-";

    const match = String(time).match(/^(\d{1,2}):(\d{2})/);

    if (!match) return time;

    const date = new Date();
    date.setHours(Number(match[1]), Number(match[2]), 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusStyle = (status) => {
    const value = String(status || "Pending").toLowerCase();

    if (["approved", "confirmed", "completed", "success"].includes(value)) {
      return {
        background: "#e7f5ec",
        color: "#17663a",
      };
    }

    if (["rejected", "cancelled", "canceled"].includes(value)) {
      return {
        background: "#fdeaea",
        color: "#a32020",
      };
    }

    return {
      background: "#fff4d6",
      color: "#805d00",
    };
  };

  const Detail = ({ label, value }) => (
    <div className="col-md-6 mb-4">
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e9e2ce",
          borderRadius: "10px",
          padding: "16px",
          height: "100%",
        }}
      >
        <div
          style={{
            color: "#777777",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.7px",
            marginBottom: "8px",
          }}
        >
          {label}
        </div>

        <div
          style={{
            color: "#171717",
            fontSize: "15px",
            fontWeight: 500,
            overflowWrap: "anywhere",
          }}
        >
          {value || "-"}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container-fluid p-4" style={{ background: "#f8f8f8", minHeight: "100vh" }}>
        <div className="text-center p-5">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#c5a028" }}
          />
          <p className="mt-3 text-muted">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="container-fluid p-4" style={{ background: "#f8f8f8", minHeight: "100vh" }}>
        <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
          <div className="card-body p-4 text-center">
            <h5 style={{ color: "#171717" }}>Appointment Details</h5>
            <p className="text-danger mt-3">
              {error || "Appointment not found."}
            </p>

            <button
              type="button"
              className="btn me-2"
              style={{ background: "#d4af37", color: "#111111", fontWeight: 600 }}
              onClick={loadAppointment}
            >
              Try Again
            </button>

            <Link to="/appointments" className="btn btn-outline-dark">
              Back to Appointments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = appointment.status || "Pending";
  const paymentStatus = appointment.payment_status || "Pending";

  return (
    <div
      className="container-fluid p-3 p-md-4"
      style={{
        background: "#f7f7f7",
        minHeight: "100vh",
      }}
    >
      {/* Page heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div
            style={{
              color: "#ad8b20",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            AMARA LANDS
          </div>

          <h2 className="mb-1" style={{ color: "#111111", fontWeight: 700 }}>
            Appointment Details
          </h2>

          <p className="mb-0 text-muted">
            View your appointment information and current status.
          </p>
        </div>

        <Link
          to="/appointments"
          className="btn"
          style={{
            background: "#111111",
            color: "#ffffff",
            borderRadius: "8px",
            padding: "10px 18px",
          }}
        >
          ← Back to Appointments
        </Link>
      </div>

      {/* Main card */}
      <div
        className="card border-0 shadow-sm"
        style={{
          borderRadius: "14px",
          overflow: "hidden",
        }}
      >
        {/* Black and gold header */}
        <div
          className="card-header border-0 p-4"
          style={{
            background: "#111111",
            borderBottom: "3px solid #d4af37",
          }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h4 className="mb-1" style={{ color: "#ffffff", fontWeight: 700 }}>
                Appointment Overview
              </h4>

              <p className="mb-0" style={{ color: "#d5d5d5", fontSize: "13px" }}>
                Reference ID: #{appointment.id || id}
              </p>
            </div>

            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                ...getStatusStyle(status),
                fontSize: "13px",
              }}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="card-body p-3 p-md-4">
          <h6
            className="mb-4"
            style={{
              color: "#ad8b20",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Appointment Information
          </h6>

          <div className="row">
            <Detail
              label="Property"
              value={appointment.property_name || appointment.property_id}
            />

            <Detail
              label="Customer Name"
              value={appointment.customer_name}
            />

            <Detail
              label="Phone Number"
              value={appointment.phone || appointment.mobile}
            />

            <Detail
              label="Service / Purpose"
              value={
                appointment.service_type ||
                appointment.purpose ||
                "-"
              }
            />

            <Detail
              label="Appointment Date"
              value={formatDate(
                appointment.appointment_date || appointment.date
              )}
            />

            <Detail
              label="Appointment Time"
              value={formatTime(
                appointment.appointment_time || appointment.time
              )}
            />

            <Detail
              label="Appointment Status"
              value={
                <span
                  className="badge rounded-pill px-3 py-2"
                  style={getStatusStyle(status)}
                >
                  {status}
                </span>
              }
            />

            <Detail
              label="Payment Status"
              value={
                <span
                  className="badge rounded-pill px-3 py-2"
                  style={getStatusStyle(paymentStatus)}
                >
                  {paymentStatus}
                </span>
              }
            />

            <Detail
              label="Remarks"
              value={appointment.remarks || appointment.notes || "No remarks provided"}
            />
          </div>

          <hr style={{ borderColor: "#e9e2ce" }} />

          {/* Actions */}
          <div className="d-flex flex-wrap justify-content-end gap-2 mt-3">
            <Link
              to="/appointments"
              className="btn"
              style={{
                background: "#ffffff",
                color: "#111111",
                border: "1px solid #111111",
                borderRadius: "8px",
                padding: "10px 20px",
              }}
            >
              Back
            </Link>

            <Link
              to={`/appointments/edit/${appointment.id || id}`}
              className="btn"
              style={{
                background: "#d4af37",
                color: "#111111",
                border: "1px solid #d4af37",
                borderRadius: "8px",
                padding: "10px 20px",
                fontWeight: 700,
              }}
            >
              Edit Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
