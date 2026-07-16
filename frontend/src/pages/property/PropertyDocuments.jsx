import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  fetchDocuments,
  createDocument,
  removeDocument,
} from "../../redux/propertyDocumentSlice";
export default function PropertyDocuments() {
  const { propertyId } = useParams();

  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const { documents, loading } = useSelector((state) => state.documents);

  useEffect(() => {
    dispatch(fetchDocuments(propertyId));
  }, [dispatch, propertyId]);
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?",
    );

    if (!confirmDelete) return;

    try {
      await dispatch(removeDocument(id)).unwrap();

      alert("Document Deleted Successfully");

      dispatch(fetchDocuments(propertyId));
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("document_name", documentName);
    formData.append("document_type", documentType);
    formData.append("file", file);

    try {
      await dispatch(
        createDocument({
          propertyId,
          formData,
        }),
      ).unwrap();

      alert("Document Uploaded Successfully");

dispatch(fetchDocuments(propertyId));
      setDocumentName("");
      setDocumentType("");
      setFile(null);
    } catch (error) {
      console.log(error);
      alert("Upload Failed");
    }
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-4">Property Documents</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Document Name</label>

                <input
                  className="form-control"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Document Type</label>

                <select
                  className="form-select"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Image">Image</option>
                  <option value="PDF">PDF</option>
                  <option value="Sale Deed">Sale Deed</option>
                  <option value="Patta">Patta</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Select File</label>

                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>
            </div>

            <button className="btn btn-primary">Upload Document</button>
          </form>
        </div>
      </div>
      <div className="card shadow-sm mt-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">Uploaded Documents</h5>
        </div>

        <div className="card-body">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Uploaded Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
             {documents?.length > 0 ? (
                documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.document_name}</td>

                    <td>{doc.document_type}</td>

                    <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>

                    <td>
                      <a
                        href={`http://localhost:4000${doc.file_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm me-2"
                      >
                        View
                      </a>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(doc.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No Documents Uploaded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
