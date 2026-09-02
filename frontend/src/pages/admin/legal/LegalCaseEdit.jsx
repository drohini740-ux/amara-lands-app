import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaGavel,
  FaCalendarAlt,
} from "react-icons/fa";

import {
  fetchAdminLegalCase,
  updateAdminLegalCase,
} from "../../../redux/adminLegalSlice";

export default function LegalCaseEdit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedCase, loading, error } = useSelector(
    (state) => state.adminLegal
  );

  const [formData, setFormData] = useState({
    case_title: "",
    case_number: "",
    court_name: "",
    advocate_name: "",
    hearing_date: "",
    status: "Open",
    remarks: "",
  });

  // ==========================================
  // Fetch Case
  // ==========================================

  useEffect(() => {
    dispatch(fetchAdminLegalCase(id));
  }, [dispatch, id]);

  // ==========================================
  // Populate Form
  // ==========================================

  useEffect(() => {
    if (selectedCase) {
      setFormData({
        case_title: selectedCase.case_title || "",
        case_number: selectedCase.case_number || "",
        court_name: selectedCase.court_name || "",
        advocate_name: selectedCase.advocate_name || "",
        hearing_date: selectedCase.hearing_date
          ? selectedCase.hearing_date.split("T")[0]
          : "",
        status: selectedCase.status || "Open",
        remarks: selectedCase.remarks || "",
      });
    }
  }, [selectedCase]);

  // ==========================================
  // Handle Change
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        updateAdminLegalCase({
          id,
          data: formData,
        })
      ).unwrap();

      alert("Legal Case Updated Successfully");

      navigate(`/admin/legal/view/${id}`);
    } catch (error) {
      alert(error || "Failed to update legal case");
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading && !selectedCase) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading Legal Case...</h4>
      </div>
    );
  }

  // ==========================================
  // Case Not Found
  // ==========================================

  if (!selectedCase) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-warning">
          Legal Case Not Found
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid p-4"
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
      }}
    >
      {/* ======================================
          Header
      ====================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">

          <button
            className="btn me-3"
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
            }}
            onClick={() =>
              navigate(`/admin/legal/view/${id}`)
            }
          >
            <FaArrowLeft className="me-2" />
            Back
          </button>

          <div>
            <h2
              className="fw-bold mb-1"
              style={{ color: "#000000" }}
            >
              Edit Legal Case
            </h2>

            <p className="text-muted mb-0">
              Update legal case information
            </p>
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
          Form
      ====================================== */}

      <form onSubmit={handleSubmit}>

        <div className="card shadow-sm border-0 mb-4">

          <div
            className="card-header"
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
              borderBottom: "3px solid #d4af37",
            }}
          >
            <h5 className="mb-0">
              <FaGavel
                className="me-2"
                style={{ color: "#d4af37" }}
              />
              Case Information
            </h5>
          </div>

          <div className="card-body">

            <div className="row">

              {/* Case Title */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
                  Case Title
                </label>

                <input
                  type="text"
                  name="case_title"
                  className="form-control"
                  value={formData.case_title}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* Case Number */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
                  Case Number
                </label>

                <input
                  type="text"
                  name="case_number"
                  className="form-control"
                  value={formData.case_number}
                  onChange={handleChange}
                />

              </div>

              {/* Court */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
                  Court Name
                </label>

                <input
                  type="text"
                  name="court_name"
                  className="form-control"
                  value={formData.court_name}
                  onChange={handleChange}
                />

              </div>

              {/* Advocate */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
                  Advocate Name
                </label>

                <input
                  type="text"
                  name="advocate_name"
                  className="form-control"
                  value={formData.advocate_name}
                  onChange={handleChange}
                />

              </div>

              {/* Hearing Date */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
                  <FaCalendarAlt
                    className="me-2"
                    style={{ color: "#d4af37" }}
                  />
                  Hearing Date
                </label>

                <input
                  type="date"
                  name="hearing_date"
                  className="form-control"
                  value={formData.hearing_date}
                  onChange={handleChange}
                />

              </div>

              {/* Status */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
                  Status
                </label>

                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Open">
                    Open
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Closed">
                    Closed
                  </option>

                </select>

              </div>

              {/* Remarks */}

              <div className="col-md-12 mb-3">

                <label className="form-label fw-semibold">
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  className="form-control"
                  rows="5"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Enter case remarks..."
                />

              </div>

            </div>

          </div>

        </div>

        {/* ======================================
            Customer / Property Read Only
        ====================================== */}

        <div className="card shadow-sm border-0 mb-4">

          <div
            className="card-header"
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
              borderBottom: "3px solid #d4af37",
            }}
          >
            <h5 className="mb-0">
              Customer & Property
            </h5>
          </div>

          <div className="card-body">

            <div className="row">

              <div className="col-md-6 mb-3">

                <label className="form-label text-muted">
                  Customer
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={
                    selectedCase.customer_name || "-"
                  }
                  disabled
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label text-muted">
                  Customer Email
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={
                    selectedCase.customer_email || "-"
                  }
                  disabled
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label text-muted">
                  Property
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={
                    selectedCase.property_name || "-"
                  }
                  disabled
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label text-muted">
                  Survey Number
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={
                    selectedCase.survey_number || "-"
                  }
                  disabled
                />

              </div>

            </div>

            <div className="alert alert-light border mb-0">
              Customer and property information is read-only.
              Only legal case information can be updated from
              this page.
            </div>

          </div>

        </div>

        {/* ======================================
            Buttons
        ====================================== */}

        <div className="d-flex justify-content-end gap-2">

          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
            }}
            onClick={() =>
              navigate(`/admin/legal/view/${id}`)
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: "#d4af37",
              color: "#000000",
              fontWeight: "600",
            }}
            disabled={loading}
          >
            <FaSave className="me-2" />

            {loading
              ? "Updating..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
}