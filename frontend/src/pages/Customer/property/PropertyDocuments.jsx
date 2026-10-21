
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDocuments,
  createDocument,
  removeDocument,
} from "../../../redux/propertyDocumentSlice";
import {
  FaFileAlt,
  FaUpload,
  FaTrash,
  FaEye,
  FaArrowLeft,
} from "react-icons/fa";

export default function PropertyDocuments() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const { documents, loading } = useSelector((state) => state.documents);

  useEffect(() => {
    dispatch(fetchDocuments(propertyId));
  }, [dispatch, propertyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("document_name", documentName);
    formData.append("document_type", documentType);
    formData.append("file", file);

    setUploading(true);

    try {
      await dispatch(createDocument({ propertyId, formData })).unwrap();

      alert("Document uploaded successfully.");
      setDocumentName("");
      setDocumentType("");
      setFile(null);

      const fileInput = document.getElementById("property-document-file");
      if (fileInput) fileInput.value = "";

      await dispatch(fetchDocuments(propertyId));
    } catch (err) {
      console.error("Upload failed:", err);
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to upload document. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    setError("");
    setDeletingId(id);

    try {
      await dispatch(removeDocument(id)).unwrap();
      await dispatch(fetchDocuments(propertyId));
    } catch (err) {
      console.error("Delete failed:", err);
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to delete document."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="customer-documents-page">
      <div className="customer-documents-heading">
        <div className="customer-documents-heading-icon"><FaFileAlt /></div>
        <div>
          <p className="customer-documents-eyebrow">CUSTOMER PORTAL</p>
          <h1>Property Documents</h1>
          <p>Manage your property records and supporting documents.</p>
        </div>
      </div>

      {error && <div className="customer-documents-alert">{error}</div>}

      <div className="customer-documents-panel">
        <div className="customer-documents-panel-header">
          <div>
            <h2>Upload a Document</h2>
            <p>Provide a document name, type, and file.</p>
          </div>
          <span className="customer-documents-tag">DOCUMENT CENTER</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="customer-documents-form-grid">
            <div className="customer-documents-field">
              <label>Document Name *</label>
              <input
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                required
                placeholder="e.g. Property Sale Deed"
              />
            </div>

            <div className="customer-documents-field">
              <label>Document Type *</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                required
              >
                <option value="">Select document type</option>
                <option value="Image">Image</option>
                <option value="PDF">PDF</option>
                <option value="Sale Deed">Sale Deed</option>
                <option value="Patta">Patta</option>
              </select>
            </div>

            <div className="customer-documents-field customer-documents-field-full">
              <label>Select File *</label>
              <input
                id="property-document-file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
              <small>{file ? `Selected: ${file.name}` : "Choose the document you want to upload."}</small>
            </div>
          </div>

          <div className="customer-documents-form-actions">
            <button type="submit" className="customer-documents-btn customer-documents-btn-gold" disabled={uploading}>
              <FaUpload /> {uploading ? "Uploading Document..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>

      <div className="customer-documents-panel customer-documents-list-panel">
        <div className="customer-documents-panel-header">
          <div>
            <h2>Uploaded Documents</h2>
            <p>Documents associated with this property.</p>
          </div>
          <span className="customer-documents-count">
            {documents?.length || 0} {(documents?.length || 0) === 1 ? "DOCUMENT" : "DOCUMENTS"}
          </span>
        </div>

        {loading ? (
          <div className="customer-documents-empty">
            <div className="customer-documents-spinner" />
            <p>Loading documents...</p>
          </div>
        ) : (
          <div className="customer-documents-table-wrap">
            <table className="customer-documents-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Document Type</th>
                  <th>Uploaded Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents?.length > 0 ? (
                  documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div className="customer-documents-name">
                          <span className="customer-documents-file-icon"><FaFileAlt /></span>
                          <strong>{doc.document_name}</strong>
                        </div>
                      </td>
                      <td><span className="customer-documents-type">{doc.document_type}</span></td>
                      <td>{doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : "—"}</td>
                      <td>
                        <div className="customer-documents-row-actions">
                          <a
                            href={`http://localhost:4000${doc.file_url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="customer-documents-icon-btn customer-documents-view"
                            aria-label={`View ${doc.document_name}`}
                            title="View document"
                          >
                            <FaEye /> View
                          </a>
                          <button
                            type="button"
                            className="customer-documents-icon-btn customer-documents-delete"
                            onClick={() => handleDelete(doc.id)}
                            disabled={deletingId === doc.id}
                            aria-label={`Delete ${doc.document_name}`}
                            title="Delete document"
                          >
                            <FaTrash /> {deletingId === doc.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      <div className="customer-documents-empty">
                        <FaFileAlt className="customer-documents-empty-icon" />
                        <strong>No documents uploaded yet</strong>
                        <p>Upload a document using the form above.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="customer-documents-bottom">
        <button type="button" className="customer-documents-btn customer-documents-btn-light" onClick={() => navigate("/properties")}>
          <FaArrowLeft /> Back to Properties
        </button>
      </div>

      <style>{`
        .customer-documents-page{padding:28px;background:#f6f6f4;min-height:100%;color:#171717}
        .customer-documents-heading{display:flex;align-items:center;gap:16px;margin-bottom:24px}
        .customer-documents-heading-icon{width:58px;height:58px;border-radius:15px;background:#111;color:#d4af37;display:grid;place-items:center;font-size:24px}
        .customer-documents-eyebrow{font-size:11px;letter-spacing:2px;font-weight:800;color:#9a7b19;margin:0 0 5px}
        .customer-documents-heading h1{font-size:28px;font-weight:800;margin:0}
        .customer-documents-heading p:last-child{margin:5px 0 0;color:#777}
        .customer-documents-panel{background:#fff;border:1px solid #e8e5dc;border-radius:16px;box-shadow:0 8px 26px #17171708;padding:25px;margin-bottom:22px}
        .customer-documents-panel-header{display:flex;justify-content:space-between;align-items:center;gap:12px;border-bottom:1px solid #eeeae0;padding-bottom:18px;margin-bottom:22px}
        .customer-documents-panel-header h2{font-size:19px;font-weight:800;margin:0 0 5px}
        .customer-documents-panel-header p{font-size:13px;color:#777;margin:0}
        .customer-documents-tag,.customer-documents-count{background:#fbf4d9;color:#81630c;font-size:10px;font-weight:800;letter-spacing:1px;padding:8px 11px;border-radius:20px;white-space:nowrap}
        .customer-documents-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:19px}
        .customer-documents-field{display:flex;flex-direction:column;gap:8px}
        .customer-documents-field-full{grid-column:1/-1}
        .customer-documents-field label{font-size:13px;font-weight:700;color:#333}
        .customer-documents-field input,.customer-documents-field select{width:100%;border:1px solid #dedede;border-radius:9px;padding:12px 13px;background:#fff;color:#222;outline:none;min-height:45px}
        .customer-documents-field input:focus,.customer-documents-field select:focus{border-color:#c4a02b;box-shadow:0 0 0 3px #d4af3720}
        .customer-documents-field small{color:#777;font-size:12px}
        .customer-documents-form-actions{display:flex;justify-content:flex-end;margin-top:22px}
        .customer-documents-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:11px 17px;border-radius:9px;border:1px solid transparent;font-weight:700;cursor:pointer;transition:.2s;text-decoration:none}
        .customer-documents-btn:disabled,.customer-documents-icon-btn:disabled{opacity:.6;cursor:not-allowed}
        .customer-documents-btn-gold{background:#d4af37;color:#111}
        .customer-documents-btn-gold:hover:not(:disabled){background:#c29b22}
        .customer-documents-btn-light{background:#fff;border-color:#ddd;color:#333}
        .customer-documents-alert{background:#fff0ef;border:1px solid #f0c7c3;color:#a52d24;padding:12px 14px;border-radius:9px;margin-bottom:18px;font-size:14px}
        .customer-documents-table-wrap{width:100%;overflow-x:auto}
        .customer-documents-table{width:100%;border-collapse:collapse;min-width:650px}
        .customer-documents-table th{background:#111;color:#fff;text-align:left;font-size:12px;letter-spacing:.4px;padding:15px 14px;white-space:nowrap}
        .customer-documents-table td{padding:15px 14px;border-bottom:1px solid #eeeae0;font-size:13px;vertical-align:middle}
        .customer-documents-table tbody tr:hover{background:#fdfbf3}
        .customer-documents-name{display:flex;align-items:center;gap:10px}
        .customer-documents-file-icon{display:grid;place-items:center;width:34px;height:34px;border-radius:9px;background:#fbf1cb;color:#997710;flex-shrink:0}
        .customer-documents-name strong{font-weight:700}
        .customer-documents-type{display:inline-block;padding:6px 9px;background:#f3f3f3;border-radius:7px;font-size:11px;font-weight:700}
        .customer-documents-row-actions{display:flex;gap:8px;flex-wrap:wrap}
        .customer-documents-icon-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 9px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;text-decoration:none;border:1px solid}
        .customer-documents-view{background:#fbf4d9;border-color:#eadb9c;color:#705609}
        .customer-documents-delete{background:#fff;border-color:#efc9c5;color:#a52d24}
        .customer-documents-empty{text-align:center;padding:35px 15px;color:#777}
        .customer-documents-empty strong{display:block;color:#333;margin-top:10px}
        .customer-documents-empty p{font-size:13px;margin:6px 0 0}
        .customer-documents-empty-icon{font-size:27px;color:#c7a12a}
        .customer-documents-spinner{width:30px;height:30px;border:3px solid #eee;border-top-color:#d4af37;border-radius:50%;animation:customer-docs-spin .8s linear infinite;margin:0 auto 12px}
        @keyframes customer-docs-spin{to{transform:rotate(360deg)}}
        .customer-documents-bottom{display:flex;justify-content:flex-start}
        @media(max-width:650px){.customer-documents-page{padding:15px}.customer-documents-heading h1{font-size:23px}.customer-documents-panel{padding:17px}.customer-documents-form-grid{grid-template-columns:1fr}.customer-documents-field-full{grid-column:auto}.customer-documents-panel-header{align-items:flex-start}.customer-documents-form-actions .customer-documents-btn,.customer-documents-bottom .customer-documents-btn{width:100%}}
      `}</style>
    </div>
  );
}
