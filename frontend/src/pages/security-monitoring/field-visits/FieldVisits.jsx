import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFieldVisits,
  removeFieldVisit,
} from "../../../redux/fieldVisitSlice";

import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function FieldVisits() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { visits, loading } = useSelector(
    (state) => state.fieldVisits
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchFieldVisits());
  }, [dispatch]);

 const filteredVisits = visits?.filter((visit) =>
  (visit.property_name || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this field visit?")) return;

    try {
      await dispatch(removeFieldVisit(id)).unwrap();
      alert("Field Visit Deleted Successfully");
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading Field Visits...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold">Field Visits</h2>
          <p className="text-muted">
            Manage Property Field Visits
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/field-visits/add")}
        >
          <FaPlus className="me-2" />
          Add Visit
        </button>

      </div>

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <div className="input-group">

            <span className="input-group-text">
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
             placeholder="Search Property..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

      </div>

      <div className="card shadow-sm">

        <div className="card-header">
          <h5 className="mb-0">Field Visit List</h5>
        </div>

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-hover">

              <thead className="table-dark">
  <tr>
    <th>Property</th>
    <th>User</th>
    <th>Visit Date</th>
    <th>Check In</th>
    <th>Check Out</th>
    <th>Status</th>
    <th>Actions</th>
  </tr>
</thead>
             <tbody>
  {filteredVisits?.length > 0 ? (
    filteredVisits.map((visit) => (
      <tr key={visit.id}>

        <td>{visit.property_name}</td>

        <td>{visit.user_name}</td>

        <td>{visit.visit_date?.split("T")[0]}</td>

        <td>{visit.check_in}</td>

        <td>{visit.check_out}</td>

        <td>
          <span
            className={`badge ${
              visit.visit_status === "Completed"
                ? "bg-success"
                : "bg-warning text-dark"
            }`}
          >
            {visit.visit_status}
          </span>
        </td>

        <td>
          <button
            className="btn btn-info btn-sm me-2"
            onClick={() => navigate(`/field-visits/view/${visit.id}`)}
          >
            <FaEye />
          </button>

          <button
            className="btn btn-warning btn-sm me-2"
            onClick={() => navigate(`/field-visits/edit/${visit.id}`)}
          >
            <FaEdit />
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(visit.id)}
          >
            <FaTrash />
          </button>
        </td>

      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="text-center">
        No Field Visits Found
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