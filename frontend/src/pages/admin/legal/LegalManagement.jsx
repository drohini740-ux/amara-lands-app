import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  fetchAdminLegalCases,
  deleteAdminLegalCase,
} from "../../../redux/adminLegalSlice";

export default function LegalManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    legalCases,
    loading,
    error,
  } = useSelector((state) => state.adminLegal);

  const [search, setSearch] = useState("");

  // ==========================================
  // Fetch Legal Cases
  // ==========================================

  useEffect(() => {
    dispatch(fetchAdminLegalCases());
  }, [dispatch]);

  // ==========================================
  // Delete Case
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this legal case?"
    );

    if (!confirmDelete) return;

    try {
      await dispatch(deleteAdminLegalCase(id)).unwrap();

      alert("Legal Case Deleted Successfully");
    } catch (error) {
      alert(error || "Delete Failed");
    }
  };

  // ==========================================
  // Search
  // ==========================================

  const filteredCases = legalCases.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.case_title?.toLowerCase().includes(searchText) ||
      item.case_number?.toLowerCase().includes(searchText) ||
      item.court_name?.toLowerCase().includes(searchText) ||
      item.advocate_name?.toLowerCase().includes(searchText) ||
      item.customer_name?.toLowerCase().includes(searchText) ||
      item.property_name?.toLowerCase().includes(searchText)
    );
  });

  // ==========================================
  // Loading
  // ==========================================

  if (loading && legalCases.length === 0) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading Legal Cases...</h4>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="container-fluid p-4">

      {/* ======================================
          Header
      ====================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Legal Management
          </h2>

          <p className="text-muted mb-0">
            Manage and monitor all property legal cases
          </p>
        </div>
      </div>

      {/* ======================================
          Summary Cards
      ====================================== */}

      <div className="row mb-4">

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">
                Total Cases
              </h6>

              <h3 className="fw-bold">
                {legalCases.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">
                Open Cases
              </h6>

              <h3 className="fw-bold text-primary">
                {
                  legalCases.filter(
                    (item) =>
                      item.status?.toLowerCase() === "open"
                  ).length
                }
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">
                Pending Cases
              </h6>

              <h3 className="fw-bold text-warning">
                {
                  legalCases.filter(
                    (item) =>
                      item.status?.toLowerCase() === "pending"
                  ).length
                }
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">
                Closed Cases
              </h6>

              <h3 className="fw-bold text-success">
                {
                  legalCases.filter(
                    (item) =>
                      item.status?.toLowerCase() === "closed"
                  ).length
                }
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================
          Error
      ====================================== */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ======================================
          Search
      ====================================== */}

      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body">

          <div className="input-group">

            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search by case, customer, property, court or advocate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>
      </div>

      {/* ======================================
          Cases Table
      ====================================== */}

      <div className="card shadow-sm border-0">

        <div className="card-header bg-white">
          <h5 className="mb-0 fw-bold">
            All Legal Cases
          </h5>
        </div>

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead className="table-dark">

                <tr>
                  <th>Property</th>
                  <th>Customer</th>
                  <th>Case Number</th>
                  <th>Case Title</th>
                  <th>Court</th>
                  <th>Advocate</th>
                  <th>Hearing</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredCases.length > 0 ? (

                  filteredCases.map((item) => (

                    <tr key={item.id}>

                      {/* Property */}

                      <td>
                        <strong>
                          {item.property_name || "-"}
                        </strong>

                        {item.survey_number && (
                          <div className="small text-muted">
                            Survey: {item.survey_number}
                          </div>
                        )}
                      </td>

                      {/* Customer */}

                      <td>
                        {item.customer_name || "-"}

                        {item.customer_email && (
                          <div className="small text-muted">
                            {item.customer_email}
                          </div>
                        )}
                      </td>

                      {/* Case Number */}

                      <td>
                        {item.case_number || "-"}
                      </td>

                      {/* Case Title */}

                      <td>
                        {item.case_title || "-"}
                      </td>

                      {/* Court */}

                      <td>
                        {item.court_name || "-"}
                      </td>

                      {/* Advocate */}

                      <td>
                        {item.advocate_name || "Not Assigned"}
                      </td>

                      {/* Hearing */}

                      <td>
                        {item.hearing_date
                          ? new Date(
                              item.hearing_date
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      {/* Status */}

                      <td>

                        <span
                          className={`badge ${
                            item.status?.toLowerCase() ===
                            "closed"
                              ? "bg-success"
                              : item.status?.toLowerCase() ===
                                "pending"
                              ? "bg-warning text-dark"
                              : "bg-primary"
                          }`}
                        >
                          {item.status || "Open"}
                        </span>

                      </td>

                      {/* Actions */}

                      <td>

                        <button
                          className="btn btn-info btn-sm me-1"
                          title="View"
                          onClick={() =>
                            navigate(
                              `/admin/legal/view/${item.id}`
                            )
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          className="btn btn-warning btn-sm me-1"
                          title="Edit"
                          onClick={() =>
                            navigate(
                              `/admin/legal/edit/${item.id}`
                            )
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          title="Delete"
                          onClick={() =>
                            handleDelete(item.id)
                          }
                        >
                          <FaTrash />
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-4"
                    >
                      No Legal Cases Found
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}