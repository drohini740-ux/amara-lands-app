
import { useCallback, useEffect, useMemo, useState } from "react";
import securityAppointmentService from "../../services/securityAppointmentService";

const COLORS = {
  background: "#020617",
  card: "#0f172a",
  header: "#1e293b",
  border: "#334155",
  text: "#f8fafc",
  muted: "#94a3b8",
  gold: "#fbbf24",
};

const STATUS_COLORS = {
  pending: { background: "#451a03", color: "#fcd34d" },
  confirmed: { background: "#172554", color: "#93c5fd" },
  completed: { background: "#064e3b", color: "#6ee7b7" },
  cancelled: { background: "#450a0a", color: "#fca5a5" },
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "—";

  const time = String(value).slice(0, 5);
  const [hours, minutes] = time.split(":").map(Number);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return String(value);
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusStyle = (status) => {
  const normalized = String(status || "Pending").toLowerCase();

  return (
    STATUS_COLORS[normalized] || {
      background: "#334155",
      color: "#f8fafc",
    }
  );
};

const cellStyle = {
  padding: "16px",
  borderBottom: `1px solid ${COLORS.border}`,
  verticalAlign: "top",
};

export default function SecurityAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Fetch appointments from the backend.
  const loadAppointments = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = {
  data: await securityAppointmentService.getAppointments(),
};

      const rows =
        response.data?.appointments ??
        response.data?.data?.appointments ??
        response.data?.data ??
        [];

      if (!Array.isArray(rows)) {
        throw new Error("Unexpected appointments API response.");
      }

      setAppointments(rows);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load appointments. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Calculate appointment totals.
  const counts = useMemo(() => {
    const result = {
      All: appointments.length,
      Pending: 0,
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0,
    };

    appointments.forEach((appointment) => {
      const status = String(appointment.status || "Pending").toLowerCase();

      const matchingKey = Object.keys(result).find(
        (key) => key !== "All" && key.toLowerCase() === status
      );

      if (matchingKey) result[matchingKey]++;
    });

    return result;
  }, [appointments]);

  // Apply search and status filters.
  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appointments.filter((item) => {
      const searchableValues = [
        item.id,
        item.customer_name,
        item.phone,
        item.mobile,
        item.property_name,
        item.purpose,
        item.service_type,
        item.status,
      ];

      const matchesSearch = searchableValues.some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );

      const matchesStatus =
        statusFilter === "All" ||
        String(item.status || "Pending").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  const cardStyle = (active) => ({
    padding: "18px",
    border: `1px solid ${active ? COLORS.gold : COLORS.border}`,
    borderRadius: "12px",
    background: active ? "#29200b" : COLORS.card,
    color: COLORS.text,
    textAlign: "left",
    cursor: "pointer",
    minWidth: 0,
  });

  const buttonStyle = {
    padding: "10px 16px",
    border: `1px solid ${COLORS.gold}`,
    borderRadius: "8px",
    background: "transparent",
    color: COLORS.gold,
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: "24px",
        background: COLORS.background,
        color: COLORS.text,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Page heading */}
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div>
          <p
            style={{
              color: COLORS.gold,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: "0 0 10px",
            }}
          >
            Security Portal
          </p>

          <h1 style={{ fontSize: "30px", margin: 0 }}>
            Appointments
          </h1>

          <p style={{ color: COLORS.muted, marginTop: "10px" }}>
            View customer appointments and property visit schedules.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadAppointments(true)}
          disabled={loading || refreshing}
          style={{
            ...buttonStyle,
            opacity: loading || refreshing ? 0.6 : 1,
          }}
        >
          {refreshing ? "Refreshing..." : "↻ Refresh"}
        </button>
      </header>

      {/* Status cards */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {Object.entries(counts).map(([status, count]) => (
          <button
            type="button"
            key={status}
            onClick={() => setStatusFilter(status)}
            style={cardStyle(statusFilter === status)}
          >
            <span style={{ color: COLORS.muted, fontSize: "14px" }}>
              {status}
            </span>

            <div
              style={{
                marginTop: "10px",
                color: COLORS.gold,
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              {count}
            </div>
          </button>
        ))}
      </section>

      {/* Search */}
      <section
        style={{
          padding: "20px",
          marginBottom: "24px",
          border: `1px solid ${COLORS.border}`,
          borderRadius: "12px",
          background: COLORS.card,
        }}
      >
        <label
          htmlFor="appointment-search"
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Search appointments
        </label>

        <input
          id="appointment-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by customer, phone, property or ID..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "13px",
            border: `1px solid ${COLORS.border}`,
            borderRadius: "8px",
            outline: "none",
            background: COLORS.background,
            color: COLORS.text,
          }}
        />
      </section>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          style={{
            padding: "16px",
            marginBottom: "20px",
            border: "1px solid #991b1b",
            borderRadius: "8px",
            background: "#450a0a",
            color: "#fecaca",
          }}
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() => loadAppointments()}
            style={{
              ...buttonStyle,
              borderColor: "#fca5a5",
              color: "#fca5a5",
            }}
          >
            Try again
          </button>
        </div>
      )}

      {/* Appointment table */}
      <section
        style={{
          display: "block",
          width: "100%",
          minHeight: "200px",
          boxSizing: "border-box",
          marginBottom: "24px",
          overflow: "visible",
          border: `1px solid ${COLORS.border}`,
          borderRadius: "12px",
          background: COLORS.card,
          color: COLORS.text,
        }}
      >
        <div
          style={{
            padding: "20px",
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <h2 style={{ margin: 0, fontSize: "20px" }}>
            Appointment List
          </h2>

          <p style={{ margin: "8px 0 0", color: COLORS.muted }}>
            {loading
              ? "Loading appointments..."
              : `${filteredAppointments.length} appointment(s) found`}
          </p>
        </div>

        {loading ? (
          <p style={{ padding: "30px", textAlign: "center", color: COLORS.muted }}>
            Loading appointments...
          </p>
        ) : filteredAppointments.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center" }}>
            <p style={{ fontWeight: 700 }}>No appointments found</p>
            <p style={{ color: COLORS.muted }}>
              Try another search or select the All status filter.
            </p>
          </div>
        ) : (
          <div style={{ display: "block", width: "100%", overflowX: "auto" }}>
            <table
              style={{
                display: "table",
                width: "100%",
                minWidth: "850px",
                borderCollapse: "collapse",
                tableLayout: "auto",
                color: COLORS.text,
                textAlign: "left",
                fontSize: "14px",
              }}
            >
              <thead style={{ display: "table-header-group", background: COLORS.header }}>
                <tr>
                  {[
                    "ID / Customer",
                    "Property",
                    "Date / Time",
                    "Purpose",
                    "Status",
                    "Payment",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "16px",
                        whiteSpace: "nowrap",
                        fontSize: "12px",
                        textTransform: "uppercase",
                        color: "#cbd5e1",
                        borderBottom: `1px solid ${COLORS.border}`,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody style={{ display: "table-row-group" }}>
                {filteredAppointments.map((item) => (
                  <tr key={item.id}>
                    <td style={cellStyle}>
                      <strong>{item.customer_name || "—"}</strong>
                      <div style={{ color: COLORS.muted, marginTop: "6px" }}>
                        #{item.id}
                        {(item.phone || item.mobile)
                          ? ` · ${item.phone || item.mobile}`
                          : ""}
                      </div>
                    </td>

                    <td style={cellStyle}>
                      {item.property_name || "Property unavailable"}
                    </td>

                    <td style={{ ...cellStyle, whiteSpace: "nowrap" }}>
                      <div>{formatDate(item.appointment_date || item.date)}</div>
                      <div style={{ color: COLORS.muted, marginTop: "6px" }}>
                        {formatTime(item.appointment_time || item.time)}
                      </div>
                    </td>

                    <td style={cellStyle}>
                      {item.purpose || item.service_type || "—"}
                    </td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: "999px",
                          background: getStatusStyle(item.status).background,
                          color: getStatusStyle(item.status).color,
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {item.status || "Pending"}
                      </span>
                    </td>

                    <td style={cellStyle}>
                      {item.payment_status || "Pending"}
                    </td>

                    <td style={cellStyle}>
                      <button
                        type="button"
                        onClick={() => setSelectedAppointment(item)}
                        style={{
                          ...buttonStyle,
                          padding: "8px 12px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Appointment details modal */}
      {selectedAppointment && (
        <div
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedAppointment(null);
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "auto",
            padding: "20px",
            background: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-detail-title"
            style={{
              width: "100%",
              maxWidth: "650px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "24px",
              border: `1px solid ${COLORS.border}`,
              borderRadius: "16px",
              background: COLORS.card,
              color: COLORS.text,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <div>
                <p style={{ color: COLORS.gold }}>
                  Appointment #{selectedAppointment.id}
                </p>
                <h2 id="appointment-detail-title" style={{ fontSize: "24px" }}>
                  Appointment Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                aria-label="Close details"
                style={{
                  ...buttonStyle,
                  fontSize: "20px",
                  padding: "4px 12px",
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              {[
                ["Customer", selectedAppointment.customer_name],
                ["Phone", selectedAppointment.phone || selectedAppointment.mobile],
                ["Property", selectedAppointment.property_name],
                ["Date", formatDate(selectedAppointment.appointment_date || selectedAppointment.date)],
                ["Time", formatTime(selectedAppointment.appointment_time || selectedAppointment.time)],
                ["Purpose", selectedAppointment.purpose || selectedAppointment.service_type],
                ["Status", selectedAppointment.status],
                ["Payment", selectedAppointment.payment_status],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    padding: "14px",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "8px",
                    background: COLORS.background,
                    overflowWrap: "anywhere",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: COLORS.muted,
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </p>
                  <p style={{ marginBottom: 0, fontWeight: 600 }}>
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "14px",
                padding: "14px",
                border: `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                background: COLORS.background,
              }}
            >
              <p style={{ color: COLORS.muted, fontSize: "12px" }}>
                REMARKS
              </p>
              <p style={{ whiteSpace: "pre-wrap" }}>
                {selectedAppointment.remarks || "No remarks"}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                style={{
                  ...buttonStyle,
                  background: COLORS.gold,
                  color: "#111827",
                }}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
