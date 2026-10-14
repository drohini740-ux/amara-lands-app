
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFileAlt, FaExclamationTriangle, FaRoute, FaCheckCircle, FaSyncAlt, FaChartBar } from "react-icons/fa";
import { fetchSecurityAnalytics } from "../../redux/securityAnalyticsSlice";

const GOLD = "#C9A227";

const SecurityAnalytics = () => {
  const dispatch = useDispatch();

  const {
    overview,
    reportsByStatus,
    reportsByType,
    incidentsByStatus,
    motionAlertsByStatus,
    patrolsByStatus,
    monthlyReportTrend,
    loading,
    error,
  } = useSelector((state) => state.securityAnalytics);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    dispatch(fetchSecurityAnalytics());
  }, [dispatch]);

  const applyFilters = (event) => {
    event.preventDefault();
    dispatch(fetchSecurityAnalytics({ from, to }));
  };

  const resetFilters = () => {
    setFrom("");
    setTo("");
    dispatch(fetchSecurityAnalytics());
  };

  const cards = [
    {
      title: "Total Reports",
      value: overview.total_reports,
      icon: <FaFileAlt />,
    },
    {
      title: "Pending Reports",
      value: overview.pending_reports,
      icon: <FaExclamationTriangle />,
    },
    {
      title: "Resolved Reports",
      value: overview.resolved_reports,
      icon: <FaCheckCircle />,
    },
    {
      title: "Total Incidents",
      value: overview.total_incidents,
      icon: <FaExclamationTriangle />,
    },
    {
      title: "Motion Alerts",
      value: overview.total_motion_alerts,
      icon: <FaChartBar />,
    },
    {
      title: "Total Patrols",
      value: overview.total_patrols,
      icon: <FaRoute />,
    },
    {
      title: "Completed Patrols",
      value: overview.completed_patrols,
      icon: <FaCheckCircle />,
    },
    {
      title: "Patrol Completion",
      value: `${overview.patrol_completion_rate}%`,
      icon: <FaChartBar />,
    },
  ];

  const renderBars = (items, labelKey = "status") => {
    if (!items?.length) {
      return <p style={styles.empty}>No data available for this period.</p>;
    }

    const max = Math.max(...items.map((item) => Number(item.total) || 0), 1);

    return items.map((item, index) => (
      <div key={`${item[labelKey]}-${index}`} style={styles.barItem}>
        <div style={styles.barLabels}>
          <span>{item[labelKey] || "Other"}</span>
          <strong>{item.total}</strong>
        </div>
        <div style={styles.barTrack}>
          <div
            style={{
              ...styles.barFill,
              width: `${(Number(item.total) / max) * 100}%`,
            }}
          />
        </div>
      </div>
    ));
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>AMARA LANDS / SECURITY</p>
          <h1 style={styles.title}>Reports & Analytics</h1>
          <p style={styles.subtitle}>
            Monitor security reports, incidents, motion alerts, and patrol performance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch(fetchSecurityAnalytics({ from, to }))}
          style={styles.refreshButton}
          disabled={loading}
        >
          <FaSyncAlt /> {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <form onSubmit={applyFilters} style={styles.filterPanel}>
        <div style={styles.filterField}>
          <label htmlFor="analytics-from">From date</label>
          <input
            id="analytics-from"
            type="date"
            value={from}
            max={to || undefined}
            onChange={(event) => setFrom(event.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.filterField}>
          <label htmlFor="analytics-to">To date</label>
          <input
            id="analytics-to"
            type="date"
            value={to}
            min={from || undefined}
            onChange={(event) => setTo(event.target.value)}
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.applyButton} disabled={loading}>
          Apply Filters
        </button>

        <button
          type="button"
          onClick={resetFilters}
          style={styles.resetButton}
          disabled={loading}
        >
          Clear
        </button>
      </form>

      {error && (
        <div role="alert" style={styles.error}>
          {error}
          <button
            type="button"
            onClick={() => dispatch(fetchSecurityAnalytics({ from, to }))}
            style={styles.retryButton}
          >
            Try again
          </button>
        </div>
      )}

      {loading && (
        <p role="status" style={styles.loading}>
          Loading security analytics...
        </p>
      )}

      <div style={styles.cardGrid}>
        {cards.map((card) => (
          <div key={card.title} style={styles.statCard}>
            <div style={styles.cardTop}>
              <span style={styles.cardIcon}>{card.icon}</span>
              <span style={styles.cardAccent} />
            </div>
            <p style={styles.cardTitle}>{card.title}</p>
            <h2 style={styles.cardValue}>{card.value}</h2>
          </div>
        ))}
      </div>

      <div style={styles.chartGrid}>
        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>Reports by Status</h2>
          {renderBars(reportsByStatus)}
        </section>

        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>Reports by Type</h2>
          {renderBars(reportsByType, "report_type")}
        </section>

        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>Incidents by Status</h2>
          {renderBars(incidentsByStatus)}
        </section>

        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>Motion Alerts by Status</h2>
          {renderBars(motionAlertsByStatus)}
        </section>

        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>Patrols by Status</h2>
          {renderBars(patrolsByStatus)}
        </section>

        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>Monthly Report Trend</h2>
          {renderBars(monthlyReportTrend, "month")}
        </section>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background: "#F5F5F5",
    color: "#171717",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "18px",
    marginBottom: "26px",
  },
  eyebrow: {
    color: "#8A6D12",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    marginBottom: "8px",
  },
  title: {
    fontSize: "30px",
    fontWeight: 750,
    margin: "0 0 8px",
  },
  subtitle: {
    color: "#666",
    margin: 0,
    lineHeight: 1.6,
  },
  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "12px 18px",
    border: "none",
    borderRadius: "7px",
    background: "#171717",
    color: "#FFF",
    cursor: "pointer",
  },
  filterPanel: {
    display: "flex",
    alignItems: "end",
    flexWrap: "wrap",
    gap: "15px",
    padding: "20px",
    marginBottom: "25px",
    background: "#FFF",
    border: "1px solid #E5E5E5",
    borderRadius: "10px",
  },
  filterField: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: "180px",
    flex: "1",
  },
  input: {
    padding: "11px",
    border: "1px solid #D4D4D4",
    borderRadius: "6px",
    background: "#FFF",
    color: "#171717",
  },
  applyButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "6px",
    background: GOLD,
    color: "#171717",
    fontWeight: 700,
    cursor: "pointer",
  },
  resetButton: {
    padding: "11px 18px",
    border: "1px solid #CCC",
    borderRadius: "6px",
    background: "#FFF",
    cursor: "pointer",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "18px",
    marginBottom: "25px",
  },
  statCard: {
    padding: "20px",
    background: "#FFF",
    border: "1px solid #E5E5E5",
    borderRadius: "10px",
    boxShadow: "0 2px 7px rgba(0,0,0,0.035)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },
  cardIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "42px",
    height: "42px",
    borderRadius: "9px",
    background: "#FBF5E2",
    color: "#8A6D12",
    fontSize: "18px",
  },
  cardAccent: {
    width: "32px",
    height: "3px",
    borderRadius: "5px",
    background: GOLD,
  },
  cardTitle: {
    color: "#666",
    fontSize: "14px",
    margin: "0 0 8px",
  },
  cardValue: {
    fontSize: "29px",
    margin: 0,
    fontWeight: 750,
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  panel: {
    minWidth: 0,
    padding: "22px",
    background: "#FFF",
    border: "1px solid #E5E5E5",
    borderRadius: "10px",
  },
  panelTitle: {
    margin: "0 0 22px",
    fontSize: "17px",
    fontWeight: 700,
  },
  barItem: {
    marginBottom: "18px",
  },
  barLabels: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    fontSize: "13px",
    marginBottom: "8px",
  },
  barTrack: {
    height: "9px",
    overflow: "hidden",
    borderRadius: "10px",
    background: "#EEEEEE",
  },
  barFill: {
    height: "100%",
    minWidth: "3px",
    borderRadius: "10px",
    background: GOLD,
    transition: "width 0.3s ease",
  },
  empty: {
    color: "#777",
    fontSize: "13px",
    padding: "10px 0",
  },
  error: {
    padding: "14px",
    marginBottom: "20px",
    border: "1px solid #E7B5B5",
    borderRadius: "7px",
    background: "#FFF0F0",
    color: "#A32121",
  },
  retryButton: {
    marginLeft: "12px",
    padding: "7px 10px",
    border: "1px solid #A32121",
    borderRadius: "5px",
    background: "#FFF",
    cursor: "pointer",
  },
  loading: {
    color: "#765B0A",
    marginBottom: "18px",
  },
};

export default SecurityAnalytics;
