import React, { useEffect, useState } from "react";
import API from "../../../services/api";

const AdminSettings = () => {

    // ==========================================
    // PROFILE STATE
    // ==========================================

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [profileLoading, setProfileLoading] = useState(false);

    const [passwordLoading, setPasswordLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");


    // ==========================================
    // EDIT PROFILE STATE
    // ==========================================

    const [editProfile, setEditProfile] = useState({
        full_name: "",
        mobile: "",
        email: ""
    });


    // ==========================================
    // PASSWORD STATE
    // ==========================================

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: ""
    });


    // ==========================================
    // LOAD ADMIN PROFILE
    // ==========================================

    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get(
                "/admin/settings/profile"
            );

            console.log(
                "Admin Profile Response:",
                response.data
            );

            const adminProfile = response.data.data;

            setProfile(adminProfile);

            setEditProfile({
                full_name: adminProfile.full_name || "",
                mobile: adminProfile.mobile || "",
                email: adminProfile.email || ""
            });

        } catch (error) {

            console.error(
                "Load admin profile error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load admin profile"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        loadProfile();

    }, []);


    // ==========================================
    // HANDLE PROFILE INPUT
    // ==========================================

    const handleProfileChange = (e) => {

        const { name, value } = e.target;

        setEditProfile((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // ==========================================
    // HANDLE PASSWORD INPUT
    // ==========================================

    const handlePasswordChange = (e) => {

        const { name, value } = e.target;

        setPasswordData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    const handleProfileSubmit = async (e) => {

        e.preventDefault();

        try {

            setProfileLoading(true);

            setMessage("");
            setError("");

            const response = await API.put(
                "/admin/settings/profile",
                editProfile
            );

            console.log(
                "Update Profile Response:",
                response.data
            );

            setMessage(
                response.data.message ||
                "Profile updated successfully"
            );

            setProfile(response.data.data);

            setEditProfile({
                full_name: response.data.data.full_name || "",
                mobile: response.data.data.mobile || "",
                email: response.data.data.email || ""
            });

        } catch (error) {

            console.error(
                "Update admin profile error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update admin profile"
            );

        } finally {

            setProfileLoading(false);

        }
    };


    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    const handlePasswordSubmit = async (e) => {

        e.preventDefault();

        try {

            setPasswordLoading(true);

            setMessage("");
            setError("");

            if (
                passwordData.new_password !==
                passwordData.confirm_password
            ) {

                setError(
                    "New password and confirm password do not match"
                );

                setPasswordLoading(false);

                return;
            }

            const response = await API.put(
                "/admin/settings/password",
                passwordData
            );

            console.log(
                "Change Password Response:",
                response.data
            );

            setMessage(
                response.data.message ||
                "Password changed successfully"
            );

            setPasswordData({
                current_password: "",
                new_password: "",
                confirm_password: ""
            });

        } catch (error) {

            console.error(
                "Change password error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to change password"
            );

        } finally {

            setPasswordLoading(false);

        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="text-center py-5">

                <div
                    className="spinner-border"
                    role="status"
                ></div>

                <p className="mt-2">
                    Loading admin settings...
                </p>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error && !profile) {

        return (
            <div>

                <h3 className="mb-4">
                    Admin Settings
                </h3>

                <div className="alert alert-danger">
                    {error}
                </div>

            </div>
        );
    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div>

            {/* PAGE TITLE */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">
                        Admin Settings
                    </h2>

                    <p className="text-muted mb-0">
                        Manage your admin profile and password
                    </p>

                </div>

            </div>


            {/* SUCCESS MESSAGE */}

            {message && (

                <div className="alert alert-success">
                    {message}
                </div>

            )}


            {/* ERROR MESSAGE */}

            {error && profile && (

                <div className="alert alert-danger">
                    {error}
                </div>

            )}


            <div className="row g-4">


                {/* ==================================
                    PROFILE INFORMATION
                ================================== */}

                <div className="col-lg-6">

                    <div className="card shadow-sm h-100">

                        <div className="card-body">

                            <h5 className="card-title">
                                Admin Profile
                            </h5>

                            <hr />

                            {profile && (

                                <>

                                    <div className="mb-3">

                                        <strong>
                                            Name
                                        </strong>

                                        <div className="text-muted">
                                            {profile.full_name}
                                        </div>

                                    </div>


                                    <div className="mb-3">

                                        <strong>
                                            Email
                                        </strong>

                                        <div className="text-muted">
                                            {profile.email}
                                        </div>

                                    </div>


                                    <div className="mb-3">

                                        <strong>
                                            Mobile
                                        </strong>

                                        <div className="text-muted">
                                            {profile.mobile}
                                        </div>

                                    </div>


                                    <div className="mb-3">

                                        <strong>
                                            Role
                                        </strong>

                                        <div>

                                            <span className="badge bg-dark">
                                                {profile.role}
                                            </span>

                                        </div>

                                    </div>


                                    <div className="mb-3">

                                        <strong>
                                            Status
                                        </strong>

                                        <div>

                                            <span className="badge bg-success">
                                                {profile.status}
                                            </span>

                                        </div>

                                    </div>

                                </>

                            )}

                        </div>

                    </div>

                </div>


                {/* ==================================
                    EDIT PROFILE
                ================================== */}

                <div className="col-lg-6">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h5 className="card-title">
                                Edit Profile
                            </h5>

                            <hr />

                            <form onSubmit={handleProfileSubmit}>

                                {/* NAME */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="full_name"
                                        className="form-control"
                                        value={editProfile.full_name}
                                        onChange={handleProfileChange}
                                        required
                                    />

                                </div>


                                {/* MOBILE */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Mobile
                                    </label>

                                    <input
                                        type="text"
                                        name="mobile"
                                        className="form-control"
                                        value={editProfile.mobile}
                                        onChange={handleProfileChange}
                                        required
                                    />

                                </div>


                                {/* EMAIL */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={editProfile.email}
                                        onChange={handleProfileChange}
                                        required
                                    />

                                </div>


                                <button
                                    type="submit"
                                    className="btn btn-dark"
                                    disabled={profileLoading}
                                >

                                    {profileLoading
                                        ? "Updating..."
                                        : "Update Profile"
                                    }

                                </button>

                            </form>

                        </div>

                    </div>

                </div>


                {/* ==================================
                    CHANGE PASSWORD
                ================================== */}

                <div className="col-lg-6">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h5 className="card-title">
                                Change Password
                            </h5>

                            <hr />

                            <form onSubmit={handlePasswordSubmit}>

                                {/* CURRENT PASSWORD */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Current Password
                                    </label>

                                    <input
                                        type="password"
                                        name="current_password"
                                        className="form-control"
                                        value={
                                            passwordData.current_password
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        required
                                    />

                                </div>


                                {/* NEW PASSWORD */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="new_password"
                                        className="form-control"
                                        value={
                                            passwordData.new_password
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        minLength="6"
                                        required
                                    />

                                </div>


                                {/* CONFIRM PASSWORD */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Confirm New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="confirm_password"
                                        className="form-control"
                                        value={
                                            passwordData.confirm_password
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        minLength="6"
                                        required
                                    />

                                </div>


                                <button
                                    type="submit"
                                    className="btn btn-warning"
                                    disabled={passwordLoading}
                                >

                                    {passwordLoading
                                        ? "Changing..."
                                        : "Change Password"
                                    }

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
};

export default AdminSettings;