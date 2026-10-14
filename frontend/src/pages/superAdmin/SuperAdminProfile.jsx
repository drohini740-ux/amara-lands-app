
import React, { useEffect, useState } from "react";
import api from "../../services/api";

const SuperAdminProfile = () => {
  const [user, setUser] = useState({
    id: "",
    full_name: "",
    email: "",
    mobile: "",
    role: "super_admin",
    status: "active",
    profile_image: "",
    created_at: "",
  });

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    mobile: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOAD SUPER ADMIN PROFILE
  // GET /api/v1/super-admin/profile
  // =====================================================

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/super-admin/profile");

      // Supports the response format used by the backend.
      const profile =
        response.data.data || response.data.user;

      if (!profile) {
        throw new Error("Profile data was not returned.");
      }

      setUser((previous) => ({ ...previous, ...profile }));

      setForm({
        full_name: profile.full_name || "",
        email: profile.email || "",
        mobile: profile.mobile || "",
      });

      // Update cached user details, if your app stores them.
      for (const key of ["user", "userInfo"]) {
        try {
          const stored = JSON.parse(
            localStorage.getItem(key) || "null"
          );

          if (
            stored &&
            String(stored.id) === String(profile.id)
          ) {
            localStorage.setItem(
              key,
              JSON.stringify({ ...stored, ...profile })
            );
          }
        } catch {
          // Ignore invalid optional cached data.
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // SAVE PROFILE
  // PUT /api/v1/super-admin/profile
  // =====================================================

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    if (
      !form.full_name.trim() ||
      !form.email.trim() ||
      !form.mobile.trim()
    ) {
      setError(
        "Please enter your full name, email, and mobile number."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put(
        "/super-admin/profile",
        {
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          mobile: form.mobile.trim(),
        }
      );

      const updatedUser =
        response.data.data || response.data.user;

      if (!updatedUser) {
        throw new Error("Updated profile was not returned.");
      }

      setUser((previous) => ({
        ...previous,
        ...updatedUser,
      }));

      setForm({
        full_name: updatedUser.full_name || "",
        email: updatedUser.email || "",
        mobile: updatedUser.mobile || "",
      });

      // Synchronize the cached login details.
      for (const key of ["user", "userInfo"]) {
        try {
          const stored = JSON.parse(
            localStorage.getItem(key) || "null"
          );

          if (
            stored &&
            String(stored.id) === String(updatedUser.id)
          ) {
            localStorage.setItem(
              key,
              JSON.stringify({ ...stored, ...updatedUser })
            );
          }
        } catch {
          // Ignore optional cached data errors.
        }
      }

      setEditing(false);
      setSuccess(
        response.data.message ||
          "Super Admin profile updated successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // PROFILE IMAGE UPLOAD
  // Uses existing customer upload endpoint.
  // =====================================================

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("profile", file);

      const response = await api.post(
        "/users/profile/upload",
        formData
      );

      const updatedUser =
        response.data.user || {};

      setUser((previous) => ({
        ...previous,
        ...updatedUser,
        profile_image:
          response.data.profile_image ||
          updatedUser.profile_image ||
          previous.profile_image,
      }));

      setSuccess(
        response.data.message ||
          "Profile picture updated successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to upload your profile picture."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  // =====================================================
  // CHANGE PASSWORD
  // Uses existing customer password endpoint.
  // =====================================================

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordForm;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Your new password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirmation do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);
      setError("");
      setSuccess("");

      const response = await api.put(
        "/users/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        }
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordForm(false);

      setSuccess(
        response.data.message ||
          "Password changed successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to change your password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const initials = (user.full_name || "Super Admin")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (/^https?:\/\//i.test(imagePath)) {
      return imagePath;
    }

    const baseURL = (
      api.defaults.baseURL ||
      "http://localhost:4000/api/v1"
    )
      .replace(/\/api\/v1\/?$/, "")
      .replace(/\/$/, "");

    return `${baseURL}${
      imagePath.startsWith("/") ? "" : "/"
    }${imagePath}`;
  };

  const handleImageError = (event) => {
    event.currentTarget.style.display = "none";
  };

  if (loading) {
    return (
      <div className="super-profile-page">
        <style>{profileStyles}</style>
        <div className="profile-loading">
          Loading your Super Admin profile...
        </div>
      </div>
    );
  }

  return (
    <div className="super-profile-page">
      <style>{profileStyles}</style>

      {/* PAGE HEADER */}
      <div className="profile-header">
        <div>
          <span className="profile-eyebrow">
            AMARA LANDS · SUPER ADMIN
          </span>
          <h1>My Profile</h1>
          <p>
            Manage your personal information and account security.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            className="gold-button"
            onClick={() => {
              setEditing(true);
              setError("");
              setSuccess("");
            }}
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="profile-message error" role="alert">
          {error}
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="profile-message success" role="status">
          {success}
        </div>
      )}

      <div className="profile-layout">
        {/* PROFILE IDENTITY */}
        <section className="profile-card identity-card">
          <div className="avatar">
            {user.profile_image ? (
              <img
                src={getImageUrl(user.profile_image)}
                alt="Super Admin profile"
                onError={handleImageError}
              />
            ) : (
              initials
            )}
          </div>

          <h2>{user.full_name || "Super Admin"}</h2>

          <p className="identity-role">
            Super Administrator
          </p>

          <span
            className={`status-pill ${
              String(user.status).toLowerCase() === "active"
                ? "active"
                : "inactive"
            }`}
          >
            {user.status || "Unknown"}
          </span>

          <label className="upload-button">
            {uploading
              ? "Uploading..."
              : "Change Profile Picture"}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              hidden
            />
          </label>

          <div className="identity-divider" />

          <div className="identity-detail">
            <span>Role</span>
            <strong>{user.role || "super_admin"}</strong>
          </div>

          <div className="identity-detail">
            <span>Account ID</span>
            <strong>{user.id || "—"}</strong>
          </div>

          <div className="identity-detail">
            <span>Joined</span>
            <strong>
              {user.created_at
                ? new Date(
                    user.created_at
                  ).toLocaleDateString()
                : "—"}
            </strong>
          </div>
        </section>

        {/* PERSONAL INFORMATION */}
        <section className="profile-card details-card">
          <div className="section-heading">
            <div>
              <h2>Personal Information</h2>
              <p>
                View and update your account information.
              </p>
            </div>
            <span className="gold-line" />
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className="profile-form">
              <div className="form-field">
                <label htmlFor="super-full-name">
                  Full Name
                </label>
                <input
                  id="super-full-name"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleFormChange}
                  disabled={!editing || saving}
                  maxLength={150}
                  autoComplete="name"
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-field">
                <label htmlFor="super-email">
                  Email Address
                </label>
                <input
                  id="super-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  disabled={!editing || saving}
                  maxLength={254}
                  autoComplete="email"
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-field">
                <label htmlFor="super-mobile">
                  Mobile Number
                </label>
                <input
                  id="super-mobile"
                  name="mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={handleFormChange}
                  disabled={!editing || saving}
                  maxLength={20}
                  autoComplete="tel"
                  required
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="form-field">
                <label htmlFor="super-role">
                  Account Role
                </label>
                <input
                  id="super-role"
                  value={user.role || "super_admin"}
                  disabled
                />
              </div>
            </div>

            {editing && (
              <div className="profile-actions">
                <button
                  type="button"
                  className="secondary-button"
                  disabled={saving}
                  onClick={() => {
                    setForm({
                      full_name: user.full_name || "",
                      email: user.email || "",
                      mobile: user.mobile || "",
                    });
                    setEditing(false);
                    setError("");
                    setSuccess("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="gold-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </section>

        {/* ACCOUNT SECURITY */}
        <section className="profile-card security-card">
          <div className="security-icon">◆</div>

          <div className="security-copy">
            <h2>Account Security</h2>
            <p>
              Update your password to help protect your
              Super Admin account.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setShowPasswordForm((previous) => !previous);
              setError("");
              setSuccess("");
            }}
          >
            {showPasswordForm
              ? "Cancel"
              : "Change Password"}
          </button>

          {showPasswordForm && (
            <form
              className="password-form"
              onSubmit={handlePasswordChange}
            >
              <div className="form-field password-current">
                <label htmlFor="super-current-password">
                  Current Password
                </label>
                <input
                  id="super-current-password"
                  type="password"
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((previous) => ({
                      ...previous,
                      currentPassword: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="super-new-password">
                  New Password
                </label>
                <input
                  id="super-new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((previous) => ({
                      ...previous,
                      newPassword: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="super-confirm-password">
                  Confirm New Password
                </label>
                <input
                  id="super-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((previous) => ({
                      ...previous,
                      confirmPassword: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="gold-button"
                disabled={changingPassword}
              >
                {changingPassword
                  ? "Updating..."
                  : "Update Password"}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

const profileStyles = `
.super-profile-page {
  min-height: 100%;
  box-sizing: border-box;
  padding: 30px;
  background: #f7f7f5;
  color: #171717;
  font-family: Arial, sans-serif;
}

.super-profile-page * {
  box-sizing: border-box;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
}

.profile-eyebrow {
  color: #a78317;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
}

.profile-header h1 {
  margin: 9px 0;
  font-size: 30px;
}

.profile-header p,
.section-heading p {
  color: #777;
  font-size: 14px;
  margin: 0;
  line-height: 1.6;
}

.profile-layout {
  display: grid;
  grid-template-columns: minmax(230px, 0.8fr) minmax(0, 2fr);
  gap: 22px;
}

.profile-card {
  min-width: 0;
  background: #fff;
  border: 1px solid #e9e6dc;
  border-radius: 14px;
  padding: 26px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.035);
}

.identity-card {
  text-align: center;
}

.avatar {
  width: 96px;
  height: 96px;
  margin: 4px auto 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #171717;
  border: 4px solid #d2b24c;
  color: #f1d77d;
  font-size: 30px;
  font-weight: 700;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.identity-card h2 {
  font-size: 19px;
  margin: 0 0 7px;
  overflow-wrap: anywhere;
}

.identity-role {
  font-size: 13px;
  color: #777;
  margin: 0 0 15px;
}

.status-pill {
  display: inline-block;
  padding: 6px 13px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}

.status-pill.active {
  background: #e7f5e9;
  color: #26743b;
}

.status-pill.inactive {
  background: #fce8e6;
  color: #a32d25;
}

.upload-button {
  display: block;
  margin: 18px auto 0;
  color: #8b6b0d;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.upload-button:hover {
  text-decoration: underline;
}

.identity-divider {
  height: 1px;
  background: #eee;
  margin: 24px 0;
}

.identity-detail {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  text-align: left;
  font-size: 13px;
}

.identity-detail span {
  color: #777;
}

.identity-detail strong {
  overflow-wrap: anywhere;
  text-align: right;
}

.details-card {
  min-width: 0;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 28px;
}

.section-heading h2,
.security-copy h2 {
  margin: 0 0 8px;
  font-size: 19px;
}

.gold-line {
  width: 45px;
  height: 3px;
  background: #c9a227;
  border-radius: 3px;
  flex-shrink: 0;
}

.profile-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
}

.form-field label {
  font-size: 13px;
  font-weight: 700;
}

.form-field input {
  width: 100%;
  min-width: 0;
  padding: 12px 13px;
  border: 1px solid #dedede;
  border-radius: 7px;
  font-size: 14px;
  background: #fff;
  color: #222;
}

.form-field input:disabled {
  background: #f7f7f7;
  color: #555;
}

.form-field input:focus {
  outline: 2px solid #e6d69e;
  border-color: #c9a227;
}

.gold-button,
.secondary-button {
  border-radius: 7px;
  padding: 12px 18px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.gold-button {
  background: #c9a227;
  color: #171717;
  border: 1px solid #c9a227;
}

.gold-button:hover {
  background: #b28c15;
}

.secondary-button {
  background: #fff;
  border: 1px solid #d7d7d7;
  color: #222;
}

.secondary-button:hover {
  border-color: #c9a227;
}

.gold-button:disabled,
.secondary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 26px;
}

.security-card {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
}

.security-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #171717;
  color: #d8b744;
}

.security-copy {
  flex: 1;
  min-width: 180px;
}

.security-copy p {
  color: #777;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}

.password-form {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  padding-top: 12px;
}

.password-current {
  grid-column: 1 / -1;
}

.password-form > button {
  justify-self: start;
}

.profile-message {
  margin-bottom: 18px;
  padding: 13px 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.profile-message.error {
  color: #922c25;
  background: #fce8e6;
}

.profile-message.success {
  color: #72530b;
  background: #fff5d8;
}

.profile-loading {
  padding: 50px;
  text-align: center;
}

@media (max-width: 800px) {
  .super-profile-page {
    padding: 18px;
  }

  .profile-layout {
    grid-template-columns: 1fr;
  }

  .security-card {
    grid-column: auto;
  }
}

@media (max-width: 520px) {
  .profile-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .profile-form,
  .password-form {
    grid-template-columns: 1fr;
  }

  .password-current {
    grid-column: auto;
  }

  .profile-card {
    padding: 20px;
  }

  .security-card .secondary-button {
    width: 100%;
  }
}
`;

export default SuperAdminProfile;
