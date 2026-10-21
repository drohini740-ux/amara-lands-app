
import { useEffect, useState } from "react";
import api from "../../../services/api";

const API_BASE_URL = "http://localhost:4000";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pageError, setPageError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setPageError("");

    try {
      const res = await api.get("/users/profile");
      const user = res.data?.user;

      if (!user) {
        throw new Error("Profile information was not returned by the server.");
      }

      setProfile(user);
      setFormData({
        full_name: user.full_name || "",
        mobile: user.mobile || "",
      });
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!formData.full_name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!formData.mobile.trim()) {
      alert("Please enter your mobile number.");
      return;
    }

    setSaving(true);

    try {
      await api.put("/users/profile", {
        full_name: formData.full_name.trim(),
        mobile: formData.mobile.trim(),
        email: profile.email,
      });

      alert("Profile updated successfully.");
      setEditing(false);
      await fetchProfile();
    } catch (error) {
      alert(
        error.response?.data?.message || "Profile update failed."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } =
      passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      alert("Your new password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const res = await api.put("/users/change-password", passwordData);

      alert(res.data?.message || "Password changed successfully.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.message || "Password change failed."
      );
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    const uploadData = new FormData();
    uploadData.append("profile", file);

    setUploading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/users/profile/upload`,
        {
          method: "POST",
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
          body: uploadData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Profile image upload failed.");
      }

      alert(result.message || "Profile image uploaded successfully.");
      await fetchProfile();
    } catch (error) {
      alert(error.message || "Unable to upload your profile image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const imageUrl = profile.profile_image
    ? `${API_BASE_URL}${profile.profile_image}${
        profile.profile_image.includes("?") ? "&" : "?"
      }t=${encodeURIComponent(profile.updated_at || profile.created_at || "")}`
    : "";

  if (loading) {
    return (
      <div className="container-fluid p-4 text-center">
        <div
          className="spinner-border"
          style={{ color: "#D4AF37" }}
          role="status"
        >
          <span className="visually-hidden">Loading profile...</span>
        </div>
        <p className="text-muted mt-3">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3 p-md-4 customer-profile">
      <style>{`
        .customer-profile {
          color: #171717;
        }

        .profile-heading {
          font-weight: 750;
          color: #111111;
          letter-spacing: -0.5px;
        }

        .profile-subtitle {
          color: #777777;
          font-size: 14px;
        }

        .profile-gold-line {
          width: 58px;
          height: 4px;
          background: #D4AF37;
          border-radius: 5px;
          margin-top: 12px;
        }

        .profile-panel {
          background: #FFFFFF;
          border: 1px solid #eeeeee;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .profile-panel-heading {
          background: #111111;
          color: #FFFFFF;
          padding: 17px 22px;
          border-bottom: 3px solid #D4AF37;
        }

        .profile-panel-heading h5 {
          font-weight: 700;
          margin: 0;
        }

        .profile-avatar {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #D4AF37;
          padding: 3px;
          background: #FFFFFF;
        }

        .profile-upload {
          font-size: 12px;
        }

        .profile-role {
          display: inline-block;
          border-radius: 20px;
          background: #fff4d6;
          color: #856404;
          border: 1px solid #efd88a;
          padding: 6px 13px;
          font-size: 12px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .profile-info-table th {
          width: 35%;
          color: #555555;
          font-weight: 650;
          font-size: 13px;
          padding: 17px 14px;
          background: #fafafa;
        }

        .profile-info-table td {
          color: #222222;
          font-size: 13px;
          padding: 17px 14px;
          overflow-wrap: anywhere;
        }

        .profile-info-table tr {
          border-bottom: 1px solid #eeeeee;
        }

        .profile-input {
          border: 1px solid #dddddd;
          border-radius: 8px;
          padding: 10px 12px;
        }

        .profile-input:focus {
          border-color: #D4AF37;
          box-shadow: 0 0 0 0.2rem rgba(212, 175, 55, 0.18);
        }

        .btn-profile-gold {
          background: #D4AF37;
          border: 1px solid #D4AF37;
          color: #111111;
          font-weight: 700;
        }

        .btn-profile-gold:hover {
          background: #bd9825;
          border-color: #bd9825;
          color: #111111;
        }

        .btn-profile-dark {
          background: #111111;
          color: #FFFFFF;
          border: 1px solid #111111;
          font-weight: 600;
        }

        .btn-profile-dark:hover {
          background: #333333;
          color: #FFFFFF;
        }

        .profile-status {
          display: inline-block;
          padding: 5px 11px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: capitalize;
          background: #e8f5e9;
          color: #23743b;
        }

        @media (max-width: 576px) {
          .profile-info-table th,
          .profile-info-table td {
            padding: 12px 9px;
            font-size: 12px;
          }

          .profile-info-table th {
            width: 32%;
          }
        }
      `}</style>

      <div className="mb-4">
        <p
          className="text-uppercase fw-bold mb-2"
          style={{
            color: "#A78319",
            fontSize: 11,
            letterSpacing: "1.8px",
          }}
        >
          AMARA LANDS
        </p>

        <h2 className="profile-heading mb-2">My Profile</h2>
        <p className="profile-subtitle mb-0">
          Manage your personal information and account security.
        </p>
        <div className="profile-gold-line" />
      </div>

      {pageError && (
        <div className="alert alert-danger" role="alert">
          {pageError}
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchProfile}
          >
            Retry
          </button>
        </div>
      )}

      <div className="profile-panel mb-4">
        <div className="profile-panel-heading">
          <h5>Personal Information</h5>
        </div>

        <div className="p-3 p-md-4">
          <div className="row g-4">
            <div className="col-12 col-lg-4">
              <div className="text-center p-3">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Profile"
                    className="profile-avatar mb-3"
                  />
                ) : (
                  <div
                    className="profile-avatar mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      background: "#111111",
                      color: "#D4AF37",
                      fontSize: 48,
                    }}
                  >
                    {(profile.full_name || "U")
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <h5 className="fw-bold mb-2">
                  {profile.full_name || "Customer"}
                </h5>

                <span className="profile-role">
                  {profile.role || "Customer"}
                </span>

                <div className="mt-4 text-start">
                  <label className="form-label fw-semibold small">
                    Update Profile Photo
                  </label>

                  <input
                    type="file"
                    className="form-control profile-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />

                  <small className="text-muted d-block mt-2">
                    Image files only. Maximum size: 5 MB.
                  </small>

                  {uploading && (
                    <p className="small mt-2 mb-0">
                      Uploading image...
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-8">
              <div className="table-responsive">
                <table className="table profile-info-table mb-4">
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <td>
                        {editing ? (
                          <input
                            type="text"
                            name="full_name"
                            className="form-control profile-input"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                          />
                        ) : (
                          profile.full_name || "—"
                        )}
                      </td>
                    </tr>

                    <tr>
                      <th>Email</th>
                      <td>{profile.email || "—"}</td>
                    </tr>

                    <tr>
                      <th>Mobile</th>
                      <td>
                        {editing ? (
                          <input
                            type="tel"
                            name="mobile"
                            className="form-control profile-input"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                          />
                        ) : (
                          profile.mobile || "—"
                        )}
                      </td>
                    </tr>

                    <tr>
                      <th>Account Status</th>
                      <td>
                        <span className="profile-status">
                          {profile.status || "Unknown"}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <th>Member Since</th>
                      <td>
                        {profile.created_at
                          ? new Date(
                              profile.created_at
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {!editing ? (
                <button
                  type="button"
                  className="btn btn-profile-gold px-4"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-profile-gold px-4 me-2 mb-2"
                    onClick={handleUpdate}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 mb-2"
                    onClick={() => {
                      setFormData({
                        full_name: profile.full_name || "",
                        mobile: profile.mobile || "",
                      });
                      setEditing(false);
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-panel">
        <div className="profile-panel-heading">
          <h5>Change Password</h5>
        </div>

        <div className="p-3 p-md-4">
          <p className="profile-subtitle mb-4">
            Use a strong password of at least 8 characters to help protect
            your account.
          </p>

          <form onSubmit={handleChangePassword}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Current Password
                </label>
                <input
                  type="password"
                  className="form-control profile-input"
                  name="currentPassword"
                  autoComplete="current-password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control profile-input"
                  name="newPassword"
                  autoComplete="new-password"
                  minLength={8}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="form-control profile-input"
                  name="confirmPassword"
                  autoComplete="new-password"
                  minLength={8}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-profile-dark mt-4 px-4"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
