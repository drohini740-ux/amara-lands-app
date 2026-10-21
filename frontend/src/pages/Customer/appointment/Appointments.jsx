
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchAppointments,
  removeAppointment,
} from "../../../redux/appointmentSlice";

const GOLD = "#D4AF37";
const BLACK = "#111111";

export default function Appointments() {
  const dispatch = useDispatch();

  const appointmentState = useSelector((state) => state.appointments);
  const appointments = appointmentState?.appointments || [];
  const reduxLoading = appointmentState?.loading ?? false;
  const reduxError = appointmentState?.error ?? "";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const loadAppointments = useCallback(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      setActionError("");

      await dispatch(removeAppointment(id)).unwrap();
      window.alert("Appointment deleted successfully.");

      // Refresh the list after successful deletion.
      loadAppointments();
    } catch (error) {
      console.error("Failed to delete appointment:", error);
      setActionError(
        typeof error === "string"
          ? error
          : error?.message || "Unable to delete the appointment."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appointments.filter((item) => {
      const matchesSearch = [
        item.customer_name,
        item.property_name,
        item.service_type,
        item.purpose,
        item.phone,
        item.id,
      ].some((value) => String(value ?? "").toLowerCase().includes(query));

      const status = String(item.status || "Pending").toLowerCase();
      const paymentStatus = String(
        item.payment_status || "Pending"
      ).toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter.toLowerCase();

      const matchesPayment =
        paymentFilter === "All" ||
        paymentStatus === paymentFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [appointments, search, statusFilter, paymentFilter]);

  const getStatusStyle = (status) => {
    const value = String(status || "Pending").toLowerCase();

    if (
      ["approved", "confirmed", "completed", "success"].includes(value)
    ) {
      return { background: "#E7F5EC", color: "#17663A" };
    }

    if (
      ["rejected", "cancelled", "canceled"].includes(value)
    ) {
      return { background: "#FDEAEA", color: "#A32020" };
    }

    return { background: "#FFF4D6", color: "#805D00" };
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const value = String(date).substring(0, 10);
    const parsed = new Date(`${value}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "-";

    const match = String(time).match(/^(\d{1,2}):(\d{2})/);
    if (!match) return time;

    const hour = Number(match[1]);
    const minute = Number(match[2]);

    if (hour > 23 || minute > 59) return time;

    const parsed = new Date();
    parsed.setHours(hour, minute, 0, 0);

    return parsed.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(
    (item) => String(item.status || "Pending").toLowerCase() === "pending"
  ).length;
  const confirmedAppointments = appointments.filter((item) =>
    ["approved", "confirmed"].includes(
      String(item.status || "").toLowerCase()
    )
  ).length;
  const completedAppointments = appointments.filter(
    (item) => String(item.status || "").toLowerCase() === "completed"
  ).length;

  return (
    <div
      className="container-fluid p-3 p-md-4"
      style={{ minHeight: "100vh", background: "#F7F7F7" }}
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
            My Appointments
          </h2>

          <p className="mb-0 text-muted">
            Manage and track your property appointments.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn"
            onClick={loadAppointments}
            disabled={reduxLoading}
            style={{
              background: "#FFFFFF",
              color: BLACK,
              border: "1px solid #D8D8D8",
              borderRadius: "8px",
              padding: "10px 16px",
            }}
          >
            ↻ Refresh
          </button>

          <Link
            to="/appointments/add"
            className="btn"
            style={{
              background: GOLD,
              color: BLACK,
              border: `1px solid ${GOLD}`,
              borderRadius: "8px",
              padding: "10px 18px",
              fontWeight: 700,
            }}
          >
            + Add Appointment
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Total Appointments",
            value: totalAppointments,
            symbol: "▤",
          },
          {
            label: "Pending",
            value: pendingAppointments,
            symbol: "◷",
          },
          {
            label: "Confirmed",
            value: confirmedAppointments,
            symbol: "✓",
          },
          {
            label: "Completed",
            value: completedAppointments,
            symbol: "★",
          },
        ].map((card) => (
          <div className="col-6 col-xl-3" key={card.label}>
            <div
              className="card h-100 border-0 shadow-sm"
              style={{ borderRadius: "12px" }}
            >
              <div className="card-body p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-center gap-2">
                  <div>
                    <div
                      style={{ color: "#777777", fontSize: "13px" }}
                    >
                      {card.label}
                    </div>
                    <h3
                      className="mt-2 mb-0"
                      style={{ color: BLACK, fontWeight: 700 }}
                    >
                      {card.value}
                    </h3>
                  </div>

                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: "#FBF4DF",
                      color: "#9A7816",
                      fontSize: "22px",
                    }}
                  >
                    {card.symbol}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Appointments table */}
      <div
        className="card border-0 shadow-sm"
        style={{ borderRadius: "14px", overflow: "hidden" }}
      >
        <div
          className="card-header border-0 p-3 p-md-4"
          style={{
            background: BLACK,
            borderBottom: `3px solid ${GOLD}`,
          }}
        >
          <h5 className="mb-1" style={{ color: "#FFFFFF", fontWeight: 700 }}>
            Appointment Records
          </h5>
          <p className="mb-0" style={{ color: "#D5D5D5", fontSize: "13px" }}>
            View, update, or manage your appointments.
          </p>
        </div>

        <div className="card-body p-3 p-md-4">
          {actionError && (
            <div className="alert alert-danger" role="alert">
              {actionError}
            </div>
          )}

          {reduxError && (
            <div className="alert alert-danger" role="alert">
              {typeof reduxError === "string"
                ? reduxError
                : "Unable to load appointments."}
              <button
                type="button"
                className="btn btn-sm btn-outline-dark ms-3"
                onClick={loadAppointments}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Search and filters */}
          <div className="row g-3 mb-4">
            <div className="col-lg-5">
              <label
                className="form-label"
                style={{ color: BLACK, fontWeight: 600 }}
              >
                Search appointments
              </label>
              <input
                type="search"
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, property, service or phone..."
                style={{ borderRadius: "8px", padding: "10px 12px" }}
              />
            </div>

            <div className="col-sm-6 col-lg-3">
              <label
                className="form-label"
                style={{ color: BLACK, fontWeight: 600 }}
              >
                Appointment Status
              </label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ borderRadius: "8px", padding: "10px 12px" }}
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="col-sm-6 col-lg-3">
              <label
                className="form-label"
                style={{ color: BLACK, fontWeight: 600 }}
              >
                Payment Status
              </label>
              <select
                className="form-select"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                style={{ borderRadius: "8px", padding: "10px 12px" }}
              >
                <option value="All">All payments</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Success">Success</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="col-lg-1 d-flex align-items-end">
              <button
                type="button"
                className="btn w-100"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setPaymentFilter("All");
                }}
                style={{
                  border: "1px solid #D4AF37",
                  borderRadius: "8px",
                  color: BLACK,
                  padding: "10px 8px",
                }}
                title="Clear search and filters"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <span className="text-muted" style={{ fontSize: "13px" }}>
              Showing {filteredAppointments.length} of {totalAppointments} appointments
            </span>
          </div>

          {reduxLoading && (
            <div className="text-center py-3">
              <div
                className="spinner-border spinner-border-sm"
                role="status"
                style={{ color: GOLD }}
              />
              <span className="ms-2 text-muted">Loading appointments...</span>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  {[
                    "Customer",
                    "Property",
                    "Service",
                    "Phone",
                    "Date",
                    "Time",
                    "Status",
                    "Payment",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="py-3 px-3 text-nowrap"
                      style={{
                        background: "#F5F0E2",
                        color: BLACK,
                        borderBottom: `2px solid ${GOLD}`,
                        fontSize: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {!reduxLoading && filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5">
                      <div style={{ fontSize: "32px", color: GOLD }}>▤</div>
                      <h6 className="mt-2" style={{ color: BLACK }}>
                        {appointments.length === 0
                          ? "No Appointments Found"
                          : "No Matching Appointments"}
                      </h6>
                      <p className="text-muted mb-3">
                        {appointments.length === 0
                          ? "Create your first appointment to get started."
                          : "Try changing your search or filters."}
                      </p>

                      {appointments.length === 0 ? (
                        <Link
                          to="/appointments/add"
                          className="btn"
                          style={{
                            background: GOLD,
                            color: BLACK,
                            fontWeight: 700,
                          }}
                        >
                          + Add Appointment
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline-dark"
                          onClick={() => {
                            setSearch("");
                            setStatusFilter("All");
                            setPaymentFilter("All");
                          }}
                        >
                          Clear Filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-3">
                        <div style={{ color: BLACK, fontWeight: 600 }}>
                          {item.customer_name || "-"}
                        </div>
                        <small className="text-muted">
                          ID: #{item.id}
                        </small>
                      </td>

                      <td className="px-3 py-3">
                        {item.property_name || item.property_id || "-"}
                      </td>

                      <td className="px-3 py-3">
                        {item.service_type || item.purpose || "-"}
                      </td>

                      <td className="px-3 py-3 text-nowrap">
                        {item.phone || item.mobile || "-"}
                      </td>

                      <td className="px-3 py-3 text-nowrap">
                        {formatDate(
                          item.appointment_date || item.date
                        )}
                      </td>

                      <td className="px-3 py-3 text-nowrap">
                        {formatTime(
                          item.appointment_time || item.time
                        )}
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className="badge rounded-pill px-3 py-2"
                          style={getStatusStyle(item.status)}
                        >
                          {item.status || "Pending"}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className="badge rounded-pill px-3 py-2"
                          style={getStatusStyle(item.payment_status)}
                        >
                          {item.payment_status || "Pending"}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <div className="d-flex flex-wrap gap-2">
                          <Link
                            to={`/appointments/view/${item.id}`}
                            className="btn btn-sm"
                            style={{
                              background: BLACK,
                              color: "#FFFFFF",
                              borderRadius: "6px",
                            }}
                          >
                            View
                          </Link>

                          <Link
                            to={`/appointments/edit/${item.id}`}
                            className="btn btn-sm"
                            style={{
                              background: GOLD,
                              color: BLACK,
                              borderRadius: "6px",
                              fontWeight: 600,
                            }}
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            disabled={deletingId === item.id}
                            onClick={() => handleDelete(item.id)}
                            style={{ borderRadius: "6px" }}
                          >
                            {deletingId === item.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}