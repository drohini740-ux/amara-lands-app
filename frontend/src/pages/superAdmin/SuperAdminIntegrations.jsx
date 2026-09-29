import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaPlug,
  FaSearch,
  FaSync,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaPowerOff,
  FaVial,
} from "react-icons/fa";

import {
  fetchIntegrations,
  fetchIntegrationById,
  createIntegration,
  updateIntegration,
  updateIntegrationStatus,
  toggleIntegration,
  testIntegration,
  deleteIntegration,
  clearSelectedIntegration,
} from "../../redux/superAdminIntegrationSlice";

const SuperAdminIntegrations = () => {
  const dispatch = useDispatch();

  const {
    integrations,
    selectedIntegration,
    loading,
    actionLoading,
    error,
  } = useSelector(
    (state) => state.superAdminIntegration
  );

  // =====================================================
  // STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [formData, setFormData] = useState({
    integration_name: "",
    integration_key: "",
    integration_type: "api",
    provider: "",
    description: "",
    api_url: "",
    status: "inactive",
    is_enabled: false,
    configuration: {
      environment: "test",
      currency: "INR",
    },
  });

  const [editingId, setEditingId] =
    useState(null);

  // =====================================================
  // FETCH
  // =====================================================

  useEffect(() => {
    dispatch(fetchIntegrations());
  }, [dispatch]);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredIntegrations = useMemo(() => {
    const searchValue =
      search.toLowerCase();

    return integrations.filter((item) => {
      const matchesSearch =
        String(
          item.integration_name || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(item.integration_key || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(item.provider || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        String(item.status || "")
          .toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    integrations,
    search,
    statusFilter,
  ]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalIntegrations =
    integrations.length;

  const activeIntegrations =
    integrations.filter(
      (item) =>
        String(item.status)
          .toLowerCase() ===
        "active"
    ).length;

  const enabledIntegrations =
    integrations.filter(
      (item) => item.is_enabled === true
    ).length;

  const testingIntegrations =
    integrations.filter(
      (item) =>
        String(item.status)
          .toLowerCase() ===
        "testing"
    ).length;

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfigurationChange = (
    e
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        [name]: value,
      },
    }));
  };

  const handleEnabledChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      is_enabled: e.target.checked,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      integration_name: "",
      integration_key: "",
      integration_type: "api",
      provider: "",
      description: "",
      api_url: "",
      status: "inactive",
      is_enabled: false,
      configuration: {
        environment: "test",
        currency: "INR",
      },
    });

    setEditingId(null);
  };

  // =====================================================
  // ADD
  // =====================================================

  const handleAdd = () => {
    resetForm();
    setShowCreateModal(true);
  };

  // =====================================================
  // CREATE
  // =====================================================

  const handleCreate = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      createIntegration(formData)
    );

    if (
      createIntegration.fulfilled.match(
        result
      )
    ) {
      setShowCreateModal(false);
      resetForm();
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = async (id) => {
    const result = await dispatch(
      fetchIntegrationById(id)
    );

    if (
      fetchIntegrationById.fulfilled.match(
        result
      )
    ) {
      const integration =
        result.payload;

      setEditingId(id);

      setFormData({
        integration_name:
          integration.integration_name ||
          "",
        integration_key:
          integration.integration_key ||
          "",
        integration_type:
          integration.integration_type ||
          "api",
        provider:
          integration.provider || "",
        description:
          integration.description || "",
        api_url:
          integration.api_url || "",
        status:
          integration.status ||
          "inactive",
        is_enabled:
          integration.is_enabled ||
          false,
        configuration:
          integration.configuration || {
            environment: "test",
            currency: "INR",
          },
      });

      setShowEditModal(true);
    }
  };

  // =====================================================
  // UPDATE
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      updateIntegration({
        id: editingId,
        integrationData: formData,
      })
    );

    if (
      updateIntegration.fulfilled.match(
        result
      )
    ) {
      setShowEditModal(false);
      resetForm();
    }
  };

  // =====================================================
  // VIEW
  // =====================================================

  const handleView = async (id) => {
    const result = await dispatch(
      fetchIntegrationById(id)
    );

    if (
      fetchIntegrationById.fulfilled.match(
        result
      )
    ) {
      setShowViewModal(true);
    }
  };

  // =====================================================
  // TOGGLE
  // =====================================================

  const handleToggle = async (id) => {
    await dispatch(
      toggleIntegration(id)
    );
  };

  // =====================================================
  // TEST
  // =====================================================

  const handleTest = async (id) => {
    await dispatch(
      testIntegration(id)
    );
  };

  // =====================================================
  // STATUS
  // =====================================================

  const handleStatusChange = async (
    id,
    status
  ) => {
    await dispatch(
      updateIntegrationStatus({
        id,
        status,
      })
    );
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this integration?"
    );

    if (!confirmed) return;

    await dispatch(
      deleteIntegration(id)
    );
  };

  // =====================================================
  // CLOSE VIEW
  // =====================================================

  const closeViewModal = () => {
    setShowViewModal(false);
    dispatch(
      clearSelectedIntegration()
    );
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(
        date
      ).toLocaleString("en-IN");
    } catch {
      return "-";
    }
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (
      String(status).toLowerCase()
    ) {
      case "active":
        return {
          backgroundColor: "#DFF5E3",
          color: "#198754",
        };

      case "testing":
        return {
          backgroundColor: "#FFF3CD",
          color: "#856404",
        };

      case "error":
        return {
          backgroundColor: "#F8D7DA",
          color: "#842029",
        };

      default:
        return {
          backgroundColor: "#E9ECEF",
          color: "#495057",
        };
    }
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
            Integrations
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Manage external services and
            system integrations.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn"
            onClick={() =>
              dispatch(
                fetchIntegrations()
              )
            }
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
            onClick={handleAdd}
            style={{
              backgroundColor:
                "#111111",
              color: "#FFFFFF",
              border:
                "1px solid #111111",
            }}
          >
            <FaPlus className="me-2" />
            Add Integration
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #C9A227",
            }}
          >
            <small className="text-muted">
              Total Integrations
            </small>

            <h3 className="mb-0 mt-2">
              {totalIntegrations}
            </h3>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #28a745",
            }}
          >
            <small className="text-muted">
              Active
            </small>

            <h3 className="mb-0 mt-2">
              {activeIntegrations}
            </h3>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #007bff",
            }}
          >
            <small className="text-muted">
              Enabled
            </small>

            <h3 className="mb-0 mt-2">
              {enabledIntegrations}
            </h3>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft:
                "4px solid #856404",
            }}
          >
            <small className="text-muted">
              Testing
            </small>

            <h3 className="mb-0 mt-2">
              {testingIntegrations}
            </h3>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
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
                  placeholder="Search by name, key or provider..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />
              </div>
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
                <option value="active">
                  Active
                </option>
                <option value="inactive">
                  Inactive
                </option>
                <option value="testing">
                  Testing
                </option>
                <option value="error">
                  Error
                </option>
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
      {/* TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              System Integrations
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize:
                  "14px",
              }}
            >
              Showing{" "}
              {
                filteredIntegrations.length
              }{" "}
              integrations
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
                Loading integrations...
              </p>
            </div>
          ) : filteredIntegrations.length ===
            0 ? (
            <div className="text-center py-5">
              <FaPlug
                style={{
                  fontSize:
                    "40px",
                  color:
                    "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No integrations
                found.
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
                      Integration
                    </th>

                    <th>
                      Provider
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Enabled
                    </th>

                    <th>
                      Last Tested
                    </th>

                    <th className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredIntegrations.map(
                    (item) => (
                      <tr
                        key={
                          item.id
                        }
                      >
                        <td className="px-3">
                          {item.id}
                        </td>

                        <td>
                          <strong>
                            {
                              item.integration_name
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
                              item.integration_key
                            }
                          </div>
                        </td>

                        <td>
                          {item.provider ||
                            "-"}
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
                            {
                              item.integration_type
                            }
                          </span>
                        </td>

                        <td>
                          <span
                            className="badge"
                            style={
                              getStatusStyle(
                                item.status
                              )
                            }
                          >
                            {
                              item.status
                            }
                          </span>
                        </td>

                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                item.is_enabled
                                  ? "#DFF5E3"
                                  : "#F8D7DA",
                              color:
                                item.is_enabled
                                  ? "#198754"
                                  : "#842029",
                            }}
                          >
                            {item.is_enabled
                              ? "Enabled"
                              : "Disabled"}
                          </span>
                        </td>

                        <td>
                          {formatDate(
                            item.last_tested_at
                          )}
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {/* VIEW */}

                            <button
                              className="btn btn-sm"
                              title="View Integration"
                              onClick={() =>
                                handleView(
                                  item.id
                                )
                              }
                              style={{
                                color:
                                  "#111111",
                                border:
                                  "1px solid #111111",
                              }}
                            >
                              <FaEye />
                            </button>

                            {/* EDIT */}

                            <button
                              className="btn btn-sm"
                              title="Edit Integration"
                              onClick={() =>
                                handleEdit(
                                  item.id
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

                            {/* TEST */}

                            <button
                              className="btn btn-sm"
                              title="Test Integration"
                              onClick={() =>
                                handleTest(
                                  item.id
                                )
                              }
                              disabled={
                                actionLoading
                              }
                              style={{
                                color:
                                  "#007bff",
                                border:
                                  "1px solid #007bff",
                              }}
                            >
                              <FaVial />
                            </button>

                            {/* TOGGLE */}

                            <button
                              className="btn btn-sm"
                              title={
                                item.is_enabled
                                  ? "Disable"
                                  : "Enable"
                              }
                              onClick={() =>
                                handleToggle(
                                  item.id
                                )
                              }
                              disabled={
                                actionLoading
                              }
                              style={{
                                color:
                                  item.is_enabled
                                    ? "#dc3545"
                                    : "#198754",
                                border:
                                  item.is_enabled
                                    ? "1px solid #dc3545"
                                    : "1px solid #198754",
                              }}
                            >
                              <FaPowerOff />
                            </button>

                            {/* DELETE */}

                            <button
                              className="btn btn-sm"
                              title="Delete Integration"
                              onClick={() =>
                                handleDelete(
                                  item.id
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
      {/* CREATE MODAL */}
      {/* ================================================= */}

      {showCreateModal && (
        <div
          className="modal d-block"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form
                onSubmit={
                  handleCreate
                }
              >
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
                    Add Integration
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

                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Integration Name
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="integration_name"
                        value={
                          formData.integration_name
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Integration Key
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="integration_key"
                        value={
                          formData.integration_key
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">
                        Type
                      </label>

                      <select
                        className="form-select"
                        name="integration_type"
                        value={
                          formData.integration_type
                        }
                        onChange={
                          handleChange
                        }
                      >
                        <option value="api">
                          API
                        </option>

                        <option value="payment">
                          Payment
                        </option>

                        <option value="maps">
                          Maps
                        </option>

                        <option value="email">
                          Email
                        </option>

                        <option value="sms">
                          SMS
                        </option>

                        <option value="whatsapp">
                          WhatsApp
                        </option>

                        <option value="notification">
                          Notification
                        </option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">
                        Provider
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="provider"
                        value={
                          formData.provider
                        }
                        onChange={
                          handleChange
                        }
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
                        <option value="inactive">
                          Inactive
                        </option>

                        <option value="active">
                          Active
                        </option>

                        <option value="testing">
                          Testing
                        </option>

                        <option value="error">
                          Error
                        </option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        API URL
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="api_url"
                        value={
                          formData.api_url
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        Description
                      </label>

                      <textarea
                        className="form-control"
                        rows="3"
                        name="description"
                        value={
                          formData.description
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Environment
                      </label>

                      <select
                        className="form-select"
                        name="environment"
                        value={
                          formData
                            .configuration
                            ?.environment ||
                          "test"
                        }
                        onChange={
                          handleConfigurationChange
                        }
                      >
                        <option value="test">
                          Test
                        </option>

                        <option value="production">
                          Production
                        </option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Currency
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="currency"
                        value={
                          formData
                            .configuration
                            ?.currency ||
                          "INR"
                        }
                        onChange={
                          handleConfigurationChange
                        }
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="createIntegrationEnabled"
                          checked={
                            formData.is_enabled
                          }
                          onChange={
                            handleEnabledChange
                          }
                        />

                        <label
                          className="form-check-label"
                          htmlFor="createIntegrationEnabled"
                        >
                          Enable Integration
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
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
                      : "Create Integration"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* EDIT MODAL */}
      {/* ================================================= */}

      {showEditModal && (
        <div
          className="modal d-block"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form
                onSubmit={
                  handleUpdate
                }
              >
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
                    Edit Integration
                  </h5>

                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() =>
                      setShowEditModal(
                        false
                      )
                    }
                  />
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Integration Name
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="integration_name"
                        value={
                          formData.integration_name
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Integration Key
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="integration_key"
                        value={
                          formData.integration_key
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">
                        Type
                      </label>

                      <select
                        className="form-select"
                        name="integration_type"
                        value={
                          formData.integration_type
                        }
                        onChange={
                          handleChange
                        }
                      >
                        <option value="api">
                          API
                        </option>

                        <option value="payment">
                          Payment
                        </option>

                        <option value="maps">
                          Maps
                        </option>

                        <option value="email">
                          Email
                        </option>

                        <option value="sms">
                          SMS
                        </option>

                        <option value="whatsapp">
                          WhatsApp
                        </option>

                        <option value="notification">
                          Notification
                        </option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">
                        Provider
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="provider"
                        value={
                          formData.provider
                        }
                        onChange={
                          handleChange
                        }
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
                        <option value="inactive">
                          Inactive
                        </option>

                        <option value="active">
                          Active
                        </option>

                        <option value="testing">
                          Testing
                        </option>

                        <option value="error">
                          Error
                        </option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        API URL
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="api_url"
                        value={
                          formData.api_url
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        Description
                      </label>

                      <textarea
                        className="form-control"
                        rows="3"
                        name="description"
                        value={
                          formData.description
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Environment
                      </label>

                      <select
                        className="form-select"
                        name="environment"
                        value={
                          formData
                            .configuration
                            ?.environment ||
                          "test"
                        }
                        onChange={
                          handleConfigurationChange
                        }
                      >
                        <option value="test">
                          Test
                        </option>

                        <option value="production">
                          Production
                        </option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Currency
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="currency"
                        value={
                          formData
                            .configuration
                            ?.currency ||
                          "INR"
                        }
                        onChange={
                          handleConfigurationChange
                        }
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="editIntegrationEnabled"
                          checked={
                            formData.is_enabled
                          }
                          onChange={
                            handleEnabledChange
                          }
                        />

                        <label
                          className="form-check-label"
                          htmlFor="editIntegrationEnabled"
                        >
                          Enable Integration
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      setShowEditModal(
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
                      ? "Updating..."
                      : "Update Integration"}
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
        selectedIntegration && (
          <div
            className="modal d-block"
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
                    color:
                      "#FFFFFF",
                  }}
                >
                  <h5 className="modal-title">
                    Integration Details
                  </h5>

                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={
                      closeViewModal
                    }
                  />
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <strong>
                        Integration Name
                      </strong>

                      <p className="text-muted">
                        {
                          selectedIntegration.integration_name
                        }
                      </p>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Integration Key
                      </strong>

                      <p className="text-muted">
                        {
                          selectedIntegration.integration_key
                        }
                      </p>
                    </div>

                    <div className="col-md-4">
                      <strong>
                        Provider
                      </strong>

                      <p className="text-muted">
                        {
                          selectedIntegration.provider ||
                          "-"
                        }
                      </p>
                    </div>

                    <div className="col-md-4">
                      <strong>
                        Type
                      </strong>

                      <p className="text-muted">
                        {
                          selectedIntegration.integration_type ||
                          "-"
                        }
                      </p>
                    </div>

                    <div className="col-md-4">
                      <strong>
                        Status
                      </strong>

                      <p>
                        <span
                          className="badge"
                          style={
                            getStatusStyle(
                              selectedIntegration.status
                            )
                          }
                        >
                          {
                            selectedIntegration.status
                          }
                        </span>
                      </p>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Enabled
                      </strong>

                      <p>
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              selectedIntegration.is_enabled
                                ? "#DFF5E3"
                                : "#F8D7DA",
                            color:
                              selectedIntegration.is_enabled
                                ? "#198754"
                                : "#842029",
                          }}
                        >
                          {selectedIntegration.is_enabled
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </p>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        API URL
                      </strong>

                      <p className="text-muted">
                        {
                          selectedIntegration.api_url ||
                          "-"
                        }
                      </p>
                    </div>

                    <div className="col-12">
                      <strong>
                        Description
                      </strong>

                      <p className="text-muted">
                        {
                          selectedIntegration.description ||
                          "-"
                        }
                      </p>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Created By
                      </strong>

                      <p className="text-muted">
                        {
                          selectedIntegration.created_by_name ||
                          "-"
                        }
                      </p>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Created Date
                      </strong>

                      <p className="text-muted">
                        {formatDate(
                          selectedIntegration.created_at
                        )}
                      </p>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Last Tested
                      </strong>

                      <p className="text-muted">
                        {formatDate(
                          selectedIntegration.last_tested_at
                        )}
                      </p>
                    </div>

                    <div className="col-md-6">
                      <strong>
                        Updated Date
                      </strong>

                      <p className="text-muted">
                        {formatDate(
                          selectedIntegration.updated_at
                        )}
                      </p>
                    </div>

                    <div className="col-12">
                      <strong>
                        Configuration
                      </strong>

                      <pre
                        className="bg-light p-3 rounded mt-2"
                        style={{
                          fontSize:
                            "13px",
                        }}
                      >
                        {JSON.stringify(
                          selectedIntegration.configuration ||
                            {},
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn"
                    onClick={
                      closeViewModal
                    }
                    style={{
                      backgroundColor:
                        "#111111",
                      color:
                        "#FFFFFF",
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

export default SuperAdminIntegrations;