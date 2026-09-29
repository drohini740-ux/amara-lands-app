import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSuperAdminAppointments,
  fetchSuperAdminAppointmentById,
  updateSuperAdminAppointmentStatus,
  updateSuperAdminAppointmentRemarks,
  clearSelectedAppointment,
} from "../../redux/superAdminAppointmentSlice";

const SuperAdminAppointments = () => {
  const dispatch = useDispatch();

  const {
    appointments,
    selectedAppointment,
    loading,
    updateLoading,
    error,
  } = useSelector((state) => state.superAdminAppointment);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTab, setSelectedTab] = useState("Appointments");
  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    dispatch(fetchSuperAdminAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (selectedAppointment) {
      setRemarks(selectedAppointment.remarks || "");
    }
  }, [selectedAppointment]);

  // ==========================================
  // FILTER APPOINTMENTS
  // ==========================================
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        appointment.customer_name
          ?.toLowerCase()
          .includes(searchText) ||
        appointment.phone
          ?.toLowerCase()
          .includes(searchText) ||
        appointment.property_name
          ?.toLowerCase()
          .includes(searchText) ||
        appointment.survey_number
          ?.toLowerCase()
          .includes(searchText) ||
        appointment.purpose
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  // ==========================================
  // SUMMARY
  // ==========================================
  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (item) => item.status === "Pending"
  ).length;

  const confirmedAppointments = appointments.filter(
    (item) => item.status === "Confirmed"
  ).length;

  const completedAppointments = appointments.filter(
    (item) => item.status === "Completed"
  ).length;

  const cancelledAppointments = appointments.filter(
    (item) => item.status === "Cancelled"
  ).length;

  // ==========================================
  // VIEW APPOINTMENT
  // ==========================================
  const handleView = async (id) => {
    const result = await dispatch(
      fetchSuperAdminAppointmentById(id)
    );

    if (
      fetchSuperAdminAppointmentById.fulfilled.match(result)
    ) {
      setShowModal(true);
    }
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================
  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(clearSelectedAppointment());
  };

  // ==========================================
  // UPDATE STATUS
  // ==========================================
  const handleStatusChange = async (id, status) => {
    await dispatch(
      updateSuperAdminAppointmentStatus({
        id,
        status,
      })
    );
  };

  // ==========================================
  // SAVE REMARKS
  // ==========================================
  const handleSaveRemarks = async () => {
    if (!selectedAppointment) return;

    const result = await dispatch(
      updateSuperAdminAppointmentRemarks({
        id: selectedAppointment.id,
        remarks,
      })
    );

    if (
      updateSuperAdminAppointmentRemarks.fulfilled.match(result)
    ) {
      setShowModal(false);
      dispatch(clearSelectedAppointment());
    }
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // TIME FORMAT
  // ==========================================
  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================
  const getStatusStyle = (status) => {
    if (status === "Confirmed") {
      return {
        background: "#E8F5E9",
        color: "#2E7D32",
      };
    }

    if (status === "Completed") {
      return {
        background: "#E3F2FD",
        color: "#1565C0",
      };
    }

    if (status === "Cancelled") {
      return {
        background: "#FFEBEE",
        color: "#C62828",
      };
    }

    return {
      background: "#FFF8E1",
      color: "#9A7600",
    };
  };

  // ==========================================
  // STYLES
  // ==========================================
  const pageStyle = {
    padding: "28px",
    background: "#F5F5F5",
    minHeight: "100vh",
  };

  const cardStyle = {
    background: "#FFFFFF",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #E5E5E5",
    boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
  };

  const summaryGrid = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  };

  const tableContainer = {
    background: "#FFFFFF",
    borderRadius: "12px",
    border: "1px solid #E5E5E5",
    overflow: "hidden",
  };

  const thStyle = {
    padding: "14px 12px",
    textAlign: "left",
    background: "#111111",
    color: "#D4AF37",
    fontSize: "13px",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "13px 12px",
    borderBottom: "1px solid #EEEEEE",
    fontSize: "13px",
    color: "#333333",
    verticalAlign: "middle",
  };

  const buttonStyle = {
    border: "none",
    borderRadius: "6px",
    padding: "7px 12px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  };

  return (
    <div style={pageStyle}>
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              color: "#111111",
            }}
          >
            Appointment Management
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#777777",
              fontSize: "14px",
            }}
          >
            Manage and monitor all customer appointments
          </p>
        </div>

        <div
          style={{
            background: "#111111",
            color: "#D4AF37",
            padding: "9px 16px",
            borderRadius: "7px",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.5px",
          }}
        >
          SUPER ADMIN
        </div>
      </div>

      {/* ====================================== */}
      {/* SUMMARY CARDS */}
      {/* ====================================== */}
      <div style={summaryGrid}>
        {[
          {
            title: "Total Appointments",
            value: totalAppointments,
          },
          {
            title: "Pending",
            value: pendingAppointments,
          },
          {
            title: "Confirmed",
            value: confirmedAppointments,
          },
          {
            title: "Completed",
            value: completedAppointments,
          },
          {
            title: "Cancelled",
            value: cancelledAppointments,
          },
        ].map((item) => (
          <div key={item.title} style={cardStyle}>
            <div
              style={{
                fontSize: "12px",
                color: "#777777",
                marginBottom: "8px",
              }}
            >
              {item.title}
            </div>

            <div
              style={{
                fontSize: "26px",
                fontWeight: "700",
                color: "#111111",
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* ====================================== */}
      {/* TABS */}
      {/* ====================================== */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "18px",
          flexWrap: "wrap",
        }}
      >
        {["Appointments"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            style={{
              ...buttonStyle,
              background:
                selectedTab === tab
                  ? "#111111"
                  : "#FFFFFF",
              color:
                selectedTab === tab
                  ? "#D4AF37"
                  : "#555555",
              border:
                selectedTab === tab
                  ? "1px solid #111111"
                  : "1px solid #DDDDDD",
              padding: "10px 18px",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ====================================== */}
      {/* FILTERS */}
      {/* ====================================== */}
      <div
        style={{
          ...cardStyle,
          marginBottom: "18px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search customer, phone, property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: "240px",
            padding: "11px 13px",
            border: "1px solid #D5D5D5",
            borderRadius: "7px",
            outline: "none",
            fontSize: "13px",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            minWidth: "160px",
            padding: "11px 13px",
            border: "1px solid #D5D5D5",
            borderRadius: "7px",
            background: "#FFFFFF",
            fontSize: "13px",
          }}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* ====================================== */}
      {/* ERROR */}
      {/* ====================================== */}
      {error && (
        <div
          style={{
            background: "#FFEBEE",
            color: "#C62828",
            padding: "12px 15px",
            borderRadius: "7px",
            marginBottom: "18px",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {/* ====================================== */}
      {/* TABLE */}
      {/* ====================================== */}
      <div style={tableContainer}>
        {loading ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#777777",
            }}
          >
            Loading appointments...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#777777",
            }}
          >
            No appointments found.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1250px",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Property</th>
                  <th style={thStyle}>Purpose</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Time</th>
                  <th style={thStyle}>Payment</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td style={tdStyle}>
                      #{appointment.id}
                    </td>

                    <td style={tdStyle}>
                      <strong>
                        {appointment.customer_name}
                      </strong>

                      {appointment.user_email && (
                        <div
                          style={{
                            color: "#888888",
                            fontSize: "11px",
                            marginTop: "3px",
                          }}
                        >
                          {appointment.user_email}
                        </div>
                      )}
                    </td>

                    <td style={tdStyle}>
                      {appointment.phone || "-"}
                    </td>

                    <td style={tdStyle}>
                      <strong>
                        {appointment.property_name || "-"}
                      </strong>

                      <div
                        style={{
                          color: "#888888",
                          fontSize: "11px",
                          marginTop: "3px",
                        }}
                      >
                        {appointment.survey_number || "-"}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {appointment.purpose || "-"}
                    </td>

                    <td style={tdStyle}>
                      {formatDate(
                        appointment.appointment_date
                      )}
                    </td>

                    <td style={tdStyle}>
                      {formatTime(
                        appointment.appointment_time
                      )}
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...getStatusStyle(
                            appointment.payment_status
                          ),
                          padding: "5px 9px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        {appointment.payment_status || "-"}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <select
                        value={appointment.status || "Pending"}
                        disabled={updateLoading}
                        onChange={(e) =>
                          handleStatusChange(
                            appointment.id,
                            e.target.value
                          )
                        }
                        style={{
                          border: "1px solid #D5D5D5",
                          borderRadius: "6px",
                          padding: "6px 8px",
                          fontSize: "12px",
                          background: "#FFFFFF",
                          minWidth: "115px",
                        }}
                      >
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
                    </td>

                    <td style={tdStyle}>
                      <button
                        onClick={() =>
                          handleView(appointment.id)
                        }
                        style={{
                          ...buttonStyle,
                          background: "#111111",
                          color: "#D4AF37",
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ====================================== */}
      {/* VIEW MODAL */}
      {/* ====================================== */}
      {showModal && selectedAppointment && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              width: "100%",
              maxWidth: "720px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "14px",
              boxShadow: "0 15px 50px rgba(0,0,0,0.25)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "#111111",
                color: "#FFFFFF",
                padding: "18px 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#D4AF37",
                    fontSize: "11px",
                    fontWeight: "700",
                    marginBottom: "4px",
                  }}
                >
                  APPOINTMENT DETAILS
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "20px",
                  }}
                >
                  Appointment #{selectedAppointment.id}
                </h2>
              </div>

              <button
                onClick={handleCloseModal}
                style={{
                  background: "transparent",
                  border: "1px solid #555555",
                  color: "#FFFFFF",
                  borderRadius: "6px",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "22px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                }}
              >
                {[
                  [
                    "Customer Name",
                    selectedAppointment.customer_name,
                  ],
                  [
                    "Phone",
                    selectedAppointment.phone,
                  ],
                  [
                    "User Email",
                    selectedAppointment.user_email,
                  ],
                  [
                    "Property",
                    selectedAppointment.property_name,
                  ],
                  [
                    "Survey Number",
                    selectedAppointment.survey_number,
                  ],
                  [
                    "Property Type",
                    selectedAppointment.property_type,
                  ],
                  [
                    "Area",
                    selectedAppointment.area,
                  ],
                  [
                    "City",
                    selectedAppointment.city,
                  ],
                  [
                    "State",
                    selectedAppointment.state,
                  ],
                  [
                    "Pincode",
                    selectedAppointment.pincode,
                  ],
                  [
                    "Purpose",
                    selectedAppointment.purpose,
                  ],
                  [
                    "Service Type",
                    selectedAppointment.service_type,
                  ],
                  [
                    "Appointment Date",
                    formatDate(
                      selectedAppointment.appointment_date
                    ),
                  ],
                  [
                    "Appointment Time",
                    formatTime(
                      selectedAppointment.appointment_time
                    ),
                  ],
                  [
                    "Payment Status",
                    selectedAppointment.payment_status,
                  ],
                  [
                    "Status",
                    selectedAppointment.status,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      background: "#F8F8F8",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #EEEEEE",
                    }}
                  >
                    <div
                      style={{
                        color: "#888888",
                        fontSize: "11px",
                        marginBottom: "5px",
                      }}
                    >
                      {label}
                    </div>

                    <div
                      style={{
                        color: "#222222",
                        fontSize: "13px",
                        fontWeight: "600",
                        wordBreak: "break-word",
                      }}
                    >
                      {value || "-"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Remarks */}
              <div style={{ marginTop: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "700",
                    marginBottom: "7px",
                    color: "#333333",
                  }}
                >
                  Remarks
                </label>

                <textarea
                  value={remarks}
                  onChange={(e) =>
                    setRemarks(e.target.value)
                  }
                  rows={4}
                  placeholder="Enter appointment remarks..."
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    resize: "vertical",
                    border: "1px solid #D5D5D5",
                    borderRadius: "8px",
                    padding: "11px",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={handleCloseModal}
                  style={{
                    ...buttonStyle,
                    background: "#EEEEEE",
                    color: "#333333",
                    padding: "10px 18px",
                  }}
                >
                  Close
                </button>

                <button
                  onClick={handleSaveRemarks}
                  disabled={updateLoading}
                  style={{
                    ...buttonStyle,
                    background: "#111111",
                    color: "#D4AF37",
                    padding: "10px 18px",
                    opacity: updateLoading ? 0.6 : 1,
                  }}
                >
                  {updateLoading
                    ? "Saving..."
                    : "Save Remarks"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminAppointments;