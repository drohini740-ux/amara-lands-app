
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

export default function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        const user = res.data?.user;

        if (!user) {
          throw new Error("Profile information was not returned.");
        }

        setFormData({
          full_name: user.full_name || "",
          email: user.email || "",
          mobile: user.mobile || "",
        });
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

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.mobile.trim()) {
      setError("Please enter your mobile number.");
      return;
    }

    setSaving(true);

    try {
      await api.put("/users/profile", {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
      });

      alert("Profile updated successfully.");
      navigate("/profile");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4 text-center">
        <div
          className="spinner-border"
          style={{ color: "#D4AF37" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3 p-md-4 customer-edit-profile">
      <style>{`
        .customer-edit-profile {
          color: #171717;
        }

        .edit-profile-heading {
          color: #111111;
          font-weight: 750;
          letter-spacing: -0.5px;
        }

        .edit-profile-subtitle {
          color: #777777;
          font-size: 14px;
        }

        .edit-profile-line {
          width: 58px;
          height: 4px;
          background: #D4AF37;
          border-radius: 5px;
          margin-top: 12px;
        }

        .edit-profile-panel {
          max-width: 850px;
          background: #FFFFFF;
          border: 1px solid #eeeeee;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }

        .edit-profile-panel-heading {
          background: #111111;
          color: #FFFFFF;
          padding: 18px 24px;
          border-bottom: 3px solid #D4AF37;
        }

        .edit-profile-panel-heading h5 {
          margin: 0;
          font-weight: 700;
        }

        .edit-profile-input {
          border: 1px solid #dddddd;
          border-radius: 8px;
          padding: 11px 13px;
        }

        .edit-profile-input:focus {
          border-color: #D4AF37;
          box-shadow: 0 0 0 0.2rem rgba(212, 175, 55, 0.18);
        }

        .edit-profile-label {
          color: #333333;
          font-size: 13px;
          font-weight: 650;
          margin-bottom: 8px;
        }

        .edit-profile-save {
          background: #D4AF37;
          color: #111111;
          border: 1px solid #D4AF37;
          font-weight: 700;
        }

        .edit-profile-save:hover {
          background: #bd9825;
          border-color: #bd9825;
          color: #111111;
        }

        .edit-profile-cancel {
          background: #111111;
          color: #FFFFFF;
          border: 1px solid #111111;
          font-weight: 600;
        }

        .edit-profile-cancel:hover {
          background: #333333;
          color: #FFFFFF;
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

        <h2 className="edit-profile-heading mb-2">Edit Profile</h2>
        <p className="edit-profile-subtitle mb-0">
          Update your personal information.
        </p>
        <div className="edit-profile-line" />
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="edit-profile-panel">
        <div className="edit-profile-panel-heading">
          <h5>Personal Information</h5>
        </div>

        <div className="p-3 p-md-4">
          <form onSubmit={updateProfile}>
            <div className="mb-4">
              <label className="form-label edit-profile-label">
                Full Name
              </label>
              <input
                type="text"
                className="form-control edit-profile-input"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label edit-profile-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control edit-profile-input"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                autoComplete="email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label edit-profile-label">
                Mobile Number
              </label>
              <input
                type="tel"
                className="form-control edit-profile-input"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                autoComplete="tel"
                required
              />
            </div>

            <div className="d-flex flex-wrap gap-2 pt-2">
              <button
                type="submit"
                className="btn edit-profile-save px-4"
                disabled={saving}
              >
                {saving ? "Saving..." : "Update Profile"}
              </button>

              <button
                type="button"
                className="btn edit-profile-cancel px-4"
                onClick={() => navigate("/profile")}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
