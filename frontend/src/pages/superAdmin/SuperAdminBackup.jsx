import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaDatabase,
  FaSync,
  FaPlus,
  FaEye,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaPlay,
} from "react-icons/fa";

import {
  fetchBackups,
  fetchBackupById,
  createBackup,
  updateBackupStatus,
  deleteBackup,
  clearSelectedBackup,
} from "../../redux/superAdminBackupSlice";

const SuperAdminBackup = () => {
  const dispatch = useDispatch();

  const {
    backups = [],
    selectedBackup = null,
    loading = false,
    actionLoading = false,
    error = null,
  } = useSelector(
    (state) => state.superAdminBackup || {}
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [formData, setFormData] = useState({
    backup_name: "",
    backup_type: "manual",
    backup_file: "",
    backup_size: "",
    status: "completed",
    remarks: "",
  });

  // =====================================================
  // FETCH BACKUPS
  // =====================================================

  useEffect(() => {
    dispatch(fetchBackups());
  }, [dispatch]);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredBackups = useMemo(() => {
    return backups.filter((backup) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        String(
          backup.backup_name || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          backup.backup_file || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          backup.created_by_name || ""
        )
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        String(backup.status || "")
          .toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [backups, search, statusFilter]);

  // =====================================================
  // COUNTS
  // =====================================================

  const totalBackups = backups.length;

  const completedBackups =
    backups.filter(
      (backup) =>
        String(backup.status).toLowerCase() ===
        "completed"
    ).length;

  const runningBackups =
    backups.filter(
      (backup) =>
        String(backup.status).toLowerCase() ===
        "running"
    ).length;

  const failedBackups =
    backups.filter(
      (backup) =>
        String(backup.status).toLowerCase() ===
        "failed"
    ).length;

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
  // CREATE BACKUP RECORD
  // =====================================================

  const handleCreateBackup = async (e) => {
    e.preventDefault();

    if (!formData.backup_name.trim()) {
      return;
    }

    const result = await dispatch(
      createBackup(formData)
    );

    if (
      createBackup.fulfilled.match(result)
    ) {
      setFormData({
        backup_name: "",
        backup_type: "manual",
        backup_file: "",
        backup_size: "",
        status: "completed",
        remarks: "",
      });

      setShowCreateModal(false);
    }
  };

  // =====================================================
  // VIEW BACKUP
  // =====================================================

  const handleView = async (id) => {
    const result = await dispatch(
      fetchBackupById(id)
    );

    if (
      fetchBackupById.fulfilled.match(result)
    ) {
      setShowViewModal(true);
    }
  };

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const handleStatusChange = async (
    id,
    status
  ) => {
    await dispatch(
      updateBackupStatus({
        id,
        status,
      })
    );
  };

  // =====================================================
  // DELETE BACKUP
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this backup record?"
    );

    if (!confirmed) {
      return;
    }

    await dispatch(deleteBackup(id));
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    dispatch(fetchBackups());
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(
        date
      ).toLocaleString("en-IN");
    } catch {
      return "-";
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "completed") {
      return {
        backgroundColor: "#DFF5E3",
        color: "#198754",
      };
    }

    if (value === "running") {
      return {
        backgroundColor: "#FFF3CD",
        color: "#856404",
      };
    }

    if (value === "failed") {
      return {
        backgroundColor: "#F8D7DA",
        color: "#842029",
      };
    }

    return {
      backgroundColor: "#E9ECEF",
      color: "#495057",
    };
  };

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
            Backup & Database
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Manage database backup records and
            backup status.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn"
            onClick={handleRefresh}
            disabled={loading}
            style={{
              border:
                "1px solid #C9A227",
              color: "#C9A227",
              backgroundColor:
                "#FFFFFF",
            }}
          >
            <FaSync className="me-2" />
            Refresh
          </button>

          <button
            className="btn"
            onClick={() =>
              setShowCreateModal(true)
            }
            style={{
              backgroundColor:
                "#111111",
              color: "#FFFFFF",
              border:
                "1px solid #111111",
            }}
          >
            <FaPlus className="me-2" />
            Add Backup
          </button>
        </div>
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
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Total Backups
                </small>

                <h3 className="mb-0 mt-2">
                  {totalBackups}
                </h3>
              </div>

              <FaDatabase
                style={{
                  color: "#C9A227",
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
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Completed
                </small>

                <h3 className="mb-0 mt-2">
                  {completedBackups}
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

        {/* RUNNING */}

        <div className="col-md-3">
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
                  Running
                </small>

                <h3 className="mb-0 mt-2">
                  {runningBackups}
                </h3>
              </div>

              <FaPlay
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* FAILED */}

        <div className="col-md-3">
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
                  Failed
                </small>

                <h3 className="mb-0 mt-2">
                  {failedBackups}
                </h3>
              </div>

              <FaTimesCircle
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
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Search backup name, file or creator..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />
            </div>

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

                <option value="pending">
                  Pending
                </option>

                <option value="running">
                  Running
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="failed">
                  Failed
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* BACKUP TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              Backup History
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              {filteredBackups.length}{" "}
              backups
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
                Loading backups...
              </p>
            </div>
          ) : filteredBackups.length ===
            0 ? (
            <div className="text-center py-5">
              <FaDatabase
                style={{
                  fontSize: "42px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No backup records found.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead
                  style={{
                    backgroundColor:
                      "#111111",
                    color:
                      "#FFFFFF",
                  }}
                >
                  <tr>
                    <th className="px-3">
                      ID
                    </th>

                    <th>
                      Backup Name
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Size
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Created By
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
                  {filteredBackups.map(
                    (backup) => (
                      <tr
                        key={
                          backup.id
                        }
                      >
                        <td className="px-3">
                          {
                            backup.id
                          }
                        </td>

                        <td>
                          <strong>
                            {
                              backup.backup_name
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
                              backup.backup_file ||
                              "-"
                            }
                          </div>
                        </td>

                        <td>
                          <span className="badge bg-light text-dark">
                            {
                              backup.backup_type ||
                              "-"
                            }
                          </span>
                        </td>

                        <td>
                          {
                            backup.backup_size ||
                            "-"
                          }
                        </td>

                        <td>
                          <span
                            className="badge"
                            style={getStatusStyle(
                              backup.status
                            )}
                          >
                            {
                              backup.status ||
                              "-"
                            }
                          </span>
                        </td>

                        <td>
                          {
                            backup.created_by_name ||
                            "-"
                          }
                        </td>

                        <td>
                          {formatDate(
                            backup.created_at
                          )}
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {/* VIEW */}

                            <button
                              className="btn btn-sm"
                              title="View Backup"
                              onClick={() =>
                                handleView(
                                  backup.id
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

                            {/* COMPLETE */}

                            {String(
                              backup.status
                            ).toLowerCase() !==
                              "completed" && (
                              <button
                                className="btn btn-sm"
                                title="Mark Completed"
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  handleStatusChange(
                                    backup.id,
                                    "completed"
                                  )
                                }
                                style={{
                                  color:
                                    "#198754",
                                  border:
                                    "1px solid #198754",
                                }}
                              >
                                <FaCheckCircle />
                              </button>
                            )}

                            {/* DELETE */}

                            <button
                              className="btn btn-sm"
                              title="Delete Backup"
                              disabled={
                                actionLoading
                              }
                              onClick={() =>
                                handleDelete(
                                  backup.id
                                )
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
      {/* CREATE MODAL */}
      {/* ================================================= */}

      {showCreateModal && (
        <div
          className="modal d-block"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.55)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{
                  backgroundColor:
                    "#111111",
                  color:
                    "#FFFFFF",
                }}
              >
                <h5 className="modal-title">
                  Create Backup Record
                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() =>
                    setShowCreateModal(
                      false
                    )
                  }
                />
              </div>

              <form
                onSubmit={
                  handleCreateBackup
                }
              >
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label">
                        Backup Name
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="backup_name"
                        value={
                          formData.backup_name
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter backup name"
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">
                        Backup Type
                      </label>

                      <select
                        className="form-select"
                        name="backup_type"
                        value={
                          formData.backup_type
                        }
                        onChange={
                          handleChange
                        }
                      >
                        <option value="manual">
                          Manual
                        </option>

                        <option value="automatic">
                          Automatic
                        </option>

                        <option value="scheduled">
                          Scheduled
                        </option>
                      </select>
                    </div>

                    <div className="col-md-8">
                      <label className="form-label">
                        Backup File
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="backup_file"
                        value={
                          formData.backup_file
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="backup_file.sql"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">
                        Backup Size
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="backup_size"
                        value={
                          formData.backup_size
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="25 MB"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">
                        Status
                      </label>

                      <select
                        className="form-select"
                        name="status"
                        value={
                          formData.status
                        }
                        onChange={
                          handleChange
                        }
                      >
                        <option value="pending">
                          Pending
                        </option>

                        <option value="running">
                          Running
                        </option>

                        <option value="completed">
                          Completed
                        </option>

                        <option value="failed">
                          Failed
                        </option>
                      </select>
                    </div>

                    <div className="col-md-8">
                      <label className="form-label">
                        Remarks
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="remarks"
                        value={
                          formData.remarks
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter remarks"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() =>
                      setShowCreateModal(
                        false
                      )
                    }
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
                      color:
                        "#FFFFFF",
                    }}
                  >
                    {actionLoading
                      ? "Saving..."
                      : "Create Backup"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* VIEW MODAL */}
      {/* ================================================= */}

      {showViewModal &&
        selectedBackup && (
          <div
            className="modal d-block"
            style={{
              backgroundColor:
                "rgba(0,0,0,0.55)",
            }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div
                  className="modal-header"
                  style={{
                    backgroundColor:
                      "#111111",
                    color:
                      "#FFFFFF",
                  }}
                >
                  <h5 className="modal-title">
                    Backup Details
                  </h5>

                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => {
                      setShowViewModal(
                        false
                      );

                      dispatch(
                        clearSelectedBackup()
                      );
                    }}
                  />
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <strong>
                        Backup Name
                      </strong>

                      <p className="text-muted">
                        {
                          selectedBackup.backup_name
                        }
                      </p>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Backup Type
                      </strong>

                      <p className="text-muted">
                        {
                          selectedBackup.backup_type
                        }
                      </p>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Backup File
                      </strong>

                      <p className="text-muted">
                        {
                          selectedBackup.backup_file ||
                          "-"
                        }
                      </p>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Backup Size
                      </strong>

                      <p className="text-muted">
                        {
                          selectedBackup.backup_size ||
                          "-"
                        }
                      </p>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Status
                      </strong>

                      <p>
                        <span
                          className="badge"
                          style={getStatusStyle(
                            selectedBackup.status
                          )}
                        >
                          {
                            selectedBackup.status
                          }
                        </span>
                      </p>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Created By
                      </strong>

                      <p className="text-muted">
                        {
                          selectedBackup.created_by_name ||
                          "-"
                        }
                      </p>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Started At
                      </strong>

                      <p className="text-muted">
                        {formatDate(
                          selectedBackup.started_at
                        )}
                      </p>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Completed At
                      </strong>

                      <p className="text-muted">
                        {formatDate(
                          selectedBackup.completed_at
                        )}
                      </p>
                    </div>

                    <div className="col-12">
                      <strong>
                        Remarks
                      </strong>

                      <p className="text-muted">
                        {
                          selectedBackup.remarks ||
                          "-"
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-dark"
                    onClick={() => {
                      setShowViewModal(
                        false
                      );

                      dispatch(
                        clearSelectedBackup()
                      );
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

export default SuperAdminBackup;