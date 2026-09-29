import React from "react";
import {
  FaGavel,
  FaFolderOpen,
  FaClock,
  FaCalendarCheck,
  FaFileAlt,
  FaArrowRight,
  FaBalanceScale,
} from "react-icons/fa";

const LegalTeamDashboard = () => {
  return (
    <div>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="mb-4">
        <h3
          className="mb-1"
          style={{
            fontWeight: "700",
            color: "#111111",
          }}
        >
          Legal Team Dashboard
        </h3>

        <p
          className="mb-0"
          style={{
            color: "#777777",
          }}
        >
          Manage legal cases, consultations, property
          verification and legal documents.
        </p>
      </div>

      {/* ================================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div className="row g-4 mb-4">
        {/* TOTAL CASES */}

        <div className="col-xl-3 col-md-6">
          <div
            className="bg-white rounded shadow-sm p-4 h-100"
            style={{
              borderLeft: "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small
                  style={{
                    color: "#777777",
                    fontWeight: "600",
                  }}
                >
                  Total Cases
                </small>

                <h2
                  className="mt-2 mb-0"
                  style={{
                    color: "#111111",
                    fontWeight: "700",
                  }}
                >
                  0
                </h2>
              </div>

              <FaGavel
                style={{
                  color: "#C9A227",
                  fontSize: "30px",
                }}
              />
            </div>
          </div>
        </div>

        {/* ACTIVE CASES */}

        <div className="col-xl-3 col-md-6">
          <div
            className="bg-white rounded shadow-sm p-4 h-100"
            style={{
              borderLeft: "4px solid #111111",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small
                  style={{
                    color: "#777777",
                    fontWeight: "600",
                  }}
                >
                  Active Cases
                </small>

                <h2
                  className="mt-2 mb-0"
                  style={{
                    color: "#111111",
                    fontWeight: "700",
                  }}
                >
                  0
                </h2>
              </div>

              <FaFolderOpen
                style={{
                  color: "#111111",
                  fontSize: "30px",
                }}
              />
            </div>
          </div>
        </div>

        {/* PENDING CASES */}

        <div className="col-xl-3 col-md-6">
          <div
            className="bg-white rounded shadow-sm p-4 h-100"
            style={{
              borderLeft: "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small
                  style={{
                    color: "#777777",
                    fontWeight: "600",
                  }}
                >
                  Pending Cases
                </small>

                <h2
                  className="mt-2 mb-0"
                  style={{
                    color: "#111111",
                    fontWeight: "700",
                  }}
                >
                  0
                </h2>
              </div>

              <FaClock
                style={{
                  color: "#C9A227",
                  fontSize: "30px",
                }}
              />
            </div>
          </div>
        </div>

        {/* UPCOMING APPOINTMENTS */}

        <div className="col-xl-3 col-md-6">
          <div
            className="bg-white rounded shadow-sm p-4 h-100"
            style={{
              borderLeft: "4px solid #111111",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small
                  style={{
                    color: "#777777",
                    fontWeight: "600",
                  }}
                >
                  Upcoming Appointments
                </small>

                <h2
                  className="mt-2 mb-0"
                  style={{
                    color: "#111111",
                    fontWeight: "700",
                  }}
                >
                  0
                </h2>
              </div>

              <FaCalendarCheck
                style={{
                  color: "#111111",
                  fontSize: "30px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* SECOND ROW */}
      {/* ================================================= */}

      <div className="row g-4">
        {/* CASE STATUS */}

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong style={{ color: "#111111" }}>
                    Case Status Overview
                  </strong>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#777777",
                    }}
                  >
                    Current legal case distribution
                  </div>
                </div>

                <FaBalanceScale
                  style={{
                    color: "#C9A227",
                    fontSize: "20px",
                  }}
                />
              </div>
            </div>

            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div
                    className="p-3 rounded"
                    style={{
                      backgroundColor: "#111111",
                      color: "#FFFFFF",
                    }}
                  >
                    <div className="d-flex justify-content-between">
                      <span>Active</span>
                      <strong>0</strong>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="p-3 rounded"
                    style={{
                      backgroundColor: "#F5E8B0",
                      color: "#111111",
                    }}
                  >
                    <div className="d-flex justify-content-between">
                      <span>Pending</span>
                      <strong>0</strong>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="p-3 rounded"
                    style={{
                      backgroundColor: "#E8E8E8",
                      color: "#111111",
                    }}
                  >
                    <div className="d-flex justify-content-between">
                      <span>Closed</span>
                      <strong>0</strong>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="p-3 rounded"
                    style={{
                      backgroundColor: "#F8D7DA",
                      color: "#842029",
                    }}
                  >
                    <div className="d-flex justify-content-between">
                      <span>Rejected</span>
                      <strong>0</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UPCOMING APPOINTMENTS */}

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <strong style={{ color: "#111111" }}>
                  Upcoming Appointments
                </strong>

                <FaCalendarCheck
                  style={{
                    color: "#C9A227",
                  }}
                />
              </div>
            </div>

            <div className="card-body">
              <div className="text-center py-4">
                <FaCalendarCheck
                  style={{
                    fontSize: "40px",
                    color: "#C9A227",
                  }}
                />

                <p
                  className="mt-3 mb-1"
                  style={{
                    fontWeight: "600",
                    color: "#111111",
                  }}
                >
                  No upcoming appointments
                </p>

                <small style={{ color: "#777777" }}>
                  Upcoming legal appointments will appear
                  here.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* RECENT CASES */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong style={{ color: "#111111" }}>
                Recent Legal Cases
              </strong>

              <div
                style={{
                  fontSize: "13px",
                  color: "#777777",
                }}
              >
                Recently created or updated cases
              </div>
            </div>

            <FaFileAlt
              style={{
                color: "#C9A227",
              }}
            />
          </div>
        </div>

        <div className="card-body p-0">
          <div className="text-center py-5">
            <FaFileAlt
              style={{
                fontSize: "40px",
                color: "#CCCCCC",
              }}
            />

            <p
              className="mt-3 mb-1"
              style={{
                fontWeight: "600",
                color: "#111111",
              }}
            >
              No legal cases found
            </p>

            <small style={{ color: "#777777" }}>
              Legal cases assigned to the team will appear
              here.
            </small>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* QUICK ACTIONS */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <h6
            className="mb-3"
            style={{
              fontWeight: "700",
              color: "#111111",
            }}
          >
            Quick Actions
          </h6>

          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: "#111111",
                color: "#FFFFFF",
              }}
            >
              <FaGavel className="me-2" />
              View Legal Cases
              <FaArrowRight className="ms-2" />
            </button>

            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: "#C9A227",
                color: "#111111",
              }}
            >
              <FaCalendarCheck className="me-2" />
              View Appointments
              <FaArrowRight className="ms-2" />
            </button>

            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: "#FFFFFF",
                color: "#111111",
                border: "1px solid #C9A227",
              }}
            >
              <FaFileAlt className="me-2" />
              View Documents
              <FaArrowRight className="ms-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalTeamDashboard;