
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { fetchLegalCases } from "../../redux/legalSlice";
import { deleteLegalCase } from "../../services/legalService";

import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaBalanceScale,
  FaSyncAlt,
  FaCalendarAlt,
} from "react-icons/fa";

export default function Legal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { legalCases = [], loading } = useSelector(
    (state) => state.legal
  );

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const GOLD = "#D4AF37";
  const BLACK = "#0B0B0B";

  const loadLegalCases = () => {
    dispatch(fetchLegalCases());
  };

  useEffect(() => {
    loadLegalCases();
  }, [dispatch]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this legal case?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setDeletingId(id);

      await deleteLegalCase(id);

      window.alert("Legal case deleted successfully.");
      dispatch(fetchLegalCases());
    } catch (err) {
      console.error("Failed to delete legal case:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to delete the legal case. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCases = legalCases.filter((item) => {
    const searchText = search.toLowerCase();

    return [
      item.property_name,
      item.case_title,
      item.case_number,
      item.court_name,
      item.advocate_name,
      item.status,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );
  });

  const totalCases = legalCases.length;

  const openCases = legalCases.filter(
    (item) => item.status?.toLowerCase() !== "closed"
  ).length;

  const closedCases = legalCases.filter(
    (item) => item.status?.toLowerCase() === "closed"
  ).length;

  const cardStyle = {
    background: "#FFFFFF",
    border: "1px solid #EAE5D5",
    borderRadius: "14px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  };

  const primaryButtonStyle = {
    background: GOLD,
    color: BLACK,
    border: `1px solid ${GOLD}`,
    borderRadius: "8px",
    padding: "10px 14px",
    fontWeight: 600,
  };

  const secondaryButtonStyle = {
    background: BLACK,
    color: "#FFFFFF",
    border: `1px solid ${BLACK}`,
    borderRadius: "8px",
    padding: "10px 14px",
    fontWeight: 600,
  };

  return (
    <div className="container-fluid py-3 px-2 px-md-4">
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div
            className="d-flex align-items-center gap-2 mb-2"
            style={{ color: "#927313" }}
          >
            <FaBalanceScale size={22} />
            <span className="small fw-semibold text-uppercase">
              Customer Portal
            </span>
          </div>

          <h2 className="fw-bold mb-1" style={{ color: BLACK }}>
            Legal Management
          </h2>

          <p className="text-muted mb-0">
            Manage and track your property legal cases.
          </p>
        </div>

        <button
          type="button"
          onClick={loadLegalCases}
          style={secondaryButtonStyle}
        >
          <FaSyncAlt className="me-2" />
          Refresh
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-4">
          <div className="p-4 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-2">Total Legal Cases</p>
                <h3 className="fw-bold mb-0" style={{ color: BLACK }}>
                  {totalCases}
                </h3>
              </div>

              <div
                className="rounded-3 p-3"
                style={{ background: "#FFF4CC", color: "#8B6B0B" }}
              >
                <FaBalanceScale size={23} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="p-4 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-2">Open Cases</p>
                <h3 className="fw-bold mb-0" style={{ color: BLACK }}>
                  {openCases}
                </h3>
              </div>

              <div
                className="rounded-3 p-3"
                style={{ background: "#FFF4CC", color: "#8B6B0B" }}
              >
                <FaCalendarAlt size={23} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="p-4 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-2">Closed Cases</p>
                <h3 className="fw-bold mb-0" style={{ color: BLACK }}>
                  {closedCases}
                </h3>
              </div>

              <div
                className="rounded-3 p-3"
                style={{ background: "#E8F5E9", color: "#237A35" }}
              >
                <FaBalanceScale size={23} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div
        className="p-3 mb-4 d-flex flex-wrap gap-2"
        style={cardStyle}
      >
        <button
          type="button"
          style={primaryButtonStyle}
          onClick={() => navigate("/legal/add")}
        >
          <FaPlus className="me-2" />
          Add Legal Case
        </button>

        <button
          type="button"
          style={secondaryButtonStyle}
          onClick={() => navigate("/case-tracking")}
        >
          <FaBalanceScale className="me-2" />
          Track Cases
        </button>

        <button
          type="button"
          style={secondaryButtonStyle}
          onClick={() => navigate("/consultations")}
        >
          <FaCalendarAlt className="me-2" />
          Book Consultation
        </button>
      </div>

      {/* SEARCH */}
      <div className="p-3 p-md-4 mb-4" style={cardStyle}>
        <label
          htmlFor="legal-search"
          className="form-label fw-semibold"
          style={{ color: BLACK }}
        >
          Search Legal Cases
        </label>

        <div className="input-group">
          <span
            className="input-group-text"
            style={{
              background: "#FFF9E8",
              borderColor: "#E8DCA9",
            }}
          >
            <FaSearch />
          </span>

          <input
            id="legal-search"
            type="search"
            className="form-control"
            placeholder="Search property, case number, court, advocate or status..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* LEGAL CASES TABLE */}
      <div className="overflow-hidden" style={cardStyle}>
        <div
          className="p-3 p-md-4 d-flex flex-wrap justify-content-between align-items-center gap-2"
          style={{ borderBottom: "1px solid #EEE8D8" }}
        >
          <div>
            <h5 className="fw-bold mb-1" style={{ color: BLACK }}>
              Legal Cases
            </h5>
            <small className="text-muted">
              Showing {filteredCases.length} of {totalCases} cases
            </small>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border"
              role="status"
              style={{ color: GOLD }}
            />
            <p className="text-muted mt-3 mb-0">
              Loading legal cases...
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr style={{ background: BLACK, color: "#FFFFFF" }}>
                  {[
                    "Property",
                    "Case Title",
                    "Case Number",
                    "Court",
                    "Advocate",
                    "Hearing Date",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="py-3 px-3 text-nowrap"
                      style={{
                        background: BLACK,
                        color: "#FFFFFF",
                        fontSize: "13px",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredCases.length > 0 ? (
                  filteredCases.map((item) => {
                    const isClosed =
                      item.status?.toLowerCase() === "closed";

                    return (
                      <tr key={item.id}>
                        <td className="px-3 fw-semibold">
                          {item.property_name || "-"}
                        </td>

                        <td className="px-3">
                          {item.case_title || "-"}
                        </td>

                        <td className="px-3">
                          {item.case_number || "-"}
                        </td>

                        <td className="px-3">
                          {item.court_name || "-"}
                        </td>

                        <td className="px-3">
                          {item.advocate_name || "-"}
                        </td>

                        <td className="px-3 text-nowrap">
                          {item.hearing_date
                            ? new Date(
                                item.hearing_date
                              ).toLocaleDateString("en-IN")
                            : "-"}
                        </td>

                        <td className="px-3">
                          <span
                            className="badge rounded-pill px-3 py-2"
                            style={{
                              background: isClosed
                                ? "#E8F5E9"
                                : "#FFF4CC",
                              color: isClosed
                                ? "#237A35"
                                : "#765B00",
                            }}
                          >
                            {item.status || "Pending"}
                          </span>
                        </td>

                        <td className="px-3 text-nowrap">
                          <Link
                            to={`/legal/view/${item.id}`}
                            className="btn btn-sm me-1 mb-1"
                            title="View case"
                            aria-label="View case"
                            style={{
                              background: BLACK,
                              color: "#FFFFFF",
                            }}
                          >
                            <FaEye />
                          </Link>

                          <Link
                            to={`/legal/edit/${item.id}`}
                            className="btn btn-sm me-1 mb-1"
                            title="Edit case"
                            aria-label="Edit case"
                            style={{
                              background: GOLD,
                              color: BLACK,
                            }}
                          >
                            <FaEdit />
                          </Link>

                          <button
                            type="button"
                            className="btn btn-danger btn-sm mb-1"
                            title="Delete case"
                            aria-label="Delete case"
                            disabled={deletingId === item.id}
                            onClick={() => handleDelete(item.id)}
                          >
                            <FaTrash />
                            {deletingId === item.id ? " Deleting..." : ""}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-5"
                    >
                      <FaBalanceScale
                        size={32}
                        style={{ color: GOLD }}
                      />

                      <h6 className="fw-bold mt-3">
                        No Legal Cases Found
                      </h6>

                      <p className="text-muted mb-3">
                        {search
                          ? "Try changing your search."
                          : "Add a legal case to get started."}
                      </p>

                      {!search && (
                        <button
                          type="button"
                          style={primaryButtonStyle}
                          onClick={() => navigate("/legal/add")}
                        >
                          <FaPlus className="me-2" />
                          Add Legal Case
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
