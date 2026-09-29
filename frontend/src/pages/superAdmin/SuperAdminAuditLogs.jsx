
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaHistory,
  FaSearch,
  FaEye,
  FaSync,
  FaTimes,
  FaUser,
} from "react-icons/fa";

import {
  fetchAuditLogs,
  fetchAuditLogById,
  clearSelectedAuditLog,
} from "../../redux/superAdminAuditLogSlice";

const SuperAdminAuditLogs = () => {
  const dispatch = useDispatch();

  const {
    logs,
    selectedLog,
    loading,
    error,
  } = useSelector(
    (state) => state.superAdminAuditLog
  );

  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] =
    useState("all");
  const [actionFilter, setActionFilter] =
    useState("all");

  const [showModal, setShowModal] =
    useState(false);

  // =====================================================
  // LOAD AUDIT LOGS
  // =====================================================

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  // =====================================================
  // VIEW AUDIT LOG
  // =====================================================

  const handleView = (id) => {
    dispatch(fetchAuditLogById(id));
    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(clearSelectedAuditLog());
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
  // FILTER LOGS
  // =====================================================

  const filteredLogs = logs.filter((log) => {
    const searchValue =
      search.toLowerCase();

    const matchesSearch =
      String(log.action || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(log.module || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(log.entity_type || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(log.description || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(log.full_name || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(log.email || "")
        .toLowerCase()
        .includes(searchValue);

    const matchesModule =
      moduleFilter === "all" ||
      String(log.module || "")
        .toLowerCase() ===
        moduleFilter.toLowerCase();

    const matchesAction =
      actionFilter === "all" ||
      String(log.action || "")
        .toLowerCase() ===
        actionFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesModule &&
      matchesAction
    );
  });

  // =====================================================
  // UNIQUE MODULES
  // =====================================================

  const modules = [
    ...new Set(
      logs
        .map((log) => log.module)
        .filter(Boolean)
    ),
  ];

  // =====================================================
  // UNIQUE ACTIONS
  // =====================================================

  const actions = [
    ...new Set(
      logs
        .map((log) => log.action)
        .filter(Boolean)
    ),
  ];

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
            Audit Logs
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Monitor important activities and
            system changes across Amara Lands.
          </p>
        </div>

        <button
          className="btn"
          onClick={() =>
            dispatch(fetchAuditLogs())
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
        {/* TOTAL LOGS */}

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
                  Total Logs
                </small>

                <h3 className="mb-0 mt-2">
                  {logs.length}
                </h3>
              </div>

              <FaHistory
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* MODULES */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #111111",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Modules
                </small>

                <h3 className="mb-0 mt-2">
                  {modules.length}
                </h3>
              </div>

              <FaHistory
                style={{
                  color: "#111111",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* USERS */}

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
                  Users With Activity
                </small>

                <h3 className="mb-0 mt-2">
                  {
                    new Set(
                      logs
                        .map(
                          (log) =>
                            log.user_id
                        )
                        .filter(Boolean)
                    ).size
                  }
                </h3>
              </div>

              <FaUser
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
                  placeholder="Search action, module, user or description..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* MODULE */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={moduleFilter}
                onChange={(e) =>
                  setModuleFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Modules
                </option>

                {modules.map(
                  (module) => (
                    <option
                      key={module}
                      value={module}
                    >
                      {module}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* ACTION */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={actionFilter}
                onChange={(e) =>
                  setActionFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Actions
                </option>

                {actions.map(
                  (action) => (
                    <option
                      key={action}
                      value={action}
                    >
                      {action}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
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
      {/* AUDIT LOG TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              Activity History
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              {filteredLogs.length} logs
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
                Loading audit logs...
              </p>
            </div>
          ) : filteredLogs.length ===
            0 ? (
            <div className="text-center py-5">
              <FaHistory
                style={{
                  fontSize: "40px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No audit logs found.
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
                      Action
                    </th>

                    <th>
                      Module
                    </th>

                    <th>
                      Entity
                    </th>

                    <th>
                      Description
                    </th>

                    <th>
                      Date
                    </th>

                    <th className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.map(
                    (log) => (
                      <tr key={log.id}>
                        <td className="px-3">
                          {log.id}
                        </td>

                        <td>
                          <strong>
                            {log.full_name ||
                              "Unknown User"}
                          </strong>

                          <div
                            style={{
                              fontSize:
                                "12px",
                              color:
                                "#777777",
                            }}
                          >
                            {log.email ||
                              "-"}
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
                            {log.action ||
                              "-"}
                          </span>
                        </td>

                        <td>
                          {log.module ||
                            "-"}
                        </td>

                        <td>
                          {log.entity_type
                            ? `${log.entity_type}${
                                log.entity_id
                                  ? ` #${log.entity_id}`
                                  : ""
                              }`
                            : "-"}
                        </td>

                        <td>
                          <div
                            style={{
                              maxWidth:
                                "250px",
                              whiteSpace:
                                "nowrap",
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis",
                            }}
                          >
                            {log.description ||
                              "-"}
                          </div>
                        </td>

                        <td
                          style={{
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatDate(
                            log.created_at
                          )}
                        </td>

                        <td>
                          <div className="d-flex justify-content-center">
                            <button
                              className="btn btn-sm"
                              title="View Audit Log"
                              onClick={() =>
                                handleView(
                                  log.id
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
      {/* VIEW MODAL */}
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
              {/* MODAL HEADER */}

              <div
                className="modal-header"
                style={{
                  backgroundColor:
                    "#111111",
                  color: "#FFFFFF",
                }}
              >
                <h5 className="modal-title">
                  Audit Log Details
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

              {/* MODAL BODY */}

              <div className="modal-body">
                {loading ? (
                  <div className="text-center py-4">
                    <div
                      className="spinner-border"
                      style={{
                        color:
                          "#C9A227",
                      }}
                    />
                  </div>
                ) : selectedLog ? (
                  <>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <strong>
                          Log ID
                        </strong>

                        <div>
                          {selectedLog.id}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <strong>
                          User
                        </strong>

                        <div>
                          {selectedLog.full_name ||
                            "Unknown User"}
                        </div>

                        <small className="text-muted">
                          {selectedLog.email ||
                            "-"}
                        </small>
                      </div>

                      <div className="col-md-6">
                        <strong>
                          Action
                        </strong>

                        <div>
                          {selectedLog.action ||
                            "-"}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <strong>
                          Module
                        </strong>

                        <div>
                          {selectedLog.module ||
                            "-"}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <strong>
                          Entity Type
                        </strong>

                        <div>
                          {selectedLog.entity_type ||
                            "-"}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <strong>
                          Entity ID
                        </strong>

                        <div>
                          {selectedLog.entity_id ||
                            "-"}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <strong>
                          IP Address
                        </strong>

                        <div>
                          {selectedLog.ip_address ||
                            "-"}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <strong>
                          Created At
                        </strong>

                        <div>
                          {formatDate(
                            selectedLog.created_at
                          )}
                        </div>
                      </div>

                      <div className="col-12">
                        <strong>
                          Description
                        </strong>

                        <div className="mt-1 p-3 bg-light rounded">
                          {selectedLog.description ||
                            "-"}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <strong>
                          Old Values
                        </strong>

                        <pre
                          className="mt-2 p-3 bg-light rounded"
                          style={{
                            maxHeight:
                              "250px",
                            overflow:
                              "auto",
                            fontSize:
                              "12px",
                          }}
                        >
                          {selectedLog.old_values
                            ? JSON.stringify(
                                selectedLog.old_values,
                                null,
                                2
                              )
                            : "No previous values"}
                        </pre>
                      </div>

                      <div className="col-md-6">
                        <strong>
                          New Values
                        </strong>

                        <pre
                          className="mt-2 p-3 bg-light rounded"
                          style={{
                            maxHeight:
                              "250px",
                            overflow:
                              "auto",
                            fontSize:
                              "12px",
                          }}
                        >
                          {selectedLog.new_values
                            ? JSON.stringify(
                                selectedLog.new_values,
                                null,
                                2
                              )
                            : "No new values"}
                        </pre>
                      </div>

                      <div className="col-12">
                        <strong>
                          User Agent
                        </strong>

                        <div
                          className="mt-1 p-3 bg-light rounded"
                          style={{
                            wordBreak:
                              "break-word",
                            fontSize:
                              "13px",
                          }}
                        >
                          {selectedLog.user_agent ||
                            "-"}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-muted">
                    Audit log not found.
                  </div>
                )}
              </div>

              {/* MODAL FOOTER */}

              <div className="modal-footer">
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
    </div>
  );
};

export default SuperAdminAuditLogs;

