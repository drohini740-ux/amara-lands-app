
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getAppointment,
  updateAppointment,
} from "../../../services/appointmentService";
import api from "../../../services/api";

const GOLD = "#D4AF37";
const BLACK = "#111111";
const BACKGROUND = "#F7F7F7";

const initialFormData = {
  property_id: "",
  customer_name: "",
  phone: "",
  appointment_date: "",
  appointment_time: "",
  purpose: "",
  status: "Pending",
  remarks: "",
};

const inputStyle = {
  borderRadius: "8px",
  border: "1px solid #dedede",
  padding: "11px 12px",
  color: BLACK,
};

export default function EditAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [propertyError, setPropertyError] = useState("");

  const loadProperties = useCallback(async () => {
    try {
      setPropertyError("");

      const res = await api.get("/properties");
      const data = res?.data ?? res;

      setProperties(
        Array.isArray(data?.properties)
          ? data.properties
          : Array.isArray(data)
            ? data
            : []
      );
    } catch (err) {
      console.error("Failed to load properties:", err);
      setPropertyError("Unable to load properties. Please try again.");
    }
  }, []);

  const loadAppointment = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAppointment(id);
      const data = res?.data ?? res;
      const appointment = data?.appointment ?? data;

      if (!appointment || !appointment.id && !appointment.property_id) {
        throw new Error("Appointment details were not found.");
      }

      setFormData({
        property_id: appointment.property_id ?? "",
        customer_name: appointment.customer_name ?? "",
        phone: appointment.phone ?? appointment.mobile ?? "",
        appointment_date: (
          appointment.appointment_date ?? appointment.date ?? ""
        ).toString().substring(0, 10),
        appointment_time: (
          appointment.appointment_time ?? appointment.time ?? ""
        ).toString().substring(0, 5),
        purpose:
          appointment.purpose ?? appointment.service_type ?? "",
        status: appointment.status ?? "Pending",
        remarks: appointment.remarks ?? appointment.notes ?? "",
      });
    } catch (err) {
      console.error("Failed to load appointment:", err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load appointment details."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAppointment();
    loadProperties();
  }, [loadAppointment, loadProperties]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.property_id) {
      setError("Please select a property.");
      return;
    }

    if (!formData.customer_name.trim()) {
      setError("Please enter the customer name.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter the phone number.");
      return;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(formData.phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!formData.appointment_date || !formData.appointment_time) {
      setError("Please select the appointment date and time.");
      return;
    }

    if (!formData.purpose.trim()) {
      setError("Please enter the appointment purpose.");
      return;
    }

    try {
      setSaving(true);

      await updateAppointment(id, {
        ...formData,
        customer_name: formData.customer_name.trim(),
        phone: formData.phone.trim(),
        purpose: formData.purpose.trim(),
        remarks: formData.remarks.trim(),
      });

      window.alert("Appointment updated successfully.");
      navigate("/appointments");
    } catch (err) {
      console.error("Failed to update appointment:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to update appointment. Please check your details and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const FieldLabel = ({ children, required = false }) => (
    <label
      className="form-label mb-2"
      style={{ color: BLACK, fontWeight: 600, fontSize: "14px" }}
    >
      {children}
      {required && <span style={{ color: "#b42318" }}> *</span>}
    </label>
  );

  if (loading) {
    return (
      <div
        className="container-fluid p-4"
        style={{ minHeight: "100vh", background: BACKGROUND }}
      >
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
            style={{ color: GOLD }}
          />
          <p className="mt-3 text-muted">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.customer_name && !formData.property_id) {
    return (
      <div
        className="container-fluid p-4"
        style={{ minHeight: "100vh", background: BACKGROUND }}
      >
        <div
          className="card border-0 shadow-sm mx-auto"
          style={{ maxWidth: "650px", borderRadius: "14px" }}
        >
          <div className="card-body p-4 text-center">
            <h4 style={{ color: BLACK }}>Edit Appointment</h4>
            <p className="text-danger mt-3">{error}</p>

            <button
              type="button"
              onClick={loadAppointment}
              className="btn me-2"
              style={{
                background: GOLD,
                color: BLACK,
                fontWeight: 600,
              }}
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

  return (
    <div
      className="container-fluid p-3 p-md-4"
      style={{ minHeight: "100vh", background: BACKGROUND }}
    >
      {/* Page heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div
            style={{
              color: "#AD8B20",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2px",
              marginBottom: "6px",
            }}
          >
            AMARA LANDS
          </div>

          <h2 className="mb-1" style={{ color: BLACK, fontWeight: 700 }}>
            Edit Appointment
          </h2>

          <p className="mb-0 text-muted">
            Update your appointment information below.
          </p>
        </div>

        <Link
          to="/appointments"
          className="btn"
          style={{
            background: BLACK,
            color: "#FFFFFF",
            borderRadius: "8px",
            padding: "10px 18px",
          }}
        >
          ← Back to Appointments
        </Link>
      </div>

      {/* Form card */}
      <div
        className="card border-0 shadow-sm"
        style={{ borderRadius: "14px", overflow: "hidden" }}
      >
        <div
          className="card-header border-0 p-4"
          style={{
            background: BLACK,
            borderBottom: `3px solid ${GOLD}`,
          }}
        >
          <h4 className="mb-1" style={{ color: "#FFFFFF", fontWeight: 700 }}>
            Appointment Information
          </h4>
          <p className="mb-0" style={{ color: "#D5D5D5", fontSize: "13px" }}>
            Reference ID: #{id}
          </p>
        </div>

        <div className="card-body p-3 p-md-4">
          {error && (
            <div
              className="alert alert-danger"
              role="alert"
              style={{ borderRadius: "8px" }}
            >
              {error}
            </div>
          )}

          {propertyError && (
            <div
              className="alert alert-warning d-flex flex-wrap justify-content-between align-items-center gap-2"
              role="alert"
            >
              <span>{propertyError}</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-dark"
                onClick={loadProperties}
              >
                Retry
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Property */}
              <div className="col-md-6 mb-4">
                <FieldLabel required>Property</FieldLabel>
                <select
                  className="form-select"
                  name="property_id"
                  value={formData.property_id}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Select a property</option>

                  {formData.property_id &&
                    !properties.some(
                      (property) =>
                        String(property.id) ===
                        String(formData.property_id)
                    ) && (
                      <option value={formData.property_id}>
                        Current property (ID: {formData.property_id})
                      </option>
                    )}

                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.property_name ||
                        property.name ||
                        `Property #${property.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer name */}
              <div className="col-md-6 mb-4">
                <FieldLabel required>Customer Name</FieldLabel>
                <input
                  type="text"
                  className="form-control"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  style={inputStyle}
                />
              </div>

              {/* Phone */}
              <div className="col-md-6 mb-4">
                <FieldLabel required>Phone Number</FieldLabel>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  autoComplete="tel"
                  required
                  maxLength={20}
                  style={inputStyle}
                />
              </div>

              {/* Date */}
              <div className="col-md-6 mb-4">
                <FieldLabel required>Appointment Date</FieldLabel>
                <input
                  type="date"
                  className="form-control"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              {/* Time */}
              <div className="col-md-6 mb-4">
                <FieldLabel required>Appointment Time</FieldLabel>
                <input
                  type="time"
                  className="form-control"
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              {/* Purpose */}
              <div className="col-md-6 mb-4">
                <FieldLabel required>Service / Purpose</FieldLabel>
                <select
                  className="form-select"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Select service</option>
                  <option value="Property Site Visit">
                    Property Site Visit
                  </option>
                  <option value="Document Verification">
                    Document Verification
                  </option>
                  <option value="Legal Consultation">
                    Legal Consultation
                  </option>
                  <option value="Property Registration">
                    Property Registration
                  </option>
                  <option value="Payment Consultation">
                    Payment Consultation
                  </option>
                  <option value="Other">Other</option>

                  {/* Preserve a previously saved custom purpose */}
                  {formData.purpose &&
                    ![
                      "Property Site Visit",
                      "Document Verification",
                      "Legal Consultation",
                      "Property Registration",
                      "Payment Consultation",
                      "Other",
                    ].includes(formData.purpose) && (
                      <option value={formData.purpose}>
                        {formData.purpose}
                      </option>
                    )}
                </select>
              </div>

              {/* Status */}
              <div className="col-md-6 mb-4">
                <FieldLabel>Appointment Status</FieldLabel>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <small className="text-muted d-block mt-2">
                  Only select a status you are authorized to change.
                </small>
              </div>

              {/* Remarks */}
              <div className="col-12 mb-4">
                <FieldLabel>Remarks</FieldLabel>
                <textarea
                  className="form-control"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Enter additional remarks (optional)"
                  rows={4}
                  maxLength={1000}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
            </div>

            <hr style={{ borderColor: "#E9E2CE" }} />

            {/* Buttons */}
            <div className="d-flex flex-wrap justify-content-end gap-2 mt-3">
              <Link
                to="/appointments"
                className="btn"
                style={{
                  background: "#FFFFFF",
                  color: BLACK,
                  border: `1px solid ${BLACK}`,
                  borderRadius: "8px",
                  padding: "10px 22px",
                }}
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="btn"
                disabled={saving}
                style={{
                  background: GOLD,
                  color: BLACK,
                  border: `1px solid ${GOLD}`,
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontWeight: 700,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Updating..." : "✓ Update Appointment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
