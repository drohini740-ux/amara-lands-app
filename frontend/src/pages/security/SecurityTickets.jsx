
import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const initialForm = {
  subject: "",
  description: "",
  priority: "Medium",
};

const SecurityTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch tickets
  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tickets");
      const data = response.data;

      const ticketList = Array.isArray(data.tickets)
        ? data.tickets
        : Array.isArray(data.data?.tickets)
          ? data.data.tickets
          : [];

      setTickets(ticketList);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load support tickets. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // Search and filter tickets
  const filteredTickets = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        !searchText ||
        String(ticket.id ?? "").includes(searchText) ||
        String(ticket.subject || "").toLowerCase().includes(searchText) ||
        String(ticket.description || "").toLowerCase().includes(searchText) ||
        String(ticket.user_name || "").toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  // Update form fields
  const updateForm = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Create ticket
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const response = await api.post("/tickets", {
        subject: form.subject.trim(),
        description: form.description.trim(),
        priority: form.priority,
      });

      const data = response.data;
      const newTicket = data.ticket || data.data?.ticket;

      if (newTicket) {
        setTickets((previous) => [
          newTicket,
          ...previous.filter((ticket) => ticket.id !== newTicket.id),
        ]);
      } else {
        await loadTickets();
      }

      setForm(initialForm);
      setShowForm(false);
      setSuccess("Support ticket created successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create the ticket. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Clear filters
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
  };

  const openCount = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const progressCount = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) =>
      ticket.status === "Resolved" || ticket.status === "Closed"
  ).length;

  // Status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "st-status-open";
      case "In Progress":
        return "st-status-progress";
      case "Resolved":
        return "st-status-resolved";
      case "Closed":
        return "st-status-closed";
      default:
        return "st-status-default";
    }
  };

  // Priority badge class
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Low":
        return "st-priority-low";
      case "Medium":
        return "st-priority-medium";
      case "High":
        return "st-priority-high";
      case "Urgent":
        return "st-priority-urgent";
      default:
        return "st-priority-medium";
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="st-page">
      {/* CSS is kept inside this JSX file */}
      <style>{`
        .st-page {
          min-height: 100%;
          padding: 24px;
          color: #202020;
          background: #f5f6f8;
          font-family: Arial, Helvetica, sans-serif;
        }

        .st-container {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
        }

        .st-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 25px;
        }

        .st-eyebrow {
          margin: 0 0 8px;
          color: #927017;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.6px;
          text-transform: uppercase;
        }

        .st-heading {
          margin: 0;
          color: #111;
          font-size: 30px;
          font-weight: 750;
          letter-spacing: -0.7px;
        }

        .st-subtitle {
          margin: 9px 0 0;
          color: #777;
          font-size: 14px;
          line-height: 1.6;
        }

        .st-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 11px 18px;
          border: 1px solid transparent;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .st-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .st-button-gold {
          color: #111;
          background: #c9a227;
          border-color: #c9a227;
        }

        .st-button-gold:hover:not(:disabled) {
          background: #dfbd4d;
        }

        .st-button-dark {
          color: #fff;
          background: #111;
          border-color: #111;
        }

        .st-button-dark:hover:not(:disabled) {
          color: #111;
          background: #c9a227;
          border-color: #c9a227;
        }

        .st-button-light {
          color: #333;
          background: #fff;
          border-color: #ddd;
        }

        .st-button-light:hover:not(:disabled) {
          background: #f5f5f5;
        }

        .st-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 22px;
        }

        .st-card {
          min-width: 0;
          background: #fff;
          border: 1px solid #e9e9e9;
          border-radius: 11px;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.035);
        }

        .st-summary-card {
          display: flex;
          min-height: 120px;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 20px;
          border-left: 4px solid #c9a227;
        }

        .st-summary-label {
          margin: 0;
          color: #777;
          font-size: 12px;
          font-weight: 600;
        }

        .st-summary-number {
          margin: 11px 0 0;
          color: #111;
          font-size: 30px;
          font-weight: 750;
        }

        .st-summary-icon {
          display: flex;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          color: #a17b10;
          background: #fff7df;
          border-radius: 11px;
          font-size: 19px;
        }

        .st-panel {
          margin-bottom: 22px;
          padding: 22px;
        }

        .st-panel-heading {
          margin: 0 0 5px;
          color: #111;
          font-size: 17px;
          font-weight: 750;
        }

        .st-panel-description {
          margin: 0 0 20px;
          color: #888;
          font-size: 12px;
        }

        .st-form-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 20px;
        }

        .st-field {
          min-width: 0;
          margin-bottom: 18px;
        }

        .st-label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-size: 12px;
          font-weight: 700;
        }

        .st-control {
          display: block;
          width: 100%;
          min-height: 43px;
          padding: 11px 13px;
          color: #252525;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 7px;
          font-family: inherit;
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
        }

        .st-control:focus {
          border-color: #c9a227;
          box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.13);
        }

        .st-textarea {
          min-height: 110px;
          resize: vertical;
        }

        .st-form-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 5px;
        }

        .st-alert {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
          padding: 14px 16px;
          border: 1px solid;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.6;
        }

        .st-alert-error {
          color: #9d2626;
          background: #fff1f1;
          border-color: #f0cccc;
        }

        .st-alert-success {
          color: #176b36;
          background: #edfaf0;
          border-color: #c8e9d0;
        }

        .st-dismiss {
          padding: 0 4px;
          color: inherit;
          background: transparent;
          border: 0;
          font-size: 20px;
          cursor: pointer;
        }

        .st-filter-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 16px;
        }

        .st-filter-footer {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 18px;
          padding-top: 17px;
          border-top: 1px solid #eee;
        }

        .st-muted-text {
          margin: 0;
          color: #777;
          font-size: 12px;
        }

        .st-filter-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .st-table-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 18px 20px;
          border-bottom: 1px solid #eee;
        }

        .st-table-title {
          margin: 0;
          color: #111;
          font-size: 15px;
          font-weight: 750;
        }

        .st-table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .st-table {
          width: 100%;
          min-width: 950px;
          border-collapse: collapse;
          text-align: left;
          font-size: 12px;
        }

        .st-table thead {
          color: #fff;
          background: #111;
        }

        .st-table th {
          padding: 15px 17px;
          color: #d7b84c;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          white-space: nowrap;
          border-bottom: 2px solid #c9a227;
        }

        .st-table td {
          padding: 16px 17px;
          vertical-align: top;
          border-bottom: 1px solid #eee;
        }

        .st-table tbody tr:hover {
          background: #fffaf0;
        }

        .st-ticket-id {
          color: #927017;
          font-weight: 750;
          white-space: nowrap;
        }

        .st-ticket-subject {
          margin: 0;
          color: #202020;
          font-size: 13px;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .st-ticket-description {
          max-width: 350px;
          margin: 6px 0 0;
          color: #777;
          font-size: 12px;
          line-height: 1.6;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .st-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 750;
          white-space: nowrap;
        }

        .st-priority-low {
          color: #174ea6;
          background: #e3efff;
        }

        .st-priority-medium {
          color: #856404;
          background: #fff1c2;
        }

        .st-priority-high {
          color: #a64b00;
          background: #ffead8;
        }

        .st-priority-urgent {
          color: #a32129;
          background: #ffe1e3;
        }

        .st-status-open {
          color: #174ea6;
          background: #e3efff;
        }

        .st-status-progress {
          color: #856404;
          background: #fff1c2;
        }

        .st-status-resolved {
          color: #176b36;
          background: #dff5e3;
        }

        .st-status-closed {
          color: #555;
          background: #ededed;
        }

        .st-status-default {
          color: #555;
          background: #eee;
        }

        .st-empty {
          padding: 48px 20px;
          text-align: center;
        }

        .st-empty-title {
          margin: 12px 0 6px;
          color: #333;
          font-size: 16px;
          font-weight: 700;
        }

        .st-empty-description {
          margin: 0;
          color: #888;
          font-size: 13px;
        }

        .st-spinner {
          width: 29px;
          height: 29px;
          margin: 0 auto;
          border: 3px solid #eee;
          border-top-color: #c9a227;
          border-radius: 50%;
          animation: st-spin 0.8s linear infinite;
        }

        @keyframes st-spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1000px) {
          .st-summary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .st-filter-grid {
            grid-template-columns: 1fr 1fr;
          }

          .st-filter-grid > div:first-child {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 650px) {
          .st-page {
            padding: 13px;
          }

          .st-heading {
            font-size: 25px;
          }

          .st-summary-grid {
            gap: 10px;
          }

          .st-summary-card {
            min-height: 100px;
            padding: 13px;
          }

          .st-summary-number {
            font-size: 25px;
          }

          .st-summary-icon {
            width: 35px;
            height: 35px;
            font-size: 15px;
          }

          .st-panel {
            padding: 15px;
          }

          .st-form-grid,
          .st-filter-grid {
            grid-template-columns: 1fr;
          }

          .st-filter-grid > div:first-child {
            grid-column: auto;
          }

          .st-filter-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .st-filter-actions {
            width: 100%;
          }

          .st-filter-actions .st-button {
            flex: 1;
          }

          .st-button {
            padding: 10px 12px;
          }
        }

        @media (max-width: 390px) {
          .st-summary-card {
            padding: 10px;
          }

          .st-summary-number {
            font-size: 22px;
          }

          .st-summary-icon {
            display: none;
          }
        }
      `}</style>

      <div className="st-container">
        {/* Page heading */}
        <div className="st-header">
          <div>
            <p className="st-eyebrow">
              Amara Lands / Security Portal
            </p>

            <h1 className="st-heading">Support Tickets</h1>

            <p className="st-subtitle">
              Create support requests and track their progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm((previous) => !previous);
              setError("");
              setSuccess("");
            }}
            className="st-button st-button-gold"
          >
            {showForm ? "× Cancel" : "+ Add Ticket"}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div role="alert" className="st-alert st-alert-error">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="st-dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div role="status" className="st-alert st-alert-success">
            {success}
          </div>
        )}

        {/* Create ticket form */}
        {showForm && (
          <section className="st-card st-panel">
            <h2 className="st-panel-heading">Create Support Ticket</h2>

            <p className="st-panel-description">
              Describe your issue so the support team can review it.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="st-form-grid">
                <div className="st-field">
                  <label className="st-label" htmlFor="ticket-subject">
                    Subject *
                  </label>

                  <input
                    id="ticket-subject"
                    name="subject"
                    type="text"
                    className="st-control"
                    value={form.subject}
                    onChange={updateForm}
                    maxLength={255}
                    placeholder="Enter ticket subject"
                    required
                  />
                </div>

                <div className="st-field">
                  <label className="st-label" htmlFor="ticket-priority">
                    Priority
                  </label>

                  <select
                    id="ticket-priority"
                    name="priority"
                    className="st-control"
                    value={form.priority}
                    onChange={updateForm}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="st-field">
                <label className="st-label" htmlFor="ticket-description">
                  Description *
                </label>

                <textarea
                  id="ticket-description"
                  name="description"
                  className="st-control st-textarea"
                  value={form.description}
                  onChange={updateForm}
                  rows={4}
                  placeholder="Describe your issue or request"
                  required
                />
              </div>

              <div className="st-form-actions">
                <button
                  type="submit"
                  disabled={submitting}
                  className="st-button st-button-dark"
                >
                  {submitting ? "Creating..." : "Submit Ticket"}
                </button>

                <button
                  type="button"
                  className="st-button st-button-light"
                  onClick={() => {
                    setShowForm(false);
                    setForm(initialForm);
                    setError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Summary cards */}
        <div className="st-summary-grid">
          <div className="st-card st-summary-card">
            <div>
              <p className="st-summary-label">Total Tickets</p>
              <p className="st-summary-number">{tickets.length}</p>
            </div>
            <div className="st-summary-icon">#</div>
          </div>

          <div
            className="st-card st-summary-card"
            style={{ borderLeftColor: "#2874c7" }}
          >
            <div>
              <p className="st-summary-label">Open</p>
              <p className="st-summary-number">{openCount}</p>
            </div>
            <div
              className="st-summary-icon"
              style={{ color: "#2874c7", background: "#eaf2ff" }}
            >
              O
            </div>
          </div>

          <div
            className="st-card st-summary-card"
            style={{ borderLeftColor: "#d39e00" }}
          >
            <div>
              <p className="st-summary-label">In Progress</p>
              <p className="st-summary-number">{progressCount}</p>
            </div>
            <div
              className="st-summary-icon"
              style={{ color: "#9b7300", background: "#fff5d8" }}
            >
              ↻
            </div>
          </div>

          <div
            className="st-card st-summary-card"
            style={{ borderLeftColor: "#198754" }}
          >
            <div>
              <p className="st-summary-label">Resolved / Closed</p>
              <p className="st-summary-number">{resolvedCount}</p>
            </div>
            <div
              className="st-summary-icon"
              style={{ color: "#198754", background: "#e5f7e9" }}
            >
              ✓
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <section className="st-card st-panel">
          <h2 className="st-panel-heading">Find Tickets</h2>

          <div className="st-filter-grid">
            <div>
              <label className="st-label" htmlFor="ticket-search">
                Search Tickets
              </label>

              <input
                id="ticket-search"
                type="search"
                className="st-control"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search ticket ID, subject, description..."
              />
            </div>

            <div>
              <label className="st-label" htmlFor="ticket-status-filter">
                Filter by Status
              </label>

              <select
                id="ticket-status-filter"
                className="st-control"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="st-label" htmlFor="ticket-priority-filter">
                Filter by Priority
              </label>

              <select
                id="ticket-priority-filter"
                className="st-control"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="st-filter-footer">
            <p className="st-muted-text">
              Showing {filteredTickets.length} of {tickets.length} tickets
            </p>

            <div className="st-filter-actions">
              <button
                type="button"
                className="st-button st-button-light"
                onClick={resetFilters}
              >
                Clear Filters
              </button>

              <button
                type="button"
                className="st-button st-button-gold"
                onClick={loadTickets}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "↻ Refresh"}
              </button>
            </div>
          </div>
        </section>

        {/* Ticket list */}
        <section className="st-card" style={{ overflow: "hidden" }}>
          <div className="st-table-heading">
            <h2 className="st-table-title">Ticket List</h2>
            <span className="st-muted-text">
              {filteredTickets.length} result(s)
            </span>
          </div>

          {loading ? (
            <div className="st-empty">
              <div className="st-spinner" />
              <p className="st-empty-title">Loading tickets</p>
              <p className="st-empty-description">
                Please wait while we fetch your support tickets.
              </p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="st-empty">
              <div
                style={{
                  color: "#c9a227",
                  fontSize: 34,
                  fontWeight: 700,
                }}
              >
                —
              </div>
              <p className="st-empty-title">No tickets found</p>
              <p className="st-empty-description">
                Create a ticket or change your search and filters.
              </p>
            </div>
          ) : (
            <div className="st-table-wrap">
              <table className="st-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Subject / Description</th>
                    <th>Created By</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>
                        <span className="st-ticket-id">
                          #{ticket.id}
                        </span>
                      </td>

                      <td>
                        <p className="st-ticket-subject">
                          {ticket.subject?.trim() || "Untitled ticket"}
                        </p>

                        <p className="st-ticket-description">
                          {ticket.description || "No description"}
                        </p>
                      </td>

                      <td style={{ overflowWrap: "anywhere" }}>
                        {ticket.user_name || "User"}
                      </td>

                      <td>
                        <span
                          className={`st-badge ${getPriorityClass(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority || "Medium"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`st-badge ${getStatusClass(
                            ticket.status
                          )}`}
                        >
                          {ticket.status || "Open"}
                        </span>
                      </td>

                      <td style={{ whiteSpace: "nowrap" }}>
                        {formatDate(ticket.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SecurityTickets;
