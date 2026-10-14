
import React, { useEffect, useMemo, useState } from "react";
import {
  FaVideo,
  FaSearch,
  FaSyncAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaMapMarkerAlt,
  FaHome,
  FaExclamationCircle,
} from "react-icons/fa";
import api from "../../services/api";

const initialForm = {
  property_id: "",
  camera_name: "",
  camera_location: "",
  camera_type: "CCTV",
  status: "Active",
  installation_date: "",
  remarks: "",
};

const getRows = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.cameras)) return response.data.cameras;
  if (Array.isArray(response?.cameras)) return response.cameras;
  return [];
};

export default function SurveillanceCameras() {
  const [cameras, setCameras] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCameras = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/surveillance-cameras");
      setCameras(getRows(response.data));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load cameras. Check your backend server and API route."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    try {
      const response = await api.get("/properties");
      setProperties(getRows(response.data));
    } catch (err) {
      console.error("Property loading failed:", err);
    }
  };

  useEffect(() => {
    loadCameras();
    loadProperties();
  }, []);

  const filteredCameras = useMemo(() => {
    const query = search.toLowerCase().trim();

    return cameras.filter((camera) => {
      const matchesSearch = [
        camera.camera_name,
        camera.camera_location,
        camera.camera_type,
        camera.property_name,
        camera.survey_number,
        camera.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" ||
        String(camera.status).toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [cameras, search, statusFilter]);

  const activeCount = cameras.filter(
    (camera) => camera.status?.toLowerCase() === "active"
  ).length;

  const inactiveCount = cameras.filter(
    (camera) => camera.status?.toLowerCase() === "inactive"
  ).length;

  const offlineCount = cameras.filter(
    (camera) => camera.status?.toLowerCase() === "offline"
  ).length;

  const openAddForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const openEditForm = (camera) => {
    setEditingId(camera.id);
    setForm({
      property_id: camera.property_id || "",
      camera_name: camera.camera_name || "",
      camera_location: camera.camera_location || "",
      camera_type: camera.camera_type || "CCTV",
      status: camera.status || "Active",
      installation_date: camera.installation_date
        ? String(camera.installation_date).slice(0, 10)
        : "",
      remarks: camera.remarks || "",
    });
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      ...form,
      property_id: Number(form.property_id),
      camera_name: form.camera_name.trim(),
      camera_location: form.camera_location.trim(),
      installation_date: form.installation_date || null,
      remarks: form.remarks.trim(),
    };

    try {
      if (editingId) {
        await api.put(`/surveillance-cameras/${editingId}`, payload);
        setMessage("Camera updated successfully.");
      } else {
        await api.post("/surveillance-cameras", payload);
        setMessage("Camera added successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(initialForm);
      await loadCameras();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save camera. Please check the backend API."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (camera) => {
    if (!window.confirm(`Delete camera "${camera.camera_name}"?`)) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`/surveillance-cameras/${camera.id}`);
      setCameras((previous) =>
        previous.filter((item) => item.id !== camera.id)
      );
      setMessage("Camera deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete camera. Check whether it is linked to motion alerts."
      );
    }
  };

  const statusClass = (status) => {
    const value = status?.toLowerCase();

    if (value === "active") return "sc-status-active";
    if (value === "offline") return "sc-status-offline";
    return "sc-status-inactive";
  };

  return (
    <div className="sc-page">
      <style>{`
        .sc-page {
          min-height: 100vh;
          padding: 28px;
          color: #fff;
          background: #111;
          font-family: Arial, sans-serif;
        }
        .sc-page * { box-sizing: border-box; }
        .sc-header {
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap;
          gap: 16px; margin-bottom: 26px;
        }
        .sc-heading { display: flex; align-items: center; gap: 14px; }
        .sc-heading-icon {
          width: 54px; height: 54px; display: grid;
          place-items: center; border-radius: 12px;
          background: #c9a227; color: #111; font-size: 23px;
        }
        .sc-heading h1 { margin: 0 0 7px; font-size: 27px; }
        .sc-heading p { margin: 0; color: #aaa; font-size: 14px; }
        .sc-button {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 8px; padding: 11px 15px; border-radius: 8px;
          border: 1px solid #c9a227; font-weight: 700; cursor: pointer;
        }
        .sc-primary { background: #c9a227; color: #111; }
        .sc-primary:hover { background: #e0bb45; }
        .sc-secondary { background: transparent; color: #fff; }
        .sc-secondary:hover { background: #292929; }
        .sc-button:disabled { opacity: .6; cursor: not-allowed; }
        .sc-stats {
          display: grid; grid-template-columns: repeat(4,minmax(0,1fr));
          gap: 16px; margin-bottom: 24px;
        }
        .sc-stat {
          padding: 20px; border: 1px solid #333;
          border-radius: 12px; background: #1b1b1b;
        }
        .sc-stat-label { color: #aaa; font-size: 13px; margin-bottom: 12px; }
        .sc-stat-value { color: #c9a227; font-size: 29px; font-weight: 700; }
        .sc-toolbar { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 18px; }
        .sc-search { position: relative; flex: 1; min-width: 220px; }
        .sc-search svg {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%); color: #999;
        }
        .sc-input, .sc-select, .sc-textarea {
          width: 100%; padding: 12px; border: 1px solid #3b3b3b;
          border-radius: 7px; outline: none; background: #202020;
          color: #fff; font-size: 14px;
        }
        .sc-search .sc-input { padding-left: 38px; }
        .sc-input:focus, .sc-select:focus, .sc-textarea:focus {
          border-color: #c9a227;
        }
        .sc-select { min-width: 160px; }
        .sc-table-wrap {
          overflow-x: auto; border: 1px solid #333;
          border-radius: 12px; background: #1b1b1b;
        }
        .sc-table { width: 100%; min-width: 900px; border-collapse: collapse; }
        .sc-table th {
          padding: 15px; text-align: left; white-space: nowrap;
          color: #c9a227; background: #242424;
          font-size: 12px; text-transform: uppercase;
        }
        .sc-table td { padding: 15px; border-top: 1px solid #303030; font-size: 13px; }
        .sc-table tbody tr:hover { background: #222; }
        .sc-name { font-weight: 700; margin-bottom: 5px; }
        .sc-muted { color: #999; font-size: 12px; }
        .sc-status {
          display: inline-block; padding: 6px 9px;
          border-radius: 20px; font-size: 11px;
          font-weight: 700; text-transform: capitalize;
        }
        .sc-status-active { background: #173c2b; color: #71e0a0; }
        .sc-status-inactive { background: #393939; color: #ccc; }
        .sc-status-offline { background: #492020; color: #ff9999; }
        .sc-action {
          width: 34px; height: 34px; margin-right: 6px;
          border: 1px solid #444; border-radius: 7px;
          background: transparent; color: #c9a227; cursor: pointer;
        }
        .sc-action:hover { background: #333; }
        .sc-delete { color: #ff7777; }
        .sc-notice { margin-bottom: 16px; padding: 12px 14px; border-radius: 8px; font-size: 14px; }
        .sc-error { color: #ffaaaa; border: 1px solid #6b3333; background: #321d1d; }
        .sc-success { color: #8ee4ad; border: 1px solid #28563b; background: #183021; }
        .sc-empty { padding: 44px 20px; text-align: center; color: #aaa; }
        .sc-empty svg { display: block; margin: 0 auto 14px; color: #c9a227; font-size: 30px; }
        .sc-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          display: flex; justify-content: center; align-items: center;
          padding: 20px; overflow-y: auto; background: #000c;
        }
        .sc-modal {
          width: 100%; max-width: 620px; max-height: 92vh;
          overflow-y: auto; border: 1px solid #444;
          border-radius: 14px; background: #191919;
        }
        .sc-modal-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 22px; border-bottom: 1px solid #333;
        }
        .sc-modal-header h2 { margin: 0; font-size: 20px; }
        .sc-close { border: 0; background: transparent; color: #fff; font-size: 20px; cursor: pointer; }
        .sc-form { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; padding: 22px; }
        .sc-field { display: flex; flex-direction: column; gap: 8px; }
        .sc-field label { color: #ddd; font-size: 13px; font-weight: 600; }
        .sc-full { grid-column: 1 / -1; }
        .sc-textarea { min-height: 90px; resize: vertical; }
        .sc-form-actions { display: flex; justify-content: flex-end; gap: 10px; grid-column: 1 / -1; }
        @media(max-width:850px) {
          .sc-page { padding: 18px; }
          .sc-stats { grid-template-columns: repeat(2,minmax(0,1fr)); }
        }
        @media(max-width:520px) {
          .sc-stats { gap: 10px; }
          .sc-stat { padding: 14px; }
          .sc-stat-value { font-size: 24px; }
          .sc-form { grid-template-columns: 1fr; padding: 16px; }
          .sc-full { grid-column: auto; }
          .sc-backdrop { padding: 10px; }
        }
      `}</style>

      <div className="sc-header">
        <div className="sc-heading">
          <div className="sc-heading-icon"><FaVideo /></div>
          <div>
            <h1>Surveillance Cameras</h1>
            <p>Monitor and manage property security cameras.</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="sc-button sc-secondary" onClick={() => {
            loadCameras();
            loadProperties();
          }}>
            <FaSyncAlt /> Refresh
          </button>
          <button className="sc-button sc-primary" onClick={openAddForm}>
            <FaPlus /> Add Camera
          </button>
        </div>
      </div>

      <div className="sc-stats">
        <div className="sc-stat"><div className="sc-stat-label">Total Cameras</div><div className="sc-stat-value">{cameras.length}</div></div>
        <div className="sc-stat"><div className="sc-stat-label">Active Cameras</div><div className="sc-stat-value">{activeCount}</div></div>
        <div className="sc-stat"><div className="sc-stat-label">Inactive Cameras</div><div className="sc-stat-value">{inactiveCount}</div></div>
        <div className="sc-stat"><div className="sc-stat-label">Offline Cameras</div><div className="sc-stat-value">{offlineCount}</div></div>
      </div>

      {message && <div className="sc-notice sc-success">{message}</div>}
      {error && !showForm && <div className="sc-notice sc-error"><FaExclamationCircle /> {error}</div>}

      <div className="sc-toolbar">
        <div className="sc-search">
          <FaSearch />
          <input
            className="sc-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search camera, property, location..."
          />
        </div>
        <select className="sc-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Offline">Offline</option>
        </select>
      </div>

      <div className="sc-table-wrap">
        <table className="sc-table">
          <thead>
            <tr>
              <th>Camera</th><th>Property</th><th>Location</th>
              <th>Type</th><th>Status</th><th>Installed</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="sc-empty">Loading cameras...</td></tr>
            ) : filteredCameras.length === 0 ? (
              <tr>
                <td colSpan="7" className="sc-empty">
                  <FaVideo />
                  {cameras.length === 0
                    ? "No cameras found. Click Add Camera to create one."
                    : "No cameras match your search or filter."}
                </td>
              </tr>
            ) : filteredCameras.map((camera) => (
              <tr key={camera.id}>
                <td>
                  <div className="sc-name"><FaVideo style={{ color: "#c9a227", marginRight: 8 }} />{camera.camera_name || `Camera #${camera.id}`}</div>
                  <div className="sc-muted">ID: {camera.id}</div>
                </td>
                <td>
                  <div className="sc-name"><FaHome style={{ marginRight: 6 }} />{camera.property_name || `Property #${camera.property_id}`}</div>
                  {camera.survey_number && <div className="sc-muted">Survey: {camera.survey_number}</div>}
                </td>
                <td><FaMapMarkerAlt style={{ color: "#c9a227", marginRight: 6 }} />{camera.camera_location || "Not specified"}</td>
                <td>{camera.camera_type || "CCTV"}</td>
                <td><span className={`sc-status ${statusClass(camera.status)}`}>{camera.status || "Unknown"}</span></td>
                <td>{camera.installation_date ? String(camera.installation_date).slice(0, 10) : "—"}</td>
                <td>
                  <button className="sc-action" title="Edit camera" onClick={() => openEditForm(camera)}><FaEdit /></button>
                  <button className="sc-action sc-delete" title="Delete camera" onClick={() => handleDelete(camera)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="sc-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !saving) setShowForm(false);
        }}>
          <div className="sc-modal" role="dialog" aria-modal="true">
            <div className="sc-modal-header">
              <h2>{editingId ? "Edit Camera" : "Add Surveillance Camera"}</h2>
              <button type="button" className="sc-close" onClick={() => !saving && setShowForm(false)}><FaTimes /></button>
            </div>

            {error && <div className="sc-notice sc-error" style={{ margin: "16px 22px 0" }}>{error}</div>}

            <form className="sc-form" onSubmit={handleSubmit}>
              <div className="sc-field sc-full">
                <label htmlFor="property_id">Property *</label>
                <select id="property_id" name="property_id" className="sc-select" value={form.property_id} onChange={handleChange} required>
                  <option value="">Select property</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.property_name || `Property #${property.id}`}
                      {property.survey_number ? ` — Survey ${property.survey_number}` : ""}
                    </option>
                  ))}
                </select>
                {properties.length === 0 && <small className="sc-muted">No properties loaded. Check the properties API.</small>}
              </div>

              <div className="sc-field">
                <label htmlFor="camera_name">Camera Name *</label>
                <input id="camera_name" name="camera_name" className="sc-input" value={form.camera_name} onChange={handleChange} placeholder="Main Gate Camera" required maxLength={150} />
              </div>

              <div className="sc-field">
                <label htmlFor="camera_type">Camera Type *</label>
                <select id="camera_type" name="camera_type" className="sc-select" value={form.camera_type} onChange={handleChange} required>
                  <option value="CCTV">CCTV</option>
                  <option value="IP Camera">IP Camera</option>
                  <option value="PTZ Camera">PTZ Camera</option>
                  <option value="Thermal Camera">Thermal Camera</option>
                  <option value="Motion Sensor Camera">Motion Sensor Camera</option>
                </select>
              </div>

              <div className="sc-field sc-full">
                <label htmlFor="camera_location">Camera Location *</label>
                <input id="camera_location" name="camera_location" className="sc-input" value={form.camera_location} onChange={handleChange} placeholder="Main entrance" required maxLength={255} />
              </div>

              <div className="sc-field">
                <label htmlFor="status">Status *</label>
                <select id="status" name="status" className="sc-select" value={form.status} onChange={handleChange} required>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <div className="sc-field">
                <label htmlFor="installation_date">Installation Date</label>
                <input id="installation_date" name="installation_date" type="date" className="sc-input" value={form.installation_date} onChange={handleChange} />
              </div>

              <div className="sc-field sc-full">
                <label htmlFor="remarks">Remarks</label>
                <textarea id="remarks" name="remarks" className="sc-textarea" value={form.remarks} onChange={handleChange} placeholder="Optional notes" maxLength={2000} />
              </div>

              <div className="sc-form-actions">
                <button type="button" className="sc-button sc-secondary" onClick={() => setShowForm(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="sc-button sc-primary" disabled={saving || properties.length === 0}>
                  {saving ? "Saving..." : editingId ? "Update Camera" : "Save Camera"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
