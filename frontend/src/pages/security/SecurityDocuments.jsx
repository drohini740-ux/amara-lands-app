
import React, { useRef, useState } from "react";
import api from "../../services/api";

const SecurityDocuments = () => {
  const [propertyId, setPropertyId] = useState("");
  const [loadedPropertyId, setLoadedPropertyId] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("Property Document");
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Reference to the upload form and file input
  const uploadFormRef = useRef(null);
  const fileInputRef = useRef(null);

  const colors = {
    background: "#101010",
    panel: "#181818",
    input: "#202020",
    border: "#353535",
    gold: "#c9a227",
    text: "#ffffff",
    muted: "#aaaaaa",
    green: "#4ade80",
    red: "#ff7777",
  };

  const panelStyle = {
    background: colors.panel,
    border: `1px solid ${colors.border}`,
    borderRadius: "10px",
    padding: "18px",
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    background: colors.input,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
  };

  const buttonStyle = {
    background: colors.gold,
    color: "#111111",
    border: "none",
    borderRadius: "6px",
    padding: "10px 15px",
    fontSize: "13px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    color: "#dddddd",
    fontSize: "12px",
    fontWeight: "600",
  };

  const backendBaseUrl = (
    api.defaults?.baseURL || "http://localhost:4000/api/v1"
  ).replace(/\/api\/v1\/?$/, "");

  // Load documents for a property
  const loadDocuments = async (id = propertyId) => {
    if (!id || !Number.isInteger(Number(id)) || Number(id) < 1) {
      setError("Please enter a valid Property ID.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.get(
        `/property-documents/${encodeURIComponent(id)}`
      );

      const result =
        response.data?.documents ??
        response.data?.data?.documents ??
        response.data?.data;

      setDocuments(Array.isArray(result) ? result : []);
      setLoadedPropertyId(String(id));
      setPropertyId(String(id));
    } catch (err) {
      setDocuments([]);
      setLoadedPropertyId("");
      setError(
        err.response?.data?.message || "Unable to load documents."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;

    setFile(selectedFile);
    setError("");
    setMessage("");
  };

  // Upload document
  const handleUpload = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const trimmedPropertyId = String(propertyId).trim();
    const trimmedDocumentName = documentName.trim();

    if (
      !trimmedPropertyId ||
      !Number.isInteger(Number(trimmedPropertyId)) ||
      Number(trimmedPropertyId) < 1
    ) {
      setError("Please enter a valid Property ID.");
      return;
    }

    if (!trimmedDocumentName) {
      setError("Please enter a document name.");
      return;
    }

    // Read the selected file from state or directly from the file input
    const selectedFile =
      file || fileInputRef.current?.files?.[0] || null;

    if (!selectedFile) {
      setError("Please select the document before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("document_name", trimmedDocumentName);
    formData.append("document_type", documentType);
    formData.append("file", selectedFile);

    setUploading(true);

    try {
      const response = await api.post(
        `/property-documents/${encodeURIComponent(trimmedPropertyId)}`,
        formData
      );

      setMessage(
        response.data?.message || "Document uploaded successfully."
      );

      // Clear the form only after a successful upload
      setDocumentName("");
      setDocumentType("Property Document");
      setFile(null);

      if (uploadFormRef.current) {
        uploadFormRef.current.reset();
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh the documents list
      await loadDocuments(trimmedPropertyId);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Document upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  // Delete document
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await api.delete(`/property-documents/${id}`);

      setMessage(
        response.data?.message || "Document deleted successfully."
      );

      await loadDocuments(loadedPropertyId);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete document."
      );
    }
  };

  // Search documents
  const filteredDocuments = documents.filter((doc) =>
    `${doc.document_name || ""} ${doc.document_type || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const pdfCount = documents.filter((doc) =>
    /\.pdf(?:$|[?#])/i.test(doc.file_url || "")
  ).length;

  // Build a usable file URL
  const getFileUrl = (url) => {
    if (!url) return "#";
    if (/^https?:\/\//i.test(url)) return url;

    return `${backendBaseUrl}/${url.replace(/^\/+/, "")}`;
  };

  return (
    <div
      style={{
        background: colors.background,
        color: colors.text,
        minHeight: "100vh",
        padding: "24px",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
      }}
    >
      {/* Page heading */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div>
          <p
            style={{
              color: colors.gold,
              fontSize: "10px",
              letterSpacing: "2px",
              fontWeight: "bold",
              margin: "0 0 7px",
            }}
          >
            SECURITY PORTAL
          </p>

          <h1
            style={{
              color: colors.gold,
              fontSize: "25px",
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            Security Documents
          </h1>

          <p
            style={{
              color: colors.muted,
              fontSize: "13px",
              margin: "8px 0 0",
            }}
          >
            Upload and manage property documents.
          </p>
        </div>

        <button
          type="button"
          style={buttonStyle}
          disabled={loading || !propertyId}
          onClick={() => loadDocuments(loadedPropertyId || propertyId)}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {/* Success and error messages */}
      {error && (
        <div
          role="alert"
          style={{
            background: "#351818",
            color: "#ffb4b4",
            padding: "12px",
            borderRadius: "7px",
            marginBottom: "16px",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          style={{
            background: "#15301e",
            color: colors.green,
            padding: "12px",
            borderRadius: "7px",
            marginBottom: "16px",
            fontSize: "13px",
          }}
        >
          {message}
        </div>
      )}

      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        <div style={panelStyle}>
          <p style={{ color: colors.muted, fontSize: "12px", margin: "0 0 10px" }}>
            Total Documents
          </p>
          <strong style={{ fontSize: "25px" }}>{documents.length}</strong>
        </div>

        <div style={panelStyle}>
          <p style={{ color: colors.muted, fontSize: "12px", margin: "0 0 10px" }}>
            PDF Documents
          </p>
          <strong style={{ color: colors.gold, fontSize: "25px" }}>
            {pdfCount}
          </strong>
        </div>

        <div style={panelStyle}>
          <p style={{ color: colors.muted, fontSize: "12px", margin: "0 0 10px" }}>
            Property ID
          </p>
          <strong style={{ fontSize: "22px" }}>
            {loadedPropertyId || "—"}
          </strong>
        </div>
      </div>

      {/* Find property */}
      <section style={{ ...panelStyle, marginBottom: "20px" }}>
        <h2 style={{ fontSize: "16px", margin: "0 0 6px" }}>
          Find Property Documents
        </h2>

        <p style={{ color: colors.muted, fontSize: "12px", margin: "0 0 16px" }}>
          Enter an existing property ID to view its documents.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            loadDocuments();
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            gap: "10px",
          }}
        >
          <input
            type="number"
            min="1"
            value={propertyId}
            onChange={(event) => setPropertyId(event.target.value)}
            placeholder="Enter Property ID"
            aria-label="Property ID"
            style={inputStyle}
            required
          />

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </button>
        </form>
      </section>

      {/* Upload form */}
      <section style={{ ...panelStyle, marginBottom: "20px" }}>
        <h2 style={{ fontSize: "16px", margin: "0 0 6px" }}>
          Upload Document
        </h2>

        <p style={{ color: colors.muted, fontSize: "12px", margin: "0 0 18px" }}>
          Complete the details below to upload a new document.
        </p>

        <form ref={uploadFormRef} onSubmit={handleUpload}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            <div>
              <label style={labelStyle}>Property ID *</label>
              <input
                type="number"
                min="1"
                value={propertyId}
                onChange={(event) => setPropertyId(event.target.value)}
                placeholder="Enter property ID"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Document Name *</label>
              <input
                value={documentName}
                onChange={(event) => setDocumentName(event.target.value)}
                placeholder="e.g. Ownership Certificate"
                maxLength={150}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Document Type</label>
              <select
                value={documentType}
                onChange={(event) => setDocumentType(event.target.value)}
                style={inputStyle}
              >
                <option>Property Document</option>
                <option>Ownership Certificate</option>
                <option>Legal Document</option>
                <option>Survey Document</option>
                <option>Security Report</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Choose File *</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={handleFileChange}
                style={inputStyle}
                required
              />
            </div>
          </div>

          {file && (
            <div
              style={{
                color: colors.gold,
                fontSize: "12px",
                marginTop: "12px",
                overflowWrap: "anywhere",
              }}
            >
              Selected file: {file.name}
              <span style={{ color: colors.muted }}>
                {" "}({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </span>

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                style={{
                  marginLeft: "12px",
                  color: colors.red,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <button
              type="submit"
              style={{
                ...buttonStyle,
                opacity: uploading ? 0.7 : 1,
                cursor: uploading ? "not-allowed" : "pointer",
              }}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "+ Upload Document"}
            </button>
          </div>
        </form>
      </section>

      {/* Document library */}
      <section style={panelStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "16px", margin: "0 0 6px" }}>
              Document Library
            </h2>

            <p style={{ color: colors.muted, fontSize: "12px", margin: 0 }}>
              {loadedPropertyId
                ? `Documents for property #${loadedPropertyId}`
                : "Search by property ID to display documents."}
            </p>
          </div>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search documents..."
            aria-label="Search documents"
            style={{ ...inputStyle, width: "220px", maxWidth: "100%" }}
          />
        </div>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr style={{ background: "#222222", color: colors.gold }}>
                {["DOCUMENT NAME", "TYPE", "UPLOADED", "ACTIONS"].map((title) => (
                  <th
                    key={title}
                    style={{
                      padding: "13px 12px",
                      fontSize: "10px",
                      letterSpacing: "0.6px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {!loadedPropertyId ? (
                <tr>
                  <td colSpan="4" style={{ padding: "25px", textAlign: "center", color: colors.muted }}>
                    Enter a property ID above to view documents.
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan="4" style={{ padding: "25px", textAlign: "center", color: colors.muted }}>
                    Loading documents...
                  </td>
                </tr>
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: "25px", textAlign: "center", color: colors.muted }}>
                    No documents found for this property.
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    style={{ borderBottom: `1px solid ${colors.border}` }}
                  >
                    <td style={{ padding: "14px 12px" }}>
                      {doc.document_name || "Untitled"}
                    </td>

                    <td style={{ padding: "14px 12px", color: colors.muted }}>
                      {doc.document_type || "Other"}
                    </td>

                    <td style={{ padding: "14px 12px", color: colors.muted }}>
                      {doc.uploaded_at
                        ? new Date(doc.uploaded_at).toLocaleDateString()
                        : "—"}
                    </td>

                    <td style={{ padding: "14px 12px", whiteSpace: "nowrap" }}>
                      {doc.file_url && (
                        <a
                          href={getFileUrl(doc.file_url)}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: colors.gold,
                            marginRight: "12px",
                            textDecoration: "none",
                            fontWeight: "bold",
                          }}
                        >
                          Open
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(doc.id)}
                        style={{
                          background: "transparent",
                          color: colors.red,
                          border: "none",
                          padding: 0,
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SecurityDocuments;
