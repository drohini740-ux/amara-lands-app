
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAppointment } from "../../../redux/appointmentSlice";
import api from "../../../services/api";

export default function AddAppointment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [propertiesError, setPropertiesError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    property_id: "",
    customer_name: "",
    phone: "",
    appointment_date: "",
    appointment_time: "",
    purpose: "",
    status: "Pending",
    remarks: "",
  });

  // ==========================================
  // LOAD CUSTOMER PROPERTIES
  // ==========================================

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoadingProperties(true);
        setPropertiesError("");

        const res = await api.get("/properties");

        setProperties(
          Array.isArray(res.data?.properties)
            ? res.data.properties
            : []
        );
      } catch (error) {
        console.error("Fetch Properties Error:", error);

        setPropertiesError(
          "Unable to load properties. Please try again."
        );
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchProperties();
  }, []);

  // ==========================================
  // FORM INPUT HANDLER
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT APPOINTMENT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!formData.property_id) {
      alert("Please select a property.");
      return;
    }

    if (!formData.customer_name.trim()) {
      alert("Please enter the customer name.");
      return;
    }

    if (!formData.purpose) {
      alert("Please select an appointment service.");
      return;
    }

    if (
      formData.appointment_date <
      new Date().toLocaleDateString("en-CA")
    ) {
      alert("Please select today or a future date.");
      return;
    }

    setSubmitting(true);

    try {
      const appointmentData = {
        ...formData,
        customer_name: formData.customer_name.trim(),
        phone: formData.phone.trim(),
        remarks: formData.remarks.trim(),
      };

      await dispatch(
        createAppointment(appointmentData)
      ).unwrap();

      alert("Appointment created successfully!");
      navigate("/appointments");
    } catch (error) {
      console.error("Create Appointment Error:", error);

      alert(
        typeof error === "string"
          ? error
          : error?.message ||
              "Failed to create appointment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Today's local date in YYYY-MM-DD format
  const today = new Date();
  const minimumDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <div className="container-fluid p-4">
      <div className="card shadow border-0">
        <div className="card-header bg-dark text-white py-3">
          <h3 className="mb-1">Book an Appointment</h3>
          <p className="mb-0 text-light">
            Select your property, service, and preferred schedule.
          </p>
        </div>

        <div className="card-body p-4">
          {propertiesError && (
            <div className="alert alert-danger">
              {propertiesError}
            </div>
          )}

          {!loadingProperties &&
            !propertiesError &&
            properties.length === 0 && (
              <div className="alert alert-warning">
                No properties are available. Please add a property
                before booking an appointment.
              </div>
            )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* PROPERTY */}

              <div className="col-md-6 mb-3">
                <label
                  htmlFor="property_id"
                  className="form-label fw-semibold"
                >
                  Select Property <span className="text-danger">*</span>
                </label>

                <select
                  id="property_id"
                  className="form-select"
                  name="property_id"
                  value={formData.property_id}
                  onChange={handleChange}
                  required
                  disabled={
                    loadingProperties ||
                    propertiesError ||
                    properties.length === 0
                  }
                >
                  <option value="">
                    {loadingProperties
                      ? "Loading properties..."
                      : "Select Property"}
                  </option>

                  {properties.map((property) => (
                    <option
                      key={property.id}
                      value={property.id}
                    >
                      {property.property_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* CUSTOMER NAME */}

              <div className="col-md-6 mb-3">
                <label
                  htmlFor="customer_name"
                  className="form-label fw-semibold"
                >
                  Customer Name <span className="text-danger">*</span>
                </label>

                <input
                  id="customer_name"
                  type="text"
                  className="form-control"
                  name="customer_name"
                  placeholder="Enter customer name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>

              {/* PHONE */}

              <div className="col-md-6 mb-3">
                <label
                  htmlFor="phone"
                  className="form-label fw-semibold"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  className="form-control"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={20}
                />
              </div>

              {/* SERVICE */}

              <div className="col-md-6 mb-3">
                <label
                  htmlFor="purpose"
                  className="form-label fw-semibold"
                >
                  Appointment Service{" "}
                  <span className="text-danger">*</span>
                </label>

                <select
                  id="purpose"
                  className="form-select"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Service</option>
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
                </select>
              </div>

              {/* DATE */}

              <div className="col-md-6 mb-3">
                <label
                  htmlFor="appointment_date"
                  className="form-label fw-semibold"
                >
                  Appointment Date{" "}
                  <span className="text-danger">*</span>
                </label>

                <input
                  id="appointment_date"
                  type="date"
                  className="form-control"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  min={minimumDate}
                  required
                />
              </div>

              {/* TIME */}

              <div className="col-md-6 mb-3">
                <label
                  htmlFor="appointment_time"
                  className="form-label fw-semibold"
                >
                  Appointment Time{" "}
                  <span className="text-danger">*</span>
                </label>

                <input
                  id="appointment_time"
                  type="time"
                  className="form-control"
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* STATUS */}

              <div className="col-md-6 mb-3">
                <label
                  htmlFor="status"
                  className="form-label fw-semibold"
                >
                  Status
                </label>

                <select
                  id="status"
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                </select>

                <small className="text-muted">
                  New appointments are submitted as Pending.
                </small>
              </div>

              {/* REMARKS */}

              <div className="col-12 mb-4">
                <label
                  htmlFor="remarks"
                  className="form-label fw-semibold"
                >
                  Additional Remarks
                </label>

                <textarea
                  id="remarks"
                  className="form-control"
                  name="remarks"
                  rows={4}
                  placeholder="Enter any additional information..."
                  value={formData.remarks}
                  onChange={handleChange}
                  maxLength={1000}
                />
              </div>
            </div>

            {/* ACTIONS */}

            <div className="d-flex gap-2 flex-wrap">
              <button
                type="submit"
                className="btn btn-warning px-4"
                disabled={
                  submitting ||
                  loadingProperties ||
                  Boolean(propertiesError) ||
                  properties.length === 0
                }
              >
                {submitting
                  ? "Saving Appointment..."
                  : "Book Appointment"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => navigate("/appointments")}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
