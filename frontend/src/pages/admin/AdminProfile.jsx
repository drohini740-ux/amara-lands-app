
import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminProfile() {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    mobile: "",
  });
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/profile");
      const profile = response.data.user;

      setUser(profile);
      setForm({
        full_name: profile.full_name || "",
        email: profile.email || "",
        mobile: profile.mobile || "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.full_name.trim() || !form.email.trim() || !form.mobile.trim()) {
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

      const updatedUser = response.data.user;

      setUser((previous) => ({ ...previous, ...updatedUser }));
      setForm({
        full_name: updatedUser.full_name || "",
        email: updatedUser.email || "",
        mobile: updatedUser.mobile || "",
      });

      setEditing(false);
      setSuccess(response.data.message || "Profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update your profile. Check whether the email or mobile is already registered."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setError("Choose a JPG, PNG, WEBP, or GIF image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const data = new FormData();
      data.append("profile", file);

      const response = await api.post("/users/profile/upload", data);
      const updatedUser = response.data.user || {};

      setUser((previous) => ({
        ...previous,
        ...updatedUser,
        profile_image: response.data.profile_image || updatedUser.profile_image,
      }));

      setSuccess(response.data.message || "Profile picture updated.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to upload the profile picture."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (
      !password.currentPassword ||
      !password.newPassword ||
      !password.confirmPassword
    ) {
      setError("Please fill in all password fields.");
      return;
    }

    if (password.newPassword.length < 8) {
      setError("The new password must contain at least 8 characters.");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      setError("The new password and confirmation do not match.");
      return;
    }

    try {
      setChangingPassword(true);
      setError("");
      setSuccess("");

      const response = await api.put("/users/change-password", password);

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      setSuccess(response.data.message || "Password changed successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to change your password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const imageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (/^https?:\/\//i.test(imagePath)) return imagePath;

    const base = (api.defaults.baseURL || "http://localhost:4000/api/v1")
      .replace(/\/api\/v1\/?$/, "")
      .replace(/\/$/, "");

    return `${base}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  const initials = (user.full_name || "Admin")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (loading) {
    return (
      <div className="admin-profile-page">
        <style>{styles}</style>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="admin-profile-page">
      <style>{styles}</style>

      <header className="ap-header">
        <div>
          <span className="ap-eyebrow">AMARA LANDS · ADMINISTRATION</span>
          <h1>My Profile</h1>
          <p>Manage your personal information and account security.</p>
        </div>

        {!editing && (
          <button
            className="ap-gold"
            onClick={() => {
              setEditing(true);
              setError("");
              setSuccess("");
            }}
          >
            Edit Profile
          </button>
        )}
      </header>

      {error && <div className="ap-message ap-error" role="alert">{error}</div>}
      {success && <div className="ap-message ap-success" role="status">{success}</div>}

      <div className="ap-grid">
        <section className="ap-card ap-identity">
          <div className="ap-avatar">
            {user.profile_image ? (
              <img
                src={imageUrl(user.profile_image)}
                alt="Admin profile"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              initials
            )}
          </div>

          <h2>{user.full_name || "Admin User"}</h2>
          <p className="ap-muted">{user.role || "admin"}</p>

          <span
            className={`ap-status ${
              String(user.status).toLowerCase() === "active"
                ? "ap-active"
                : "ap-inactive"
            }`}
          >
            {user.status || "Unknown"}
          </span>

          <label className="ap-upload">
            {uploading ? "Uploading..." : "Change Profile Picture"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleUpload}
              disabled={uploading}
              hidden
            />
          </label>

          <hr />

          <div className="ap-detail">
            <span>Account ID</span>
            <strong>{user.id ?? "—"}</strong>
          </div>
          <div className="ap-detail">
            <span>Joined</span>
            <strong>
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "—"}
            </strong>
          </div>
        </section>

        <section className="ap-card">
          <div className="ap-section-title">
            <div>
              <h2>Personal Information</h2>
              <p>Update your contact details.</p>
            </div>
            <span className="ap-line" />
          </div>

          <form onSubmit={handleSave}>
            <div className="ap-form-grid">
              <div className="ap-field">
                <label htmlFor="admin-full-name">Full Name</label>
                <input
                  id="admin-full-name"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  disabled={!editing || saving}
                  maxLength={150}
                  required
                />
              </div>

              <div className="ap-field">
                <label htmlFor="admin-email">Email Address</label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!editing || saving}
                  maxLength={254}
                  required
                />
              </div>

              <div className="ap-field">
                <label htmlFor="admin-mobile">Mobile Number</label>
                <input
                  id="admin-mobile"
                  name="mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={handleChange}
                  disabled={!editing || saving}
                  maxLength={20}
                  required
                />
              </div>

              <div className="ap-field">
                <label htmlFor="admin-role">Account Role</label>
                <input
                  id="admin-role"
                  value={user.role || "admin"}
                  disabled
                  readOnly
                />
              </div>
            </div>

            {editing && (
              <div className="ap-actions">
                <button
                  type="button"
                  className="ap-secondary"
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
                <button type="submit" className="ap-gold" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </section>

        <section className="ap-card ap-security">
          <div className="ap-security-icon">◆</div>
          <div className="ap-security-copy">
            <h2>Account Security</h2>
            <p>Change your password to help protect your account.</p>
          </div>
          <button
            className="ap-secondary"
            onClick={() => {
              setShowPasswordForm((previous) => !previous);
              setError("");
              setSuccess("");
            }}
          >
            {showPasswordForm ? "Cancel" : "Change Password"}
          </button>

          {showPasswordForm && (
            <form className="ap-password-form" onSubmit={handlePasswordChange}>
              <div className="ap-field">
                <label htmlFor="admin-current-password">Current Password</label>
                <input
                  id="admin-current-password"
                  type="password"
                  autoComplete="current-password"
                  value={password.currentPassword}
                  onChange={(event) =>
                    setPassword((previous) => ({
                      ...previous,
                      currentPassword: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="ap-field">
                <label htmlFor="admin-new-password">New Password</label>
                <input
                  id="admin-new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={password.newPassword}
                  onChange={(event) =>
                    setPassword((previous) => ({
                      ...previous,
                      newPassword: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="ap-field">
                <label htmlFor="admin-confirm-password">Confirm New Password</label>
                <input
                  id="admin-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={password.confirmPassword}
                  onChange={(event) =>
                    setPassword((previous) => ({
                      ...previous,
                      confirmPassword: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <button type="submit" className="ap-gold" disabled={changingPassword}>
                {changingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

const styles = `
.admin-profile-page {
  min-height: 100%;
  padding: 30px;
  background: #f7f7f5;
  color: #171717;
  font-family: Arial, sans-serif;
}
.admin-profile-page * { box-sizing: border-box; }
.ap-header {
  display: flex; justify-content: space-between; align-items: center;
  gap: 20px; margin-bottom: 28px;
}
.ap-eyebrow {
  color: #a78317; font-size: 11px; font-weight: 800; letter-spacing: 2px;
}
.ap-header h1 { margin: 9px 0; font-size: 30px; }
.ap-header p, .ap-section-title p, .ap-security-copy p {
  color: #777; font-size: 14px; margin: 0; line-height: 1.6;
}
.ap-grid {
  display: grid;
  grid-template-columns: minmax(230px, .8fr) minmax(0, 2fr);
  gap: 22px;
}
.ap-card {
  min-width: 0; padding: 26px; background: #fff;
  border: 1px solid #e9e6dc; border-radius: 14px;
  box-shadow: 0 5px 20px rgba(0,0,0,.035);
}
.ap-identity { text-align: center; }
.ap-avatar {
  width: 96px; height: 96px; margin: 4px auto 18px;
  border-radius: 50%; display: flex; align-items: center;
  justify-content: center; background: #171717; border: 4px solid #d2b24c;
  color: #f1d77d; font-size: 30px; font-weight: 700; overflow: hidden;
}
.ap-avatar img { width: 100%; height: 100%; object-fit: cover; }
.ap-identity h2 { font-size: 19px; margin: 0 0 7px; overflow-wrap: anywhere; }
.ap-muted { color: #777; font-size: 13px; }
.ap-status { display: inline-block; padding: 6px 13px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.ap-active { background: #e7f5e9; color: #26743b; }
.ap-inactive { background: #fce8e6; color: #a32d25; }
.ap-upload { display: block; margin: 18px auto; color: #8b6b0d; font-size: 12px; font-weight: 700; cursor: pointer; }
.ap-detail { display: flex; justify-content: space-between; gap: 12px; margin-top: 16px; font-size: 13px; text-align: left; }
.ap-detail span { color: #777; }
.ap-detail strong { overflow-wrap: anywhere; text-align: right; }
.ap-section-title { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-bottom: 28px; }
.ap-section-title h2, .ap-security-copy h2 { margin: 0 0 8px; font-size: 19px; }
.ap-line { width: 45px; height: 3px; background: #c9a227; border-radius: 3px; flex-shrink: 0; }
.ap-form-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 22px; }
.ap-field { display: flex; flex-direction: column; gap: 9px; min-width: 0; }
.ap-field label { font-size: 13px; font-weight: 700; }
.ap-field input {
  width: 100%; min-width: 0; padding: 12px 13px;
  border: 1px solid #dedede; border-radius: 7px; font-size: 14px;
  background: #fff; color: #222;
}
.ap-field input:disabled { background: #f7f7f7; color: #555; }
.ap-field input:focus { outline: 2px solid #e6d69e; border-color: #c9a227; }
.ap-gold, .ap-secondary {
  border-radius: 7px; padding: 12px 18px; font-size: 13px;
  font-weight: 700; cursor: pointer; transition: .2s;
}
.ap-gold { background: #c9a227; color: #171717; border: 1px solid #c9a227; }
.ap-gold:hover { background: #b28c15; }
.ap-secondary { background: #fff; border: 1px solid #d7d7d7; color: #222; }
.ap-secondary:hover { border-color: #c9a227; }
.ap-gold:disabled, .ap-secondary:disabled { opacity: .6; cursor: not-allowed; }
.ap-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 26px; }
.ap-security { grid-column: 1 / -1; display: flex; align-items: center; flex-wrap: wrap; gap: 18px; }
.ap-security-icon {
  width: 48px; height: 48px; flex-shrink: 0; border-radius: 12px;
  background: #171717; color: #d8b744; display: flex; align-items: center; justify-content: center;
}
.ap-security-copy { flex: 1; min-width: 180px; }
.ap-password-form {
  width: 100%; display: grid; grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 18px; padding-top: 12px;
}
.ap-password-form .ap-field:first-child { grid-column: 1 / -1; }
.ap-password-form > button { justify-self: start; }
.ap-message { margin-bottom: 18px; padding: 13px 16px; border-radius: 8px; font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
.ap-error { color: #922c25; background: #fce8e6; }
.ap-success { color: #72530b; background: #fff5d8; }
@media (max-width: 800px) {
  .admin-profile-page { padding: 18px; }
  .ap-grid { grid-template-columns: 1fr; }
  .ap-security { grid-column: auto; }
}
@media (max-width: 520px) {
  .ap-header { align-items: flex-start; flex-direction: column; }
  .ap-form-grid, .ap-password-form { grid-template-columns: 1fr; }
  .ap-password-form .ap-field:first-child { grid-column: auto; }
  .ap-card { padding: 20px; }
  .ap-security .ap-secondary { width: 100%; }
}
`;
