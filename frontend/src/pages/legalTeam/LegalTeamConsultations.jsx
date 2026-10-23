import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

import {
  FaBalanceScale,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaSearch,
  FaSync,
  FaVideo,
} from "react-icons/fa";

const LegalTeamConsultations = () => {
  const navigate = useNavigate();

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [meetingTypeFilter, setMeetingTypeFilter] = useState("all");

  // Fetch consultations using the shared API service. It attaches the
  // authentication token from sessionStorage automatically.
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/legal-team/consultations");
      console.log("Legal Team Consultations Response:", response.data);

      if (response.data?.success) {
        setConsultations(response.data.consultations || []);
      } else {
        setConsultations([]);
        setError(
          response.data?.message || "Unable to fetch consultations."
        );
      }
    } catch (err) {
      console.error(
        "Legal Team Consultations Error:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message || "Unable to load consultations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleDateString("en-IN");
    } catch {
      return "-";
    }
  };

  const formatTime = (time) => {
    if (!time) return "-";
    try {
      const [hours, minutes] = String(time).split(":");
      const date = new Date();
      date.setHours(Number(hours), Number(minutes), 0, 0);
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return time;
    }
  };

  const filteredConsultations = useMemo(() => {
    return consultations.filter((item) => {
      const searchValue = search.trim().toLowerCase();
      const matchesSearch =
        !searchValue ||
        String(item.customer_name || "").toLowerCase().includes(searchValue) ||
        String(item.customer_email || "").toLowerCase().includes(searchValue) ||
        String(item.case_number || "").toLowerCase().includes(searchValue) ||
        String(item.case_title || "").toLowerCase().includes(searchValue) ||
        String(item.property_name || "").toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        String(item.status || "").toLowerCase() === statusFilter.toLowerCase();
      const matchesMeetingType =
        meetingTypeFilter === "all" ||
        String(item.meeting_type || "").toLowerCase() ===
          meetingTypeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesMeetingType;
    });
  }, [consultations, search, statusFilter, meetingTypeFilter]);

  const totalConsultations = consultations.length;
  const pendingConsultations = consultations.filter(
    (item) => String(item.status || "").toLowerCase() === "pending"
  ).length;
  const confirmedConsultations = consultations.filter(
    (item) => String(item.status || "").toLowerCase() === "confirmed"
  ).length;
  const completedConsultations = consultations.filter((item) =>
    ["completed", "closed"].includes(String(item.status || "").toLowerCase())
  ).length;

  const handleViewConsultation = (id) => {
    navigate(`/legal-team/consultations/view/${id}`);
  };

  const cardStyle = (borderColor) => ({
    borderLeft: `4px solid ${borderColor}`,
  });

  const iconStyle = (color) => ({ color, fontSize: "28px" });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1" style={{ fontWeight: "700", color: "#111111" }}>
            Legal Consultations
          </h3>
          <p className="mb-0" style={{ color: "#777777" }}>
            Manage customer legal consultations and meetings.
          </p>
        </div>
        <button
          type="button"
          className="btn"
          onClick={fetchConsultations}
          disabled={loading}
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
            border: "1px solid #111111",
          }}
        >
          <FaSync className="me-2" /> Refresh
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="bg-white rounded shadow-sm p-4" style={cardStyle("#C9A227")}>
            <div className="d-flex justify-content-between align-items-center">
              <div><small className="text-muted">Total Consultations</small><h3 className="mb-0 mt-2">{totalConsultations}</h3></div>
              <FaBalanceScale style={iconStyle("#C9A227")} />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-white rounded shadow-sm p-4" style={cardStyle("#ffc107")}>
            <div className="d-flex justify-content-between align-items-center">
              <div><small className="text-muted">Pending</small><h3 className="mb-0 mt-2">{pendingConsultations}</h3></div>
              <FaClock style={iconStyle("#C9A227")} />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-white rounded shadow-sm p-4" style={cardStyle("#198754")}>
            <div className="d-flex justify-content-between align-items-center">
              <div><small className="text-muted">Confirmed</small><h3 className="mb-0 mt-2">{confirmedConsultations}</h3></div>
              <FaCheckCircle style={iconStyle("#198754")} />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-white rounded shadow-sm p-4" style={cardStyle("#111111")}>
            <div className="d-flex justify-content-between align-items-center">
              <div><small className="text-muted">Completed</small><h3 className="mb-0 mt-2">{completedConsultations}</h3></div>
              <FaCalendarAlt style={iconStyle("#111111")} />
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-6">
              <div className="input-group">
                <span className="input-group-text bg-white"><FaSearch style={{ color: "#C9A227" }} /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search customer, case, property..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-3">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-lg-3">
              <select className="form-select" value={meetingTypeFilter} onChange={(e) => setMeetingTypeFilter(e.target.value)}>
                <option value="all">All Meeting Types</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>All Consultations</strong>
            <span style={{ color: "#777777", fontSize: "14px" }}>
              Showing {filteredConsultations.length} of {consultations.length}
            </span>
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: "#C9A227" }} />
              <p className="mt-3 mb-0">Loading consultations...</p>
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="text-center py-5">
              <FaCalendarAlt style={{ fontSize: "40px", color: "#CCCCCC" }} />
              <p className="mt-3 text-muted">No consultations found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead style={{ backgroundColor: "#111111", color: "#FFFFFF" }}>
                  <tr>
                    <th className="px-3">Consultation</th><th>Customer</th><th>Legal Case</th><th>Property</th><th>Date &amp; Time</th><th>Meeting</th><th>Status</th><th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConsultations.map((item) => {
                    const status = String(item.status || "").toLowerCase();
                    const statusColors = status === "confirmed"
                      ? { backgroundColor: "#DFF5E3", color: "#198754" }
                      : status === "pending"
                      ? { backgroundColor: "#FFF3CD", color: "#856404" }
                      : status === "cancelled"
                      ? { backgroundColor: "#F8D7DA", color: "#842029" }
                      : { backgroundColor: "#E8E8E8", color: "#555555" };
                    return (
                      <tr key={item.id}>
                        <td className="px-3"><strong>#{item.id}</strong><div style={{ fontSize: "12px", color: "#777777" }}>Created {formatDate(item.created_at)}</div></td>
                        <td><strong>{item.customer_name || "-"}</strong><div style={{ fontSize: "12px", color: "#777777" }}>{item.customer_mobile || item.customer_email || "-"}</div></td>
                        <td><strong>{item.case_number || "-"}</strong><div style={{ fontSize: "12px", color: "#777777" }}>{item.case_title || "-"}</div></td>
                        <td>{item.property_name || "-"}<div style={{ fontSize: "12px", color: "#777777" }}>{item.survey_number || "-"}</div></td>
                        <td><strong>{formatDate(item.consultation_date)}</strong><div style={{ fontSize: "12px", color: "#777777" }}>{formatTime(item.consultation_time)}</div></td>
                        <td><span className="badge" style={{ backgroundColor: "#F5E8B0", color: "#111111" }}><FaVideo className="me-1" />{item.meeting_type || "-"}</span></td>
                        <td><span className="badge" style={statusColors}>{item.status || "-"}</span></td>
                        <td className="text-center">
                          <button type="button" className="btn btn-sm" title="View Consultation" onClick={() => handleViewConsultation(item.id)} style={{ color: "#C9A227", border: "1px solid #C9A227", backgroundColor: "#FFFFFF" }}>
                            <FaEye className="me-1" /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalTeamConsultations;
