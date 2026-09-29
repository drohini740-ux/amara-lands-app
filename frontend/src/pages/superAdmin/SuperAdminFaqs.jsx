import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaQuestionCircle,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaSync,
} from "react-icons/fa";

import {
  fetchFaqs,
  createFaq,
  updateFaq,
  updateFaqStatus,
  deleteFaq,
} from "../../redux/superAdminFaqSlice";

const SuperAdminFaqs = () => {
  const dispatch = useDispatch();

  const {
    faqs,
    loading,
    error,
  } = useSelector((state) => state.superAdminFaq);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("Active");

  // =====================================================
  // LOAD FAQS
  // =====================================================

  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);

  // =====================================================
  // OPEN CREATE MODAL
  // =====================================================

  const handleAddFaq = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setStatus("Active");
    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEditFaq = (faq) => {
    setEditingFaq(faq);
    setQuestion(faq.question || "");
    setAnswer(faq.answer || "");
    setStatus(faq.status || "Active");
    setShowModal(true);
  };

  // =====================================================
  // SAVE FAQ
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim() || !answer.trim()) {
      alert("Question and answer are required.");
      return;
    }

    try {
      if (editingFaq) {
        await dispatch(
          updateFaq({
            id: editingFaq.id,
            faqData: {
              question,
              answer,
              status,
            },
          })
        ).unwrap();
      } else {
        await dispatch(
          createFaq({
            question,
            answer,
            status,
          })
        ).unwrap();
      }

      setShowModal(false);
      setEditingFaq(null);
      setQuestion("");
      setAnswer("");
      setStatus("Active");
    } catch (error) {
      alert(error || "Failed to save FAQ.");
    }
  };

  // =====================================================
  // CHANGE STATUS
  // =====================================================

  const handleStatusChange = async (faq) => {
    const newStatus =
      String(faq.status).toLowerCase() === "active"
        ? "Inactive"
        : "Active";

    try {
      await dispatch(
        updateFaqStatus({
          id: faq.id,
          status: newStatus,
        })
      ).unwrap();
    } catch (error) {
      alert(error || "Failed to update FAQ status.");
    }
  };

  // =====================================================
  // DELETE FAQ
  // =====================================================

  const handleDelete = async (faq) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this FAQ?\n\n"${faq.question}"`
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteFaq(faq.id)).unwrap();
    } catch (error) {
      alert(error || "Failed to delete FAQ.");
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredFaqs = faqs.filter((faq) => {
    const searchValue = search.toLowerCase();

    return (
      String(faq.question || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(faq.answer || "")
        .toLowerCase()
        .includes(searchValue)
    );
  });

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleDateString("en-IN");
    } catch {
      return "-";
    }
  };

  // =====================================================
  // RETURN
  // =====================================================

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
            FAQ Management
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            Manage frequently asked questions across the
            Amara Lands application.
          </p>
        </div>

        <div className="d-flex gap-2">
          {/* REFRESH */}

          <button
            className="btn"
            onClick={() => dispatch(fetchFaqs())}
            disabled={loading}
            style={{
              border: "1px solid #C9A227",
              color: "#C9A227",
              backgroundColor: "#FFFFFF",
            }}
          >
            <FaSync className="me-2" />
            Refresh
          </button>

          {/* ADD FAQ */}

          <button
            className="btn"
            onClick={handleAddFaq}
            style={{
              backgroundColor: "#111111",
              color: "#FFFFFF",
              border: "1px solid #111111",
            }}
          >
            <FaPlus className="me-2" />
            Add FAQ
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="row g-3 mb-4">
        {/* TOTAL */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft: "4px solid #C9A227",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Total FAQs
                </small>

                <h3 className="mb-0 mt-2">
                  {faqs.length}
                </h3>
              </div>

              <FaQuestionCircle
                style={{
                  color: "#C9A227",
                  fontSize: "28px",
                }}
              />
            </div>
          </div>
        </div>

        {/* ACTIVE */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft: "4px solid #28a745",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Active FAQs
                </small>

                <h3 className="mb-0 mt-2">
                  {
                    faqs.filter(
                      (faq) =>
                        String(faq.status).toLowerCase() ===
                        "active"
                    ).length
                  }
                </h3>
              </div>

              <FaToggleOn
                style={{
                  color: "#28a745",
                  fontSize: "30px",
                }}
              />
            </div>
          </div>
        </div>

        {/* INACTIVE */}

        <div className="col-md-4">
          <div
            className="p-4 bg-white rounded shadow-sm"
            style={{
              borderLeft: "4px solid #dc3545",
            }}
          >
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  Inactive FAQs
                </small>

                <h3 className="mb-0 mt-2">
                  {
                    faqs.filter(
                      (faq) =>
                        String(faq.status).toLowerCase() ===
                        "inactive"
                    ).length
                  }
                </h3>
              </div>

              <FaToggleOff
                style={{
                  color: "#dc3545",
                  fontSize: "30px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <FaSearch
                style={{
                  color: "#C9A227",
                }}
              />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search by question or answer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
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
      {/* FAQ TABLE */}
      {/* ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <strong>All FAQs</strong>

            <span
              style={{
                color: "#777777",
                fontSize: "14px",
              }}
            >
              Showing {filteredFaqs.length} FAQs
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{
                  color: "#C9A227",
                }}
              />

              <p className="mt-3 mb-0">
                Loading FAQs...
              </p>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="text-center py-5">
              <FaQuestionCircle
                style={{
                  fontSize: "40px",
                  color: "#CCCCCC",
                }}
              />

              <p className="mt-3 text-muted">
                No FAQs found.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead
                  style={{
                    backgroundColor: "#111111",
                    color: "#FFFFFF",
                  }}
                >
                  <tr>
                    <th className="px-3">ID</th>

                    <th>Question</th>

                    <th>Answer</th>

                    <th>Status</th>

                    <th>Created</th>

                    <th className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFaqs.map((faq) => (
                    <tr key={faq.id}>
                      <td className="px-3">
                        {faq.id}
                      </td>

                      <td>
                        <strong>
                          {faq.question}
                        </strong>
                      </td>

                      <td>
                        <div
                          style={{
                            maxWidth: "400px",
                            whiteSpace: "normal",
                            color: "#555555",
                          }}
                        >
                          {faq.answer}
                        </div>
                      </td>

                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              String(faq.status).toLowerCase() ===
                              "active"
                                ? "#DFF5E3"
                                : "#F8D7DA",

                            color:
                              String(faq.status).toLowerCase() ===
                              "active"
                                ? "#198754"
                                : "#842029",
                          }}
                        >
                          {faq.status}
                        </span>
                      </td>

                      <td>
                        {formatDate(faq.created_at)}
                      </td>

                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          {/* EDIT */}

                          <button
                            className="btn btn-sm"
                            title="Edit FAQ"
                            onClick={() =>
                              handleEditFaq(faq)
                            }
                            style={{
                              color: "#C9A227",
                              border:
                                "1px solid #C9A227",
                            }}
                          >
                            <FaEdit />
                          </button>

                          {/* STATUS */}

                          <button
                            className="btn btn-sm"
                            title={
                              String(
                                faq.status
                              ).toLowerCase() ===
                              "active"
                                ? "Deactivate FAQ"
                                : "Activate FAQ"
                            }
                            onClick={() =>
                              handleStatusChange(faq)
                            }
                            style={{
                              color:
                                String(
                                  faq.status
                                ).toLowerCase() ===
                                "active"
                                  ? "#dc3545"
                                  : "#198754",

                              border:
                                String(
                                  faq.status
                                ).toLowerCase() ===
                                "active"
                                  ? "1px solid #dc3545"
                                  : "1px solid #198754",
                            }}
                          >
                            {String(
                              faq.status
                            ).toLowerCase() ===
                            "active" ? (
                              <FaToggleOff />
                            ) : (
                              <FaToggleOn />
                            )}
                          </button>

                          {/* DELETE */}

                          <button
                            className="btn btn-sm"
                            title="Delete FAQ"
                            onClick={() =>
                              handleDelete(faq)
                            }
                            style={{
                              color: "#111111",
                              border:
                                "1px solid #111111",
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* ADD / EDIT MODAL */}
      {/* ================================================= */}

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(0, 0, 0, 0.55)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              {/* HEADER */}

              <div
                className="modal-header"
                style={{
                  backgroundColor: "#111111",
                  color: "#FFFFFF",
                }}
              >
                <h5 className="modal-title">
                  {editingFaq
                    ? "Edit FAQ"
                    : "Add FAQ"}
                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() =>
                    setShowModal(false)
                  }
                />
              </div>

              {/* BODY */}

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* QUESTION */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Question
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter FAQ question"
                      value={question}
                      onChange={(e) =>
                        setQuestion(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* ANSWER */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Answer
                    </label>

                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Enter FAQ answer"
                      value={answer}
                      onChange={(e) =>
                        setAnswer(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* STATUS */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Status
                    </label>

                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) =>
                        setStatus(
                          e.target.value
                        )
                      }
                    >
                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>
                    </select>
                  </div>
                </div>

                {/* FOOTER */}

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() =>
                      setShowModal(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn"
                    style={{
                      backgroundColor:
                        "#111111",
                      color: "#FFFFFF",
                    }}
                  >
                    {editingFaq
                      ? "Update FAQ"
                      : "Create FAQ"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminFaqs;