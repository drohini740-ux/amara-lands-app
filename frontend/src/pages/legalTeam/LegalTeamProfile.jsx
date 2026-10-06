
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaCheckCircle,
  FaEdit,
  FaSave,
  FaTimes,
  FaSync,
} from "react-icons/fa";

import {
  fetchLegalTeamProfile,
  updateLegalTeamProfile,
  clearProfileError,
  clearProfileUpdateSuccess,
} from "../../redux/legalTeamProfileSlice";

const LegalTeamProfile = () => {
  const dispatch = useDispatch();

  const {
    profile,
    loading,
    updateLoading,
    error,
    updateSuccess,
  } = useSelector(
    (state) => state.legalTeamProfile
  );

  const [isEditing, setIsEditing] =
    useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
    email: "",
  });

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    dispatch(fetchLegalTeamProfile());
  }, [dispatch]);

  // =====================================================
  // SET FORM DATA
  // =====================================================

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        mobile: profile.mobile || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  // =====================================================
  // SUCCESS MESSAGE
  // =====================================================

  useEffect(() => {
    if (updateSuccess) {
      setIsEditing(false);

      const timer = setTimeout(() => {
        dispatch(clearProfileUpdateSuccess());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [updateSuccess, dispatch]);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      updateLegalTeamProfile(formData)
    );
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        mobile: profile.mobile || "",
        email: profile.email || "",
      });
    }

    setIsEditing(false);
    dispatch(clearProfileError());
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    dispatch(fetchLegalTeamProfile());
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && !profile) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{
            color: "#C9A227",
          }}
        />

        <p className="mt-3 mb-0">
          Loading profile...
        </p>
      </div>
    );
  }

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
            My Profile
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#777777",
            }}
          >
            View and manage your Legal Team account
            information.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn"
            onClick={handleRefresh}
            disabled={loading}
            style={{
              border:
                "1px solid #C9A227",
              color: "#C9A227",
              backgroundColor: "#FFFFFF",
            }}
          >
            <FaSync className="me-2" />

            Refresh
          </button>

          {!isEditing && (
            <button
              type="button"
              className="btn"
              onClick={() =>
                setIsEditing(true)
              }
              style={{
                backgroundColor: "#111111",
                color: "#FFFFFF",
                border:
                  "1px solid #111111",
              }}
            >
              <FaEdit className="me-2" />

              Edit Profile
            </button>
          )}
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
      {/* SUCCESS */}
      {/* ================================================= */}

      {updateSuccess && (
        <div className="alert alert-success">
          <FaCheckCircle className="me-2" />

          Profile updated successfully.
        </div>
      )}

      {/* ================================================= */}
      {/* PROFILE */}
      {/* ================================================= */}

      {profile && (
        <div className="row g-4">
          {/* ============================================= */}
          {/* PROFILE CARD */}
          {/* ============================================= */}

          <div className="col-md-4">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderTop:
                  "4px solid #C9A227",
              }}
            >
              <div className="card-body text-center p-4">
                {profile.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt="Profile"
                    style={{
                      width: "110px",
                      height: "110px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border:
                        "3px solid #C9A227",
                    }}
                  />
                ) : (
                  <FaUserCircle
                    style={{
                      fontSize: "110px",
                      color: "#C9A227",
                    }}
                  />
                )}

                <h4
                  className="mt-3 mb-1"
                  style={{
                    fontWeight: "700",
                    color: "#111111",
                  }}
                >
                  {profile.full_name ||
                    "Legal Team"}
                </h4>

                <div
                  style={{
                    color: "#777777",
                  }}
                >
                  {profile.email}
                </div>

                <span
                  className="badge mt-3"
                  style={{
                    backgroundColor:
                      "#F5E8B0",
                    color: "#111111",
                    padding: "8px 14px",
                  }}
                >
                  Legal Team
                </span>

                <div className="mt-4">
                  <span
                    className="badge"
                    style={{
                      backgroundColor:
                        profile.status ===
                        "active"
                          ? "#DFF5E3"
                          : "#F8D7DA",
                      color:
                        profile.status ===
                        "active"
                          ? "#198754"
                          : "#842029",
                      padding: "8px 14px",
                    }}
                  >
                    <FaCheckCircle className="me-1" />

                    {profile.status ||
                      "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================= */}
          {/* PROFILE DETAILS */}
          {/* ============================================= */}

          <div className="col-md-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <strong>
                  Account Information
                </strong>
              </div>

              <div className="card-body p-4">
                {isEditing ? (
                  <form
                    onSubmit={handleSubmit}
                  >
                    {/* FULL NAME */}

                    <div className="mb-3">
                      <label
                        className="form-label fw-semibold"
                      >
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="full_name"
                        className="form-control"
                        value={
                          formData.full_name
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />
                    </div>

                    {/* MOBILE */}

                    <div className="mb-3">
                      <label
                        className="form-label fw-semibold"
                      >
                        Mobile Number
                      </label>

                      <input
                        type="text"
                        name="mobile"
                        className="form-control"
                        value={
                          formData.mobile
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                    {/* EMAIL */}

                    <div className="mb-4">
                      <label
                        className="form-label fw-semibold"
                      >
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={
                          formData.email
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />
                    </div>

                    {/* BUTTONS */}

                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className="btn"
                        disabled={
                          updateLoading
                        }
                        style={{
                          backgroundColor:
                            "#111111",
                          color:
                            "#FFFFFF",
                        }}
                      >
                        {updateLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                            />

                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave className="me-2" />

                            Save Changes
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn"
                        onClick={
                          handleCancel
                        }
                        disabled={
                          updateLoading
                        }
                        style={{
                          border:
                            "1px solid #111111",
                          color:
                            "#111111",
                          backgroundColor:
                            "#FFFFFF",
                        }}
                      >
                        <FaTimes className="me-2" />

                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* NAME */}

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <small className="text-muted">
                          Full Name
                        </small>

                        <div className="mt-1 fw-semibold">
                          <FaUserCircle
                            className="me-2"
                            style={{
                              color:
                                "#C9A227",
                            }}
                          />

                          {profile.full_name ||
                            "-"}
                        </div>
                      </div>

                      {/* EMAIL */}

                      <div className="col-md-6">
                        <small className="text-muted">
                          Email Address
                        </small>

                        <div className="mt-1 fw-semibold">
                          <FaEnvelope
                            className="me-2"
                            style={{
                              color:
                                "#C9A227",
                            }}
                          />

                          {profile.email ||
                            "-"}
                        </div>
                      </div>
                    </div>

                    {/* MOBILE */}

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <small className="text-muted">
                          Mobile Number
                        </small>

                        <div className="mt-1 fw-semibold">
                          <FaPhone
                            className="me-2"
                            style={{
                              color:
                                "#C9A227",
                            }}
                          />

                          {profile.mobile ||
                            "-"}
                        </div>
                      </div>

                      {/* ROLE */}

                      <div className="col-md-6">
                        <small className="text-muted">
                          Role
                        </small>

                        <div className="mt-1 fw-semibold">
                          <FaIdBadge
                            className="me-2"
                            style={{
                              color:
                                "#C9A227",
                            }}
                          />

                          Legal Team
                        </div>
                      </div>
                    </div>

                    {/* STATUS */}

                    <div className="row">
                      <div className="col-md-6">
                        <small className="text-muted">
                          Account Status
                        </small>

                        <div className="mt-1">
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                profile.status ===
                                "active"
                                  ? "#DFF5E3"
                                  : "#F8D7DA",
                              color:
                                profile.status ===
                                "active"
                                  ? "#198754"
                                  : "#842029",
                            }}
                          >
                            {profile.status ||
                              "-"}
                          </span>
                        </div>
                      </div>

                      {/* CREATED */}

                      <div className="col-md-6">
                        <small className="text-muted">
                          Account Created
                        </small>

                        <div className="mt-1 fw-semibold">
                          {formatDate(
                            profile.created_at
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* SECURITY NOTE */}
      {/* ================================================= */}

      <div
        className="mt-4 p-3 rounded shadow-sm"
        style={{
          backgroundColor: "#111111",
          color: "#FFFFFF",
        }}
      >
        <div className="d-flex align-items-center">
          <FaIdBadge
            className="me-2"
            style={{
              color: "#C9A227",
            }}
          />

          <span>
            Your Legal Team role and account status are
            managed by the system administrator.
          </span>
        </div>
      </div>
    </div>
  );
};

export default LegalTeamProfile;

