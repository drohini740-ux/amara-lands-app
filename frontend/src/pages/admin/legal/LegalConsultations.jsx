import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaSearch,
  FaComments,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";

import { fetchAdminLegalCases } from "../../../redux/adminLegalSlice";

const LegalConsultations = () => {
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

  /*
   * Until a separate admin consultation API is connected,
   * show consultation-related information from legal cases.
   */
  const consultations = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return legalCases.filter((item) => {
      return (
        String(item.case_title || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.customer_name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.advocate_name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.property_name || "")
          .toLowerCase()
          .includes(searchText)
      );
    });
  }, [legalCases, search]);

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
          Legal Consultations
        </h2>

        <p className="text-muted mb-0">
          Manage and monitor customer legal consultations.
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
            <div
              className="card-body"
              style={{
                borderTop: "4px solid #c9a227",
              }}
            >
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">
                    Total Consultations
                  </p>

                  <h3
                    style={{
                      fontWeight: "700",
                      color: "#111",
                    }}
                  >
                    {consultations.length}
                  </h3>
                </div>

                <FaComments
                  size={30}
                  style={{
                    color: "#c9a227",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div
              className="card-body"
              style={{
                borderTop: "4px solid #c9a227",
              }}
            >
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">
                    Open Cases
                  </p>

                  <h3
                    style={{
                      fontWeight: "700",
                      color: "#111",
                    }}
                  >
                    {
                      consultations.filter(
                        (item) =>
                          String(item.status || "")
                            .toLowerCase() === "open"
                      ).length
                    }
                  </h3>
                </div>

                <FaUser
                  size={30}
                  style={{
                    color: "#c9a227",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div
              className="card-body"
              style={{
                borderTop: "4px solid #111",
              }}
            >
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted mb-1">
                    Scheduled Hearings
                  </p>

                  <h3
                    style={{
                      fontWeight: "700",
                      color: "#111",
                    }}
                  >
                    {
                      consultations.filter(
                        (item) => item.hearing_date
                      ).length
                    }
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
              placeholder="Search customer, case, property or advocate..."
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
          <FaComments className="me-2" />
          Legal Consultations
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

                  <th>Hearing</th>

                  <th>Status</th>
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
                        Loading consultations...
                      </div>
                    </td>
                  </tr>
                ) : consultations.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-5 text-muted"
                    >
                      <FaComments
                        size={35}
                        className="mb-3"
                        style={{
                          color: "#c9a227",
                        }}
                      />

                      <div>
                        No consultations found.
                      </div>
                    </td>
                  </tr>
                ) : (
                  consultations.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3">
                        <strong>
                          {item.case_title || "-"}
                        </strong>

                        <div className="small text-muted">
                          Case No:{" "}
                          {item.case_number || "-"}
                        </div>
                      </td>

                      <td>
                        {item.property_name || "-"}
                      </td>

                      <td>
                        <strong>
                          {item.customer_name || "-"}
                        </strong>

                        {item.customer_email && (
                          <div className="small text-muted">
                            {item.customer_email}
                          </div>
                        )}
                      </td>

                      <td>
                        {item.advocate_name ? (
                          item.advocate_name
                        ) : (
                          <span className="text-muted">
                            Not Assigned
                          </span>
                        )}
                      </td>

                      <td>
                        {item.hearing_date
                          ? new Date(
                              `${String(
                                item.hearing_date
                              ).substring(
                                0,
                                10
                              )}T00:00:00`
                            ).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </td>

                      <td>
                        <span
                          className="badge px-3 py-2"
                          style={{
                            background:
                              String(
                                item.status || ""
                              ).toLowerCase() ===
                              "closed"
                                ? "#111"
                                : "#c9a227",
                            color:
                              String(
                                item.status || ""
                              ).toLowerCase() ===
                              "closed"
                                ? "#fff"
                                : "#111",
                          }}
                        >
                          {item.status || "Open"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalConsultations;