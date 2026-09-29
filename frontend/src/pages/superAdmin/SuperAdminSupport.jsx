import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSuperAdminSupportTickets,
  fetchSuperAdminSupportTicketById,
  updateSuperAdminSupportTicketStatus,
  updateSuperAdminSupportTicketPriority,
  fetchSuperAdminWhatsAppSupport,
  updateSuperAdminWhatsAppSupport,
  clearSelectedSupportTicket,
} from "../../redux/superAdminSupportSlice";

const SuperAdminSupport = () => {
  const dispatch = useDispatch();

  const {
    tickets,
    selectedTicket,
    whatsappSupport,
    loading,
    updateLoading,
    whatsappLoading,
    error,
    whatsappError,
  } = useSelector((state) => state.superAdminSupport);

  const [activeTab, setActiveTab] = useState("tickets");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const [whatsappForm, setWhatsAppForm] = useState({
    id: null,
    support_name: "",
    phone_number: "",
    welcome_message: "",
    status: "Active",
  });

  useEffect(() => {
    dispatch(fetchSuperAdminSupportTickets());
    dispatch(fetchSuperAdminWhatsAppSupport());
  }, [dispatch]);

  // ===============================
  // SUMMARY
  // ===============================

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedClosedTickets = tickets.filter(
    (ticket) =>
      ticket.status === "Resolved" ||
      ticket.status === "Closed"
  ).length;

  // ===============================
  // FILTER TICKETS
  // ===============================

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        ticket.subject?.toLowerCase().includes(searchText) ||
        ticket.user_name?.toLowerCase().includes(searchText) ||
        ticket.user_email?.toLowerCase().includes(searchText) ||
        String(ticket.id).includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        ticket.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    tickets,
    search,
    statusFilter,
    priorityFilter,
  ]);

  // ===============================
  // VIEW TICKET
  // ===============================

  const handleViewTicket = async (id) => {
    const result = await dispatch(
      fetchSuperAdminSupportTicketById(id)
    );

    if (
      fetchSuperAdminSupportTicketById.fulfilled.match(
        result
      )
    ) {
      setShowTicketModal(true);
    }
  };

  // ===============================
  // STATUS UPDATE
  // ===============================

  const handleStatusChange = async (id, status) => {
    await dispatch(
      updateSuperAdminSupportTicketStatus({
        id,
        status,
      })
    );
  };

  // ===============================
  // PRIORITY UPDATE
  // ===============================

  const handlePriorityChange = async (
    id,
    priority
  ) => {
    await dispatch(
      updateSuperAdminSupportTicketPriority({
        id,
        priority,
      })
    );
  };

  // ===============================
  // OPEN WHATSAPP EDIT
  // ===============================

  const handleEditWhatsApp = (support) => {
    setWhatsAppForm({
      id: support.id,
      support_name: support.support_name || "",
      phone_number: support.phone_number || "",
      welcome_message:
        support.welcome_message || "",
      status: support.status || "Active",
    });

    setShowWhatsAppModal(true);
  };

  // ===============================
  // WHATSAPP FORM CHANGE
  // ===============================

  const handleWhatsAppChange = (e) => {
    const { name, value } = e.target;

    setWhatsAppForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // SAVE WHATSAPP
  // ===============================

  const handleSaveWhatsApp = async (e) => {
    e.preventDefault();

    const { id, ...supportData } =
      whatsappForm;

    const result = await dispatch(
      updateSuperAdminWhatsAppSupport({
        id,
        supportData,
      })
    );

    if (
      updateSuperAdminWhatsAppSupport.fulfilled.match(
        result
      )
    ) {
      setShowWhatsAppModal(false);
    }
  };

  // ===============================
  // CLOSE TICKET MODAL
  // ===============================

  const closeTicketModal = () => {
    setShowTicketModal(false);
    dispatch(clearSelectedSupportTicket());
  };

  // ===============================
  // DATE FORMAT
  // ===============================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <div style={pageStyle}>
      {/* ============================
          HEADER
      ============================ */}

      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>
            Customer Support
          </h1>

          <p style={subtitleStyle}>
            Manage support tickets and WhatsApp
            support settings
          </p>
        </div>
      </div>

      {/* ============================
          ERROR
      ============================ */}

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      {/* ============================
          SUMMARY CARDS
      ============================ */}

      <div style={summaryGrid}>
        <SummaryCard
          title="Total Tickets"
          value={totalTickets}
        />

        <SummaryCard
          title="Open"
          value={openTickets}
        />

        <SummaryCard
          title="In Progress"
          value={inProgressTickets}
        />

        <SummaryCard
          title="Resolved / Closed"
          value={resolvedClosedTickets}
        />
      </div>

      {/* ============================
          TABS
      ============================ */}

      <div style={tabsContainer}>
        <button
          onClick={() => setActiveTab("tickets")}
          style={{
            ...tabStyle,
            ...(activeTab === "tickets"
              ? activeTabStyle
              : {}),
          }}
        >
          Support Tickets
        </button>

        <button
          onClick={() =>
            setActiveTab("whatsapp")
          }
          style={{
            ...tabStyle,
            ...(activeTab === "whatsapp"
              ? activeTabStyle
              : {}),
          }}
        >
          WhatsApp Support
        </button>
      </div>

      {/* ============================
          TICKETS TAB
      ============================ */}

      {activeTab === "tickets" && (
        <div style={cardStyle}>
          <div style={toolbarStyle}>
            <input
              type="text"
              placeholder="Search ticket, customer, email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={searchInputStyle}
            />

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
              <option value="Open">
                Open
              </option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Resolved">
                Resolved
              </option>
              <option value="Closed">
                Closed
              </option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
              style={selectStyle}
            >
              <option value="All">
                All Priority
              </option>
              <option value="Low">
                Low
              </option>
              <option value="Medium">
                Medium
              </option>
              <option value="High">
                High
              </option>
              <option value="Critical">
                Critical
              </option>
            </select>
          </div>

          {loading ? (
            <div style={loadingStyle}>
              Loading support tickets...
            </div>
          ) : filteredTickets.length === 0 ? (
            <div style={emptyStyle}>
              No support tickets found.
            </div>
          ) : (
            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Customer</th>
                    <th style={thStyle}>
                      Subject
                    </th>
                    <th style={thStyle}>
                      Priority
                    </th>
                    <th style={thStyle}>
                      Status
                    </th>
                    <th style={thStyle}>
                      Created
                    </th>
                    <th style={thStyle}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.map(
                    (ticket) => (
                      <tr key={ticket.id}>
                        <td style={tdStyle}>
                          #{ticket.id}
                        </td>

                        <td style={tdStyle}>
                          <div
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {ticket.user_name ||
                              "Unknown"}
                          </div>

                          <div
                            style={{
                              fontSize: 12,
                              color: "#777",
                            }}
                          >
                            {ticket.user_email ||
                              "-"}
                          </div>
                        </td>

                        <td style={tdStyle}>
                          <div
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {ticket.subject}
                          </div>

                          <div
                            style={{
                              fontSize: 12,
                              color: "#777",
                              marginTop: 3,
                            }}
                          >
                            {ticket.description}
                          </div>
                        </td>

                        <td style={tdStyle}>
                          <select
                            value={
                              ticket.priority ||
                              "Medium"
                            }
                            onChange={(e) =>
                              handlePriorityChange(
                                ticket.id,
                                e.target.value
                              )
                            }
                            style={{
                              ...smallSelectStyle,
                              ...getPriorityStyle(
                                ticket.priority
                              ),
                            }}
                            disabled={
                              updateLoading
                            }
                          >
                            <option value="Low">
                              Low
                            </option>
                            <option value="Medium">
                              Medium
                            </option>
                            <option value="High">
                              High
                            </option>
                            <option value="Critical">
                              Critical
                            </option>
                          </select>
                        </td>

                        <td style={tdStyle}>
                          <select
                            value={
                              ticket.status ||
                              "Open"
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                ticket.id,
                                e.target.value
                              )
                            }
                            style={{
                              ...smallSelectStyle,
                              ...getStatusStyle(
                                ticket.status
                              ),
                            }}
                            disabled={
                              updateLoading
                            }
                          >
                            <option value="Open">
                              Open
                            </option>
                            <option value="In Progress">
                              In Progress
                            </option>
                            <option value="Resolved">
                              Resolved
                            </option>
                            <option value="Closed">
                              Closed
                            </option>
                          </select>
                        </td>

                        <td style={tdStyle}>
                          {formatDate(
                            ticket.created_at
                          )}
                        </td>

                        <td style={tdStyle}>
                          <button
                            onClick={() =>
                              handleViewTicket(
                                ticket.id
                              )
                            }
                            style={viewButtonStyle}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ============================
          WHATSAPP TAB
      ============================ */}

      {activeTab === "whatsapp" && (
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>
                WhatsApp Support
              </h2>

              <p style={sectionSubtitleStyle}>
                Manage the WhatsApp support contact
                information.
              </p>
            </div>
          </div>

          {whatsappError && (
            <div style={errorStyle}>
              {whatsappError}
            </div>
          )}

          {whatsappLoading &&
          whatsappSupport.length === 0 ? (
            <div style={loadingStyle}>
              Loading WhatsApp support...
            </div>
          ) : whatsappSupport.length === 0 ? (
            <div style={emptyStyle}>
              No WhatsApp support configuration
              found.
            </div>
          ) : (
            <div style={whatsappGrid}>
              {whatsappSupport.map((support) => (
                <div
                  key={support.id}
                  style={whatsappCardStyle}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={whatsappIconStyle}
                      >
                        WA
                      </div>

                      <h3
                        style={{
                          margin:
                            "14px 0 5px",
                          fontSize: 20,
                        }}
                      >
                        {support.support_name}
                      </h3>
                    </div>

                    <span
                      style={{
                        ...statusBadgeStyle,
                        ...(support.status ===
                        "Active"
                          ? activeBadgeStyle
                          : inactiveBadgeStyle),
                      }}
                    >
                      {support.status}
                    </span>
                  </div>

                  <div
                    style={infoRowStyle}
                  >
                    <span
                      style={
                        infoLabelStyle
                      }
                    >
                      Phone
                    </span>

                    <span>
                      {support.phone_number}
                    </span>
                  </div>

                  <div
                    style={infoRowStyle}
                  >
                    <span
                      style={
                        infoLabelStyle
                      }
                    >
                      Welcome Message
                    </span>

                    <span
                      style={{
                        textAlign: "right",
                        maxWidth: 350,
                      }}
                    >
                      {support.welcome_message}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      handleEditWhatsApp(
                        support
                      )
                    }
                    style={
                      primaryButtonStyle
                    }
                  >
                    Edit Support
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================
          TICKET MODAL
      ============================ */}

      {showTicketModal &&
        selectedTicket && (
          <div
            style={modalOverlayStyle}
            onClick={closeTicketModal}
          >
            <div
              style={modalStyle}
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div
                style={modalHeaderStyle}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                    }}
                  >
                    Support Ticket #
                    {selectedTicket.id}
                  </h2>

                  <p
                    style={{
                      margin:
                        "6px 0 0",
                      color: "#777",
                    }}
                  >
                    Ticket details
                  </p>
                </div>

                <button
                  onClick={
                    closeTicketModal
                  }
                  style={closeButtonStyle}
                >
                  ×
                </button>
              </div>

              <div
                style={modalBodyStyle}
              >
                <DetailRow
                  label="Customer"
                  value={
                    selectedTicket.user_name
                  }
                />

                <DetailRow
                  label="Mobile"
                  value={
                    selectedTicket.user_mobile
                  }
                />

                <DetailRow
                  label="Email"
                  value={
                    selectedTicket.user_email
                  }
                />

                <DetailRow
                  label="Role"
                  value={
                    selectedTicket.user_role
                  }
                />

                <DetailRow
                  label="Subject"
                  value={
                    selectedTicket.subject
                  }
                />

                <DetailRow
                  label="Description"
                  value={
                    selectedTicket.description
                  }
                />

                <DetailRow
                  label="Priority"
                  value={
                    selectedTicket.priority
                  }
                />

                <DetailRow
                  label="Status"
                  value={
                    selectedTicket.status
                  }
                />

                <DetailRow
                  label="Created"
                  value={formatDate(
                    selectedTicket.created_at
                  )}
                />

                <DetailRow
                  label="Updated"
                  value={formatDate(
                    selectedTicket.updated_at
                  )}
                />
              </div>

              <div
                style={modalFooterStyle}
              >
                <button
                  onClick={
                    closeTicketModal
                  }
                  style={secondaryButtonStyle}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ============================
          WHATSAPP MODAL
      ============================ */}

      {showWhatsAppModal && (
        <div
          style={modalOverlayStyle}
          onClick={() =>
            setShowWhatsAppModal(false)
          }
        >
          <div
            style={modalStyle}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div style={modalHeaderStyle}>
              <div>
                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  Edit WhatsApp Support
                </h2>

                <p
                  style={{
                    margin:
                      "6px 0 0",
                    color: "#777",
                  }}
                >
                  Update support contact
                  information
                </p>
              </div>

              <button
                onClick={() =>
                  setShowWhatsAppModal(false)
                }
                style={closeButtonStyle}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                handleSaveWhatsApp
              }
            >
              <div
                style={{
                  padding: 24,
                }}
              >
                <FormField
                  label="Support Name"
                  name="support_name"
                  value={
                    whatsappForm.support_name
                  }
                  onChange={
                    handleWhatsAppChange
                  }
                />

                <FormField
                  label="Phone Number"
                  name="phone_number"
                  value={
                    whatsappForm.phone_number
                  }
                  onChange={
                    handleWhatsAppChange
                  }
                />

                <div
                  style={{
                    marginBottom: 18,
                  }}
                >
                  <label
                    style={
                      fieldLabelStyle
                    }
                  >
                    Welcome Message
                  </label>

                  <textarea
                    name="welcome_message"
                    value={
                      whatsappForm.welcome_message
                    }
                    onChange={
                      handleWhatsAppChange
                    }
                    rows={4}
                    style={
                      textareaStyle
                    }
                  />
                </div>

                <div
                  style={{
                    marginBottom: 18,
                  }}
                >
                  <label
                    style={
                      fieldLabelStyle
                    }
                  >
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      whatsappForm.status
                    }
                    onChange={
                      handleWhatsAppChange
                    }
                    style={inputStyle}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>

              <div
                style={modalFooterStyle}
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowWhatsAppModal(false)
                  }
                  style={
                    secondaryButtonStyle
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={
                    primaryButtonStyle
                  }
                  disabled={
                    whatsappLoading
                  }
                >
                  {whatsappLoading
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ======================================================
// SUMMARY CARD
// ======================================================

const SummaryCard = ({ title, value }) => {
  return (
    <div style={summaryCardStyle}>
      <div style={summaryTitleStyle}>
        {title}
      </div>

      <div style={summaryValueStyle}>
        {value}
      </div>

      <div
        style={{
          width: 35,
          height: 3,
          background: "#C9A227",
          marginTop: 10,
        }}
      />
    </div>
  );
};

// ======================================================
// DETAIL ROW
// ======================================================

const DetailRow = ({ label, value }) => {
  return (
    <div style={detailRowStyle}>
      <span style={detailLabelStyle}>
        {label}
      </span>

      <span
        style={{
          maxWidth: "65%",
          textAlign: "right",
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </span>
    </div>
  );
};

// ======================================================
// FORM FIELD
// ======================================================

const FormField = ({
  label,
  name,
  value,
  onChange,
}) => {
  return (
    <div
      style={{
        marginBottom: 18,
      }}
    >
      <label style={fieldLabelStyle}>
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        style={inputStyle}
      />
    </div>
  );
};

// ======================================================
// STATUS STYLE
// ======================================================

const getStatusStyle = (status) => {
  switch (status) {
    case "Open":
      return {
        borderColor: "#C9A227",
      };

    case "In Progress":
      return {
        borderColor: "#777",
      };

    case "Resolved":
      return {
        borderColor: "#2E7D32",
      };

    case "Closed":
      return {
        borderColor: "#555",
      };

    default:
      return {};
  }
};

// ======================================================
// PRIORITY STYLE
// ======================================================

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "Critical":
      return {
        borderColor: "#9B1C1C",
      };

    case "High":
      return {
        borderColor: "#C62828",
      };

    case "Medium":
      return {
        borderColor: "#C9A227",
      };

    case "Low":
      return {
        borderColor: "#777",
      };

    default:
      return {};
  }
};

// ======================================================
// STYLES
// ======================================================

const pageStyle = {
  minHeight: "100vh",
  background: "#F5F5F5",
  padding: "30px",
  boxSizing: "border-box",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 25,
};

const titleStyle = {
  margin: 0,
  fontSize: 30,
  fontWeight: 700,
  color: "#111",
};

const subtitleStyle = {
  margin: "7px 0 0",
  color: "#777",
  fontSize: 14,
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(190px, 1fr))",
  gap: 18,
  marginBottom: 25,
};

const summaryCardStyle = {
  background: "#FFFFFF",
  border: "1px solid #E2E2E2",
  borderRadius: 10,
  padding: "20px 22px",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.04)",
};

const summaryTitleStyle = {
  fontSize: 13,
  color: "#777",
  fontWeight: 600,
};

const summaryValueStyle = {
  fontSize: 28,
  fontWeight: 700,
  color: "#111",
  marginTop: 8,
};

const tabsContainer = {
  display: "flex",
  gap: 5,
  background: "#111",
  padding: 5,
  borderRadius: 8,
  width: "fit-content",
  marginBottom: 20,
};

const tabStyle = {
  border: "none",
  background: "transparent",
  color: "#FFF",
  padding: "10px 20px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const activeTabStyle = {
  background: "#C9A227",
  color: "#111",
};

const cardStyle = {
  background: "#FFF",
  borderRadius: 10,
  border: "1px solid #E2E2E2",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.04)",
  overflow: "hidden",
};

const toolbarStyle = {
  display: "flex",
  gap: 12,
  padding: 20,
  borderBottom: "1px solid #E5E5E5",
  flexWrap: "wrap",
};

const searchInputStyle = {
  flex: 1,
  minWidth: 250,
  padding: "11px 13px",
  border: "1px solid #CCC",
  borderRadius: 6,
  fontSize: 14,
  outline: "none",
};

const selectStyle = {
  minWidth: 150,
  padding: "10px 12px",
  border: "1px solid #CCC",
  borderRadius: 6,
  background: "#FFF",
  fontSize: 14,
};

const smallSelectStyle = {
  padding: "7px 9px",
  border: "1px solid #CCC",
  borderRadius: 5,
  background: "#FFF",
  fontSize: 12,
  cursor: "pointer",
};

const tableWrapperStyle = {
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 1050,
};

const thStyle = {
  textAlign: "left",
  padding: "13px 15px",
  background: "#111",
  color: "#FFF",
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "14px 15px",
  borderBottom: "1px solid #EEE",
  fontSize: 13,
  verticalAlign: "middle",
};

const viewButtonStyle = {
  background: "#111",
  color: "#FFF",
  border: "none",
  padding: "8px 14px",
  borderRadius: 5,
  cursor: "pointer",
  fontWeight: 600,
};

const loadingStyle = {
  padding: 40,
  textAlign: "center",
  color: "#777",
};

const emptyStyle = {
  padding: 40,
  textAlign: "center",
  color: "#777",
};

const errorStyle = {
  background: "#FDECEC",
  border: "1px solid #E8B4B4",
  color: "#9B1C1C",
  padding: "12px 15px",
  borderRadius: 6,
  marginBottom: 20,
};

const sectionHeaderStyle = {
  padding: 25,
  borderBottom: "1px solid #E5E5E5",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: 22,
};

const sectionSubtitleStyle = {
  margin: "6px 0 0",
  color: "#777",
  fontSize: 14,
};

const whatsappGrid = {
  padding: 25,
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(420px, 1fr))",
  gap: 20,
};

const whatsappCardStyle = {
  border: "1px solid #DDD",
  borderRadius: 10,
  padding: 25,
  background: "#FFF",
};

const whatsappIconStyle = {
  width: 42,
  height: 42,
  borderRadius: 8,
  background: "#111",
  color: "#C9A227",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: 13,
};

const statusBadgeStyle = {
  padding: "5px 10px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 600,
};

const activeBadgeStyle = {
  background: "#E7F5E8",
  color: "#2E7D32",
};

const inactiveBadgeStyle = {
  background: "#F1F1F1",
  color: "#666",
};

const infoRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  padding: "12px 0",
  borderBottom: "1px solid #EEE",
  fontSize: 14,
};

const infoLabelStyle = {
  color: "#777",
  fontWeight: 600,
};

const primaryButtonStyle = {
  background: "#C9A227",
  color: "#111",
  border: "none",
  padding: "10px 18px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 700,
  marginTop: 20,
};

const secondaryButtonStyle = {
  background: "#FFF",
  color: "#111",
  border: "1px solid #CCC",
  padding: "10px 18px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  padding: 20,
};

const modalStyle = {
  width: "100%",
  maxWidth: 700,
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#FFF",
  borderRadius: 10,
  boxShadow:
    "0 15px 50px rgba(0,0,0,0.25)",
};

const modalHeaderStyle = {
  padding: "20px 24px",
  borderBottom: "1px solid #E5E5E5",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const closeButtonStyle = {
  border: "none",
  background: "transparent",
  fontSize: 30,
  lineHeight: 1,
  cursor: "pointer",
  color: "#555",
};

const modalBodyStyle = {
  padding: "10px 24px",
};

const detailRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  padding: "13px 0",
  borderBottom: "1px solid #EEE",
  fontSize: 14,
};

const detailLabelStyle = {
  fontWeight: 600,
  color: "#777",
};

const modalFooterStyle = {
  padding: "16px 24px",
  borderTop: "1px solid #E5E5E5",
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
};

const fieldLabelStyle = {
  display: "block",
  marginBottom: 7,
  fontSize: 13,
  fontWeight: 600,
  color: "#333",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: "1px solid #CCC",
  borderRadius: 6,
  fontSize: 14,
  outline: "none",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
};

// ======================================================
// EXPORT
// ======================================================

export default SuperAdminSupport;