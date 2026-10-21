
import React, { useEffect, useState } from "react";
import api from "../../services/api";

const LegalTeamProfile = () => {
  const [user, setUser] = useState(null);

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

  // Load logged-in Legal Team profile
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/profile");
      const profile = response.data.user || response.data;

      setUser(profile);

      setForm({
        full_name: profile.full_name || "",
        email: profile.email || "",
        mobile: profile.mobile || "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your profile. Please check your login."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Handle personal information input
  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save personal information
  const handleSaveProfile = async (event) => {
    event.preventDefault();

    if (
      !form.full_name.trim() ||
      !form.email.trim() ||
      !form.mobile.trim()
    ) {
      setError("Please fill in your name, email, and mobile number.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put("/users/profile", {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
      });

      const updatedUser = response.data.user || response.data;

      setUser((previous) => ({
        ...previous,
        ...updatedUser,
      }));

      setForm({
        full_name: updatedUser.full_name || form.full_name.trim(),
        email: updatedUser.email || form.email.trim(),
        mobile: updatedUser.mobile || form.mobile.trim(),
      });

      setEditing(false);

      setSuccess(
        response.data.message || "Profile updated successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // Upload Legal Team profile picture
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, WEBP, or GIF image.");
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

      const formData = new FormData();
      formData.append("profile", file);

      const response = await api.post(
        "/users/profile/upload",
        formData
      );

      const updatedUser = response.data.user || {};
      const updatedImage =
        response.data.profile_image ||
        updatedUser.profile_image;

      setUser((previous) => ({
        ...previous,
        ...updatedUser,
        profile_image:
          updatedImage || previous?.profile_image || "",
      }));

      if (!updatedImage) {
        throw new Error(
          "The server did not return the saved profile picture path."
        );
      }

      setSuccess(
        response.data.message ||
          "Profile picture updated successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to upload your profile picture."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  // Change Legal Team account password
  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setError("Please fill in all password fields.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setChangingPassword(true);
      setError("");
      setSuccess("");

      const response = await api.put(
        "/users/change-password",
        passwordForm
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordForm(false);

      setSuccess(
        response.data.message || "Password changed successfully."
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

  // Build image URL from the saved backend image path
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (/^https?:\/\//i.test(imagePath)) {
      return imagePath;
    }

    const baseURL = (
      api.defaults.baseURL || "http://localhost:4000/api/v1"
    )
      .replace(/\/api\/v1\/?$/, "")
      .replace(/\/$/, "");

    return `${baseURL}${
      imagePath.startsWith("/") ? "" : "/"
    }${imagePath}`;
  };

  // Create initials for the profile avatar
  const initials = (user?.full_name || "Legal Team")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (loading) {
    return (
      <div className="legal-profile-page">
        <style>{profileStyles}</style>
        <div className="profile-loading">
          Loading your profile...
        </div>
      </div>
    );
  }

  return (
    <div className="legal-profile-page">
      <style>{profileStyles}</style>

      {/* HEADER */}
      <div className="profile-header">
        <div>
          <span className="profile-eyebrow">
            AMARA LANDS · LEGAL TEAM
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your personal information and account security.
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={loadProfile}
            disabled={loading}
          >
            Refresh
          </button>

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
      </div>

      {/* SUCCESS AND ERROR MESSAGES */}
      {error && (
        <div className="profile-message error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="profile-message success" role="status">
          {success}
        </div>
      )}

      {user && (
        <div className="profile-layout">
          {/* PROFILE CARD */}
          <section className="profile-card identity-card">
            <div className="avatar">
              {user.profile_image ? (
                <img
                  key={user.profile_image}
                  src={getImageUrl(user.profile_image)}
                  alt="Legal Team profile"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                initials
              )}
            </div>

            <h2>{user.full_name || "Legal Team Member"}</h2>

            <p className="identity-role">Legal Team</p>

            <span
              className={`status-pill ${
                String(user.status).toLowerCase() === "active"
                  ? "active"
                  : "inactive"
              }`}
            >
              {user.status || "Unknown"}
            </span>

            {/* PROFILE PICTURE UPLOAD */}
            <label
              className={`upload-button ${
                uploading ? "upload-disabled" : ""
              }`}
            >
              {uploading
                ? "Uploading picture..."
                : "Change Profile Picture"}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                disabled={uploading}
                hidden
              />
            </label>

            <p className="upload-hint">
              JPG, PNG, WEBP, or GIF · Maximum 5 MB
            </p>

            <div className="identity-divider" />

            <div className="identity-detail">
              <span>Role</span>
              <strong>Legal Team</strong>
            </div>

            <div className="identity-detail">
              <span>Account ID</span>
              <strong>{user.id || "—"}</strong>
            </div>

            <div className="identity-detail">
              <span>Joined</span>
              <strong>
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString(
                      "en-IN"
                    )
                  : "—"}
              </strong>
            </div>
          </section>

          {/* PERSONAL INFORMATION */}
          <section className="profile-card details-card">
            <div className="section-heading">
              <div>
                <h2>Personal Information</h2>
                <p>Update your contact information.</p>
              </div>

              <span className="gold-line" />
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="profile-form">
                <div className="form-field">
                  <label htmlFor="legal-full-name">
                    Full Name
                  </label>

                  <input
                    id="legal-full-name"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleFormChange}
                    disabled={!editing || saving}
                    required
                    maxLength={150}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="legal-email">
                    Email Address
                  </label>

                  <input
                    id="legal-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleFormChange}
                    disabled={!editing || saving}
                    required
                    maxLength={254}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="legal-mobile">
                    Mobile Number
                  </label>

                  <input
                    id="legal-mobile"
                    name="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={handleFormChange}
                    disabled={!editing || saving}
                    required
                    maxLength={20}
                    placeholder="Enter your mobile number"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="legal-role">
                    Account Role
                  </label>

                  <input
                    id="legal-role"
                    value="Legal Team"
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
                Change your password regularly to help keep your
                account secure.
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
                ? "Close Password Form"
                : "Change Password"}
            </button>

            {showPasswordForm && (
              <form
                className="password-form"
                onSubmit={handlePasswordChange}
              >
                <div className="form-field full-width">
                  <label htmlFor="legal-current-password">
                    Current Password
                  </label>

                  <input
                    id="legal-current-password"
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
                  <label htmlFor="legal-new-password">
                    New Password
                  </label>

                  <input
                    id="legal-new-password"
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
                  <label htmlFor="legal-confirm-password">
                    Confirm New Password
                  </label>

                  <input
                    id="legal-confirm-password"
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
                  className="gold-button password-submit"
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
      )}
    </div>
  );
};

const profileStyles = `
.legal-profile-page {
  min-height: 100%;
  box-sizing: border-box;
  padding: 30px;
  background: #f7f7f5;
  color: #171717;
  font-family: Arial, sans-serif;
}
.legal-profile-page * {
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
.profile-header p, .section-heading p {
  color: #777;
  font-size: 14px;
  margin: 0;
  line-height: 1.6;
}
.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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
.upload-disabled {
  opacity: 0.6;
  cursor: wait;
}
.upload-hint {
  margin: 8px 0 0;
  color: #888;
  font-size: 11px;
  line-height: 1.5;
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
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 28px;
}
.section-heading h2, .security-copy h2 {
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
.gold-button, .secondary-button {
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
.gold-button:disabled, .secondary-button:disabled {
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
.password-form .full-width {
  grid-column: 1 / -1;
}
.password-submit {
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
  .legal-profile-page { padding: 18px; }
  .profile-layout { grid-template-columns: 1fr; }
  .security-card { grid-column: auto; }
}
@media (max-width: 520px) {
  .profile-header {
    align-items: flex-start;
    flex-direction: column;
  }
  .profile-form, .password-form {
    grid-template-columns: 1fr;
  }
  .password-form .full-width {
    grid-column: auto;
  }
  .profile-card { padding: 20px; }
  .security-card .secondary-button { width: 100%; }
}
`;

export default LegalTeamProfile;
