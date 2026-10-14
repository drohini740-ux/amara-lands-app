
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaRoute,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaSync,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaPlus,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import {
  fetchSecurityPatrols,
  fetchAssignedPatrolProperties,
  createSecurityPatrol,
  updateSecurityPatrol,
  deleteSecurityPatrol,
  clearSecurityPatrolErrors,
  resetCreateSecurityPatrol,
  resetUpdateSecurityPatrol,
} from "../../redux/securityPatrolSlice";

const SecurityPatrols = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    patrols = [],
    loading,
    error,
    createLoading,
    createError,
    updateLoading,
    updateError,
    deleteLoading,
    deleteError,
    assignedProperties = [],
    assignedPropertiesLoading,
    assignedPropertiesError,
  } = useSelector((state) => state.securityPatrol);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editingPatrol, setEditingPatrol] = useState(null);

  const initialForm = {
    property_id: "",
    patrol_date: "",
    check_in: "",
    check_out: "",
    patrol_status: "Pending",
    remarks: "",
  };

  const [form, setForm] = useState(initialForm);

  // =====================================================
  // FETCH DATA
  // =====================================================

  useEffect(() => {
    dispatch(fetchSecurityPatrols());

    return () => {
      dispatch(clearSecurityPatrolErrors());
    };
  }, [dispatch]);

  useEffect(() => {
    if (showAddModal || showEditModal) {
      dispatch(fetchAssignedPatrolProperties());
    }
  }, [showAddModal, showEditModal, dispatch]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const summary = useMemo(() => {
    const total = patrols.length;

    const completed = patrols.filter(
      (p) => String(p.patrol_status).toLowerCase() === "completed"
    ).length;

    const pending = patrols.filter(
      (p) => String(p.patrol_status).toLowerCase() === "pending"
    ).length;

    const inProgress = patrols.filter(
      (p) => String(p.patrol_status).toLowerCase() === "in progress"
    ).length;

    return { total, completed, pending, inProgress };
  }, [patrols]);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredPatrols = useMemo(() => {
    const term = search.toLowerCase();

    return patrols.filter((p) => {
      const matchesSearch = [
        p.patrol_id,
        p.property_id,
        p.property_name,
        p.survey_number,
        p.city,
        p.patrol_status,
        p.remarks,
      ].some((value) =>
        String(value || "").toLowerCase().includes(term)
      );

      const matchesStatus =
        statusFilter === "all" ||
        String(p.patrol_status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [patrols, search, statusFilter]);

  // =====================================================
  // FORM HANDLERS
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingPatrol(null);
    setForm(initialForm);
    dispatch(resetCreateSecurityPatrol());
    dispatch(resetUpdateSecurityPatrol());
  };

  const openAddModal = () => {
    setForm(initialForm);
    dispatch(clearSecurityPatrolErrors());
    setShowAddModal(true);
  };

  // =====================================================
  // CREATE PATROL
  // =====================================================

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.property_id || !form.patrol_date) {
      window.alert("Please select a property and patrol date.");
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
      createSecurityPatrol({
        ...form,
        property_id: Number(form.property_id),
        check_in: form.check_in || null,
        check_out: form.check_out || null,
        remarks: form.remarks.trim(),
      })
    );

    if (createSecurityPatrol.fulfilled.match(result)) {
      window.alert("Patrol created successfully.");
      closeModals();
      dispatch(fetchSecurityPatrols());
    }
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (patrol) => {
    const patrolId = patrol.patrol_id ?? patrol.id;

    setEditingPatrol({
      ...patrol,
      patrol_id: patrolId,
    });

    setForm({
      property_id: String(patrol.property_id || ""),
      patrol_date: patrol.patrol_date
        ? String(patrol.patrol_date).slice(0, 10)
        : "",
      check_in: patrol.check_in
        ? String(patrol.check_in).slice(0, 5)
        : "",
      check_out: patrol.check_out
        ? String(patrol.check_out).slice(0, 5)
        : "",
      patrol_status: patrol.patrol_status || "Pending",
      remarks: patrol.remarks || "",
    });

    dispatch(clearSecurityPatrolErrors());
    setShowEditModal(true);
  };

  // =====================================================
  // UPDATE PATROL
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingPatrol) return;

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
        id: editingPatrol.patrol_id,
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
      window.alert("Patrol updated successfully.");
      closeModals();
      dispatch(fetchSecurityPatrols());
    }
  };

  // =====================================================
  // DELETE PATROL
  // =====================================================

  const handleDelete = async (patrol) => {
    const patrolId = patrol.patrol_id ?? patrol.id;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete patrol #${patrolId}?`
    );

    if (!confirmed) return;

    const result = await dispatch(deleteSecurityPatrol(patrolId));

    if (deleteSecurityPatrol.fulfilled.match(result)) {
      window.alert("Patrol deleted successfully.");
      dispatch(fetchSecurityPatrols());
    } else {
      window.alert(result.payload || "Unable to delete patrol.");
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "completed") {
      return { backgroundColor: "#DFF5E3", color: "#198754" };
    }

    if (value === "in progress") {
      return { backgroundColor: "#CFE2FF", color: "#084298" };
    }

    if (value === "cancelled") {
      return { backgroundColor: "#F8D7DA", color: "#842029" };
    }

    return { backgroundColor: "#FFF3CD", color: "#856404" };
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parts = String(date).slice(0, 10).split("-");

    return parts.length === 3
      ? `${parts[2]}/${parts[1]}/${parts[0]}`
      : String(date);
  };

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
  // REUSABLE FORM FIELDS
  // =====================================================

  const renderPatrolForm = (onSubmit, isEditing) => (
    <form onSubmit={onSubmit}>
      <div className="modal-body">
        {isEditing && (
          <div className="alert alert-light border">
            Editing patrol #{editingPatrol?.patrol_id} —{" "}
            {editingPatrol?.property_name || "Assigned property"}
          </div>
        )}

        {!isEditing && (
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Assigned Property *
            </label>

            <select
              className="form-select"
              name="property_id"
              value={form.property_id}
              onChange={handleChange}
              required
              disabled={assignedPropertiesLoading}
            >
              <option value="">
                {assignedPropertiesLoading
                  ? "Loading assigned properties..."
                  : "Select assigned property"}
              </option>

              {assignedProperties.map((property) => (
                <option
                  key={property.property_id}
                  value={property.property_id}
                >
                  {property.property_name} — Survey:{" "}
                  {property.survey_number} (ID: {property.property_id})
                </option>
              ))}
            </select>
          </div>
        )}

        {assignedPropertiesError && (
          <div className="alert alert-danger">
            {assignedPropertiesError}

            <button
              type="button"
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={() => dispatch(fetchAssignedPatrolProperties())}
            >
              Retry
            </button>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Patrol Date *
          </label>

          <input
            type="date"
            className="form-control"
            name="patrol_date"
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
              className="form-control"
              name="check_in"
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
              className="form-control"
              name="check_out"
              value={form.check_out}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Patrol Status *
          </label>

          <select
            className="form-select"
            name="patrol_status"
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
            className="form-control"
            name="remarks"
            rows="3"
            value={form.remarks}
            onChange={handleChange}
            placeholder="Enter patrol remarks..."
          />
        </div>

        {isEditing && updateError && (
          <div className="alert alert-danger">
            {updateError}
          </div>
        )}

        {!isEditing && createError && (
          <div className="alert alert-danger">
            {createError}
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={closeModals}
        >
          <FaTimes className="me-2" />
          Cancel
        </button>

        <button
          type="submit"
          className="btn"
          disabled={
            isEditing
              ? updateLoading
              : createLoading ||
                assignedPropertiesLoading ||
                assignedProperties.length === 0
          }
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
            border: "1px solid #C9A227",
          }}
        >
          <FaSave className="me-2" />
          {isEditing
            ? updateLoading
              ? "Saving..."
              : "Save Changes"
            : createLoading
              ? "Creating..."
              : "Create Patrol"}
        </button>
      </div>
    </form>
  );

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div>
      {/* HEADER */}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="mb-1 fw-bold" style={{ color: "#111111" }}>
            Security Patrol Management
          </h3>

          <p className="mb-0 text-muted">
            Schedule, view, edit and manage security patrols.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn"
            onClick={() => dispatch(fetchSecurityPatrols())}
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

          <button
            type="button"
            className="btn"
            onClick={openAddModal}
            style={{
              backgroundColor: "#111111",
              color: "#FFFFFF",
              border: "1px solid #C9A227",
            }}
          >
            <FaPlus className="me-2" />
            Add Patrol
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div className="row g-3 mb-4">
        {[
          {
            title: "Total Patrols",
            value: summary.total,
            icon: <FaRoute />,
            color: "#C9A227",
          },
          {
            title: "Completed",
            value: summary.completed,
            icon: <FaCheckCircle />,
            color: "#198754",
          },
          {
            title: "Pending",
            value: summary.pending,
            icon: <FaClock />,
            color: "#856404",
          },
          {
            title: "In Progress",
            value: summary.inProgress,
            icon: <FaBuilding />,
            color: "#0D6EFD",
          },
        ].map((card) => (
          <div className="col-md-6 col-xl-3" key={card.title}>
            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderLeft: `4px solid ${card.color}` }}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">{card.title}</small>
                  <h3 className="mt-2 mb-0">{card.value}</h3>
                </div>

                <span style={{ fontSize: 28, color: card.color }}>
                  {card.icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH AND FILTER */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch style={{ color: "#C9A227" }} />
                </span>

                <input
                  className="form-control"
                  placeholder="Search property, survey number, status or remarks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ERRORS */}

      {error && (
        <div className="alert alert-danger">
          {error}

          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={() => dispatch(fetchSecurityPatrols())}
          >
            Retry
          </button>
        </div>
      )}

      {deleteError && (
        <div className="alert alert-danger">
          {deleteError}
        </div>
      )}

      {/* PATROL TABLE */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <strong>Patrol Records</strong>

          <span className="text-muted small">
            Showing {filteredPatrols.length} patrols
          </span>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{ color: "#C9A227" }}
              />
              <p className="mt-3 mb-0">Loading patrols...</p>
            </div>
          ) : filteredPatrols.length === 0 ? (
            <div className="text-center py-5">
              <FaRoute style={{ fontSize: 40, color: "#CCCCCC" }} />
              <p className="text-muted mt-3">No patrols found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead style={{ backgroundColor: "#111111", color: "#FFFFFF" }}>
                  <tr>
                    <th className="px-3">ID</th>
                    <th>Property</th>
                    <th>Survey Number</th>
                    <th>Date</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPatrols.map((patrol) => {
                    const id = patrol.patrol_id ?? patrol.id;

                    return (
                      <tr key={id}>
                        <td className="px-3">{id}</td>

                        <td>
                          <strong>{patrol.property_name || "-"}</strong>

                          <div className="small text-muted">
                            <FaBuilding className="me-1" />
                            {patrol.city || "-"}
                          </div>
                        </td>

                        <td>{patrol.survey_number || "-"}</td>

                        <td style={{ whiteSpace: "nowrap" }}>
                          <FaCalendarAlt
                            className="me-2"
                            style={{ color: "#C9A227" }}
                          />
                          {formatDate(patrol.patrol_date)}
                        </td>

                        <td>{formatTime(patrol.check_in)}</td>

                        <td>{formatTime(patrol.check_out)}</td>

                        <td>
                          <span
                            className="badge"
                            style={getStatusStyle(patrol.patrol_status)}
                          >
                            {patrol.patrol_status || "Pending"}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              type="button"
                              className="btn btn-sm"
                              title="View patrol"
                              onClick={() =>
                                navigate(`/security/patrols/${id}`)
                              }
                              style={{
                                color: "#C9A227",
                                border: "1px solid #C9A227",
                              }}
                            >
                              <FaEye />
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm"
                              title="Edit patrol"
                              onClick={() => openEditModal(patrol)}
                              style={{
                                color: "#C9A227",
                                border: "1px solid #C9A227",
                              }}
                            >
                              <FaEdit />
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm"
                              title="Delete patrol"
                              onClick={() => handleDelete(patrol)}
                              disabled={deleteLoading}
                              style={{
                                color: "#C9A227",
                                border: "1px solid #C9A227",
                              }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD PATROL MODAL */}

      {showAddModal && (
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
                style={{ backgroundColor: "#111111", color: "#FFFFFF" }}
              >
                <h5 className="modal-title">
                  <FaPlus className="me-2" />
                  Add Patrol
                </h5>

                <button
                  type="button"
                  className="btn"
                  onClick={closeModals}
                  style={{ color: "#FFFFFF" }}
                >
                  <FaTimes />
                </button>
              </div>

              {renderPatrolForm(handleCreate, false)}
            </div>
          </div>
        </div>
      )}

      {/* EDIT PATROL MODAL */}

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
                style={{ backgroundColor: "#111111", color: "#FFFFFF" }}
              >
                <h5 className="modal-title">
                  <FaEdit className="me-2" />
                  Edit Patrol
                </h5>

                <button
                  type="button"
                  className="btn"
                  onClick={closeModals}
                  style={{ color: "#FFFFFF" }}
                >
                  <FaTimes />
                </button>
              </div>

              {renderPatrolForm(handleUpdate, true)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPatrols;

