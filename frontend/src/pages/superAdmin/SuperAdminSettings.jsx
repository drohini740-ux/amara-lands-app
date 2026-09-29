
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCog,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaSync,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import {
  fetchSettings,
  createSetting,
  updateSetting,
  deleteSetting,
} from "../../redux/superAdminSettingsSlice";

const SuperAdminSettings = () => {
  const dispatch = useDispatch();

  const {
    settings,
    loading,
    error,
  } = useSelector(
    (state) => state.superAdminSettings
  );

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingSetting, setEditingSetting] =
    useState(null);

  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    setting_key: "",
    setting_value: "",
    setting_type: "text",
    category: "general",
    description: "",
    is_editable: true,
  });

  // =====================================================
  // FETCH SETTINGS
  // =====================================================

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleAdd = () => {
    setEditingSetting(null);

    setFormData({
      setting_key: "",
      setting_value: "",
      setting_type: "text",
      category: "general",
      description: "",
      is_editable: true,
    });

    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEdit = (setting) => {
    setEditingSetting(setting);

    setFormData({
      setting_key: setting.setting_key || "",
      setting_value: setting.setting_value || "",
      setting_type:
        setting.setting_type || "text",
      category:
        setting.category || "general",
      description:
        setting.description || "",
      is_editable:
        setting.is_editable !== false,
    });

    setShowModal(true);
  };

  // =====================================================
  // SAVE SETTING
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.setting_key.trim()) {
      alert("Setting key is required.");
      return;
    }

    if (editingSetting) {
      await dispatch(
        updateSetting({
          id: editingSetting.id,
          settingData: {
            setting_value:
              formData.setting_value,
            setting_type:
              formData.setting_type,
            category:
              formData.category,
            description:
              formData.description,
            is_editable:
              formData.is_editable,
          },
        })
      ).unwrap();
    } else {
      await dispatch(
        createSetting(formData)
      ).unwrap();
    }

    setShowModal(false);
    setEditingSetting(null);
  };

  // =====================================================
  // DELETE SETTING
  // =====================================================

  const handleDelete = async () => {
    if (!deleteId) return;

    await dispatch(
      deleteSetting(deleteId)
    ).unwrap();

    setDeleteId(null);
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    dispatch(fetchSettings());
  };

  // =====================================================
  // FILTER SETTINGS
  // =====================================================

  const filteredSettings = settings.filter(
    (setting) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        String(
          setting.setting_key || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          setting.setting_value || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          setting.description || ""
        )
          .toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        categoryFilter === "all" ||
        String(
          setting.category || ""
        ).toLowerCase() ===
          categoryFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    ...new Set(
      settings
        .map((setting) => setting.category)
        .filter(Boolean)
    ),
  ];

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
            System Settings
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Manage application-wide system
            configuration.
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
            Add Setting
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
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
                  Total Settings
                </small>

                <h3 className="mb-0 mt-2">
                  {settings.length}
                </h3>
              </div>

              <FaCog
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

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
                  Editable
                </small>

                <h3 className="mb-0 mt-2">
                  {
                    settings.filter(
                      (setting) =>
                        setting.is_editable
                    ).length
                  }
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
                  Locked
                </small>

                <h3 className="mb-0 mt-2">
                  {
                    settings.filter(
                      (setting) =>
                        !setting.is_editable
                    ).length
                  }
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
                  placeholder="Search setting..."
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
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Categories
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
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
      {/* TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>
              Application Settings
            </strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              {filteredSettings.length}{" "}
              settings
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
                Loading settings...
              </p>
            </div>
          ) : filteredSettings.length ===
            0 ? (
            <div className="text-center py-5">
              <FaCog
                style={{
                  fontSize: "40px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No settings found.
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
                      Setting
                    </th>

                    <th>
                      Value
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Updated By
                    </th>

                    <th className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSettings.map(
                    (setting) => (
                      <tr
                        key={setting.id}
                      >
                        <td className="px-3">
                          {setting.id}
                        </td>

                        <td>
                          <strong>
                            {
                              setting.setting_key
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
                              setting.description ||
                              "-"
                            }
                          </div>
                        </td>

                        <td>
                          <span
                            style={{
                              fontFamily:
                                "monospace",
                              color:
                                "#333333",
                            }}
                          >
                            {
                              setting.setting_value ||
                              "-"
                            }
                          </span>
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
                              setting.setting_type ||
                              "text"
                            }
                          </span>
                        </td>

                        <td>
                          {
                            setting.category ||
                            "-"
                          }
                        </td>

                        <td>
                          {setting.is_editable ? (
                            <span
                              className="badge"
                              style={{
                                backgroundColor:
                                  "#DFF5E3",
                                color:
                                  "#198754",
                              }}
                            >
                              Editable
                            </span>
                          ) : (
                            <span
                              className="badge"
                              style={{
                                backgroundColor:
                                  "#F8D7DA",
                                color:
                                  "#842029",
                              }}
                            >
                              Locked
                            </span>
                          )}
                        </td>

                        <td>
                          <div>
                            {
                              setting.updated_by_name ||
                              "-"
                            }
                          </div>

                          <small className="text-muted">
                            {
                              setting.updated_by_email ||
                              ""
                            }
                          </small>
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-sm"
                              title="Edit Setting"
                              disabled={
                                !setting.is_editable
                              }
                              onClick={() =>
                                handleEdit(
                                  setting
                                )
                              }
                              style={{
                                color:
                                  setting.is_editable
                                    ? "#C9A227"
                                    : "#999999",
                                border:
                                  "1px solid " +
                                  (setting.is_editable
                                    ? "#C9A227"
                                    : "#999999"),
                              }}
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="btn btn-sm"
                              title="Delete Setting"
                              disabled={
                                !setting.is_editable
                              }
                              onClick={() =>
                                setDeleteId(
                                  setting.id
                                )
                              }
                              style={{
                                color:
                                  setting.is_editable
                                    ? "#dc3545"
                                    : "#999999",
                                border:
                                  "1px solid " +
                                  (setting.is_editable
                                    ? "#dc3545"
                                    : "#999999"),
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
          style={{
            backgroundColor:
              "rgba(0,0,0,0.55)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
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
                  {editingSetting
                    ? "Edit System Setting"
                    : "Add System Setting"}
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
                  <div className="row g-3">
                    {/* KEY */}

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Setting Key
                      </label>

                      <input
                        type="text"
                        name="setting_key"
                        className="form-control"
                        placeholder="Example: site_name"
                        value={
                          formData.setting_key
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          !!editingSetting
                        }
                        required
                      />

                      {editingSetting && (
                        <small className="text-muted">
                          Setting key cannot
                          be changed after
                          creation.
                        </small>
                      )}
                    </div>

                    {/* TYPE */}

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Setting Type
                      </label>

                      <select
                        name="setting_type"
                        className="form-select"
                        value={
                          formData.setting_type
                        }
                        onChange={
                          handleChange
                        }
                      >
                        <option value="text">
                          Text
                        </option>

                        <option value="number">
                          Number
                        </option>

                        <option value="boolean">
                          Boolean
                        </option>

                        <option value="url">
                          URL
                        </option>

                        <option value="email">
                          Email
                        </option>

                        <option value="json">
                          JSON
                        </option>
                      </select>
                    </div>

                    {/* VALUE */}

                    <div className="col-md-12">
                      <label className="form-label fw-semibold">
                        Setting Value
                      </label>

                      <textarea
                        name="setting_value"
                        className="form-control"
                        rows="3"
                        placeholder="Enter setting value..."
                        value={
                          formData.setting_value
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                    {/* CATEGORY */}

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Category
                      </label>

                      <select
                        name="category"
                        className="form-select"
                        value={
                          formData.category
                        }
                        onChange={
                          handleChange
                        }
                      >
                        <option value="general">
                          General
                        </option>

                        <option value="security">
                          Security
                        </option>

                        <option value="notifications">
                          Notifications
                        </option>

                        <option value="payments">
                          Payments
                        </option>

                        <option value="system">
                          System
                        </option>

                        <option value="application">
                          Application
                        </option>

                        <option value="integration">
                          Integration
                        </option>
                      </select>
                    </div>

                    {/* EDITABLE */}

                    <div className="col-md-6 d-flex align-items-end">
                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          name="is_editable"
                          className="form-check-input"
                          id="is_editable"
                          checked={
                            formData.is_editable
                          }
                          onChange={
                            handleChange
                          }
                        />

                        <label
                          className="form-check-label"
                          htmlFor="is_editable"
                        >
                          Allow editing
                        </label>
                      </div>
                    </div>

                    {/* DESCRIPTION */}

                    <div className="col-md-12">
                      <label className="form-label fw-semibold">
                        Description
                      </label>

                      <textarea
                        name="description"
                        className="form-control"
                        rows="3"
                        placeholder="Describe this setting..."
                        value={
                          formData.description
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>
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
                      color: "#FFFFFF",
                    }}
                  >
                    {editingSetting
                      ? "Update Setting"
                      : "Create Setting"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* DELETE CONFIRMATION */}
      {/* ================================================= */}

      {deleteId && (
        <div
          className="modal d-block"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.55)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">
                  Delete Setting
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setDeleteId(null)
                  }
                />
              </div>

              <div className="modal-body">
                <p className="mb-0">
                  Are you sure you want to
                  delete this system setting?
                </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() =>
                    setDeleteId(null)
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminSettings;

