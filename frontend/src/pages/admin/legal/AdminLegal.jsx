import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LegalConsultations from "./LegalConsultations";
import LegalTeam from "./LegalTeam";
import {
  FaEye,
  FaSearch,
  FaTrash,
  FaEdit,
  FaUserTie,
  FaGavel,
  FaClipboardList,
  FaCalendarAlt,
  FaComments,
} from "react-icons/fa";

import {
  fetchAdminLegalCases,
  updateAdminLegalCase,
  deleteAdminLegalCase,
} from "../../../redux/adminLegalSlice";

// Internal Legal Management sections
import CaseTracking from "./CaseTracking";
import UpcomingHearings from "./UpcomingHearings";

const EMPTY_FORM = {
  case_title: "",
  case_number: "",
  court_name: "",
  advocate_name: "",
  hearing_date: "",
  status: "Open",
  remarks: "",
};

const AdminLegal = () => {
  const dispatch = useDispatch();

  const {
    legalCases = [],
    loading,
    error,
  } = useSelector((state) => state.adminLegal);

  // =====================================================
  // ACTIVE SECTION
  // =====================================================

  const [activeSection, setActiveSection] = useState("cases");

  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =====================================================
  // VIEW / EDIT MODAL
  // =====================================================

  const [selectedCase, setSelectedCase] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // FETCH LEGAL CASES
  // =====================================================

  useEffect(() => {
    if (activeSection === "cases") {
      dispatch(fetchAdminLegalCases());
    }
  }, [dispatch, activeSection]);

  // =====================================================
  // SEARCH + STATUS FILTER
  // =====================================================

  const filteredCases = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return legalCases.filter((item) => {
      const matchesSearch =
        String(item.case_title || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.case_number || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.property_name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.customer_name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.advocate_name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.court_name || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        String(item.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [legalCases, search, statusFilter]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalCases = legalCases.length;

  const openCases = legalCases.filter(
    (item) => String(item.status || "").toLowerCase() === "open",
  ).length;

  const pendingCases = legalCases.filter(
    (item) => String(item.status || "").toLowerCase() === "pending",
  ).length;

  const closedCases = legalCases.filter(
    (item) => String(item.status || "").toLowerCase() === "closed",
  ).length;

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const dateString = String(date).substring(0, 10);

    const parsedDate = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return dateString;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // OPEN VIEW / EDIT MODAL
  // =====================================================

  const handleView = (item) => {
    setSelectedCase(item);

    setForm({
      case_title: item.case_title || "",
      case_number: item.case_number || "",
      court_name: item.court_name || "",
      advocate_name: item.advocate_name || "",
      hearing_date: item.hearing_date
        ? String(item.hearing_date).substring(0, 10)
        : "",
      status: item.status || "Open",
      remarks: item.remarks || "",
    });

    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setSelectedCase(null);
    setForm(EMPTY_FORM);
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
  // UPDATE LEGAL CASE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCase?.id) {
      return;
    }

    if (!form.case_title.trim()) {
      alert("Please enter the case title.");
      return;
    }

    try {
      setSaving(true);

      await dispatch(
        updateAdminLegalCase({
          id: selectedCase.id,

          data: {
            case_title: form.case_title.trim(),
            case_number: form.case_number.trim(),
            court_name: form.court_name.trim(),
            advocate_name: form.advocate_name.trim(),
            hearing_date: form.hearing_date || null,
            status: form.status,
            remarks: form.remarks.trim(),
          },
        }),
      ).unwrap();

      alert("Legal case updated successfully.");

      handleCloseModal();

      // Refresh the joined property/customer information
      await dispatch(fetchAdminLegalCases()).unwrap();
    } catch (err) {
      console.error("Update legal case error:", err);

      alert(
        typeof err === "string"
          ? err
          : err?.message || "Failed to update legal case.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE CASE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this legal case?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteAdminLegalCase(id)).unwrap();

      alert("Legal case deleted successfully.");
    } catch (err) {
      console.error("Delete legal case error:", err);

      alert(
        typeof err === "string"
          ? err
          : err?.message || "Failed to delete legal case.",
      );
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    switch (value) {
      case "open":
        return {
          background: "#fff3cd",
          color: "#856404",
          border: "1px solid #c9a227",
        };

      case "pending":
        return {
          background: "#fff3cd",
          color: "#856404",
          border: "1px solid #c9a227",
        };

      case "closed":
        return {
          background: "#111",
          color: "#fff",
          border: "1px solid #111",
        };

      case "in progress":
        return {
          background: "#f8f9fa",
          color: "#111",
          border: "1px solid #c9a227",
        };

      case "on hold":
        return {
          background: "#f8f9fa",
          color: "#856404",
          border: "1px solid #c9a227",
        };

      default:
        return {
          background: "#fff",
          color: "#111",
          border: "1px solid #c9a227",
        };
    }
  };

  // =====================================================
  // TAB STYLE
  // =====================================================

  const getTabStyle = (tabName) => {
    const active = activeSection === tabName;

    return {
      background: active ? "#c9a227" : "#fff",
      color: active ? "#111" : "#444",
      border: active ? "1px solid #c9a227" : "1px solid #ddd",
      fontWeight: "600",
      padding: "11px 18px",
      borderRadius: "6px",
      whiteSpace: "nowrap",
      cursor: "pointer",
      transition: "all 0.2s ease",
      minWidth: "145px",
    };
  };

  return (
    <div
      style={{
        background: "#f7f7f7",
        minHeight: "100vh",
        padding: "25px",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-4">
        <h2
          style={{
            color: "#111",
            fontWeight: "700",
            marginBottom: "5px",
          }}
        >
          Legal Management
        </h2>

        <p className="text-muted mb-0">
          Manage and monitor all property legal cases
        </p>
      </div>

      {/* =====================================================
          LEGAL MANAGEMENT TABS
      ===================================================== */}

      <div
        className="card border-0 shadow-sm mb-4"
        style={{
          background: "#fff",
        }}
      >
        <div
          className="card-body"
          style={{
            padding: "10px",
            overflowX: "auto",
          }}
        >
          <div
            className="d-flex align-items-center"
            style={{
              gap: "8px",
              minWidth: "max-content",
            }}
          >
            {/* ALL CASES */}

            <button
              type="button"
              onClick={() => setActiveSection("cases")}
              style={getTabStyle("cases")}
            >
              <FaGavel className="me-2" />
              All Cases
            </button>

            {/* CASE TRACKING */}

            <button
              type="button"
              onClick={() => setActiveSection("tracking")}
              style={getTabStyle("tracking")}
            >
              <FaClipboardList className="me-2" />
              Case Tracking
            </button>

            {/* UPCOMING HEARINGS */}

            <button
              type="button"
              onClick={() => setActiveSection("hearings")}
              style={getTabStyle("hearings")}
            >
              <FaCalendarAlt className="me-2" />
              Upcoming Hearings
            </button>

            {/* CONSULTATIONS */}

            <button
              type="button"
              onClick={() => setActiveSection("consultations")}
              style={getTabStyle("consultations")}
            >
              <FaComments className="me-2" />
              Consultations
            </button>

            {/* LEGAL TEAM */}

            <button
              type="button"
              onClick={() => setActiveSection("team")}
              style={getTabStyle("team")}
            >
              <FaUserTie className="me-2" />
              Legal Team
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          ALL CASES
      ===================================================== */}

      {activeSection === "cases" && (
        <>
          {/* ERROR */}

          {error && <div className="alert alert-danger">{error}</div>}

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div className="row g-3 mb-4">
            {/* TOTAL */}

            <div className="col-md-3">
              <div
                className="card border-0 shadow-sm h-100"
                style={{
                  borderTop: "4px solid #c9a227",
                }}
              >
                <div className="card-body">
                  <p className="text-muted mb-1">Total Cases</p>

                  <h3
                    style={{
                      color: "#111",
                      fontWeight: "700",
                    }}
                  >
                    {totalCases}
                  </h3>
                </div>
              </div>
            </div>

            {/* OPEN */}

            <div className="col-md-3">
              <div
                className="card border-0 shadow-sm h-100"
                style={{
                  borderTop: "4px solid #c9a227",
                }}
              >
                <div className="card-body">
                  <p className="text-muted mb-1">Open Cases</p>

                  <h3
                    style={{
                      color: "#111",
                      fontWeight: "700",
                    }}
                  >
                    {openCases}
                  </h3>
                </div>
              </div>
            </div>

            {/* PENDING */}

            <div className="col-md-3">
              <div
                className="card border-0 shadow-sm h-100"
                style={{
                  borderTop: "4px solid #c9a227",
                }}
              >
                <div className="card-body">
                  <p className="text-muted mb-1">Pending Cases</p>

                  <h3
                    style={{
                      color: "#111",
                      fontWeight: "700",
                    }}
                  >
                    {pendingCases}
                  </h3>
                </div>
              </div>
            </div>

            {/* CLOSED */}

            <div className="col-md-3">
              <div
                className="card border-0 shadow-sm h-100"
                style={{
                  borderTop: "4px solid #111",
                }}
              >
                <div className="card-body">
                  <p className="text-muted mb-1">Closed Cases</p>

                  <h3
                    style={{
                      color: "#111",
                      fontWeight: "700",
                    }}
                  >
                    {closedCases}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              SEARCH + FILTER
          ================================================= */}

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-8">
                  <div className="input-group">
                    <span
                      className="input-group-text"
                      style={{
                        background: "#111",
                        color: "#fff",
                        border: "1px solid #111",
                      }}
                    >
                      <FaSearch />
                    </span>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by case, property, customer, case number, court or advocate..."
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
                    <option value="All">All Status</option>

                    <option value="Open">Open</option>

                    <option value="Pending">Pending</option>

                    <option value="In Progress">In Progress</option>

                    <option value="On Hold">On Hold</option>

                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              LEGAL CASE TABLE
          ================================================= */}

          <div className="card border-0 shadow-sm">
            <div
              className="card-header"
              style={{
                background: "#c9a227",
                color: "#111",
                fontWeight: "700",
                fontSize: "18px",
              }}
            >
              <FaGavel className="me-2" />
              All Legal Cases
            </div>

            <div className="card-body p-0">
              <div
                className="table-responsive"
                style={{
                  overflowX: "auto",
                }}
              >
                <table className="table table-hover align-middle mb-0">
                  <thead
                    style={{
                      background: "#111",
                      color: "#fff",
                    }}
                  >
                    <tr>
                      <th
                        className="px-3 py-3"
                        style={{
                          minWidth: "150px",
                        }}
                      >
                        Property
                      </th>

                      <th
                        style={{
                          minWidth: "160px",
                        }}
                      >
                        Customer
                      </th>

                      <th
                        style={{
                          minWidth: "120px",
                        }}
                      >
                        Case Number
                      </th>

                      <th
                        style={{
                          minWidth: "180px",
                        }}
                      >
                        Case Title
                      </th>

                      <th
                        style={{
                          minWidth: "180px",
                        }}
                      >
                        Court
                      </th>

                      <th
                        style={{
                          minWidth: "160px",
                        }}
                      >
                        Advocate
                      </th>

                      <th
                        style={{
                          minWidth: "130px",
                        }}
                      >
                        Hearing
                      </th>

                      <th
                        style={{
                          minWidth: "100px",
                        }}
                      >
                        Status
                      </th>

                      <th
                        className="text-center"
                        style={{
                          minWidth: "120px",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="9" className="text-center py-5">
                          <div
                            className="spinner-border"
                            style={{
                              color: "#c9a227",
                            }}
                          ></div>

                          <div className="mt-2 text-muted">
                            Loading legal cases...
                          </div>
                        </td>
                      </tr>
                    ) : filteredCases.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-5 text-muted">
                          No legal cases found.
                        </td>
                      </tr>
                    ) : (
                      filteredCases.map((item) => (
                        <tr key={item.id}>
                          {/* PROPERTY */}

                          <td className="px-3">
                            <strong>{item.property_name || "-"}</strong>

                            {item.survey_number && (
                              <div className="small text-muted">
                                Survey: {item.survey_number}
                              </div>
                            )}
                          </td>

                          {/* CUSTOMER */}

                          <td>
                            <strong>{item.customer_name || "-"}</strong>

                            {item.customer_email && (
                              <div className="small text-muted">
                                {item.customer_email}
                              </div>
                            )}
                          </td>

                          {/* CASE NUMBER */}

                          <td>{item.case_number || "-"}</td>

                          {/* CASE TITLE */}

                          <td>
                            <strong>{item.case_title || "-"}</strong>
                          </td>

                          {/* COURT */}

                          <td>{item.court_name || "-"}</td>

                          {/* ADVOCATE */}

                          <td>
                            {item.advocate_name ? (
                              <span>
                                <FaUserTie
                                  className="me-1"
                                  style={{
                                    color: "#c9a227",
                                  }}
                                />

                                {item.advocate_name}
                              </span>
                            ) : (
                              <span className="text-muted">Not Assigned</span>
                            )}
                          </td>

                          {/* HEARING */}

                          <td>{formatDate(item.hearing_date)}</td>

                          {/* STATUS */}

                          <td>
                            <span
                              className="badge px-3 py-2"
                              style={getStatusStyle(item.status)}
                            >
                              {item.status || "Open"}
                            </span>
                          </td>

                          {/* ACTIONS */}

                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              {/* VIEW / EDIT */}

                              <button
                                type="button"
                                className="btn btn-sm"
                                title="View / Edit Case"
                                onClick={() => handleView(item)}
                                style={{
                                  background: "#c9a227",
                                  color: "#111",
                                  border: "1px solid #c9a227",
                                }}
                              >
                                <FaEye />
                              </button>

                              {/* DELETE */}

                              <button
                                type="button"
                                className="btn btn-sm"
                                title="Delete Case"
                                onClick={() => handleDelete(item.id)}
                                style={{
                                  background: "#111",
                                  color: "#fff",
                                  border: "1px solid #111",
                                }}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================
          CASE TRACKING
      ===================================================== */}

      {activeSection === "tracking" && <CaseTracking />}

      {/* =====================================================
          UPCOMING HEARINGS
      ===================================================== */}

      {activeSection === "hearings" && <UpcomingHearings />}

      {/* =====================================================
          CONSULTATIONS
      ===================================================== */}

      {activeSection === "consultations" && <LegalConsultations />}
      {/* =====================================================
          LEGAL TEAM
      ===================================================== */}

      {activeSection === "team" && <LegalTeam />}
      {/* =====================================================
          VIEW / EDIT MODAL
      ===================================================== */}

      {showModal && selectedCase && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            zIndex: 1050,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            className="bg-white rounded shadow-lg"
            style={{
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div
              className="d-flex justify-content-between align-items-center p-3"
              style={{
                background: "#111",
                color: "#fff",
              }}
            >
              <div>
                <h5 className="mb-1">Legal Case Details</h5>

                <small
                  style={{
                    color: "#c9a227",
                  }}
                >
                  Case ID: #{selectedCase.id}
                </small>
              </div>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleCloseModal}
                disabled={saving}
              ></button>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form onSubmit={handleSubmit}>
              <div className="p-4">
                {/* PROPERTY + CUSTOMER */}

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Property</label>

                    <input
                      type="text"
                      className="form-control"
                      value={selectedCase.property_name || "-"}
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Customer</label>

                    <input
                      type="text"
                      className="form-control"
                      value={selectedCase.customer_name || "-"}
                      disabled
                    />
                  </div>
                </div>

                <hr />

                {/* CASE TITLE */}

                <div className="mb-3">
                  <label className="form-label fw-bold">Case Title</label>

                  <input
                    type="text"
                    name="case_title"
                    className="form-control"
                    value={form.case_title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* CASE NUMBER + COURT */}

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Case Number</label>

                    <input
                      type="text"
                      name="case_number"
                      className="form-control"
                      value={form.case_number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Court Name</label>

                    <input
                      type="text"
                      name="court_name"
                      className="form-control"
                      value={form.court_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* ADVOCATE */}

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <FaUserTie
                      className="me-2"
                      style={{
                        color: "#c9a227",
                      }}
                    />
                    Assign Advocate
                  </label>

                  <input
                    type="text"
                    name="advocate_name"
                    className="form-control"
                    placeholder="Enter advocate name"
                    value={form.advocate_name}
                    onChange={handleChange}
                  />

                  <small className="text-muted">
                    Enter the advocate responsible for this legal case.
                  </small>
                </div>

                {/* HEARING + STATUS */}

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Hearing Date</label>

                    <input
                      type="date"
                      name="hearing_date"
                      className="form-control"
                      value={form.hearing_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Status</label>

                    <select
                      name="status"
                      className="form-select"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="Open">Open</option>

                      <option value="Pending">Pending</option>

                      <option value="In Progress">In Progress</option>

                      <option value="On Hold">On Hold</option>

                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* REMARKS */}

                <div className="mb-3">
                  <label className="form-label fw-bold">Remarks</label>

                  <textarea
                    name="remarks"
                    className="form-control"
                    rows="4"
                    value={form.remarks}
                    onChange={handleChange}
                    placeholder="Enter case remarks..."
                  ></textarea>
                </div>
              </div>

              {/* =================================================
                  MODAL FOOTER
              ================================================= */}

              <div
                className="d-flex justify-content-end gap-2 p-3"
                style={{
                  borderTop: "1px solid #ddd",
                  background: "#fafafa",
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn"
                  disabled={saving}
                  style={{
                    background: "#c9a227",
                    color: "#111",
                    fontWeight: "600",
                  }}
                >
                  <FaEdit className="me-2" />

                  {saving ? "Updating..." : "Update Legal Case"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLegal;
