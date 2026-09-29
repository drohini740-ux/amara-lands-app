import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaShieldAlt,
  FaSearch,
  FaSync,
  FaEye,
  FaSignOutAlt,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaLaptop,
} from "react-icons/fa";

import {
  fetchSecuritySessions,
  fetchSecuritySessionById,
  forceLogoutSecuritySession,
  deleteSecuritySession,
  clearSelectedSecuritySession,
  clearSecuritySessionError,
} from "../../redux/superAdminSecuritySessionSlice";

const SuperAdminSecuritySessions = () => {
  const dispatch = useDispatch();

  const {
    sessions,
    selectedSession,
    loading,
    actionLoading,
    error,
  } = useSelector(
    (state) => state.superAdminSecuritySession
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [showModal, setShowModal] =
    useState(false);

  // =====================================================
  // LOAD SESSIONS
  // =====================================================

  useEffect(() => {
    dispatch(fetchSecuritySessions());

    return () => {
      dispatch(clearSelectedSecuritySession());
      dispatch(clearSecuritySessionError());
    };
  }, [dispatch]);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    dispatch(fetchSecuritySessions());
  };

  // =====================================================
  // VIEW SESSION
  // =====================================================

  const handleViewSession = async (id) => {
    await dispatch(
      fetchSecuritySessionById(id)
    );

    setShowModal(true);
  };

  // =====================================================
  // FORCE LOGOUT
  // =====================================================

  const handleForceLogout = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to force logout this session?"
    );

    if (!confirmed) {
      return;
    }

    await dispatch(
      forceLogoutSecuritySession(id)
    );

    dispatch(fetchSecuritySessions());
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this session?"
    );

    if (!confirmed) {
      return;
    }

    await dispatch(
      deleteSecuritySession(id)
    );
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleString(
        "en-IN"
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // FORMAT STATUS
  // =====================================================

  const formatStatus = (status) => {
    if (!status) {
      return "-";
    }

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(status).toLowerCase();

    if (value === "active") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (value === "expired") {
      return {
        backgroundColor: "#FFF3CD",
        color: "#856404",
      };
    }

    if (
      value === "revoked" ||
      value === "logged_out"
    ) {
      return {
        backgroundColor: "#F8D7DA",
        color: "#842029",
      };
    }

    return {
      backgroundColor: "#EEEEEE",
      color: "#555555",
    };
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredSessions = sessions.filter(
    (session) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        String(
          session.user_name || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          session.user_email || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          session.ip_address || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          session.device_name || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          session.user_agent || ""
        )
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        String(session.status)
          .toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  // =====================================================
  // COUNTS
  // =====================================================

  const totalSessions =
    sessions.length;

  const activeSessions =
    sessions.filter(
      (session) =>
        String(session.status)
          .toLowerCase() ===
        "active"
    ).length;

  const expiredSessions =
    sessions.filter(
      (session) =>
        String(session.status)
          .toLowerCase() ===
        "expired"
    ).length;

  const revokedSessions =
    sessions.filter(
      (session) =>
        String(session.status)
          .toLowerCase() ===
          "revoked" ||
        String(session.status)
          .toLowerCase() ===
          "logged_out"
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
            Security & Sessions
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Monitor and manage user login sessions
            across the Amara Lands application.
          </p>
        </div>

        <button
          className="btn"
          onClick={handleRefresh}
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
      {/* SUMMARY CARDS */}
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
                  Total Sessions
                </small>

                <h3 className="mb-0 mt-2">
                  {totalSessions}
                </h3>
              </div>

              <FaShieldAlt
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* ACTIVE */}

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
                  Active
                </small>

                <h3 className="mb-0 mt-2">
                  {activeSessions}
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

        {/* EXPIRED */}

        <div className="col-md-3">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #856404",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Expired
                </small>

                <h3 className="mb-0 mt-2">
                  {expiredSessions}
                </h3>
              </div>

              <FaClock
                style={{
                  color: "#856404",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* REVOKED */}

        <div className="col-md-3">
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
                  Revoked / Logged Out
                </small>

                <h3 className="mb-0 mt-2">
                  {revokedSessions}
                </h3>
              </div>

              <FaBan
                style={{
                  color: "#dc3545",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="alert alert-danger d-flex justify-content-between">
          <span>{error}</span>

          <button
            className="btn-close"
            onClick={() =>
              dispatch(
                clearSecuritySessionError()
              )
            }
          />
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
                  placeholder="Search user, email, IP, device or browser..."
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

                <option value="active">
                  Active
                </option>

                <option value="expired">
                  Expired
                </option>

                <option value="revoked">
                  Revoked
                </option>

                <option value="logged_out">
                  Logged Out
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
              User Sessions
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              {filteredSessions.length}{" "}
              sessions
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
                Loading sessions...
              </p>
            </div>
          ) : filteredSessions.length ===
            0 ? (
            <div className="text-center py-5">
              <FaShieldAlt
                style={{
                  fontSize: "42px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No sessions found.
              </p>
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
                      User
                    </th>

                    <th>
                      Device
                    </th>

                    <th>
                      IP Address
                    </th>

                    <th>
                      Login
                    </th>

                    <th>
                      Last Activity
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
                  {filteredSessions.map(
                    (session) => (
                      <tr
                        key={
                          session.id
                        }
                      >
                        {/* ID */}

                        <td className="px-3">
                          {session.id}
                        </td>

                        {/* USER */}

                        <td>
                          <div>
                            <strong>
                              {
                                session.user_name ||
                                "-"
                              }
                            </strong>

                            <div
                              style={{
                                fontSize:
                                  "13px",
                                color:
                                  "#777777",
                              }}
                            >
                              {
                                session.user_email ||
                                "-"
                              }
                            </div>

                            <small
                              style={{
                                color:
                                  "#C9A227",
                              }}
                            >
                              {
                                session.user_role ||
                                "-"
                              }
                            </small>
                          </div>
                        </td>

                        {/* DEVICE */}

                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <FaLaptop
                              style={{
                                color:
                                  "#C9A227",
                              }}
                            />

                            <div>
                              <strong
                                style={{
                                  fontSize:
                                    "14px",
                                }}
                              >
                                {
                                  session.device_name ||
                                  "-"
                                }
                              </strong>

                              <div
                                style={{
                                  fontSize:
                                    "12px",
                                  color:
                                    "#777777",
                                }}
                              >
                                {
                                  session.user_agent ||
                                  "-"
                                }
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* IP */}

                        <td>
                          {session.ip_address ||
                            "-"}
                        </td>

                        {/* LOGIN */}

                        <td
                          style={{
                            fontSize:
                              "13px",
                          }}
                        >
                          {formatDate(
                            session.login_at
                          )}
                        </td>

                        {/* LAST ACTIVITY */}

                        <td
                          style={{
                            fontSize:
                              "13px",
                          }}
                        >
                          {formatDate(
                            session.last_activity_at
                          )}
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className="badge"
                            style={{
                              ...getStatusStyle(
                                session.status
                              ),
                            }}
                          >
                            {formatStatus(
                              session.status
                            )}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="d-flex justify-content-center gap-2">

                            {/* VIEW */}

                            <button
                              className="btn btn-sm"
                              title="View Session"
                              onClick={() =>
                                handleViewSession(
                                  session.id
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

                            {/* FORCE LOGOUT */}

                            {String(
                              session.status
                            ).toLowerCase() ===
                              "active" && (
                              <button
                                className="btn btn-sm"
                                title="Force Logout"
                                onClick={() =>
                                  handleForceLogout(
                                    session.id
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
                                <FaSignOutAlt />
                              </button>
                            )}

                            {/* DELETE */}

                            <button
                              className="btn btn-sm"
                              title="Delete Session"
                              onClick={() =>
                                handleDelete(
                                  session.id
                                )
                              }
                              disabled={
                                actionLoading
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
      {/* SESSION DETAILS MODAL */}
      {/* ================================================= */}

      {showModal &&
        selectedSession && (
          <div
            className="modal d-block"
            style={{
              backgroundColor:
                "rgba(0,0,0,0.6)",
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
                    <FaShieldAlt
                      className="me-2"
                      style={{
                        color:
                          "#C9A227",
                      }}
                    />
                    Session Details
                  </h5>

                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => {
                      setShowModal(
                        false
                      );
                      dispatch(
                        clearSelectedSecuritySession()
                      );
                    }}
                  />
                </div>

                {/* BODY */}

                <div className="modal-body">

                  <div className="row g-3">

                    {/* USER */}

                    <div className="col-md-6">
                      <label className="text-muted">
                        User
                      </label>

                      <div className="fw-bold">
                        {
                          selectedSession.user_name ||
                          "-"
                        }
                      </div>
                    </div>

                    {/* EMAIL */}

                    <div className="col-md-6">
                      <label className="text-muted">
                        Email
                      </label>

                      <div>
                        {
                          selectedSession.user_email ||
                          "-"
                        }
                      </div>
                    </div>

                    {/* ROLE */}

                    <div className="col-md-6">
                      <label className="text-muted">
                        Role
                      </label>

                      <div>
                        {
                          selectedSession.user_role ||
                          "-"
                        }
                      </div>
                    </div>

                    {/* SESSION ID */}

                    <div className="col-md-6">
                      <label className="text-muted">
                        Session ID
                      </label>

                      <div>
                        {
                          selectedSession.id
                        }
                      </div>
                    </div>

                    {/* IP */}

                    <div className="col-md-6">
                      <label className="text-muted">
                        IP Address
                      </label>

                      <div>
                        {
                          selectedSession.ip_address ||
                          "-"
                        }
                      </div>
                    </div>

                    {/* DEVICE */}

                    <div className="col-md-6">
                      <label className="text-muted">
                        Device
                      </label>

                      <div>
                        {
                          selectedSession.device_name ||
                          "-"
                        }
                      </div>
                    </div>

                    {/* USER AGENT */}

                    <div className="col-12">
                      <label className="text-muted">
                        User Agent
                      </label>

                      <div
                        className="p-2 rounded"
                        style={{
                          backgroundColor:
                            "#F5F5F5",
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {
                          selectedSession.user_agent ||
                          "-"
                        }
                      </div>
                    </div>

                    {/* LOGIN */}

                    <div className="col-md-6">
                      <label className="text-muted">
                        Login At
                      </label>

                      <div>
                        {formatDate(
                          selectedSession.login_at
                        )}
                      </div>
                    </div>

                    {/* LAST ACTIVITY */}

                    <div className="col-md-6">
                      <label className="text-muted">
                        Last Activity
                      </label>

                      <div>
                        {formatDate(
                          selectedSession.last_activity_at
                        )}
                      </div>
                    </div>

                    {/* LOGOUT */}

                    <div className="col-md-6">
                      <label className="text-muted">
                        Logout At
                      </label>

                      <div>
                        {formatDate(
                          selectedSession.logout_at
                        )}
                      </div>
                    </div>

                    {/* EXPIRES */}

                    <div className="col-md-6">
                      <label className="text-muted">
                        Expires At
                      </label>

                      <div>
                        {formatDate(
                          selectedSession.expires_at
                        )}
                      </div>
                    </div>

                    {/* STATUS */}

                    <div className="col-12">
                      <label className="text-muted">
                        Status
                      </label>

                      <div>
                        <span
                          className="badge"
                          style={{
                            ...getStatusStyle(
                              selectedSession.status
                            ),
                          }}
                        >
                          {formatStatus(
                            selectedSession.status
                          )}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* FOOTER */}

                <div className="modal-footer">

                  {String(
                    selectedSession.status
                  ).toLowerCase() ===
                    "active" && (
                    <button
                      className="btn"
                      onClick={async () => {
                        await handleForceLogout(
                          selectedSession.id
                        );

                        setShowModal(
                          false
                        );
                      }}
                      disabled={
                        actionLoading
                      }
                      style={{
                        backgroundColor:
                          "#dc3545",
                        color:
                          "#FFFFFF",
                        border:
                          "1px solid #dc3545",
                      }}
                    >
                      <FaSignOutAlt className="me-2" />
                      Force Logout
                    </button>
                  )}

                  <button
                    className="btn"
                    onClick={() => {
                      setShowModal(false);

                      dispatch(
                        clearSelectedSecuritySession()
                      );
                    }}
                    style={{
                      backgroundColor:
                        "#111111",
                      color:
                        "#FFFFFF",
                      border:
                        "1px solid #111111",
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

export default SuperAdminSecuritySessions;