import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSuperAdminStaff,
  fetchSuperAdminStaffById,
  updateSuperAdminStaffStatus,
  updateSuperAdminStaffRole,
  fetchSuperAdminStaffAssignments,
  updateSuperAdminAssignmentStatus,
  clearSelectedStaff,
} from "../../redux/superAdminStaffSlice";

const SuperAdminStaff = () => {
  const dispatch = useDispatch();

  const {
    staff,
    selectedStaff,
    assignments,
    loading,
    updateLoading,
    assignmentsLoading,
    error,
    assignmentsError,
  } = useSelector((state) => state.superAdminStaff);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [activeTab, setActiveTab] = useState("staff");

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  useEffect(() => {
    dispatch(fetchSuperAdminStaff());
    dispatch(fetchSuperAdminStaffAssignments());
  }, [dispatch]);

  // ===============================
  // SUMMARY
  // ===============================

  const totalStaff = staff.length;

  const activeStaff = staff.filter(
    (item) => item.status === "active"
  ).length;

  const inactiveStaff = staff.filter(
    (item) => item.status === "inactive"
  ).length;

  const fieldExecutives = staff.filter(
    (item) => item.role === "field_executive"
  ).length;

  const legalStaff = staff.filter(
    (item) => item.role === "legal"
  ).length;

  const securityStaff = staff.filter(
    (item) => item.role === "security"
  ).length;

  const adminStaff = staff.filter(
    (item) => item.role === "admin"
  ).length;

  // ===============================
  // FILTER STAFF
  // ===============================

  const filteredStaff = useMemo(() => {
    return staff.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        item.full_name?.toLowerCase().includes(searchText) ||
        item.mobile?.toLowerCase().includes(searchText) ||
        item.email?.toLowerCase().includes(searchText);

      const matchesRole =
        roleFilter === "All" ||
        item.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [staff, search, roleFilter, statusFilter]);

  // ===============================
  // VIEW STAFF
  // ===============================

  const handleViewStaff = async (id) => {
    const result = await dispatch(
      fetchSuperAdminStaffById(id)
    );

    if (
      fetchSuperAdminStaffById.fulfilled.match(result)
    ) {
      setShowStaffModal(true);
    }
  };

  // ===============================
  // UPDATE STAFF STATUS
  // ===============================

  const handleStatusChange = async (id, status) => {
    await dispatch(
      updateSuperAdminStaffStatus({
        id,
        status,
      })
    );
  };

  // ===============================
  // UPDATE STAFF ROLE
  // ===============================

  const handleRoleChange = async (id, role) => {
    await dispatch(
      updateSuperAdminStaffRole({
        id,
        role,
      })
    );
  };

  // ===============================
  // UPDATE ASSIGNMENT STATUS
  // ===============================

  const handleAssignmentStatusChange = async (
    id,
    status
  ) => {
    await dispatch(
      updateSuperAdminAssignmentStatus({
        id,
        status,
      })
    );
  };

  // ===============================
  // CLOSE STAFF MODAL
  // ===============================

  const closeStaffModal = () => {
    setShowStaffModal(false);
    dispatch(clearSelectedStaff());
  };

  // ===============================
  // OPEN ASSIGNMENT MODAL
  // ===============================

  const handleViewAssignment = (assignment) => {
    setShowAssignmentModal(assignment);
  };

  // ===============================
  // ROLE LABEL
  // ===============================

  const getRoleLabel = (role) => {
    switch (role) {
      case "field_executive":
        return "Field Executive";

      case "legal":
        return "Legal Team";

      case "security":
        return "Security";

      case "admin":
        return "Admin";

      default:
        return role || "-";
    }
  };

  // ===============================
  // DATE FORMAT
  // ===============================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F5F5",
        padding: "30px",
      }}
    >
      {/* ===============================
          HEADER
      =============================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              color: "#111",
              fontWeight: "700",
            }}
          >
            Staff Management
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#777",
              fontSize: "14px",
            }}
          >
            Manage staff members, roles, status and assignments
          </p>
        </div>

        <div
          style={{
            background: "#111",
            color: "#D4AF37",
            padding: "10px 18px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "1px",
          }}
        >
          SUPER ADMIN
        </div>
      </div>

      {/* ===============================
          ERROR
      =============================== */}

      {error && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #dc3545",
            color: "#dc3545",
            padding: "12px 15px",
            borderRadius: "6px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* ===============================
          SUMMARY CARDS
      =============================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <SummaryCard
          title="Total Staff"
          value={totalStaff}
        />

        <SummaryCard
          title="Active Staff"
          value={activeStaff}
        />

        <SummaryCard
          title="Inactive Staff"
          value={inactiveStaff}
        />

        <SummaryCard
          title="Field Executives"
          value={fieldExecutives}
        />

        <SummaryCard
          title="Legal Team"
          value={legalStaff}
        />

        <SummaryCard
          title="Security"
          value={securityStaff}
        />

        <SummaryCard
          title="Admins"
          value={adminStaff}
        />
      </div>

      {/* ===============================
          TABS
      =============================== */}

      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "5px",
          display: "inline-flex",
          gap: "5px",
          marginBottom: "20px",
          border: "1px solid #ddd",
        }}
      >
        <button
          onClick={() => setActiveTab("staff")}
          style={{
            ...tabButton,
            background:
              activeTab === "staff"
                ? "#111"
                : "#fff",
            color:
              activeTab === "staff"
                ? "#D4AF37"
                : "#555",
          }}
        >
          Staff
        </button>

        <button
          onClick={() => setActiveTab("assignments")}
          style={{
            ...tabButton,
            background:
              activeTab === "assignments"
                ? "#111"
                : "#fff",
            color:
              activeTab === "assignments"
                ? "#D4AF37"
                : "#555",
          }}
        >
          Assignments
        </button>
      </div>

      {/* ===============================
          STAFF TAB
      =============================== */}

      {activeTab === "staff" && (
        <>
          {/* FILTERS */}

          <div
            style={{
              background: "#fff",
              padding: "18px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              marginBottom: "20px",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Search name, mobile or email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={inputStyle}
            />

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              style={selectStyle}
            >
              <option value="All">All Roles</option>
              <option value="field_executive">
                Field Executive
              </option>
              <option value="legal">
                Legal Team
              </option>
              <option value="security">
                Security
              </option>
              <option value="admin">
                Admin
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              style={selectStyle}
            >
              <option value="All">
                All Status
              </option>
              <option value="active">
                Active
              </option>
              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>

          {/* STAFF TABLE */}

          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
              overflowX: "auto",
            }}
          >
            {loading ? (
              <div style={emptyStyle}>
                Loading staff...
              </div>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1000px",
                }}
              >
                <thead>
                  <tr>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Staff</th>
                    <th style={thStyle}>Mobile</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>
                      Assignments
                    </th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        style={emptyStyle}
                      >
                        No staff found.
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((item) => (
                      <tr key={item.id}>
                        <td style={tdStyle}>
                          #{item.id}
                        </td>

                        <td style={tdStyle}>
                          <strong>
                            {item.full_name}
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          {item.mobile || "-"}
                        </td>

                        <td style={tdStyle}>
                          {item.email || "-"}
                        </td>

                        <td style={tdStyle}>
                          <select
                            value={item.role}
                            onChange={(e) =>
                              handleRoleChange(
                                item.id,
                                e.target.value
                              )
                            }
                            disabled={updateLoading}
                            style={{
                              ...smallSelectStyle,
                              minWidth: "145px",
                            }}
                          >
                            <option value="field_executive">
                              Field Executive
                            </option>

                            <option value="legal">
                              Legal Team
                            </option>

                            <option value="security">
                              Security
                            </option>

                            <option value="admin">
                              Admin
                            </option>
                          </select>
                        </td>

                        <td style={tdStyle}>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleStatusChange(
                                item.id,
                                e.target.value
                              )
                            }
                            disabled={updateLoading}
                            style={{
                              ...smallSelectStyle,
                              minWidth: "100px",
                            }}
                          >
                            <option value="active">
                              Active
                            </option>

                            <option value="inactive">
                              Inactive
                            </option>
                          </select>
                        </td>

                        <td style={tdStyle}>
                          {item.total_assignments}
                        </td>

                        <td style={tdStyle}>
                          <button
                            onClick={() =>
                              handleViewStaff(
                                item.id
                              )
                            }
                            style={viewButton}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ===============================
          ASSIGNMENTS TAB
      =============================== */}

      {activeTab === "assignments" && (
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #ddd",
            overflowX: "auto",
          }}
        >
          {assignmentsError && (
            <div
              style={{
                padding: "15px",
                color: "#dc3545",
              }}
            >
              {assignmentsError}
            </div>
          )}

          {assignmentsLoading ? (
            <div style={emptyStyle}>
              Loading assignments...
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1000px",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Staff</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Property</th>
                  <th style={thStyle}>Survey Number</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>
                    Assignment Date
                  </th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>

              <tbody>
                {assignments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      style={emptyStyle}
                    >
                      No assignments found.
                    </td>
                  </tr>
                ) : (
                  assignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td style={tdStyle}>
                        #{assignment.id}
                      </td>

                      <td style={tdStyle}>
                        <strong>
                          {assignment.staff_name ||
                            "-"}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        {getRoleLabel(
                          assignment.staff_role
                        )}
                      </td>

                      <td style={tdStyle}>
                        {assignment.property_name ||
                          "-"}
                      </td>

                      <td style={tdStyle}>
                        {assignment.survey_number ||
                          "-"}
                      </td>

                      <td style={tdStyle}>
                        {assignment.assignment_type ||
                          "-"}
                      </td>

                      <td style={tdStyle}>
                        {formatDate(
                          assignment.assignment_date
                        )}
                      </td>

                      <td style={tdStyle}>
                        <select
                          value={assignment.status || ""}
                          onChange={(e) =>
                            handleAssignmentStatusChange(
                              assignment.id,
                              e.target.value
                            )
                          }
                          disabled={updateLoading}
                          style={smallSelectStyle}
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="In Progress">
                            In Progress
                          </option>

                          <option value="Completed">
                            Completed
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>
                        </select>
                      </td>

                      <td style={tdStyle}>
                        <button
                          onClick={() =>
                            handleViewAssignment(
                              assignment
                            )
                          }
                          style={viewButton}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ===============================
          STAFF DETAILS MODAL
      =============================== */}

      {showStaffModal && selectedStaff && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#111",
                }}
              >
                Staff Details
              </h2>

              <button
                onClick={closeStaffModal}
                style={closeButton}
              >
                ×
              </button>
            </div>

            <DetailRow
              label="Staff ID"
              value={`#${selectedStaff.id}`}
            />

            <DetailRow
              label="Full Name"
              value={selectedStaff.full_name}
            />

            <DetailRow
              label="Mobile"
              value={selectedStaff.mobile}
            />

            <DetailRow
              label="Email"
              value={selectedStaff.email}
            />

            <DetailRow
              label="Role"
              value={getRoleLabel(
                selectedStaff.role
              )}
            />

            <DetailRow
              label="Status"
              value={selectedStaff.status}
            />

            <DetailRow
              label="Total Assignments"
              value={
                selectedStaff.total_assignments
              }
            />

            <DetailRow
              label="Created At"
              value={formatDate(
                selectedStaff.created_at
              )}
            />

            <div
              style={{
                marginTop: "25px",
                textAlign: "right",
              }}
            >
              <button
                onClick={closeStaffModal}
                style={goldButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===============================
          ASSIGNMENT DETAILS MODAL
      =============================== */}

      {showAssignmentModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#111",
                }}
              >
                Assignment Details
              </h2>

              <button
                onClick={() =>
                  setShowAssignmentModal(false)
                }
                style={closeButton}
              >
                ×
              </button>
            </div>

            <DetailRow
              label="Assignment ID"
              value={`#${showAssignmentModal.id}`}
            />

            <DetailRow
              label="Staff"
              value={
                showAssignmentModal.staff_name
              }
            />

            <DetailRow
              label="Staff Mobile"
              value={
                showAssignmentModal.staff_mobile
              }
            />

            <DetailRow
              label="Staff Email"
              value={
                showAssignmentModal.staff_email
              }
            />

            <DetailRow
              label="Staff Role"
              value={getRoleLabel(
                showAssignmentModal.staff_role
              )}
            />

            <DetailRow
              label="Property"
              value={
                showAssignmentModal.property_name
              }
            />

            <DetailRow
              label="Survey Number"
              value={
                showAssignmentModal.survey_number
              }
            />

            <DetailRow
              label="City"
              value={showAssignmentModal.city}
            />

            <DetailRow
              label="State"
              value={showAssignmentModal.state}
            />

            <DetailRow
              label="Assignment Type"
              value={
                showAssignmentModal.assignment_type
              }
            />

            <DetailRow
              label="Assignment Date"
              value={formatDate(
                showAssignmentModal.assignment_date
              )}
            />

            <DetailRow
              label="Status"
              value={showAssignmentModal.status}
            />

            <DetailRow
              label="Notes"
              value={
                showAssignmentModal.notes || "-"
              }
            />

            <div
              style={{
                marginTop: "25px",
                textAlign: "right",
              }}
            >
              <button
                onClick={() =>
                  setShowAssignmentModal(false)
                }
                style={goldButton}
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

// ===============================
// COMPONENTS
// ===============================

const SummaryCard = ({ title, value }) => {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "18px",
        borderTop: "3px solid #D4AF37",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          color: "#777",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "26px",
          fontWeight: "700",
          color: "#111",
        }}
      >
        {value}
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "160px 1fr",
        gap: "15px",
        padding: "10px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <strong
        style={{
          color: "#555",
          fontSize: "14px",
        }}
      >
        {label}
      </strong>

      <span
        style={{
          color: "#111",
          fontSize: "14px",
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </span>
    </div>
  );
};

// ===============================
// STYLES
// ===============================

const tabButton = {
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "600",
};

const inputStyle = {
  flex: "1",
  minWidth: "250px",
  padding: "11px 13px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  outline: "none",
};

const selectStyle = {
  minWidth: "160px",
  padding: "11px 13px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  background: "#fff",
  outline: "none",
};

const smallSelectStyle = {
  padding: "7px 9px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  background: "#fff",
  fontSize: "13px",
  cursor: "pointer",
};

const thStyle = {
  padding: "13px 12px",
  background: "#111",
  color: "#D4AF37",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
  fontSize: "13px",
  color: "#333",
  whiteSpace: "nowrap",
};

const viewButton = {
  background: "#111",
  color: "#D4AF37",
  border: "none",
  padding: "7px 13px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "600",
};

const goldButton = {
  background: "#D4AF37",
  color: "#111",
  border: "none",
  padding: "9px 18px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "700",
};

const emptyStyle = {
  padding: "35px",
  textAlign: "center",
  color: "#777",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "20px",
};

const modalStyle = {
  background: "#fff",
  width: "100%",
  maxWidth: "650px",
  maxHeight: "85vh",
  overflowY: "auto",
  borderRadius: "8px",
  padding: "25px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
};

const closeButton = {
  width: "32px",
  height: "32px",
  border: "none",
  background: "#111",
  color: "#D4AF37",
  borderRadius: "50%",
  fontSize: "22px",
  cursor: "pointer",
  lineHeight: "32px",
};

export default SuperAdminStaff;