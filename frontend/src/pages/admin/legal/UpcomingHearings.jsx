import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCalendarAlt,
  FaSearch,
  FaUserTie,
  FaGavel,
} from "react-icons/fa";

import { fetchAdminLegalCases } from "../../../redux/adminLegalSlice";

const UpcomingHearings = () => {
  const dispatch = useDispatch();

  const {
    legalCases = [],
    loading,
    error,
  } = useSelector((state) => state.adminLegal);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAdminLegalCases());
  }, [dispatch]);

  // ===============================
  // UPCOMING HEARINGS
  // ===============================

  const upcomingHearings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return legalCases
      .filter((item) => {
        if (!item.hearing_date) return false;

        const hearingDate = new Date(item.hearing_date);
        hearingDate.setHours(0, 0, 0, 0);

        // Exclude closed cases
        if (
          String(item.status || "").toLowerCase() === "closed"
        ) {
          return false;
        }

        return hearingDate >= today;
      })
      .filter((item) => {
        const text = search.trim().toLowerCase();

        if (!text) return true;

        return (
          String(item.case_title || "")
            .toLowerCase()
            .includes(text) ||
          String(item.case_number || "")
            .toLowerCase()
            .includes(text) ||
          String(item.property_name || "")
            .toLowerCase()
            .includes(text) ||
          String(item.customer_name || "")
            .toLowerCase()
            .includes(text) ||
          String(item.advocate_name || "")
            .toLowerCase()
            .includes(text) ||
          String(item.court_name || "")
            .toLowerCase()
            .includes(text)
        );
      })
      .sort(
        (a, b) =>
          new Date(a.hearing_date) -
          new Date(b.hearing_date)
      );
  }, [legalCases, search]);

  // ===============================
  // DATE FORMAT
  // ===============================

  const formatDate = (date) => {
    if (!date) return "-";

    const dateString = String(date).substring(0, 10);

    const parsedDate = new Date(
      `${dateString}T00:00:00`
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return dateString;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ===============================
  // DAYS REMAINING
  // ===============================

  const getDaysRemaining = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hearingDate = new Date(date);
    hearingDate.setHours(0, 0, 0, 0);

    const difference =
      hearingDate.getTime() - today.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <div>
      {/* HEADER */}

      <div className="mb-4">
        <h3
          style={{
            color: "#111",
            fontWeight: "700",
          }}
        >
          <FaCalendarAlt
            className="me-2"
            style={{ color: "#c9a227" }}
          />
          Upcoming Hearings
        </h3>

        <p className="text-muted mb-0">
          Monitor upcoming legal case hearings and important
          court dates.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* SUMMARY */}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">
                Upcoming Hearings
              </p>

              <h3
                style={{
                  color: "#c9a227",
                  fontWeight: "700",
                }}
              >
                {upcomingHearings.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">
                Next Hearing
              </p>

              <h5
                style={{
                  fontWeight: "700",
                  color: "#111",
                }}
              >
                {upcomingHearings.length > 0
                  ? formatDate(
                      upcomingHearings[0].hearing_date
                    )
                  : "No upcoming hearing"}
              </h5>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">
                Cases Requiring Attention
              </p>

              <h3
                style={{
                  color: "#111",
                  fontWeight: "700",
                }}
              >
                {
                  upcomingHearings.filter(
                    (item) =>
                      getDaysRemaining(
                        item.hearing_date
                      ) <= 7
                  ).length
                }
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="input-group">
            <span
              className="input-group-text"
              style={{
                background: "#111",
                color: "#fff",
              }}
            >
              <FaSearch />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search cases, property, customer, advocate or court..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* TABLE */}

      <div className="card border-0 shadow-sm">
        <div
          className="card-header"
          style={{
            background: "#c9a227",
            color: "#111",
            fontWeight: "700",
            fontSize: "18px",
          }}
        >
          <FaCalendarAlt className="me-2" />
          Upcoming Hearing Schedule
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead
                style={{
                  background: "#111",
                  color: "#fff",
                }}
              >
                <tr>
                  <th className="px-3 py-3">
                    Case
                  </th>

                  <th>Property</th>

                  <th>Customer</th>

                  <th>Advocate</th>

                  <th>Court</th>

                  <th>Hearing</th>

                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-5"
                    >
                      <div
                        className="spinner-border"
                        style={{
                          color: "#c9a227",
                        }}
                      ></div>

                      <div className="mt-2 text-muted">
                        Loading upcoming hearings...
                      </div>
                    </td>
                  </tr>
                ) : upcomingHearings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-5 text-muted"
                    >
                      No upcoming hearings found.
                    </td>
                  </tr>
                ) : (
                  upcomingHearings.map((item) => {
                    const days =
                      getDaysRemaining(
                        item.hearing_date
                      );

                    return (
                      <tr key={item.id}>
                        {/* CASE */}

                        <td className="px-3">
                          <strong>
                            {item.case_title || "-"}
                          </strong>

                          <div className="small text-muted">
                            {item.case_number || "-"}
                          </div>
                        </td>

                        {/* PROPERTY */}

                        <td>
                          <strong>
                            {item.property_name || "-"}
                          </strong>

                          {item.survey_number && (
                            <div className="small text-muted">
                              Survey:{" "}
                              {item.survey_number}
                            </div>
                          )}
                        </td>

                        {/* CUSTOMER */}

                        <td>
                          {item.customer_name || "-"}

                          {item.customer_email && (
                            <div className="small text-muted">
                              {item.customer_email}
                            </div>
                          )}
                        </td>

                        {/* ADVOCATE */}

                        <td>
                          {item.advocate_name ? (
                            <>
                              <FaUserTie
                                className="me-1"
                                style={{
                                  color: "#c9a227",
                                }}
                              />

                              {item.advocate_name}
                            </>
                          ) : (
                            <span className="text-muted">
                              Not Assigned
                            </span>
                          )}
                        </td>

                        {/* COURT */}

                        <td>
                          <FaGavel
                            className="me-1"
                            style={{
                              color: "#c9a227",
                            }}
                          />

                          {item.court_name || "-"}
                        </td>

                        {/* HEARING */}

                        <td>
                          <strong>
                            {formatDate(
                              item.hearing_date
                            )}
                          </strong>

                          <div
                            className="small"
                            style={{
                              color:
                                days <= 7
                                  ? "#dc3545"
                                  : "#666",
                              fontWeight:
                                days <= 7
                                  ? "600"
                                  : "400",
                            }}
                          >
                            {days === 0
                              ? "Today"
                              : days === 1
                              ? "Tomorrow"
                              : `${days} days remaining`}
                          </div>
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className="badge px-3 py-2"
                            style={{
                              background:
                                item.status ===
                                "Open"
                                  ? "#fff3cd"
                                  : "#f8f9fa",
                              color: "#111",
                              border:
                                "1px solid #c9a227",
                            }}
                          >
                            {item.status || "Open"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingHearings;