import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { fetchLegalCases } from "../../redux/legalSlice";

import { FaPlus, FaSearch } from "react-icons/fa";
import { deleteLegalCase } from "../../services/legalService";

export default function Legal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { legalCases, loading } = useSelector((state) => state.legal);

  const [search, setSearch] = useState("");
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this legal case?",
    );

    if (!confirmDelete) return;

    try {
      await deleteLegalCase(id);

      alert("Legal Case Deleted Successfully");

      // refresh list
      fetchLegalCases();
    } catch (error) {
      console.log(error);

      alert("Delete Failed");
    }
  };

  useEffect(() => {
    dispatch(fetchLegalCases());
  }, [dispatch]);

  const filteredCases = legalCases.filter((item) =>
    item.case_title?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading Legal Cases...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Legal Management</h2>
          <p className="text-muted">Manage Property Legal Cases</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/legal/add")}
        >
          <FaPlus className="me-2" />
          Add Legal Case
        </button>
      </div>

      {/* Search */}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search Case..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Legal Cases</h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Property</th>
                  <th>Case Title</th>
                  <th>Case Number</th>
                  <th>Court</th>
                  <th>Advocate</th>
                  <th>Hearing Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCases.length > 0 ? (
                  filteredCases.map((item) => (
                    <tr key={item.id}>
                      <td>{item.property_name}</td>

                      <td>{item.case_title}</td>

                      <td>{item.case_number}</td>

                      <td>{item.court_name}</td>

                      <td>{item.advocate_name}</td>

                      <td>
                        {item.hearing_date
                          ? new Date(item.hearing_date).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            item.status === "Closed"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <Link
                          to={`/legal/view/${item.id}`}
                          className="btn btn-info btn-sm me-2"
                        >
                          <i className="bi bi-eye"></i>
                        </Link>

                        <Link
                          to={`/legal/edit/${item.id}`}
                          className="btn btn-warning btn-sm me-2"
                        >
                          Edit
                        </Link>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
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
