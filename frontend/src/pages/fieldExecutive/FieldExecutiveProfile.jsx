
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaSync,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

import {
  fetchFieldExecutiveProfile,
  updateFieldExecutiveProfile,
  clearFieldExecutiveProfileUpdateSuccess,
} from "../../redux/fieldExecutiveProfileSlice";

const FieldExecutiveProfile = () => {
  const dispatch = useDispatch();

  const {
    profile,
    loading,
    updateLoading,
    error,
    updateSuccess,
  } = useSelector(
    (state) => state.fieldExecutiveProfile
  );

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
    email: "",
  });

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  useEffect(() => {
    dispatch(fetchFieldExecutiveProfile());
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
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // START EDIT
  // =====================================================

  const handleEdit = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        mobile: profile.mobile || "",
        email: profile.email || "",
      });
    }

    dispatch(clearFieldExecutiveProfileUpdateSuccess());

    setIsEditing(true);
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

    dispatch(clearFieldExecutiveProfileUpdateSuccess());

    setIsEditing(false);
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      updateFieldExecutiveProfile({
        full_name: formData.full_name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
      })
    );

    if (
      updateFieldExecutiveProfile.fulfilled.match(
        result
      )
    ) {
      setIsEditing(false);
    }
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
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    dispatch(fetchFieldExecutiveProfile());
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

        <p className="mt-3 text-muted">
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
            View and manage your Field Executive profile.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn"
            onClick={handleRefresh}
            disabled={loading || updateLoading}
            style={{
              border: "1px solid #C9A227",
              color: "#C9A227",
              backgroundColor: "#FFFFFF",
            }}
          >
            <FaSync
              className="me-2"
              style={{
                animation:
                  loading
                    ? "spin 1s linear infinite"
                    : "none",
              }}
            />
            Refresh
          </button>

          {!isEditing && (
            <button
              type="button"
              className="btn"
              onClick={handleEdit}
              style={{
                backgroundColor: "#111111",
                color: "#FFFFFF",
                border: "1px solid #111111",
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
        <div
          className="alert d-flex align-items-center"
          style={{
            backgroundColor: "#DFF5E3",
            border: "1px solid #A8D5B5",
            color: "#198754",
          }}
        >
          <FaCheckCircle className="me-2" />
          Profile updated successfully.
        </div>
      )}

      {profile && (
        <div className="row g-4">
          {/* ================================================= */}
          {/* PROFILE CARD */}
          {/* ================================================= */}

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div
                className="card-body text-center p-4"
                style={{
                  borderTop:
                    "4px solid #C9A227",
                }}
              >
                {/* AVATAR */}

                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    backgroundColor: "#111111",
                    color: "#C9A227",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: "42px",
                  }}
                >
                  {profile.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <FaUser />
                  )}
                </div>

                <h4
                  className="mb-1"
                  style={{
                    fontWeight: "700",
                  }}
                >
                  {profile.full_name || "-"}
                </h4>

                <p
                  className="mb-3"
                  style={{
                    color: "#777777",
                  }}
                >
                  Field Executive
                </p>

                {/* STATUS */}

                <span
                  className="badge px-3 py-2"
                  style={{
                    backgroundColor:
                      String(profile.status)
                        .toLowerCase() ===
                      "active"
                        ? "#DFF5E3"
                        : "#F8D7DA",

                    color:
                      String(profile.status)
                        .toLowerCase() ===
                      "active"
                        ? "#198754"
                        : "#842029",
                  }}
                >
                  <FaCheckCircle className="me-2" />
                  {profile.status || "-"}
                </span>

                <hr className="my-4" />

                {/* USER ID */}

                <div className="text-start mb-3">
                  <small className="text-muted">
                    <FaIdBadge className="me-2" />
                    User ID
                  </small>

                  <div className="fw-semibold mt-1">
                    #{profile.id}
                  </div>
                </div>

                {/* ROLE */}

                <div className="text-start mb-3">
                  <small className="text-muted">
                    <FaUser className="me-2" />
                    Role
                  </small>

                  <div className="fw-semibold mt-1">
                    Field Executive
                  </div>
                </div>

                {/* CREATED */}

                <div className="text-start">
                  <small className="text-muted">
                    <FaCalendarAlt className="me-2" />
                    Account Created
                  </small>

                  <div className="fw-semibold mt-1">
                    {formatDate(
                      profile.created_at
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* PROFILE INFORMATION */}
          {/* ================================================= */}

          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div
                className="card-header bg-white py-3"
                style={{
                  borderBottom:
                    "2px solid #C9A227",
                }}
              >
                <strong>
                  <FaInfoCircle
                    className="me-2"
                    style={{
                      color: "#C9A227",
                    }}
                  />
                  Personal Information
                </strong>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {/* FULL NAME */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="full_name"
                      >
                        Full Name
                      </label>

                      {isEditing ? (
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <FaUser
                              style={{
                                color:
                                  "#C9A227",
                              }}
                            />
                          </span>

                          <input
                            id="full_name"
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
                      ) : (
                        <div className="p-3 bg-light rounded">
                          {profile.full_name ||
                            "-"}
                        </div>
                      )}
                    </div>

                    {/* MOBILE */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="mobile"
                      >
                        Mobile Number
                      </label>

                      {isEditing ? (
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <FaPhone
                              style={{
                                color:
                                  "#C9A227",
                              }}
                            />
                          </span>

                          <input
                            id="mobile"
                            type="tel"
                            name="mobile"
                            className="form-control"
                            value={
                              formData.mobile
                            }
                            onChange={
                              handleChange
                            }
                            required
                          />
                        </div>
                      ) : (
                        <div className="p-3 bg-light rounded">
                          {profile.mobile ||
                            "-"}
                        </div>
                      )}
                    </div>

                    {/* EMAIL */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="email"
                      >
                        Email Address
                      </label>

                      {isEditing ? (
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <FaEnvelope
                              style={{
                                color:
                                  "#C9A227",
                              }}
                            />
                          </span>

                          <input
                            id="email"
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
                      ) : (
                        <div className="p-3 bg-light rounded">
                          {profile.email ||
                            "-"}
                        </div>
                      )}
                    </div>

                    {/* ROLE */}

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Role
                      </label>

                      <div className="p-3 bg-light rounded">
                        Field Executive
                      </div>
                    </div>

                    {/* STATUS */}

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Account Status
                      </label>

                      <div className="p-3 bg-light rounded">
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              String(
                                profile.status
                              ).toLowerCase() ===
                              "active"
                                ? "#DFF5E3"
                                : "#F8D7DA",

                            color:
                              String(
                                profile.status
                              ).toLowerCase() ===
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

                    {/* CREATED DATE */}

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Account Created
                      </label>

                      <div className="p-3 bg-light rounded">
                        {formatDate(
                          profile.created_at
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ================================================= */}
                  {/* EDIT ACTIONS */}
                  {/* ================================================= */}

                  {isEditing && (
                    <div className="d-flex justify-content-end gap-2 mt-4 pt-4 border-top">
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
                          color: "#111111",
                          backgroundColor:
                            "#FFFFFF",
                        }}
                      >
                        <FaTimes className="me-2" />
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="btn"
                        disabled={
                          updateLoading
                        }
                        style={{
                          backgroundColor:
                            "#111111",
                          color: "#FFFFFF",
                          border:
                            "1px solid #111111",
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
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* INFORMATION NOTE */}
      {/* ================================================= */}

      <div
        className="alert mt-4"
        style={{
          backgroundColor: "#FFFDF5",
          border: "1px solid #E6D48A",
          color: "#555555",
        }}
      >
        <FaInfoCircle
          className="me-2"
          style={{
            color: "#C9A227",
          }}
        />

        You can update your name, mobile number and
        email address. Your role and account status are
        managed by the administrator.
      </div>
    </div>
  );
};

export default FieldExecutiveProfile;

