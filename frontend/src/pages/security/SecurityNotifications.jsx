
import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const SecurityNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications");
      const body = response.data;

      const list = Array.isArray(body?.notifications)
        ? body.notifications
        : Array.isArray(body?.data?.notifications)
        ? body.data.notifications
        : Array.isArray(body?.data)
        ? body.data
        : [];

      setNotifications(list);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load notifications. Please check your login and API."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const isRead = (item) => {
    const value = item.is_read;

    return (
      value === true ||
      value === 1 ||
      value === "1" ||
      String(value).toLowerCase() === "true" ||
      String(item.status || "").toLowerCase() === "read"
    );
  };

  const getType = (item) =>
    String(
      item.notification_type ||
      item.type ||
      item.category ||
      "General"
    );

  const getPriority = (item) =>
    String(item.priority || "Normal");

  const getDate = (item) => {
    const value = item.created_at || item.createdAt;
    if (!value) return null;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const unreadCount = notifications.filter((item) => !isRead(item)).length;
  const readCount = notifications.length - unreadCount;

  const notificationTypes = useMemo(
    () => [...new Set(notifications.map(getType))].sort(),
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications
      .filter((item) => {
        const searchableText = [
          item.title,
          item.message,
          item.description,
          item.notification_type,
          item.type,
          item.category,
          item.status,
          item.priority,
        ]
          .map((value) => String(value || ""))
          .join(" ")
          .toLowerCase();

        const matchesSearch = searchableText.includes(query);

        const matchesStatus =
          filterStatus === "All" ||
          (filterStatus === "Read" && isRead(item)) ||
          (filterStatus === "Unread" && !isRead(item));

        const matchesType =
          filterType === "All" || getType(item) === filterType;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        const dateA = getDate(a)?.getTime() || 0;
        const dateB = getDate(b)?.getTime() || 0;

        return sortOrder === "newest"
          ? dateB - dateA
          : dateA - dateB;
      });
  }, [notifications, search, filterStatus, filterType, sortOrder]);

  const runAction = async (key, callback) => {
    try {
      setActionLoading((previous) => ({ ...previous, [key]: true }));
      setError("");
      setSuccess("");

      await callback();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "The action failed. Please try again."
      );
    } finally {
      setActionLoading((previous) => ({ ...previous, [key]: false }));
    }
  };

  const handleMarkAsRead = async (item) => {
    if (isRead(item)) return;

    await runAction(`read-${item.id}`, async () => {
      await api.put(`/notifications/${item.id}/read`);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === item.id
            ? { ...notification, is_read: true }
            : notification
        )
      );

      setSuccess("Notification marked as read.");
    });
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    await runAction("read-all", async () => {
      await api.put("/notifications/read-all");

      setNotifications((previous) =>
        previous.map((item) => ({ ...item, is_read: true }))
      );

      setSuccess("All notifications marked as read.");
    });
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete notification "${item.title || `#${item.id}`}"?`
    );

    if (!confirmed) return;

    await runAction(`delete-${item.id}`, async () => {
      await api.delete(`/notifications/${item.id}`);

      setNotifications((previous) =>
        previous.filter((notification) => notification.id !== item.id)
      );

      setSuccess("Notification deleted successfully.");
    });
  };

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("All");
    setFilterType("All");
    setSortOrder("newest");
  };

  const formatDate = (item) => {
    const date = getDate(item);

    return date
      ? date.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Date unavailable";
  };

  const priorityClass = (priority) => {
    const value = priority.toLowerCase();

    if (value === "critical" || value === "urgent") {
      return "sn-priority-critical";
    }
    if (value === "high") return "sn-priority-high";
    if (value === "low") return "sn-priority-low";

    return "sn-priority-normal";
  };

  const typeIcon = (type) => {
    const value = type.toLowerCase();

    if (value.includes("motion")) return "◉";
    if (value.includes("camera")) return "▣";
    if (value.includes("security")) return "◆";
    if (value.includes("property")) return "⌂";
    if (value.includes("system")) return "⚙";

    return "●";
  };

  return (
    <div className="sn-page">
      <style>{`
        .sn-page {
          min-height: 100vh;
          padding: 28px;
          background: #101010;
          color: #f5f5f5;
          font-family: Arial, Helvetica, sans-serif;
          box-sizing: border-box;
        }

        .sn-page * { box-sizing: border-box; }

        .sn-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 26px;
        }

        .sn-eyebrow {
          color: #c9a227;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 0 0 9px;
        }

        .sn-title {
          color: #d7b44a;
          font-size: clamp(25px, 3vw, 34px);
          font-weight: 750;
          margin: 0;
        }

        .sn-subtitle {
          color: #aaa;
          margin: 9px 0 0;
          line-height: 1.6;
          font-size: 14px;
        }

        .sn-button {
          border: 1px solid #c9a227;
          border-radius: 7px;
          padding: 10px 14px;
          background: #c9a227;
          color: #111;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
          font-size: 12px;
        }

        .sn-button:hover {
          background: #e2c35f;
          border-color: #e2c35f;
        }

        .sn-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .sn-button-outline {
          background: transparent;
          color: #d7b44a;
        }

        .sn-button-outline:hover { background: #29230f; }

        .sn-button-danger {
          color: #ffb4b4;
          background: #301919;
          border-color: #693636;
        }

        .sn-button-danger:hover {
          color: white;
          background: #512020;
          border-color: #9b4444;
        }

        .sn-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .sn-stat {
          background: linear-gradient(145deg, #1c1c1c, #151515);
          border: 1px solid #353535;
          border-radius: 12px;
          padding: 20px;
          min-width: 0;
        }

        .sn-stat-label {
          color: #aaa;
          font-size: 13px;
          margin: 0 0 13px;
        }

        .sn-stat-value {
          font-size: 30px;
          font-weight: 750;
          margin: 0;
          color: #fff;
        }

        .sn-gold { color: #d7b44a; }
        .sn-green { color: #69d69a; }
        .sn-blue { color: #82b8ff; }

        .sn-panel {
          background: #181818;
          border: 1px solid #343434;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 22px;
        }

        .sn-filter-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .sn-section-title {
          color: #f5f5f5;
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }

        .sn-filter-grid {
          display: grid;
          grid-template-columns: minmax(200px, 2fr) repeat(3, minmax(140px, 1fr));
          gap: 12px;
        }

        .sn-control {
          width: 100%;
          min-width: 0;
          padding: 12px 13px;
          color: #f5f5f5;
          background: #222;
          border: 1px solid #414141;
          border-radius: 7px;
          font-size: 13px;
          outline: none;
        }

        .sn-control:focus {
          border-color: #c9a227;
          box-shadow: 0 0 0 2px #c9a22720;
        }

        .sn-control option { background: #222; color: #fff; }

        .sn-results {
          color: #aaa;
          font-size: 13px;
          margin: 17px 0 0;
        }

        .sn-list { display: grid; gap: 13px; }

        .sn-card {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 19px;
          background: #181818;
          border: 1px solid #353535;
          border-left: 4px solid #505050;
          border-radius: 10px;
          transition: border-color 0.2s ease;
        }

        .sn-card-unread {
          border-left-color: #c9a227;
          background: linear-gradient(110deg, #211f18, #181818 55%);
        }

        .sn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 43px;
          height: 43px;
          flex: 0 0 43px;
          border-radius: 10px;
          background: #29230f;
          border: 1px solid #5d4b19;
          color: #d7b44a;
          font-size: 20px;
        }

        .sn-content { flex: 1; min-width: 0; }

        .sn-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          flex-wrap: wrap;
        }

        .sn-card-title {
          color: #e1c15c;
          font-size: 16px;
          font-weight: 700;
          margin: 0;
          overflow-wrap: anywhere;
        }

        .sn-message {
          color: #d0d0d0;
          font-size: 14px;
          line-height: 1.65;
          margin: 12px 0 15px;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
        }

        .sn-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 10px;
        }

        .sn-badge {
          display: inline-flex;
          align-items: center;
          border: 1px solid #444;
          border-radius: 20px;
          padding: 5px 9px;
          font-size: 11px;
          font-weight: 700;
          color: #ccc;
          background: #242424;
        }

        .sn-status-unread {
          color: #f0cf62;
          background: #30270e;
          border-color: #6a5419;
        }

        .sn-status-read {
          color: #9bdaaf;
          background: #16271d;
          border-color: #315d41;
        }

        .sn-priority-critical,
        .sn-priority-high {
          color: #ffaaaa;
          background: #351b1b;
          border-color: #713737;
        }

        .sn-priority-low {
          color: #a8d5ff;
          background: #18283a;
          border-color: #315577;
        }

        .sn-priority-normal { color: #ddd; }

        .sn-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          color: #929292;
          font-size: 12px;
        }

        .sn-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 15px;
          padding-top: 13px;
          border-top: 1px solid #303030;
        }

        .sn-alert {
          margin-bottom: 18px;
          padding: 13px 15px;
          border-radius: 8px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .sn-error {
          color: #ffb7b7;
          background: #301919;
          border: 1px solid #633131;
        }

        .sn-success {
          color: #a8e8bb;
          background: #16271d;
          border: 1px solid #315d41;
        }

        .sn-empty {
          text-align: center;
          padding: 42px 20px;
          background: #181818;
          border: 1px dashed #444;
          border-radius: 12px;
          color: #aaa;
        }

        .sn-empty-icon {
          font-size: 32px;
          color: #c9a227;
          margin-bottom: 12px;
        }

        .sn-empty h3 { color: #eee; margin: 0 0 8px; }

        .sn-loading {
          text-align: center;
          padding: 30px;
          color: #d7b44a;
        }

        .sn-spinner {
          display: inline-block;
          width: 17px;
          height: 17px;
          margin-right: 9px;
          vertical-align: middle;
          border: 2px solid #5b4b1b;
          border-top-color: #d7b44a;
          border-radius: 50%;
          animation: sn-spin 0.8s linear infinite;
        }

        @keyframes sn-spin { to { transform: rotate(360deg); } }

        @media (max-width: 1000px) {
          .sn-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .sn-filter-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 600px) {
          .sn-page { padding: 16px; }
          .sn-stats, .sn-filter-grid { grid-template-columns: 1fr; }
          .sn-stat { padding: 16px; }
          .sn-stat-value { font-size: 26px; }
          .sn-panel { padding: 15px; }
          .sn-card { padding: 14px; gap: 10px; }
          .sn-icon { width: 35px; height: 35px; flex-basis: 35px; font-size: 16px; }
          .sn-header > .sn-button { width: 100%; }
          .sn-actions .sn-button { flex: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sn-spinner { animation: none; }
          .sn-card, .sn-button { transition: none; }
        }
      `}</style>

      <header className="sn-header">
        <div>
          <p className="sn-eyebrow">Amara Lands · Security Portal</p>
          <h1 className="sn-title">Security Notifications</h1>
          <p className="sn-subtitle">
            Monitor security alerts, updates, and important activity.
          </p>
        </div>

        <button
          type="button"
          className="sn-button"
          onClick={fetchNotifications}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </header>

      {error && (
        <div className="sn-alert sn-error" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="sn-alert sn-success" role="status">
          {success}
        </div>
      )}

      <section className="sn-stats">
        <div className="sn-stat">
          <p className="sn-stat-label">Total Notifications</p>
          <h2 className="sn-stat-value">{notifications.length}</h2>
        </div>

        <div className="sn-stat">
          <p className="sn-stat-label">Unread Notifications</p>
          <h2 className="sn-stat-value sn-gold">{unreadCount}</h2>
        </div>

        <div className="sn-stat">
          <p className="sn-stat-label">Read Notifications</p>
          <h2 className="sn-stat-value sn-green">{readCount}</h2>
        </div>

        <div className="sn-stat">
          <p className="sn-stat-label">Filtered Results</p>
          <h2 className="sn-stat-value sn-blue">
            {filteredNotifications.length}
          </h2>
        </div>
      </section>

      <section className="sn-panel">
        <div className="sn-filter-heading">
          <h2 className="sn-section-title">Search & Filter</h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button
              type="button"
              className="sn-button"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || Boolean(actionLoading["read-all"])}
            >
              {actionLoading["read-all"]
                ? "Updating..."
                : "✓ Mark All as Read"}
            </button>

            <button
              type="button"
              className="sn-button sn-button-outline"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="sn-filter-grid">
          <input
            className="sn-control"
            type="search"
            placeholder="Search title, message, type..."
            aria-label="Search notifications"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="sn-control"
            aria-label="Filter by read status"
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Unread">Unread Only</option>
            <option value="Read">Read Only</option>
          </select>

          <select
            className="sn-control"
            aria-label="Filter by notification type"
            value={filterType}
            onChange={(event) => setFilterType(event.target.value)}
          >
            <option value="All">All Types</option>
            {notificationTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            className="sn-control"
            aria-label="Sort notifications"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <p className="sn-results">
          Showing {filteredNotifications.length} of {notifications.length} notifications
        </p>
      </section>

      {loading && (
        <div className="sn-loading" role="status">
          <span className="sn-spinner" />
          Loading notifications...
        </div>
      )}

      {!loading && !error && filteredNotifications.length === 0 && (
        <div className="sn-empty">
          <div className="sn-empty-icon">◉</div>
          <h3>
            {notifications.length === 0
              ? "No Notifications Yet"
              : "No Matching Notifications"}
          </h3>
          <p>
            {notifications.length === 0
              ? "New security notifications will appear here when available."
              : "Try changing your search or filter settings."}
          </p>
          {notifications.length > 0 && (
            <button
              type="button"
              className="sn-button sn-button-outline"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {!loading && !error && filteredNotifications.length > 0 && (
        <section className="sn-list" aria-label="Notifications list">
          {filteredNotifications.map((item, index) => {
            const read = isRead(item);
            const type = getType(item);
            const priority = getPriority(item);
            const reading = Boolean(actionLoading[`read-${item.id}`]);
            const deleting = Boolean(actionLoading[`delete-${item.id}`]);

            return (
              <article
                key={item.id ?? item.notification_id ?? index}
                className={`sn-card ${read ? "" : "sn-card-unread"}`}
              >
                <div className="sn-icon" aria-hidden="true">
                  {typeIcon(type)}
                </div>

                <div className="sn-content">
                  <div className="sn-card-top">
                    <h3 className="sn-card-title">
                      {item.title || type || "Security Notification"}
                    </h3>

                    <span
                      className={`sn-badge ${
                        read ? "sn-status-read" : "sn-status-unread"
                      }`}
                    >
                      {read ? "✓ Read" : "● Unread"}
                    </span>
                  </div>

                  <div className="sn-badges">
                    <span className="sn-badge">{type}</span>
                    <span className={`sn-badge ${priorityClass(priority)}`}>
                      Priority: {priority}
                    </span>
                  </div>

                  <p className="sn-message">
                    {item.message ||
                      item.description ||
                      "No additional details available."}
                  </p>

                  <div className="sn-card-footer">
                    <span>◷ {formatDate(item)}</span>
                    {item.id != null && <span>Notification #{item.id}</span>}
                  </div>

                  <div className="sn-actions">
                    {!read && (
                      <button
                        type="button"
                        className="sn-button"
                        onClick={() => handleMarkAsRead(item)}
                        disabled={reading || deleting}
                      >
                        {reading ? "Updating..." : "✓ Mark as Read"}
                      </button>
                    )}

                    <button
                      type="button"
                      className="sn-button sn-button-danger"
                      onClick={() => handleDelete(item)}
                      disabled={deleting || reading}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default SecurityNotifications;
