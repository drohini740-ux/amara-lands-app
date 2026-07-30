import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");

      setFormData({
        full_name: res.data.user.full_name,
        email: res.data.user.email,
        mobile: res.data.user.mobile,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      await api.put("/users/profile", formData);

      alert("Profile updated successfully.");

      navigate("/profile");
    } catch (err) {
      console.log(err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="container-fluid">

      <h2 className="mb-4">Edit Profile</h2>

      <div className="card shadow p-4">

        <form onSubmit={updateProfile}>

          <div className="mb-3">
            <label className="form-label">
              Full Name
            </label>

            <input
              type="text"
              className="form-control"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">

            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Mobile
            </label>

            <input
              type="text"
              className="form-control"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />

          </div>

          <button
            type="submit"
            className="btn btn-warning me-2"
          >
            Update Profile
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>

        </form>

      </div>

    </div>
  );
}