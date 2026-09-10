import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUserTie,
  FaSearch,
  FaGavel,
  FaCalendarAlt,
} from "react-icons/fa";

import { fetchAdminLegalCases } from "../../../redux/adminLegalSlice";

const LegalTeam = () => {
  const dispatch = useDispatch();

  const {
    legalCases = [],
    loading,
    error,
  } = useSelector((state) => state.adminLegal);

  const [search, setSearch] = useState("");

  // Fetch legal cases
  useEffect(() => {
    dispatch(fetchAdminLegalCases());
  }, [dispatch]);

  // Create advocate/team list from legal cases
  const legalTeam = useMemo(() => {
    const advocateMap = {};

    legalCases.forEach((item) => {
      const advocateName = String(
        item.advocate_name || ""
      ).trim();

      if (!advocateName) {
        return;
      }

      const key = advocateName.toLowerCase();

      if (!advocateMap[key]) {
        advocateMap[key] = {
          name: advocateName,
          cases: [],
        };
      }

      advocateMap[key].cases.push(item);
    });

    const searchText = search.trim().toLowerCase();

    return Object.values(advocateMap).filter((advocate) => {
      if (!searchText) {
        return true;
      }

      return (
        advocate.name
          .toLowerCase()
          .includes(searchText) ||
        advocate.cases.some(
          (item) =>
            String(item.case_title || "")
              .toLowerCase()
              .includes(searchText) ||
            String(item.property_name || "")
              .toLowerCase()
              .includes(searchText) ||
            String(item.customer_name || "")
              .toLowerCase()
              .includes(searchText)
        )
      );
    });
  }, [legalCases, search]);

  const totalAdvocates = legalTeam.length;

  const totalAssignedCases = legalTeam.reduce(
    (total, advocate) =>
      total + advocate.cases.length,
    0
  );

  const openCases = legalTeam.reduce(
    (total, advocate) =>
      total +
      advocate.cases.filter(
        (item) =>
          String(item.status || "").toLowerCase() ===
          "open"
      ).length,
    0
  );

  const pendingCases = legalTeam.reduce(
    (total, advocate) =>
      total +
      advocate.cases.filter(
        (item) =>
          String(item.status || "").toLowerCase() ===
          "pending"
      ).length,
    0
  );

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

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

  return (
    <div>
      {/* HEADER */}
      <div className="mb-4">
        <h2
          style={{
            color: "#111",
            fontWeight: "700",
          }}
        >
          Legal Team
        </h2>

        <p className="text-muted mb-0">
          Manage advocates and monitor their assigned legal cases.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        {/* TOTAL ADVOCATES */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div
              className="card-body"
              style={{
                borderTop: "4px solid #c9a227",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">
                    Total Advocates
                  </p>

                  <h3
                    className="mb-0"
                    style={{
                      color: "#111",
                      fontWeight: "700",
                    }}
                  >
                    {totalAdvocates}
                  </h3>
                </div>

                <FaUserTie
                  size={30}
                  style={{
                    color: "#c9a227",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ASSIGNED CASES */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div
              className="card-body"
              style={{
                borderTop: "4px solid #c9a227",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">
                    Assigned Cases
                  </p>

                  <h3
                    className="mb-0"
                    style={{
                      color: "#111",
                      fontWeight: "700",
                    }}
                  >
                    {totalAssignedCases}
                  </h3>
                </div>

                <FaGavel
                  size={30}
                  style={{
                    color: "#c9a227",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* OPEN CASES */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div
              className="card-body"
              style={{
                borderTop: "4px solid #c9a227",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">
                    Open Cases
                  </p>

                  <h3
                    className="mb-0"
                    style={{
                      color: "#111",
                      fontWeight: "700",
                    }}
                  >
                    {openCases}
                  </h3>
                </div>

                <FaGavel
                  size={30}
                  style={{
                    color: "#c9a227",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* PENDING CASES */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div
              className="card-body"
              style={{
                borderTop: "4px solid #111",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">
                    Pending Cases
                  </p>

                  <h3
                    className="mb-0"
                    style={{
                      color: "#111",
                      fontWeight: "700",
                    }}
                  >
                    {pendingCases}
                  </h3>
                </div>

                <FaCalendarAlt
                  size={30}
                  style={{
                    color: "#c9a227",
                  }}
                />
              </div>
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
              placeholder="Search advocate, case, property or customer..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* LEGAL TEAM */}
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
          <FaUserTie className="me-2" />
          Legal Team
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
                    Advocate
                  </th>

                  <th>
                    Assigned Cases
                  </th>

                  <th>
                    Open Cases
                  </th>

                  <th>
                    Pending Cases
                  </th>

                  <th>
                    Latest Hearing
                  </th>

                  <th>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-5"
                    >
                      <div
                        className="spinner-border"
                        style={{
                          color: "#c9a227",
                        }}
                      />

                      <div className="mt-2 text-muted">
                        Loading legal team...
                      </div>
                    </td>
                  </tr>
                ) : legalTeam.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-5 text-muted"
                    >
                      <FaUserTie
                        size={40}
                        className="mb-3"
                        style={{
                          color: "#c9a227",
                        }}
                      />

                      <div>
                        No advocates assigned to legal cases.
                      </div>
                    </td>
                  </tr>
                ) : (
                  legalTeam.map((advocate) => {
                    const advocateOpenCases =
                      advocate.cases.filter(
                        (item) =>
                          String(
                            item.status || ""
                          ).toLowerCase() ===
                          "open"
                      ).length;

                    const advocatePendingCases =
                      advocate.cases.filter(
                        (item) =>
                          String(
                            item.status || ""
                          ).toLowerCase() ===
                          "pending"
                      ).length;

                    const hearings =
                      advocate.cases
                        .filter(
                          (item) =>
                            item.hearing_date
                        )
                        .sort(
                          (a, b) =>
                            new Date(
                              b.hearing_date
                            ) -
                            new Date(
                              a.hearing_date
                            )
                        );

                    const latestHearing =
                      hearings.length > 0
                        ? hearings[0].hearing_date
                        : null;

                    const hasOpenCases =
                      advocateOpenCases > 0;

                    return (
                      <tr key={advocate.name}>
                        {/* ADVOCATE */}
                        <td className="px-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: "42px",
                                height: "42px",
                                background:
                                  "#111",
                                color:
                                  "#c9a227",
                              }}
                            >
                              <FaUserTie />
                            </div>

                            <div>
                              <strong>
                                {advocate.name}
                              </strong>

                              <div className="small text-muted">
                                Legal Advocate
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* ASSIGNED */}
                        <td>
                          <strong>
                            {advocate.cases.length}
                          </strong>
                        </td>

                        {/* OPEN */}
                        <td>
                          <span
                            className="badge px-3 py-2"
                            style={{
                              background:
                                "#c9a227",
                              color: "#111",
                            }}
                          >
                            {advocateOpenCases}
                          </span>
                        </td>

                        {/* PENDING */}
                        <td>
                          <span
                            className="badge px-3 py-2"
                            style={{
                              background:
                                "#f1f1f1",
                              color: "#111",
                              border:
                                "1px solid #c9a227",
                            }}
                          >
                            {advocatePendingCases}
                          </span>
                        </td>

                        {/* HEARING */}
                        <td>
                          {latestHearing
                            ? formatDate(
                                latestHearing
                              )
                            : "-"}
                        </td>

                        {/* STATUS */}
                        <td>
                          <span
                            className="badge px-3 py-2"
                            style={{
                              background:
                                hasOpenCases
                                  ? "#c9a227"
                                  : "#111",
                              color:
                                hasOpenCases
                                  ? "#111"
                                  : "#fff",
                            }}
                          >
                            {hasOpenCases
                              ? "Active"
                              : "No Open Cases"}
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

export default LegalTeam;