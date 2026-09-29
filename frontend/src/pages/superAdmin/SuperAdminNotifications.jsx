import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaBell,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaEnvelope,
  FaSync,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import {
  fetchNotifications,
  createNotification,
  updateNotification,
  updateNotificationReadStatus,
  deleteNotification,
} from "../../redux/superAdminNotificationSlice";

const SuperAdminNotifications = () => {
  const dispatch = useDispatch();

  const {
    notifications,
    loading,
    error,
  } = useSelector(
    (state) => state.superAdminNotification
  );

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState(null);

  const [formData, setFormData] = useState({
    user_id: "",
    title: "",
    message: "",
    notification_type: "General",
  });

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalNotifications =
    notifications.length;

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        notification.is_read === false
    ).length;

  const readNotifications =
    notifications.filter(
      (notification) =>
        notification.is_read === true
    ).length;

  // =====================================================
  // NOTIFICATION TYPES
  // =====================================================

  const notificationTypes = useMemo(() => {
    const types = notifications
      .map(
        (notification) =>
          notification.notification_type
      )
      .filter(Boolean);

    return [...new Set(types)];
  }, [notifications]);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredNotifications =
    notifications.filter((notification) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        String(
          notification.title || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          notification.message || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          notification.full_name || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          notification.email || ""
        )
          .toLowerCase()
          .includes(searchValue);

      const matchesRead =
        readFilter === "all" ||
        (readFilter === "read" &&
          notification.is_read === true) ||
        (readFilter === "unread" &&
          notification.is_read === false);

      const matchesType =
        typeFilter === "all" ||
        notification.notification_type ===
          typeFilter;

      return (
        matchesSearch &&
        matchesRead &&
        matchesType
      );
    });

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleString(
        "en-IN"
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleAdd = () => {
    setEditingNotification(null);

    setFormData({
      user_id: "",
      title: "",
      message: "",
      notification_type: "General",
    });

    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEdit = (notification) => {
    setEditingNotification(notification);

    setFormData({
      user_id:
        notification.user_id || "",
      title:
        notification.title || "",
      message:
        notification.message || "",
      notification_type:
        notification.notification_type ||
        "General",
    });

    setShowModal(true);
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.message.trim()
    ) {
      alert(
        "Title and message are required."
      );
      return;
    }

    try {
      if (editingNotification) {
        await dispatch(
          updateNotification({
            id: editingNotification.id,
            notificationData: {
              title: formData.title,
              message: formData.message,
              notification_type:
                formData.notification_type,
            },
          })
        ).unwrap();
      } else {
        await dispatch(
          createNotification({
            user_id: formData.user_id
              ? Number(formData.user_id)
              : null,
            title: formData.title,
            message: formData.message,
            notification_type:
              formData.notification_type,
          })
        ).unwrap();
      }

      setShowModal(false);

      setEditingNotification(null);

      setFormData({
        user_id: "",
        title: "",
        message: "",
        notification_type: "General",
      });
    } catch (error) {
      alert(error);
    }
  };

  // =====================================================
  // READ / UNREAD
  // =====================================================

  const handleReadStatus = async (
    notification
  ) => {
    try {
      await dispatch(
        updateNotificationReadStatus({
          id: notification.id,
          is_read:
            !notification.is_read,
        })
      ).unwrap();
    } catch (error) {
      alert(error);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (
    notification
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete notification "${notification.title}"?`
    );

    if (!confirmed) return;

    try {
      await dispatch(
        deleteNotification(
          notification.id
        )
      ).unwrap();
    } catch (error) {
      alert(error);
    }
  };

  // =====================================================
  // RENDER
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
            Notification Management
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Manage system notifications across
            the Amara Lands application.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn"
            onClick={() =>
              dispatch(fetchNotifications())
            }
            disabled={loading}
            style={{
              border:
                "1px solid #C9A227",
              color: "#C9A227",
              backgroundColor: "#FFFFFF",
            }}
          >
            <FaSync className="me-2" />
            Refresh
          </button>

          <button
            className="btn"
            onClick={handleAdd}
            style={{
              backgroundColor: "#111111",
              color: "#FFFFFF",
              border:
                "1px solid #111111",
            }}
          >
            <FaPlus className="me-2" />
            Add Notification
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {/* TOTAL */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Total Notifications
                </small>

                <h3 className="mb-0 mt-2">
                  {totalNotifications}
                </h3>
              </div>

              <FaBell
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* UNREAD */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #dc3545",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Unread
                </small>

                <h3 className="mb-0 mt-2">
                  {unreadNotifications}
                </h3>
              </div>

              <FaEnvelope
                style={{
                  color: "#dc3545",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* READ */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #28a745",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Read
                </small>

                <h3 className="mb-0 mt-2">
                  {readNotifications}
                </h3>
              </div>

              <FaCheckCircle
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
      {/* FILTERS */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* SEARCH */}

            <div className="col-md-6">
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
                  placeholder="Search notification, message, user..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* READ FILTER */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={readFilter}
                onChange={(e) =>
                  setReadFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Status
                </option>

                <option value="unread">
                  Unread
                </option>

                <option value="read">
                  Read
                </option>
              </select>
            </div>

            {/* TYPE FILTER */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Types
                </option>

                {notificationTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
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
              All Notifications
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              {
                filteredNotifications.length
              }{" "}
              notifications
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
                Loading notifications...
              </p>
            </div>
          ) : filteredNotifications.length ===
            0 ? (
            <div className="text-center py-5">
              <FaBell
                style={{
                  fontSize: "40px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No notifications found.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead
                  style={{
                    backgroundColor:
                      "#111111",
                    color: "#FFFFFF",
                  }}
                >
                  <tr>
                    <th className="px-3">
                      ID
                    </th>

                    <th>
                      User
                    </th>

                    <th>
                      Notification
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Created
                    </th>

                    <th className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredNotifications.map(
                    (notification) => (
                      <tr
                        key={
                          notification.id
                        }
                      >
                        <td className="px-3">
                          {
                            notification.id
                          }
                        </td>

                        {/* USER */}

                        <td>
                          <strong>
                            {notification.full_name ||
                              "System"}
                          </strong>

                          <div
                            style={{
                              fontSize:
                                "13px",
                              color:
                                "#777777",
                            }}
                          >
                            {notification.email ||
                              "All Users"}
                          </div>
                        </td>

                        {/* NOTIFICATION */}

                        <td>
                          <strong>
                            {
                              notification.title
                            }
                          </strong>

                          <div
                            style={{
                              fontSize:
                                "13px",
                              color:
                                "#777777",
                              maxWidth:
                                "350px",
                            }}
                          >
                            {
                              notification.message
                            }
                          </div>
                        </td>

                        {/* TYPE */}

                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                "#F5E8B0",
                              color:
                                "#111111",
                            }}
                          >
                            {
                              notification.notification_type ||
                              "General"
                            }
                          </span>
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                notification.is_read
                                  ? "#DFF5E3"
                                  : "#F8D7DA",
                              color:
                                notification.is_read
                                  ? "#198754"
                                  : "#842029",
                            }}
                          >
                            {notification.is_read
                              ? "Read"
                              : "Unread"}
                          </span>
                        </td>

                        {/* DATE */}

                        <td>
                          {formatDate(
                            notification.created_at
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {/* READ / UNREAD */}

                            <button
                              className="btn btn-sm"
                              title={
                                notification.is_read
                                  ? "Mark as Unread"
                                  : "Mark as Read"
                              }
                              onClick={() =>
                                handleReadStatus(
                                  notification
                                )
                              }
                              style={{
                                color:
                                  notification.is_read
                                    ? "#dc3545"
                                    : "#198754",
                                border:
                                  notification.is_read
                                    ? "1px solid #dc3545"
                                    : "1px solid #198754",
                              }}
                            >
                              {notification.is_read ? (
                                <FaEyeSlash />
                              ) : (
                                <FaEye />
                              )}
                            </button>

                            {/* EDIT */}

                            <button
                              className="btn btn-sm"
                              title="Edit Notification"
                              onClick={() =>
                                handleEdit(
                                  notification
                                )
                              }
                              style={{
                                color:
                                  "#C9A227",
                                border:
                                  "1px solid #C9A227",
                              }}
                            >
                              <FaEdit />
                            </button>

                            {/* DELETE */}

                            <button
                              className="btn btn-sm"
                              title="Delete Notification"
                              onClick={() =>
                                handleDelete(
                                  notification
                                )
                              }
                              style={{
                                color:
                                  "#111111",
                                border:
                                  "1px solid #111111",
                              }}
                            >
                              <FaTrash />
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
      {/* ADD / EDIT MODAL */}
      {/* ================================================= */}

      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.55)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div
                className="modal-header"
                style={{
                  backgroundColor:
                    "#111111",
                  color: "#FFFFFF",
                }}
              >
                <h5 className="modal-title">
                  {editingNotification
                    ? "Edit Notification"
                    : "Add Notification"}
                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() =>
                    setShowModal(false)
                  }
                />
              </div>

              <form
                onSubmit={handleSubmit}
              >
                <div className="modal-body">
                  {/* USER ID */}

                  {!editingNotification && (
                    <div className="mb-3">
                      <label className="form-label">
                        User ID
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        name="user_id"
                        value={
                          formData.user_id
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Leave empty for system notification"
                      />

                      <small className="text-muted">
                        Enter an existing user ID,
                        or leave empty for a
                        system notification.
                      </small>
                    </div>
                  )}

                  {/* TITLE */}

                  <div className="mb-3">
                    <label className="form-label">
                      Title
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={
                        formData.title
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter notification title"
                      required
                    />
                  </div>

                  {/* MESSAGE */}

                  <div className="mb-3">
                    <label className="form-label">
                      Message
                    </label>

                    <textarea
                      className="form-control"
                      rows="4"
                      name="message"
                      value={
                        formData.message
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter notification message"
                      required
                    />
                  </div>

                  {/* TYPE */}

                  <div className="mb-3">
                    <label className="form-label">
                      Notification Type
                    </label>

                    <select
                      className="form-select"
                      name="notification_type"
                      value={
                        formData.notification_type
                      }
                      onChange={
                        handleChange
                      }
                    >
                      <option value="General">
                        General
                      </option>

                      <option value="Payment">
                        Payment
                      </option>

                      <option value="Property">
                        Property
                      </option>

                      <option value="Appointment">
                        Appointment
                      </option>

                      <option value="Legal">
                        Legal
                      </option>

                      <option value="Security">
                        Security
                      </option>

                      <option value="System">
                        System
                      </option>

                      <option value="Support">
                        Support
                      </option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() =>
                      setShowModal(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn"
                    disabled={loading}
                    style={{
                      backgroundColor:
                        "#111111",
                      color:
                        "#FFFFFF",
                    }}
                  >
                    {editingNotification
                      ? "Update Notification"
                      : "Create Notification"}
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

export default SuperAdminNotifications;