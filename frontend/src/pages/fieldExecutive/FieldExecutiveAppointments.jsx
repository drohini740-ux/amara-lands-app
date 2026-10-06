
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaCalendarAlt,
  FaSearch,
  FaEye,
  FaSync,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaBuilding,
} from "react-icons/fa";

import {
  fetchFieldExecutiveAppointments,
  fetchFieldExecutiveAppointmentById,
  updateFieldExecutiveAppointmentStatus,
  clearSelectedAppointment,
  clearAppointmentError,
  clearAppointmentSuccess,
} from "../../redux/fieldExecutiveAppointmentSlice";

const FieldExecutiveAppointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    appointments,
    selectedAppointment,
    loading,
    detailsLoading,
    actionLoading,
    error,
    detailsError,
    actionError,
    successMessage,
  } = useSelector(
    (state) =>
      state.fieldExecutiveAppointment
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [showDetails, setShowDetails] =
    useState(false);

  // =====================================================
  // LOAD APPOINTMENTS
  // =====================================================

  useEffect(() => {
    dispatch(
      fetchFieldExecutiveAppointments()
    );
  }, [dispatch]);

  // =====================================================
  // CLEAR MESSAGES
  // =====================================================

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      dispatch(clearAppointmentSuccess());
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, dispatch]);

  // =====================================================
  // FILTER APPOINTMENTS
  // =====================================================

  const filteredAppointments = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return appointments.filter(
      (appointment) => {
        const matchesSearch =
          String(
            appointment.customer_name || ""
          )
            .toLowerCase()
            .includes(searchValue) ||
          String(
            appointment.customer_phone || ""
          )
            .toLowerCase()
            .includes(searchValue) ||
          String(
            appointment.customer_email || ""
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
            appointment.service_type || ""
          )
            .toLowerCase()
            .includes(searchValue);

        const matchesStatus =
          statusFilter === "all" ||
          String(
            appointment.status || ""
          ).toLowerCase() ===
            statusFilter.toLowerCase();

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    appointments,
    search,
    statusFilter,
  ]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalAppointments =
    appointments.length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        ).toLowerCase() === "pending"
    ).length;

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        ).toLowerCase() === "confirmed"
    ).length;

  const completedAppointments =
    appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        ).toLowerCase() === "completed"
    ).length;

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(
        `${date}T00:00:00`
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "-";

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

      return date.toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return time;
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const normalized =
      String(status || "")
        .toLowerCase();

    if (normalized === "completed") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (normalized === "confirmed") {
      return {
        backgroundColor: "#DDEBFF",
        color: "#0D6EFD",
      };
    }

    if (normalized === "cancelled") {
      return {
        backgroundColor: "#F8D7DA",
        color: "#842029",
      };
    }

    return {
      backgroundColor: "#F5E8B0",
      color: "#111111",
    };
  };

  // =====================================================
  // VIEW APPOINTMENT
  // =====================================================

  const handleView = (id) => {
    dispatch(
      fetchFieldExecutiveAppointmentById(id)
    );

    setShowDetails(true);
  };

  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  const handleCloseDetails = () => {
    setShowDetails(false);

    dispatch(
      clearSelectedAppointment()
    );

    dispatch(
      clearAppointmentError()
    );
  };

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const handleStatusChange = (id, status) => {
    dispatch(
      updateFieldExecutiveAppointmentStatus({
        id,
        status,
      })
    );
  };

  // =====================================================
  // NAVIGATE TO PROPERTY
  // =====================================================

  const handleNavigate = (
    latitude,
    longitude
  ) => {
    if (
      latitude === null ||
      latitude === undefined ||
      longitude === null ||
      longitude === undefined
    ) {
      alert(
        "Property location is not available."
      );
      return;
    }

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${latitude},${longitude}` +
      `&travelmode=driving`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // RETURN
  // =====================================================

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
            View and manage appointments assigned
            to your properties.
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={() =>
            dispatch(
              fetchFieldExecutiveAppointments()
            )
          }
          disabled={loading}
          style={{
            border: "1px solid #C9A227",
            color: "#C9A227",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaSync className="me-2" />
          Refresh
        </button>
      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {/* TOTAL */}

        <div className="col-md-3">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Total
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
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Pending
                </small>

                <h3 className="mb-0 mt-2">
                  {pendingAppointments}
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

        {/* CONFIRMED */}

        <div className="col-md-3">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #0D6EFD",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Confirmed
                </small>

                <h3 className="mb-0 mt-2">
                  {confirmedAppointments}
                </h3>
              </div>

              <FaCalendarAlt
                style={{
                  color: "#0D6EFD",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* COMPLETED */}

        <div className="col-md-3">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #28a745",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Completed
                </small>

                <h3 className="mb-0 mt-2">
                  {completedAppointments}
                </h3>
              </div>

              <FaCalendarAlt
                style={{
                  color: "#28a745",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUCCESS */}
      {/* ================================================= */}

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

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
                  placeholder="Search customer, phone, email, property or service..."
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

            <div className="col-md-4">
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
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              My Appointments
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
                  fontSize: "42px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 mb-1 text-muted">
                No appointments found.
              </p>

              <small className="text-muted">
                Appointments will appear here when
                they are assigned to your properties.
              </small>
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
                      Appointment
                    </th>

                    <th>
                      Service
                    </th>

                    <th>
                      Payment
                    </th>

                    <th>
                      Status
                    </th>

                    <th className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppointments.map(
                    (appointment) => (
                      <tr
                        key={appointment.id}
                      >
                        <td className="px-3">
                          {appointment.id}
                        </td>

                        {/* CUSTOMER */}

                        <td>
                          <strong>
                            {appointment.customer_name ||
                              appointment.customer_full_name ||
                              "-"}
                          </strong>

                          <div
                            style={{
                              fontSize:
                                "12px",
                              color:
                                "#777777",
                            }}
                          >
                            <FaPhone
                              className="me-1"
                            />

                            {appointment.customer_phone ||
                              appointment.customer_mobile ||
                              "-"}
                          </div>
                        </td>

                        {/* PROPERTY */}

                        <td>
                          <strong>
                            {appointment.property_name ||
                              "-"}
                          </strong>

                          <div
                            style={{
                              fontSize:
                                "12px",
                              color:
                                "#777777",
                            }}
                          >
                            {appointment.survey_number ||
                              "-"}
                          </div>
                        </td>

                        {/* DATE / TIME */}

                        <td>
                          <strong>
                            {formatDate(
                              appointment.appointment_date
                            )}
                          </strong>

                          <div
                            style={{
                              fontSize:
                                "12px",
                              color:
                                "#777777",
                            }}
                          >
                            {formatTime(
                              appointment.appointment_time
                            )}
                          </div>
                        </td>

                        {/* SERVICE */}

                        <td>
                          {appointment.service_type ||
                            appointment.purpose ||
                            "-"}
                        </td>

                        {/* PAYMENT */}

                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                String(
                                  appointment.payment_status ||
                                    ""
                                ).toLowerCase() ===
                                "success"
                                  ? "#DFF5E3"
                                  : "#F5E8B0",

                              color:
                                String(
                                  appointment.payment_status ||
                                    ""
                                ).toLowerCase() ===
                                "success"
                                  ? "#198754"
                                  : "#111111",
                            }}
                          >
                            {appointment.payment_status ||
                              "-"}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className="badge"
                            style={
                              getStatusStyle(
                                appointment.status
                              )
                            }
                          >
                            {appointment.status ||
                              "-"}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="d-flex justify-content-center gap-2">
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
                                color:
                                  "#C9A227",
                                border:
                                  "1px solid #C9A227",
                              }}
                            >
                              <FaEye />
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm"
                              title="Navigate to Property"
                              onClick={() =>
                                handleNavigate(
                                  appointment.latitude,
                                  appointment.longitude
                                )
                              }
                              style={{
                                color:
                                  "#111111",
                                border:
                                  "1px solid #111111",
                              }}
                            >
                              <FaMapMarkerAlt />
                            </button>
                          </div>
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

      {/* ================================================= */}
      {/* DETAILS MODAL */}
      {/* ================================================= */}

      {showDetails && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              {/* HEADER */}

              <div
                className="modal-header"
                style={{
                  backgroundColor:
                    "#111111",
                  color: "#FFFFFF",
                }}
              >
                <h5 className="modal-title">
                  Appointment Details
                </h5>

                <button
                  type="button"
                  className="btn"
                  onClick={
                    handleCloseDetails
                  }
                  style={{
                    color: "#FFFFFF",
                    fontSize: "20px",
                  }}
                >
                  ×
                </button>
              </div>

              {/* BODY */}

              <div className="modal-body">
                {detailsLoading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border"
                      style={{
                        color:
                          "#C9A227",
                      }}
                    />
                  </div>
                ) : detailsError ? (
                  <div className="alert alert-danger">
                    {detailsError}
                  </div>
                ) : selectedAppointment ? (
                  <>
                    {/* CUSTOMER */}

                    <div className="mb-4">
                      <h6
                        style={{
                          color:
                            "#C9A227",
                          fontWeight:
                            "700",
                        }}
                      >
                        <FaUser className="me-2" />
                        Customer Details
                      </h6>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <small className="text-muted">
                            Name
                          </small>

                          <div>
                            <strong>
                              {selectedAppointment.customer_name ||
                                selectedAppointment.customer_full_name ||
                                "-"}
                            </strong>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <small className="text-muted">
                            Phone
                          </small>

                          <div>
                            {selectedAppointment.customer_phone ||
                              selectedAppointment.customer_mobile ||
                              "-"}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <small className="text-muted">
                            Email
                          </small>

                          <div>
                            {selectedAppointment.customer_email ||
                              "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PROPERTY */}

                    <div className="mb-4">
                      <h6
                        style={{
                          color:
                            "#C9A227",
                          fontWeight:
                            "700",
                        }}
                      >
                        <FaBuilding className="me-2" />
                        Property Details
                      </h6>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <small className="text-muted">
                            Property
                          </small>

                          <div>
                            <strong>
                              {selectedAppointment.property_name ||
                                "-"}
                            </strong>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <small className="text-muted">
                            Survey Number
                          </small>

                          <div>
                            {selectedAppointment.survey_number ||
                              "-"}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <small className="text-muted">
                            Property Type
                          </small>

                          <div>
                            {selectedAppointment.property_type ||
                              "-"}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <small className="text-muted">
                            Area
                          </small>

                          <div>
                            {selectedAppointment.area ||
                              "-"}
                          </div>
                        </div>

                        <div className="col-12">
                          <small className="text-muted">
                            Address
                          </small>

                          <div>
                            {selectedAppointment.address ||
                              "-"}
                          </div>

                          <div
                            style={{
                              color:
                                "#777777",
                              fontSize:
                                "13px",
                            }}
                          >
                            {selectedAppointment.city ||
                              ""}

                            {selectedAppointment.city &&
                            selectedAppointment.state
                              ? ", "
                              : ""}

                            {selectedAppointment.state ||
                              ""}

                            {selectedAppointment.pincode
                              ? ` - ${selectedAppointment.pincode}`
                              : ""}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* APPOINTMENT */}

                    <div className="mb-4">
                      <h6
                        style={{
                          color:
                            "#C9A227",
                          fontWeight:
                            "700",
                        }}
                      >
                        <FaCalendarAlt className="me-2" />
                        Appointment Details
                      </h6>

                      <div className="row g-3">
                        <div className="col-md-4">
                          <small className="text-muted">
                            Date
                          </small>

                          <div>
                            {formatDate(
                              selectedAppointment.appointment_date
                            )}
                          </div>
                        </div>

                        <div className="col-md-4">
                          <small className="text-muted">
                            Time
                          </small>

                          <div>
                            {formatTime(
                              selectedAppointment.appointment_time
                            )}
                          </div>
                        </div>

                        <div className="col-md-4">
                          <small className="text-muted">
                            Service
                          </small>

                          <div>
                            {selectedAppointment.service_type ||
                              selectedAppointment.purpose ||
                              "-"}
                          </div>
                        </div>

                        <div className="col-md-4">
                          <small className="text-muted">
                            Status
                          </small>

                          <div className="mt-1">
                            <span
                              className="badge"
                              style={getStatusStyle(
                                selectedAppointment.status
                              )}
                            >
                              {selectedAppointment.status ||
                                "-"}
                            </span>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <small className="text-muted">
                            Payment
                          </small>

                          <div className="mt-1">
                            <span
                              className="badge"
                              style={{
                                backgroundColor:
                                  "#F5E8B0",
                                color:
                                  "#111111",
                              }}
                            >
                              {selectedAppointment.payment_status ||
                                "-"}
                            </span>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <small className="text-muted">
                            Appointment ID
                          </small>

                          <div>
                            #
                            {
                              selectedAppointment.id
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* REMARKS */}

                    <div className="mb-4">
                      <small className="text-muted">
                        Remarks
                      </small>

                      <div className="mt-1 p-3 bg-light rounded">
                        {selectedAppointment.remarks ||
                          "No remarks available."}
                      </div>
                    </div>

                    {/* STATUS UPDATE */}

                    <div>
                      <h6
                        style={{
                          color:
                            "#C9A227",
                          fontWeight:
                            "700",
                        }}
                      >
                        Update Appointment Status
                      </h6>

                      {actionError && (
                        <div className="alert alert-danger">
                          {actionError}
                        </div>
                      )}

                      <div className="d-flex gap-2 flex-wrap">
                        {[
                          "Pending",
                          "Confirmed",
                          "Completed",
                          "Cancelled",
                        ].map(
                          (status) => (
                            <button
                              key={status}
                              type="button"
                              className="btn"
                              disabled={
                                actionLoading
                              }
                              onClick={() =>
                                handleStatusChange(
                                  selectedAppointment.id,
                                  status
                                )
                              }
                              style={{
                                border:
                                  "1px solid #C9A227",
                                color:
                                  "#111111",
                                backgroundColor:
                                  selectedAppointment.status ===
                                  status
                                    ? "#F5E8B0"
                                    : "#FFFFFF",
                              }}
                            >
                              {actionLoading &&
                              selectedAppointment.status !==
                                status
                                ? "Updating..."
                                : status}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-5 text-muted">
                    Appointment details not found.
                  </div>
                )}
              </div>

              {/* FOOTER */}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn"
                  onClick={
                    handleCloseDetails
                  }
                  style={{
                    backgroundColor:
                      "#111111",
                    color: "#FFFFFF",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldExecutiveAppointments;

