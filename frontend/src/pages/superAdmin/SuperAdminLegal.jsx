import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSuperAdminLegalCases,
  fetchSuperAdminLegalCaseById,
  updateSuperAdminLegalCaseStatus,
  fetchSuperAdminLegalConsultations,
  updateSuperAdminConsultationStatus,
  clearSelectedCase,
} from "../../redux/superAdminLegalSlice";

const SuperAdminLegal = () => {
  const dispatch = useDispatch();

  const {
    cases,
    consultations,
    selectedCase,
    loading,
    consultationsLoading,
    error,
    consultationsError,
  } = useSelector((state) => state.superAdminLegal);

  const [activeTab, setActiveTab] = useState("cases");

  const [search, setSearch] = useState("");
  const [caseStatusFilter, setCaseStatusFilter] = useState("All");
  const [consultationStatusFilter, setConsultationStatusFilter] =
    useState("All");

  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] =
    useState(false);

  const [selectedConsultation, setSelectedConsultation] =
    useState(null);

  useEffect(() => {
    dispatch(fetchSuperAdminLegalCases());
    dispatch(fetchSuperAdminLegalConsultations());
  }, [dispatch]);

  // =====================================================
  // CASE FILTER
  // =====================================================

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        String(item.id).includes(searchText) ||
        (item.case_title || "")
          .toLowerCase()
          .includes(searchText) ||
        (item.case_number || "")
          .toLowerCase()
          .includes(searchText) ||
        (item.advocate_name || "")
          .toLowerCase()
          .includes(searchText) ||
        (item.property_name || "")
          .toLowerCase()
          .includes(searchText) ||
        (item.owner_name || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        caseStatusFilter === "All" ||
        item.status === caseStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [cases, search, caseStatusFilter]);

  // =====================================================
  // CONSULTATION FILTER
  // =====================================================

  const filteredConsultations = useMemo(() => {
    return consultations.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        String(item.id).includes(searchText) ||
        (item.user_name || "")
          .toLowerCase()
          .includes(searchText) ||
        (item.case_title || "")
          .toLowerCase()
          .includes(searchText) ||
        (item.case_number || "")
          .toLowerCase()
          .includes(searchText) ||
        (item.meeting_type || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        consultationStatusFilter === "All" ||
        item.status === consultationStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    consultations,
    search,
    consultationStatusFilter,
  ]);

  // =====================================================
  // SUMMARY COUNTS
  // =====================================================

  const totalCases = cases.length;

  const openCases = cases.filter(
    (item) => item.status === "Open"
  ).length;

  const inProgressCases = cases.filter(
    (item) => item.status === "In Progress"
  ).length;

  const closedCases = cases.filter(
    (item) => item.status === "Closed"
  ).length;

  const pendingConsultations = consultations.filter(
    (item) => item.status === "Pending"
  ).length;

  const confirmedConsultations = consultations.filter(
    (item) => item.status === "Confirmed"
  ).length;

  // =====================================================
  // VIEW CASE
  // =====================================================

  const handleViewCase = async (id) => {
    const result = await dispatch(
      fetchSuperAdminLegalCaseById(id)
    );

    if (
      fetchSuperAdminLegalCaseById.fulfilled.match(result)
    ) {
      setShowCaseModal(true);
    }
  };

  // =====================================================
  // UPDATE CASE STATUS
  // =====================================================

  const handleCaseStatusChange = async (id, status) => {
    await dispatch(
      updateSuperAdminLegalCaseStatus({
        id,
        status,
      })
    );

    dispatch(fetchSuperAdminLegalCases());
  };

  // =====================================================
  // UPDATE CONSULTATION STATUS
  // =====================================================

  const handleConsultationStatusChange = async (
    id,
    status
  ) => {
    await dispatch(
      updateSuperAdminConsultationStatus({
        id,
        status,
      })
    );

    dispatch(fetchSuperAdminLegalConsultations());
  };

  // =====================================================
  // CLOSE CASE MODAL
  // =====================================================

  const closeCaseModal = () => {
    setShowCaseModal(false);
    dispatch(clearSelectedCase());
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN");
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Open":
        return {
          background: "#E8F5E9",
          color: "#2E7D32",
        };

      case "In Progress":
        return {
          background: "#FFF8E1",
          color: "#B8860B",
        };

      case "Closed":
        return {
          background: "#EEEEEE",
          color: "#555555",
        };

      case "Pending":
        return {
          background: "#FFF3E0",
          color: "#E65100",
        };

      case "Confirmed":
        return {
          background: "#E3F2FD",
          color: "#1565C0",
        };

      case "Completed":
        return {
          background: "#E8F5E9",
          color: "#2E7D32",
        };

      case "Cancelled":
        return {
          background: "#FFEBEE",
          color: "#C62828",
        };

      default:
        return {
          background: "#F5F5F5",
          color: "#555555",
        };
    }
  };

  return (
    <div
      style={{
        padding: "28px",
        minHeight: "100vh",
        background: "#F5F5F5",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#111111",
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            Legal Management
          </h1>

          <p
            style={{
              marginTop: "7px",
              color: "#777777",
              fontSize: "14px",
            }}
          >
            Manage legal cases and legal consultations
          </p>
        </div>
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "25px",
        }}
      >
        <SummaryCard
          title="Total Cases"
          value={totalCases}
        />

        <SummaryCard
          title="Open Cases"
          value={openCases}
        />

        <SummaryCard
          title="In Progress"
          value={inProgressCases}
        />

        <SummaryCard
          title="Closed Cases"
          value={closedCases}
        />

        <SummaryCard
          title="Pending Consultations"
          value={pendingConsultations}
        />

        <SummaryCard
          title="Confirmed Consultations"
          value={confirmedConsultations}
        />
      </div>

      {/* =================================================
          TABS
      ================================================= */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "18px",
        }}
      >
        <button
          onClick={() => {
            setActiveTab("cases");
            setSearch("");
          }}
          style={{
            ...tabButton,
            background:
              activeTab === "cases"
                ? "#111111"
                : "#FFFFFF",
            color:
              activeTab === "cases"
                ? "#D4AF37"
                : "#555555",
          }}
        >
          Legal Cases
        </button>

        <button
          onClick={() => {
            setActiveTab("consultations");
            setSearch("");
          }}
          style={{
            ...tabButton,
            background:
              activeTab === "consultations"
                ? "#111111"
                : "#FFFFFF",
            color:
              activeTab === "consultations"
                ? "#D4AF37"
                : "#555555",
          }}
        >
          Consultations
        </button>
      </div>

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div
        style={{
          background: "#FFFFFF",
          padding: "18px",
          borderRadius: "10px",
          marginBottom: "18px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder={
            activeTab === "cases"
              ? "Search case, owner, property..."
              : "Search consultation, user, case..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        {activeTab === "cases" ? (
          <select
            value={caseStatusFilter}
            onChange={(e) =>
              setCaseStatusFilter(e.target.value)
            }
            style={selectStyle}
          >
            <option value="All">All Case Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">
              In Progress
            </option>
            <option value="Closed">Closed</option>
          </select>
        ) : (
          <select
            value={consultationStatusFilter}
            onChange={(e) =>
              setConsultationStatusFilter(
                e.target.value
              )
            }
            style={selectStyle}
          >
            <option value="All">
              All Consultation Status
            </option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        )}
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && activeTab === "cases" && (
        <div style={errorStyle}>{error}</div>
      )}

      {consultationsError &&
        activeTab === "consultations" && (
          <div style={errorStyle}>
            {consultationsError}
          </div>
        )}

      {/* =================================================
          CASES TABLE
      ================================================= */}

      {activeTab === "cases" && (
        <div style={tableContainer}>
          {loading ? (
            <div style={emptyStyle}>
              Loading legal cases...
            </div>
          ) : filteredCases.length === 0 ? (
            <div style={emptyStyle}>
              No legal cases found.
            </div>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Case</th>
                  <th style={thStyle}>Case Number</th>
                  <th style={thStyle}>Property</th>
                  <th style={thStyle}>Owner</th>
                  <th style={thStyle}>Advocate</th>
                  <th style={thStyle}>Court</th>
                  <th style={thStyle}>Hearing Date</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCases.map((item) => (
                  <tr key={item.id}>
                    <td style={tdStyle}>
                      {item.id}
                    </td>

                    <td style={tdStyle}>
                      <strong>
                        {item.case_title || "-"}
                      </strong>
                    </td>

                    <td style={tdStyle}>
                      {item.case_number || "-"}
                    </td>

                    <td style={tdStyle}>
                      {item.property_name || "-"}
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#888888",
                          marginTop: "3px",
                        }}
                      >
                        {item.survey_number
                          ? `Survey: ${item.survey_number}`
                          : ""}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {item.owner_name || "-"}
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#888888",
                          marginTop: "3px",
                        }}
                      >
                        {item.owner_mobile || ""}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {item.advocate_name || "-"}
                    </td>

                    <td style={tdStyle}>
                      {item.court_name || "-"}
                    </td>

                    <td style={tdStyle}>
                      {formatDate(item.hearing_date)}
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...statusBadge,
                          ...getStatusStyle(item.status),
                        }}
                      >
                        {item.status || "Unknown"}
                      </span>
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          alignItems: "center",
                          flexWrap: "nowrap",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleViewCase(item.id)
                          }
                          style={viewButton}
                        >
                          View
                        </button>

                        <select
                          value={item.status || ""}
                          onChange={(e) =>
                            handleCaseStatusChange(
                              item.id,
                              e.target.value
                            )
                          }
                          style={actionSelect}
                        >
                          <option value="Open">
                            Open
                          </option>

                          <option value="In Progress">
                            In Progress
                          </option>

                          <option value="Closed">
                            Closed
                          </option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* =================================================
          CONSULTATIONS TABLE
      ================================================= */}

      {activeTab === "consultations" && (
        <div style={tableContainer}>
          {consultationsLoading ? (
            <div style={emptyStyle}>
              Loading consultations...
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div style={emptyStyle}>
              No consultations found.
            </div>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>User</th>
                  <th style={thStyle}>Case</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Time</th>
                  <th style={thStyle}>Meeting</th>
                  <th style={thStyle}>Reason</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredConsultations.map((item) => (
                  <tr key={item.id}>
                    <td style={tdStyle}>
                      {item.id}
                    </td>

                    <td style={tdStyle}>
                      <strong>
                        {item.user_name || "-"}
                      </strong>

                      <div
                        style={{
                          fontSize: "11px",
                          color: "#888888",
                          marginTop: "3px",
                        }}
                      >
                        {item.user_mobile || ""}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {item.case_title || "-"}
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#888888",
                          marginTop: "3px",
                        }}
                      >
                        {item.case_number || ""}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {formatDate(
                        item.consultation_date
                      )}
                    </td>

                    <td style={tdStyle}>
                      {item.consultation_time || "-"}
                    </td>

                    <td style={tdStyle}>
                      {item.meeting_type || "-"}
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        maxWidth: "180px",
                      }}
                    >
                      {item.reason || "-"}
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...statusBadge,
                          ...getStatusStyle(item.status),
                        }}
                      >
                        {item.status || "Unknown"}
                      </span>
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          alignItems: "center",
                          flexWrap: "nowrap",
                        }}
                      >
                        <button
                          onClick={() => {
                            setSelectedConsultation(item);
                            setShowConsultationModal(
                              true
                            );
                          }}
                          style={viewButton}
                        >
                          View
                        </button>

                        <select
                          value={item.status || ""}
                          onChange={(e) =>
                            handleConsultationStatusChange(
                              item.id,
                              e.target.value
                            )
                          }
                          style={actionSelect}
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Confirmed">
                            Confirmed
                          </option>

                          <option value="Completed">
                            Completed
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* =================================================
          CASE VIEW MODAL
      ================================================= */}

      {showCaseModal && selectedCase && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div style={modalHeader}>
              <h2 style={{ margin: 0 }}>
                Legal Case Details
              </h2>

              <button
                onClick={closeCaseModal}
                style={closeButton}
              >
                ×
              </button>
            </div>

            <div style={detailsGrid}>
              <Detail
                label="Case ID"
                value={selectedCase.id}
              />

              <Detail
                label="Case Title"
                value={selectedCase.case_title}
              />

              <Detail
                label="Case Number"
                value={selectedCase.case_number}
              />

              <Detail
                label="Status"
                value={selectedCase.status}
              />

              <Detail
                label="Property"
                value={selectedCase.property_name}
              />

              <Detail
                label="Survey Number"
                value={selectedCase.survey_number}
              />

              <Detail
                label="Owner"
                value={selectedCase.owner_name}
              />

              <Detail
                label="Mobile"
                value={selectedCase.owner_mobile}
              />

              <Detail
                label="Email"
                value={selectedCase.owner_email}
              />

              <Detail
                label="Advocate"
                value={selectedCase.advocate_name}
              />

              <Detail
                label="Court"
                value={selectedCase.court_name}
              />

              <Detail
                label="Hearing Date"
                value={formatDate(
                  selectedCase.hearing_date
                )}
              />

              <Detail
                label="Created Date"
                value={formatDate(
                  selectedCase.created_at
                )}
              />
            </div>

            <div style={textDetail}>
              <strong>Description</strong>

              <p>
                {selectedCase.description || "-"}
              </p>
            </div>

            <div style={textDetail}>
              <strong>Remarks</strong>

              <p>
                {selectedCase.remarks || "-"}
              </p>
            </div>

            <div
              style={{
                marginTop: "20px",
                textAlign: "right",
              }}
            >
              <button
                onClick={closeCaseModal}
                style={primaryButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          CONSULTATION VIEW MODAL
      ================================================= */}

      {showConsultationModal &&
        selectedConsultation && (
          <div style={modalOverlay}>
            <div style={modalBox}>
              <div style={modalHeader}>
                <h2 style={{ margin: 0 }}>
                  Consultation Details
                </h2>

                <button
                  onClick={() =>
                    setShowConsultationModal(false)
                  }
                  style={closeButton}
                >
                  ×
                </button>
              </div>

              <div style={detailsGrid}>
                <Detail
                  label="Consultation ID"
                  value={selectedConsultation.id}
                />

                <Detail
                  label="User"
                  value={selectedConsultation.user_name}
                />

                <Detail
                  label="Mobile"
                  value={
                    selectedConsultation.user_mobile
                  }
                />

                <Detail
                  label="Email"
                  value={
                    selectedConsultation.user_email
                  }
                />

                <Detail
                  label="Case"
                  value={
                    selectedConsultation.case_title
                  }
                />

                <Detail
                  label="Case Number"
                  value={
                    selectedConsultation.case_number
                  }
                />

                <Detail
                  label="Date"
                  value={formatDate(
                    selectedConsultation.consultation_date
                  )}
                />

                <Detail
                  label="Time"
                  value={
                    selectedConsultation.consultation_time
                  }
                />

                <Detail
                  label="Meeting Type"
                  value={
                    selectedConsultation.meeting_type
                  }
                />

                <Detail
                  label="Status"
                  value={
                    selectedConsultation.status
                  }
                />
              </div>

              <div style={textDetail}>
                <strong>Reason</strong>

                <p>
                  {selectedConsultation.reason || "-"}
                </p>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  textAlign: "right",
                }}
              >
                <button
                  onClick={() =>
                    setShowConsultationModal(false)
                  }
                  style={primaryButton}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

// =====================================================
// SUMMARY CARD
// =====================================================

const SummaryCard = ({ title, value }) => {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "10px",
        padding: "20px",
        border: "1px solid #E5E5E5",
      }}
    >
      <div
        style={{
          color: "#777777",
          fontSize: "13px",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#111111",
          fontSize: "26px",
          fontWeight: "700",
        }}
      >
        {value}
      </div>
    </div>
  );
};

// =====================================================
// DETAIL COMPONENT
// =====================================================

const Detail = ({ label, value }) => {
  return (
    <div
      style={{
        background: "#FAFAFA",
        padding: "12px",
        borderRadius: "7px",
        border: "1px solid #EEEEEE",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: "#888888",
          marginBottom: "5px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "14px",
          color: "#222222",
          fontWeight: "500",
        }}
      >
        {value || "-"}
      </div>
    </div>
  );
};

// =====================================================
// STYLES
// =====================================================

const tabButton = {
  border: "1px solid #DDDDDD",
  padding: "10px 20px",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: "600",
};

const inputStyle = {
  flex: 1,
  minWidth: "250px",
  padding: "11px 13px",
  border: "1px solid #DDDDDD",
  borderRadius: "7px",
  outline: "none",
};

const selectStyle = {
  padding: "11px 13px",
  border: "1px solid #DDDDDD",
  borderRadius: "7px",
  background: "#FFFFFF",
  minWidth: "180px",
};

const actionSelect = {
  padding: "7px 8px",
  border: "1px solid #CCCCCC",
  borderRadius: "6px",
  background: "#FFFFFF",
  fontSize: "12px",
  cursor: "pointer",
};

const tableContainer = {
  background: "#FFFFFF",
  borderRadius: "10px",
  overflowX: "auto",
  border: "1px solid #E5E5E5",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1250px",
};

const thStyle = {
  textAlign: "left",
  padding: "13px 12px",
  background: "#111111",
  color: "#D4AF37",
  fontSize: "12px",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "13px 12px",
  borderBottom: "1px solid #EEEEEE",
  fontSize: "13px",
  color: "#333333",
  verticalAlign: "middle",
};

const statusBadge = {
  display: "inline-block",
  padding: "5px 9px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "600",
  whiteSpace: "nowrap",
};

const viewButton = {
  padding: "7px 10px",
  border: "none",
  borderRadius: "5px",
  background: "#111111",
  color: "#D4AF37",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
  whiteSpace: "nowrap",
};

const primaryButton = {
  padding: "9px 18px",
  border: "none",
  borderRadius: "6px",
  background: "#111111",
  color: "#D4AF37",
  cursor: "pointer",
  fontWeight: "600",
};

const errorStyle = {
  background: "#FFEBEE",
  color: "#C62828",
  padding: "12px",
  borderRadius: "7px",
  marginBottom: "15px",
};

const emptyStyle = {
  padding: "40px",
  textAlign: "center",
  color: "#777777",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "20px",
};

const modalBox = {
  background: "#FFFFFF",
  width: "100%",
  maxWidth: "850px",
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: "12px",
  padding: "25px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "22px",
  paddingBottom: "15px",
  borderBottom: "1px solid #EEEEEE",
};

const closeButton = {
  border: "none",
  background: "transparent",
  fontSize: "28px",
  cursor: "pointer",
  color: "#555555",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "12px",
};

const textDetail = {
  marginTop: "18px",
  padding: "14px",
  background: "#FAFAFA",
  borderRadius: "7px",
  border: "1px solid #EEEEEE",
  color: "#333333",
};

export default SuperAdminLegal;