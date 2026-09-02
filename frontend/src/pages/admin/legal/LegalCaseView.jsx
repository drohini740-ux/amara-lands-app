import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaEdit,
  FaUser,
  FaBuilding,
  FaBalanceScale,
  FaUserTie,
  FaCalendarAlt,
} from "react-icons/fa";

import {
  fetchAdminLegalCase,
} from "../../../redux/adminLegalSlice";

export default function LegalCaseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedCase,
    loading,
    error,
  } = useSelector((state) => state.adminLegal);

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminLegalCase(id));
    }
  }, [dispatch, id]);

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <h5>Loading Legal Case...</h5>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          className="btn btn-dark"
          onClick={() => navigate("/admin/legal")}
        >
          <FaArrowLeft className="me-2" />
          Back to Legal Management
        </button>
      </div>
    );
  }

  if (!selectedCase) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-warning">
          Legal case not found.
        </div>

        <button
          className="btn btn-dark"
          onClick={() => navigate("/admin/legal")}
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "closed":
        return "bg-success";

      case "pending":
        return "bg-warning text-dark";

      case "open":
        return "bg-primary";

      default:
        return "bg-secondary";
    }
  };

  return (
    <div
      className="container-fluid p-4"
      style={{
        backgroundColor: "#f8f8f8",
        minHeight: "100vh",
      }}
    >

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div className="d-flex align-items-center">

          <button
            className="btn me-3"
            style={{
              backgroundColor: "#111",
              color: "#d4af37",
            }}
            onClick={() => navigate("/admin/legal")}
          >
            <FaArrowLeft />
          </button>

          <div>
            <h2
              className="fw-bold mb-1"
              style={{ color: "#111" }}
            >
              Legal Case Details
            </h2>

            <p className="text-muted mb-0">
              View complete legal case information
            </p>
          </div>

        </div>

        <div className="d-flex gap-2">

          <button
            className="btn"
            style={{
              backgroundColor: "#d4af37",
              color: "#111",
            }}
            onClick={() =>
              navigate(`/admin/legal/assign/${selectedCase.id}`)
            }
          >
            <FaUserTie className="me-2" />
            Assign Advocate
          </button>

          <button
            className="btn btn-dark"
            onClick={() =>
              navigate(`/admin/legal/edit/${selectedCase.id}`)
            }
          >
            <FaEdit className="me-2" />
            Edit Case
          </button>

        </div>

      </div>


      {/* ======================================
          CASE STATUS
      ====================================== */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body">

          <div className="row align-items-center">

            <div className="col-md-8">

              <small className="text-muted">
                Case Title
              </small>

              <h3 className="fw-bold mb-1">
                {selectedCase.case_title || "-"}
              </h3>

              <span className="text-muted">
                Case No:{" "}
                {selectedCase.case_number || "-"}
              </span>

            </div>

            <div className="col-md-4 text-md-end">

              <span
                className={`badge fs-6 px-3 py-2 ${getStatusClass(
                  selectedCase.status
                )}`}
              >
                {selectedCase.status || "Open"}
              </span>

            </div>

          </div>

        </div>

      </div>


      <div className="row g-4">

        {/* ======================================
            CUSTOMER INFORMATION
        ====================================== */}

        <div className="col-lg-6">

          <div className="card border-0 shadow-sm h-100">

            <div
              className="card-header fw-bold"
              style={{
                backgroundColor: "#111",
                color: "#fff",
              }}
            >
              <FaUser className="me-2" />
              Customer Information
            </div>

            <div className="card-body">

              <div className="mb-3">

                <small className="text-muted">
                  Customer Name
                </small>

                <div className="fw-bold">
                  {selectedCase.customer_name || "-"}
                </div>

              </div>

              <div className="mb-3">

                <small className="text-muted">
                  Email
                </small>

                <div>
                  {selectedCase.customer_email || "-"}
                </div>

              </div>

              <div>

                <small className="text-muted">
                  Mobile
                </small>

                <div>
                  {selectedCase.customer_mobile || "-"}
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ======================================
            PROPERTY INFORMATION
        ====================================== */}

        <div className="col-lg-6">

          <div className="card border-0 shadow-sm h-100">

            <div
              className="card-header fw-bold"
              style={{
                backgroundColor: "#d4af37",
                color: "#111",
              }}
            >
              <FaBuilding className="me-2" />
              Property Information
            </div>

            <div className="card-body">

              <div className="mb-3">

                <small className="text-muted">
                  Property Name
                </small>

                <div className="fw-bold">
                  {selectedCase.property_name || "-"}
                </div>

              </div>

              <div className="row">

                <div className="col-md-6 mb-3">

                  <small className="text-muted">
                    Survey Number
                  </small>

                  <div>
                    {selectedCase.survey_number || "-"}
                  </div>

                </div>

                <div className="col-md-6 mb-3">

                  <small className="text-muted">
                    Property Type
                  </small>

                  <div>
                    {selectedCase.property_type || "-"}
                  </div>

                </div>

              </div>

              <div className="mb-3">

                <small className="text-muted">
                  Area
                </small>

                <div>
                  {selectedCase.area || "-"}
                </div>

              </div>

              <div>

                <small className="text-muted">
                  Address
                </small>

                <div>
                  {selectedCase.address || "-"}
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ======================================
            LEGAL INFORMATION
        ====================================== */}

        <div className="col-lg-8">

          <div className="card border-0 shadow-sm">

            <div
              className="card-header fw-bold"
              style={{
                backgroundColor: "#111",
                color: "#fff",
              }}
            >
              <FaBalanceScale className="me-2" />
              Legal Information
            </div>

            <div className="card-body">

              <div className="row g-4">

                <div className="col-md-6">

                  <small className="text-muted">
                    Court Name
                  </small>

                  <div className="fw-bold">
                    {selectedCase.court_name || "-"}
                  </div>

                </div>

                <div className="col-md-6">

                  <small className="text-muted">
                    Advocate
                  </small>

                  <div className="fw-bold">
                    {selectedCase.advocate_name ||
                      "Not Assigned"}
                  </div>

                </div>

                <div className="col-md-6">

                  <small className="text-muted">
                    <FaCalendarAlt className="me-1" />
                    Hearing Date
                  </small>

                  <div className="fw-bold">
                    {selectedCase.hearing_date
                      ? new Date(
                          selectedCase.hearing_date
                        ).toLocaleDateString()
                      : "-"}
                  </div>

                </div>

                <div className="col-md-6">

                  <small className="text-muted">
                    Status
                  </small>

                  <div>
                    <span
                      className={`badge ${getStatusClass(
                        selectedCase.status
                      )}`}
                    >
                      {selectedCase.status || "Open"}
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ======================================
            CASE NOTES
        ====================================== */}

        <div className="col-lg-4">

          <div className="card border-0 shadow-sm h-100">

            <div
              className="card-header fw-bold"
              style={{
                backgroundColor: "#d4af37",
                color: "#111",
              }}
            >
              Remarks
            </div>

            <div className="card-body">

              <p className="mb-0">
                {selectedCase.remarks ||
                  "No remarks available."}
              </p>

            </div>

          </div>

        </div>


        {/* ======================================
            LOCATION
        ====================================== */}

        <div className="col-12">

          <div className="card border-0 shadow-sm">

            <div className="card-body">

              <small className="text-muted">
                Property Location
              </small>

              <div className="fw-bold">

                {[
                  selectedCase.address,
                  selectedCase.city,
                  selectedCase.state,
                  selectedCase.pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "-"}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}