import { useEffect, useState } from "react";
import api from "../../services/api";
import axios from "axios";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
  });
  useEffect(() => {
    console.log("Current profile:", profile);
  }, [profile]);

  useEffect(() => {
    fetchProfile();
  }, []);
  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");

      console.log("========== PROFILE API ==========");
      console.log(res.data);

      console.log("User:", res.data.user);
      console.log("Profile Image:", res.data.user.profile_image);

      const imageUrl = res.data.user.profile_image
        ? `http://localhost:4000${res.data.user.profile_image}`
        : "";

      console.log("Image URL:", imageUrl);

      setProfile(res.data.user);

      setFormData({
        full_name: res.data.user.full_name || "",
        mobile: res.data.user.mobile || "",
      });
    } catch (err) {
      console.log("Fetch Profile Error:", err);
    }
  };
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await api.put("/users/profile", {
        full_name: formData.full_name,
        mobile: formData.mobile,
        email: profile.email,
      });

      alert("Profile updated successfully.");

      setEditing(false);

      fetchProfile();
    } catch (error) {
      console.log(error);
      alert("Profile update failed.");
    }
  };
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async () => {
    try {
      const res = await api.put("/users/change-password", passwordData);

      alert(res.data.message);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Password change failed");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    console.log("Selected File:", file);
    console.log("Is File:", file instanceof File);

    if (!file) {
      alert("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("profile", file);

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:4000/api/v1/users/profile/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();
      console.log(data);

      alert("Upload Success");

      fetchProfile();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="mb-4">My Profile</h2>

      <div className="card shadow p-4">
        <div className="row">
          <div className="col-md-4 text-center">
            <img
              src={
                profile.profile_image
                  ? `http://localhost:4000${profile.profile_image}?t=${new Date().getTime()}`
                  : "https://via.placeholder.com/180"
              }
              alt="Profile"
              width={180}
              height={180}
              className="rounded-circle mb-3"
              style={{ objectFit: "cover" }}
              onLoad={() => console.log("✅ Image Loaded")}
              onError={(e) => {
                console.log("❌ Image Failed");
                console.log(e.target.src);
              }}
            />
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <h4>{profile.full_name}</h4>

            <p>{profile.role}</p>
          </div>

          <div className="col-md-8">
            <table className="table">
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>
                    {editing ? (
                      <input
                        type="text"
                        name="full_name"
                        className="form-control"
                        value={formData.full_name}
                        onChange={handleChange}
                      />
                    ) : (
                      profile.full_name
                    )}
                  </td>
                </tr>

                <tr>
                  <th>Email</th>
                  <td>{profile.email}</td>
                </tr>

                <tr>
                  <th>Mobile</th>
                  <td>
                    {editing ? (
                      <input
                        type="text"
                        name="mobile"
                        className="form-control"
                        value={formData.mobile}
                        onChange={handleChange}
                      />
                    ) : (
                      profile.mobile
                    )}
                  </td>
                </tr>

                <tr>
                  <th>Status</th>
                  <td>{profile.status}</td>
                </tr>

                <tr>
                  <th>Created</th>
                  <td>
                    {profile.created_at &&
                      new Date(profile.created_at).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>

            {!editing ? (
              <button
                className="btn btn-warning"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button className="btn btn-success me-2" onClick={handleUpdate}>
                  Save
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="card shadow p-4 mt-4">
        <h4>Change Password</h4>

        <div className="mb-3">
          <label>Current Password</label>
          <input
            type="password"
            className="form-control"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
          />
        </div>

        <div className="mb-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
        </div>

        <div className="mb-3">
          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
          />
          <button className="btn btn-primary" onClick={handleChangePassword}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
