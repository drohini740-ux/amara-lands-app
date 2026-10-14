
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaRoute,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaClipboardList,
  FaInfoCircle,
  FaSync,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import {
  fetchSecurityPatrolById,
  updateSecurityPatrol,
  deleteSecurityPatrol,
  clearSelectedPatrol,
  clearSecurityPatrolErrors,
  resetUpdateSecurityPatrol,
} from "../../redux/securityPatrolSlice";

const SecurityPatrolDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectedPatrol,
    detailsLoading,
    detailsError,
    updateLoading,
    updateError,
    deleteLoading,
    deleteError,
  } = useSelector((state) => state.securityPatrol);

  const [showEditModal, setShowEditModal] = useState(false);

  const [form, setForm] = useState({
    patrol_date: "",
    check_in: "",
    check_out: "",
    patrol_status: "Pending",
    remarks: "",
  });

  // =====================================================
  // FETCH PATROL DETAILS
  // =====================================================

  useEffect(() => {
    if (id) {
      dispatch(fetchSecurityPatrolById(id));
    }

    return () => {
      dispatch(clearSelectedPatrol());
    };
  }, [dispatch, id]);

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleOpenEdit = () => {
    if (!selectedPatrol) return;

    setForm({
      patrol_date: selectedPatrol.patrol_date
        ? String(selectedPatrol.patrol_date).slice(0, 10)
        : "",
      check_in: selectedPatrol.check_in
        ? String(selectedPatrol.check_in).slice(0, 5)
        : "",
      check_out: selectedPatrol.check_out
        ? String(selectedPatrol.check_out).slice(0, 5)
        : "",
      patrol_status: selectedPatrol.patrol_status || "Pending",
      remarks: selectedPatrol.remarks || "",
    });

    dispatch(clearSecurityPatrolErrors());
    dispatch(resetUpdateSecurityPatrol());
    setShowEditModal(true);
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // UPDATE PATROL
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.patrol_date) {
      window.alert("Please select a patrol date.");
      return;
    }

    if (
      form.check_in &&
      form.check_out &&
      form.check_out <= form.check_in
    ) {
      window.alert("Check-out time must be later than check-in time.");
      return;
    }

    const result = await dispatch(
      updateSecurityPatrol({
        id,
        patrolData: {
          patrol_date: form.patrol_date,
          check_in: form.check_in || null,
          check_out: form.check_out || null,
          patrol_status: form.patrol_status,
          remarks: form.remarks.trim(),
        },
      })
    );

    if (updateSecurityPatrol.fulfilled.match(result)) {
      setShowEditModal(false);

      await dispatch(fetchSecurityPatrolById(id));

      window.alert("Patrol updated successfully.");
    }
  };

  // =====================================================
  // DELETE PATROL
  // =====================================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete patrol #${id}?`
    );

    if (!confirmed) return;

    const result = await dispatch(deleteSecurityPatrol(id));

    if (deleteSecurityPatrol.fulfilled.match(result)) {
      window.alert("Patrol deleted successfully.");
      navigate("/security/patrols", { replace: true });
    }
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    dispatch(fetchSecurityPatrolById(id));
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parts = String(date).slice(0, 10).split("-");

    return parts.length === 3
      ? `${parts[2]}/${parts[1]}/${parts[0]}`
      : String(date);
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] = String(time).split(":");
    const hour = Number(hours);

    if (!Number.isFinite(hour)) return String(time);

    return `${hour % 12 || 12}:${minutes || "00"} ${
      hour >= 12 ? "PM" : "AM"
    }`;
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "completed") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (value === "in progress") {
      return {
        backgroundColor: "#CFE2FF",
        color: "#084298",
      };
    }

    if (value === "cancelled") {
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
  // INFORMATION FIELD
  // =====================================================

  const InfoField = ({ label, value, icon }) => (
    <div className="col-md-6 mb-4">
      <small className="text-muted d-block mb-1">
        {label}
      </small>

      <div
        className="fw-semibold"
        style={{
          color: "#222222",
          overflowWrap: "anywhere",
        }}
      >
        {icon && (
          <span
            className="me-2"
            style={{ color: "#C9A227" }}
          >
            {icon}
          </span>
        )}

        {value === null || value === undefined || value === ""
          ? "-"
          : value}
      </div>
    </div>
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (detailsLoading && !selectedPatrol) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{ color: "#C9A227" }}
        />

        <p className="text-muted mt-3">
          Loading patrol details...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (detailsError && !selectedPatrol) {
    return (
      <div>
        <button
          type="button"
          className="btn mb-4"
          onClick={() => navigate("/security/patrols")}
          style={{
            border: "1px solid #111111",
            color: "#111111",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Patrols
        </button>

        <div className="alert alert-danger">
          {detailsError}

          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={handleRefresh}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!selectedPatrol) {
    return (
      <div className="text-center py-5">
        <FaRoute
          style={{
            fontSize: 45,
            color: "#CCCCCC",
          }}
        />

        <h5 className="mt-3">Patrol not found</h5>

        <button
          type="button"
          className="btn mt-3"
          onClick={() => navigate("/security/patrols")}
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Patrols
        </button>
      </div>
    );
  }

  const patrol = selectedPatrol;

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div>
      {/* HEADER */}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <button
          type="button"
          className="btn"
          onClick={() => navigate("/security/patrols")}
          style={{
            border: "1px solid #111111",
            color: "#111111",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaArrowLeft className="me-2" />
          Back to Patrols
        </button>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn"
            onClick={handleRefresh}
            disabled={detailsLoading}
            style={{
              border: "1px solid #C9A227",
              color: "#C9A227",
              backgroundColor: "#FFFFFF",
            }}
          >
            <FaSync className="me-2" />
            Refresh
          </button>

          <button
            type="button"
            className="btn"
            onClick={handleOpenEdit}
            style={{
              backgroundColor: "#111111",
              color: "#FFFFFF",
              border: "1px solid #C9A227",
            }}
          >
            <FaEdit className="me-2" />
            Edit Patrol
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            <FaTrash className="me-2" />
            {deleteLoading ? "Deleting..." : "Delete Patrol"}
          </button>
        </div>
      </div>

      {deleteError && (
        <div className="alert alert-danger">
          {deleteError}
        </div>
      )}

      {/* TITLE */}

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-body p-4"
          style={{ borderLeft: "5px solid #C9A227" }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
            <div>
              <div
                className="mb-2"
                style={{
                  color: "#C9A227",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                SECURITY PATROL DETAILS
              </div>

              <h3
                className="mb-2 fw-bold"
                style={{ color: "#111111" }}
              >
                Patrol #{patrol.patrol_id ?? patrol.id}
              </h3>

              <p className="text-muted mb-0">
                {patrol.property_name || "Assigned Property"}
              </p>
            </div>

            <span
              className="badge px-3 py-2"
              style={getStatusStyle(patrol.patrol_status)}
            >
              {patrol.patrol_status || "Pending"}
            </span>
          </div>
        </div>
      </div>

      {/* PROPERTY INFORMATION */}

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header bg-white py-3"
          style={{ borderBottom: "2px solid #C9A227" }}
        >
          <strong>
            <FaBuilding
              className="me-2"
              style={{ color: "#C9A227" }}
            />
            Property Information
          </strong>
        </div>

        <div className="card-body p-4">
          <div className="row">
            <InfoField
              label="Property Name"
              value={patrol.property_name}
              icon={<FaBuilding />}
            />

            <InfoField
              label="Property ID"
              value={patrol.property_id}
            />

            <InfoField
              label="Survey Number"
              value={patrol.survey_number}
            />

            <InfoField
              label="Property Type"
              value={patrol.property_type}
            />

            <InfoField
              label="Area"
              value={
                patrol.area !== null &&
                patrol.area !== undefined &&
                patrol.area !== ""
                  ? `${patrol.area} acres`
                  : "-"
              }
            />

            <InfoField
              label="Verification Status"
              value={patrol.verification_status}
            />
          </div>
        </div>
      </div>

      {/* LOCATION */}

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header bg-white py-3"
          style={{ borderBottom: "2px solid #C9A227" }}
        >
          <strong>
            <FaMapMarkerAlt
              className="me-2"
              style={{ color: "#C9A227" }}
            />
            Location Information
          </strong>
        </div>

        <div className="card-body p-4">
          <div className="row">
            <InfoField
              label="Address"
              value={patrol.address}
              icon={<FaMapMarkerAlt />}
            />

            <InfoField
              label="City"
              value={patrol.city}
            />

            <InfoField
              label="State"
              value={patrol.state}
            />

            <InfoField
              label="Pincode"
              value={patrol.pincode}
            />

            <InfoField
              label="Latitude"
              value={patrol.latitude}
            />

            <InfoField
              label="Longitude"
              value={patrol.longitude}
            />
          </div>
        </div>
      </div>

      {/* PATROL SCHEDULE */}

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header bg-white py-3"
          style={{ borderBottom: "2px solid #C9A227" }}
        >
          <strong>
            <FaCalendarAlt
              className="me-2"
              style={{ color: "#C9A227" }}
            />
            Patrol Schedule
          </strong>
        </div>

        <div className="card-body p-4">
          <div className="row">
            <InfoField
              label="Patrol Date"
              value={formatDate(patrol.patrol_date)}
              icon={<FaCalendarAlt />}
            />

            <InfoField
              label="Check-in"
              value={formatTime(patrol.check_in)}
              icon={<FaClock />}
            />

            <InfoField
              label="Check-out"
              value={formatTime(patrol.check_out)}
              icon={<FaClock />}
            />

            <InfoField
              label="Patrol Status"
              value={patrol.patrol_status}
              icon={<FaCheckCircle />}
            />

            <InfoField
              label="Patrol Created By User ID"
              value={patrol.patrol_user_id}
            />

            <InfoField
              label="Created At"
              value={patrol.created_at
                ? new Date(patrol.created_at).toLocaleString("en-IN")
                : "-"}
            />
          </div>
        </div>
      </div>

      {/* REMARKS */}

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header bg-white py-3"
          style={{ borderBottom: "2px solid #C9A227" }}
        >
          <strong>
            <FaClipboardList
              className="me-2"
              style={{ color: "#C9A227" }}
            />
            Patrol Remarks
          </strong>
        </div>

        <div className="card-body p-4">
          <div
            className="rounded p-3"
            style={{
              backgroundColor: "#F8F9FA",
              minHeight: 90,
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
            }}
          >
            {patrol.remarks || "No remarks have been added."}
          </div>
        </div>
      </div>

      {/* INFORMATION NOTE */}

      <div
        className="alert"
        style={{
          backgroundColor: "#FFFDF5",
          border: "1px solid #E6D48A",
          color: "#555555",
        }}
      >
        <FaInfoCircle
          className="me-2"
          style={{ color: "#C9A227" }}
        />
        Patrol details are retrieved from the Security Patrol API.
      </div>

      {/* EDIT MODAL */}

      {showEditModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{
                  backgroundColor: "#111111",
                  color: "#FFFFFF",
                }}
              >
                <h5 className="modal-title">
                  <FaEdit className="me-2" />
                  Edit Patrol #{patrol.patrol_id ?? patrol.id}
                </h5>

                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowEditModal(false)}
                  style={{ color: "#FFFFFF" }}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Patrol Date *
                    </label>

                    <input
                      type="date"
                      name="patrol_date"
                      className="form-control"
                      value={form.patrol_date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Check-in Time
                      </label>

                      <input
                        type="time"
                        name="check_in"
                        className="form-control"
                        value={form.check_in}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Check-out Time
                      </label>

                      <input
                        type="time"
                        name="check_out"
                        className="form-control"
                        value={form.check_out}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Status *
                    </label>

                    <select
                      name="patrol_status"
                      className="form-select"
                      value={form.patrol_status}
                      onChange={handleChange}
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Remarks
                    </label>

                    <textarea
                      name="remarks"
                      className="form-control"
                      rows="4"
                      value={form.remarks}
                      onChange={handleChange}
                      placeholder="Enter patrol remarks..."
                    />
                  </div>

                  {updateError && (
                    <div className="alert alert-danger">
                      {updateError}
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn"
                    disabled={updateLoading}
                    style={{
                      backgroundColor: "#111111",
                      color: "#FFFFFF",
                      border: "1px solid #C9A227",
                    }}
                  >
                    <FaSave className="me-2" />
                    {updateLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPatrolDetails;
