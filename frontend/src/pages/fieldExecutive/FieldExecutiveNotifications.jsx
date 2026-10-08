
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaBell,
  FaSearch,
  FaEye,
  FaSync,
  FaTrash,
  FaCheck,
  FaEnvelope,
  FaEnvelopeOpen,
  FaTimes,
  FaPlus,
} from "react-icons/fa";

import {
  fetchFieldExecutiveNotifications,
  createFieldExecutiveNotification,
  fetchFieldExecutiveNotificationById,
  updateFieldExecutiveNotificationReadStatus,
  deleteFieldExecutiveNotification,
  clearSelectedNotification,
  clearNotificationError,
  clearNotificationSuccess,
} from "../../redux/fieldExecutiveNotificationSlice";

const FieldExecutiveNotifications = () => {
  const dispatch = useDispatch();

  const {
    notifications,
    selectedNotification,
    loading,
    detailsLoading,
    actionLoading,
    error,
    detailsError,
    actionError,
    successMessage,
  } = useSelector(
    (state) =>
      state.fieldExecutiveNotification
  );

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] =
    useState("all");

  // =====================================================
  // MODAL STATE
  // =====================================================

  const [showModal, setShowModal] =
    useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  // =====================================================
  // CREATE FORM
  // =====================================================

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    notification_type: "general",
  });

  // =====================================================
  // FORM ERROR
  // =====================================================

  const [formError, setFormError] =
    useState("");

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    dispatch(
      fetchFieldExecutiveNotifications()
    );
  }, [dispatch]);

  // =====================================================
  // CLEAR SUCCESS MESSAGE
  // =====================================================

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      dispatch(clearNotificationSuccess());
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, dispatch]);

  // =====================================================
  // HANDLE FORM CHANGE
  // =====================================================

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  // =====================================================
  // OPEN CREATE MODAL
  // =====================================================

  const handleOpenCreateModal = () => {
    setFormData({
      title: "",
      message: "",
      notification_type: "general",
    });

    setFormError("");

    dispatch(clearNotificationError());

    setShowCreateModal(true);
  };

  // =====================================================
  // CLOSE CREATE MODAL
  // =====================================================

  const handleCloseCreateModal = () => {
    if (actionLoading) return;

    setShowCreateModal(false);

    setFormData({
      title: "",
      message: "",
      notification_type: "general",
    });

    setFormError("");
  };

  // =====================================================
  // CREATE NOTIFICATION
  // =====================================================

  const handleCreateNotification = async (e) => {
    e.preventDefault();

    setFormError("");

    const title =
      formData.title.trim();

    const message =
      formData.message.trim();

    if (!title) {
      setFormError(
        "Notification title is required."
      );
      return;
    }

    if (!message) {
      setFormError(
        "Notification message is required."
      );
      return;
    }

    try {
      await dispatch(
        createFieldExecutiveNotification({
          title,
          message,
          notification_type:
            formData.notification_type,
        })
      ).unwrap();

      setShowCreateModal(false);

      setFormData({
        title: "",
        message: "",
        notification_type: "general",
      });
    } catch (error) {
      setFormError(
        error ||
          "Unable to create notification."
      );
    }
  };

  // =====================================================
  // VIEW NOTIFICATION
  // =====================================================

  const handleView = (id) => {
    dispatch(
      fetchFieldExecutiveNotificationById(id)
    );

    setShowModal(true);
  };

  // =====================================================
  // CLOSE VIEW MODAL
  // =====================================================

  const handleCloseModal = () => {
    setShowModal(false);

    dispatch(clearSelectedNotification());
    dispatch(clearNotificationError());
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    dispatch(
      fetchFieldExecutiveNotifications()
    );
  };

  // =====================================================
  // MARK READ / UNREAD
  // =====================================================

  const handleReadStatus = (
    notification
  ) => {
    dispatch(
      updateFieldExecutiveNotificationReadStatus(
        {
          id: notification.id,
          is_read: !notification.is_read,
        }
      )
    );
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = (notification) => {
    const confirmed = window.confirm(
      `Delete notification "${notification.title}"?`
    );

    if (!confirmed) return;

    dispatch(
      deleteFieldExecutiveNotification(
        notification.id
      )
    );
  };

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
  // FORMAT NOTIFICATION TYPE
  // =====================================================

  const formatNotificationType = (type) => {
    if (!type) return "General";

    return String(type)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // =====================================================
  // FILTER NOTIFICATIONS
  // =====================================================

  const filteredNotifications =
    notifications.filter(
      (notification) => {
        const searchValue =
          search.toLowerCase().trim();

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
            notification.notification_type ||
              ""
          )
            .toLowerCase()
            .includes(searchValue);

        const matchesReadStatus =
          readFilter === "all" ||
          (readFilter === "read" &&
            notification.is_read) ||
          (readFilter === "unread" &&
            !notification.is_read);

        return (
          matchesSearch &&
          matchesReadStatus
        );
      }
    );

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalNotifications =
    notifications.length;

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        !notification.is_read
    ).length;

  const readNotifications =
    notifications.filter(
      (notification) =>
        notification.is_read
    ).length;

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
            Notifications
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            View and manage notifications
            related to your field activities.
          </p>
        </div>

        <div className="d-flex gap-2">
          {/* NEW NOTIFICATION */}

          <button
            className="btn"
            onClick={
              handleOpenCreateModal
            }
            style={{
              backgroundColor: "#111111",
              color: "#FFFFFF",
              border:
                "1px solid #111111",
            }}
          >
            <FaPlus className="me-2" />
            New Notification
          </button>

          {/* REFRESH */}

          <button
            className="btn"
            onClick={handleRefresh}
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
      {/* ERRORS */}
      {/* ================================================= */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {actionError && (
        <div className="alert alert-danger">
          {actionError}
        </div>
      )}

      {/* ================================================= */}
      {/* SUMMARY CARDS */}
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
            <div className="d-flex justify-content-between align-items-center">
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
            <div className="d-flex justify-content-between align-items-center">
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
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Read
                </small>

                <h3 className="mb-0 mt-2">
                  {readNotifications}
                </h3>
              </div>

              <FaEnvelopeOpen
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
                  placeholder="Search notification title, message or type..."
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

            <div className="col-md-4">
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
                  All Notifications
                </option>

                <option value="unread">
                  Unread
                </option>

                <option value="read">
                  Read
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
              My Notifications
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              {filteredNotifications.length}{" "}
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
                      Notification
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Date
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
                        style={{
                          backgroundColor:
                            notification.is_read
                              ? "#FFFFFF"
                              : "#FFFDF2",
                        }}
                      >
                        <td className="px-3">
                          {notification.id}
                        </td>

                        <td>
                          <div>
                            <strong
                              style={{
                                color:
                                  notification.is_read
                                    ? "#333333"
                                    : "#111111",
                              }}
                            >
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
                                whiteSpace:
                                  "nowrap",
                                overflow:
                                  "hidden",
                                textOverflow:
                                  "ellipsis",
                              }}
                            >
                              {
                                notification.message
                              }
                            </div>
                          </div>
                        </td>

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
                            {formatNotificationType(
                              notification.notification_type
                            )}
                          </span>
                        </td>

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

                        <td
                          style={{
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatDate(
                            notification.created_at
                          )}
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {/* VIEW */}

                            <button
                              className="btn btn-sm"
                              title="View Notification"
                              onClick={() =>
                                handleView(
                                  notification.id
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
                              disabled={
                                actionLoading
                              }
                              style={{
                                color:
                                  "#198754",
                                border:
                                  "1px solid #198754",
                              }}
                            >
                              {notification.is_read ? (
                                <FaEnvelope />
                              ) : (
                                <FaCheck />
                              )}
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
                              disabled={
                                actionLoading
                              }
                              style={{
                                color:
                                  "#dc3545",
                                border:
                                  "1px solid #dc3545",
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
      {/* VIEW NOTIFICATION MODAL */}
      {/* ================================================= */}

      {showModal && (
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
              <div
                className="modal-header"
                style={{
                  backgroundColor:
                    "#111111",
                  color: "#FFFFFF",
                }}
              >
                <h5 className="modal-title">
                  Notification Details
                </h5>

                <button
                  type="button"
                  className="btn"
                  onClick={
                    handleCloseModal
                  }
                  style={{
                    color: "#FFFFFF",
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body">
                {detailsLoading ? (
                  <div className="text-center py-4">
                    <div
                      className="spinner-border"
                      style={{
                        color:
                          "#C9A227",
                      }}
                    />

                    <p className="mt-3 mb-0">
                      Loading notification...
                    </p>
                  </div>
                ) : detailsError ? (
                  <div className="alert alert-danger">
                    {detailsError}
                  </div>
                ) : selectedNotification ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <strong>
                        Notification ID
                      </strong>

                      <div>
                        {
                          selectedNotification.id
                        }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Notification Type
                      </strong>

                      <div>
                        {formatNotificationType(
                          selectedNotification.notification_type
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <strong>
                        Title
                      </strong>

                      <div className="mt-1 p-3 bg-light rounded">
                        {
                          selectedNotification.title
                        }
                      </div>
                    </div>

                    <div className="col-12">
                      <strong>
                        Message
                      </strong>

                      <div className="mt-1 p-3 bg-light rounded">
                        {
                          selectedNotification.message
                        }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Status
                      </strong>

                      <div className="mt-1">
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              selectedNotification.is_read
                                ? "#DFF5E3"
                                : "#F8D7DA",
                            color:
                              selectedNotification.is_read
                                ? "#198754"
                                : "#842029",
                          }}
                        >
                          {selectedNotification.is_read
                            ? "Read"
                            : "Unread"}
                        </span>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Created At
                      </strong>

                      <div>
                        {formatDate(
                          selectedNotification.created_at
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    Notification not found.
                  </div>
                )}
              </div>

              <div className="modal-footer">
                {selectedNotification && (
                  <button
                    type="button"
                    className="btn"
                    onClick={() =>
                      handleReadStatus(
                        selectedNotification
                      )
                    }
                    disabled={actionLoading}
                    style={{
                      border:
                        "1px solid #C9A227",
                      color: "#C9A227",
                      backgroundColor:
                        "#FFFFFF",
                    }}
                  >
                    {selectedNotification.is_read
                      ? "Mark as Unread"
                      : "Mark as Read"}
                  </button>
                )}

                <button
                  type="button"
                  className="btn"
                  onClick={
                    handleCloseModal
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

      {/* ================================================= */}
      {/* CREATE NOTIFICATION MODAL */}
      {/* ================================================= */}

      {showCreateModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
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
                  Create Notification
                </h5>

                <button
                  type="button"
                  className="btn"
                  onClick={
                    handleCloseCreateModal
                  }
                  disabled={actionLoading}
                  style={{
                    color: "#FFFFFF",
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              {/* FORM */}

              <form
                onSubmit={
                  handleCreateNotification
                }
              >
                <div className="modal-body">
                  {formError && (
                    <div className="alert alert-danger">
                      {formError}
                    </div>
                  )}

                  {/* TITLE */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Title
                      <span
                        style={{
                          color: "#dc3545",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      placeholder="Enter notification title"
                      value={
                        formData.title
                      }
                      onChange={
                        handleFormChange
                      }
                      maxLength={150}
                      disabled={
                        actionLoading
                      }
                    />
                  </div>

                  {/* TYPE */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Notification Type
                    </label>

                    <select
                      name="notification_type"
                      className="form-select"
                      value={
                        formData.notification_type
                      }
                      onChange={
                        handleFormChange
                      }
                      disabled={
                        actionLoading
                      }
                    >
                      <option value="general">
                        General
                      </option>

                      <option value="field_visit">
                        Field Visit
                      </option>

                      <option value="property">
                        Property
                      </option>

                      <option value="appointment">
                        Appointment
                      </option>

                      <option value="security">
                        Security
                      </option>

                      <option value="document">
                        Document
                      </option>

                      <option value="system">
                        System
                      </option>
                    </select>
                  </div>

                  {/* MESSAGE */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Message
                      <span
                        style={{
                          color: "#dc3545",
                        }}
                      >
                        {" "}
                        *
                      </span>
                    </label>

                    <textarea
                      name="message"
                      className="form-control"
                      rows="5"
                      placeholder="Enter notification message"
                      value={
                        formData.message
                      }
                      onChange={
                        handleFormChange
                      }
                      disabled={
                        actionLoading
                      }
                    />
                  </div>

                  <div
                    className="alert mb-0"
                    style={{
                      backgroundColor:
                        "#FFFDF5",
                      border:
                        "1px solid #E6D48A",
                      color: "#555555",
                    }}
                  >
                    This notification will be
                    created for your Field
                    Executive account.
                  </div>
                </div>

                {/* FOOTER */}

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn"
                    onClick={
                      handleCloseCreateModal
                    }
                    disabled={
                      actionLoading
                    }
                    style={{
                      border:
                        "1px solid #111111",
                      color: "#111111",
                      backgroundColor:
                        "#FFFFFF",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn"
                    disabled={
                      actionLoading
                    }
                    style={{
                      backgroundColor:
                        "#111111",
                      color: "#FFFFFF",
                      border:
                        "1px solid #111111",
                    }}
                  >
                    {actionLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />

                        Creating...
                      </>
                    ) : (
                      <>
                        <FaPlus className="me-2" />
                        Create Notification
                      </>
                    )}
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

export default FieldExecutiveNotifications;

