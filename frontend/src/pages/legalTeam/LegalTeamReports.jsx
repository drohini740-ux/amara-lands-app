
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaChartBar,
  FaGavel,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaComments,
  FaVideo,
  FaUniversity,
  FaSync,
} from "react-icons/fa";

import {
  fetchLegalReports,
} from "../../redux/legalTeamReportSlice";

const LegalTeamReports = () => {
  const dispatch = useDispatch();

  const {
    data,
    loading,
    error,
  } = useSelector(
    (state) => state.legalTeamReport
  );

  // =====================================================
  // LOAD REPORTS
  // =====================================================

  useEffect(() => {
    dispatch(fetchLegalReports());
  }, [dispatch]);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    dispatch(fetchLegalReports());
  };

  // =====================================================
  // DATA
  // =====================================================

  const caseSummary =
    data?.case_summary || {};

  const consultationSummary =
    data?.consultation_summary || {};

  const caseStatus =
    data?.case_status || [];

  const casesByMonth =
    data?.cases_by_month || [];

  const consultationTypes =
    data?.consultation_types || [];

  const casesByCourt =
    data?.cases_by_court || [];

  // =====================================================
  // FORMAT NUMBER
  // =====================================================

  const numberValue = (value) => {
    return Number(value || 0);
  };

  return (
    <div>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3
            className="mb-1"
            style={{
              fontWeight: "700",
              color: "#111111",
            }}
          >
            Reports & Analytics
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Monitor legal cases, consultations and
            legal activity across Amara Lands.
          </p>
        </div>

        <button
          className="btn"
          onClick={handleRefresh}
          disabled={loading}
          style={{
            border: "1px solid #C9A227",
            color: "#C9A227",
            backgroundColor: "#FFFFFF",
          }}
        >
          <FaSync className="me-2" />

          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading && !data ? (
        <div className="text-center py-5">
          <div
            className="spinner-border"
            style={{
              color: "#C9A227",
            }}
          />

          <p className="mt-3 mb-0">
            Loading legal reports...
          </p>
        </div>
      ) : (
        <>
          {/* ============================================= */}
          {/* CASE SUMMARY */}
          {/* ============================================= */}

          <div className="row g-3 mb-4">
            {/* TOTAL CASES */}

            <div className="col-md-3">
              <div
                className="p-4 bg-white rounded shadow-sm"
                style={{
                  borderLeft:
                    "4px solid #C9A227",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">
                      Total Cases
                    </small>

                    <h3 className="mb-0 mt-2">
                      {numberValue(
                        caseSummary.total_cases
                      )}
                    </h3>
                  </div>

                  <FaGavel
                    style={{
                      color: "#C9A227",
                      fontSize: "28px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ACTIVE CASES */}

            <div className="col-md-3">
              <div
                className="p-4 bg-white rounded shadow-sm"
                style={{
                  borderLeft:
                    "4px solid #28a745",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">
                      Active Cases
                    </small>

                    <h3 className="mb-0 mt-2">
                      {numberValue(
                        caseSummary.active_cases
                      )}
                    </h3>
                  </div>

                  <FaClock
                    style={{
                      color: "#28a745",
                      fontSize: "28px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* PENDING CASES */}

            <div className="col-md-3">
              <div
                className="p-4 bg-white rounded shadow-sm"
                style={{
                  borderLeft:
                    "4px solid #ffc107",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">
                      Pending Cases
                    </small>

                    <h3 className="mb-0 mt-2">
                      {numberValue(
                        caseSummary.pending_cases
                      )}
                    </h3>
                  </div>

                  <FaClock
                    style={{
                      color: "#ffc107",
                      fontSize: "28px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* CLOSED CASES */}

            <div className="col-md-3">
              <div
                className="p-4 bg-white rounded shadow-sm"
                style={{
                  borderLeft:
                    "4px solid #111111",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">
                      Closed Cases
                    </small>

                    <h3 className="mb-0 mt-2">
                      {numberValue(
                        caseSummary.closed_cases
                      )}
                    </h3>
                  </div>

                  <FaCheckCircle
                    style={{
                      color: "#111111",
                      fontSize: "28px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ============================================= */}
          {/* CONSULTATION SUMMARY */}
          {/* ============================================= */}

          <div className="row g-3 mb-4">
            {/* TOTAL CONSULTATIONS */}

            <div className="col-md-3">
              <div
                className="p-4 bg-white rounded shadow-sm"
                style={{
                  borderLeft:
                    "4px solid #C9A227",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">
                      Total Consultations
                    </small>

                    <h3 className="mb-0 mt-2">
                      {numberValue(
                        consultationSummary.total_consultations
                      )}
                    </h3>
                  </div>

                  <FaComments
                    style={{
                      color: "#C9A227",
                      fontSize: "28px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* PENDING CONSULTATIONS */}

            <div className="col-md-3">
              <div
                className="p-4 bg-white rounded shadow-sm"
                style={{
                  borderLeft:
                    "4px solid #ffc107",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">
                      Pending Consultations
                    </small>

                    <h3 className="mb-0 mt-2">
                      {numberValue(
                        consultationSummary.pending_consultations
                      )}
                    </h3>
                  </div>

                  <FaClock
                    style={{
                      color: "#ffc107",
                      fontSize: "28px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* CONFIRMED CONSULTATIONS */}

            <div className="col-md-3">
              <div
                className="p-4 bg-white rounded shadow-sm"
                style={{
                  borderLeft:
                    "4px solid #28a745",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">
                      Confirmed
                    </small>

                    <h3 className="mb-0 mt-2">
                      {numberValue(
                        consultationSummary.confirmed_consultations
                      )}
                    </h3>
                  </div>

                  <FaCheckCircle
                    style={{
                      color: "#28a745",
                      fontSize: "28px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* CANCELLED */}

            <div className="col-md-3">
              <div
                className="p-4 bg-white rounded shadow-sm"
                style={{
                  borderLeft:
                    "4px solid #dc3545",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">
                      Cancelled
                    </small>

                    <h3 className="mb-0 mt-2">
                      {numberValue(
                        consultationSummary.cancelled_consultations
                      )}
                    </h3>
                  </div>

                  <FaTimesCircle
                    style={{
                      color: "#dc3545",
                      fontSize: "28px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ============================================= */}
          {/* CASE STATUS */}
          {/* ============================================= */}

          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white py-3">
                  <strong>
                    Case Status Overview
                  </strong>
                </div>

                <div className="card-body">
                  {caseStatus.length === 0 ? (
                    <p className="text-muted mb-0">
                      No case status data available.
                    </p>
                  ) : (
                    caseStatus.map((item) => (
                      <div
                        key={item.status}
                        className="d-flex justify-content-between align-items-center mb-3"
                      >
                        <span>
                          {item.status}
                        </span>

                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              "#F5E8B0",
                            color: "#111111",
                            fontSize: "13px",
                          }}
                        >
                          {item.count}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* CONSULTATION TYPES */}

            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white py-3">
                  <strong>
                    Consultation Types
                  </strong>
                </div>

                <div className="card-body">
                  {consultationTypes.length === 0 ? (
                    <p className="text-muted mb-0">
                      No consultation type data available.
                    </p>
                  ) : (
                    consultationTypes.map(
                      (item) => (
                        <div
                          key={item.meeting_type}
                          className="d-flex justify-content-between align-items-center mb-3"
                        >
                          <span>
                            <FaVideo
                              className="me-2"
                              style={{
                                color:
                                  "#C9A227",
                              }}
                            />

                            {item.meeting_type}
                          </span>

                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                "#111111",
                              color:
                                "#FFFFFF",
                            }}
                          >
                            {item.count}
                          </span>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================= */}
          {/* CASES BY MONTH */}
          {/* ============================================= */}

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <strong>
                Cases by Month
              </strong>
            </div>

            <div className="card-body">
              {casesByMonth.length === 0 ? (
                <p className="text-muted mb-0">
                  No monthly case data available.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead
                      style={{
                        backgroundColor:
                          "#111111",
                        color: "#FFFFFF",
                      }}
                    >
                      <tr>
                        <th>Month</th>
                        <th>Total Cases</th>
                      </tr>
                    </thead>

                    <tbody>
                      {casesByMonth.map(
                        (item) => (
                          <tr key={item.month}>
                            <td>
                              {item.month}
                            </td>

                            <td>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor:
                                    "#F5E8B0",
                                  color:
                                    "#111111",
                                }}
                              >
                                {item.count}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ============================================= */}
          {/* CASES BY COURT */}
          {/* ============================================= */}

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <strong>
                Cases by Court
              </strong>
            </div>

            <div className="card-body">
              {casesByCourt.length === 0 ? (
                <p className="text-muted mb-0">
                  No court data available.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead
                      style={{
                        backgroundColor:
                          "#111111",
                        color: "#FFFFFF",
                      }}
                    >
                      <tr>
                        <th>Court</th>
                        <th>Cases</th>
                      </tr>
                    </thead>

                    <tbody>
                      {casesByCourt.map(
                        (item) => (
                          <tr
                            key={
                              item.court_name
                            }
                          >
                            <td>
                              <FaUniversity
                                className="me-2"
                                style={{
                                  color:
                                    "#C9A227",
                                }}
                              />

                              {item.court_name}
                            </td>

                            <td>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor:
                                    "#F5E8B0",
                                  color:
                                    "#111111",
                                }}
                              >
                                {item.count}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ============================================= */}
          {/* REPORT FOOTER */}
          {/* ============================================= */}

          <div
            className="p-3 rounded shadow-sm"
            style={{
              backgroundColor: "#111111",
              color: "#FFFFFF",
            }}
          >
            <div className="d-flex align-items-center">
              <FaChartBar
                className="me-2"
                style={{
                  color: "#C9A227",
                }}
              />

              <span>
                Legal Team analytics are generated from
                the current Amara Lands database records.
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LegalTeamReports;

