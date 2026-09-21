import React, { useEffect, useState } from "react";
import API from "../../services/api";

const SuperAdminDashboard = () => {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // LOAD DASHBOARD
    // ==========================================

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get(
                "/super-admin/dashboard"
            );

            console.log(
                "Super Admin Dashboard:",
                response.data
            );

            setDashboard(response.data.data);

        } catch (error) {

            console.error(
                "Super Admin Dashboard Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load Super Admin dashboard"
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        loadDashboard();

    }, []);


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
                    Loading Super Admin Dashboard...
                </p>

            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div>

                <h2 className="mb-4">
                    Super Admin Dashboard
                </h2>

                <div className="alert alert-danger">
                    {error}
                </div>

            </div>
        );

    }


    if (!dashboard) {
        return null;
    }


    const users = dashboard.users;

    const properties = dashboard.properties;


    // ==========================================
    // UI
    // ==========================================

    return (

        <div>

            {/* ==================================
                HEADER
            ================================== */}

            <div className="mb-4">

                <h2 className="mb-1">
                    Super Admin Dashboard
                </h2>

                <p className="text-muted mb-0">
                    System-wide management and monitoring
                </p>

            </div>


            {/* ==================================
                USER STATISTICS
            ================================== */}

            <div className="row g-4 mb-4">

                {/* TOTAL USERS */}

                <div className="col-md-6 col-xl-3">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Total Users
                            </h6>

                            <h2>
                                {users.total_users}
                            </h2>

                        </div>

                    </div>

                </div>


                {/* ADMINS */}

                <div className="col-md-6 col-xl-3">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Admins
                            </h6>

                            <h2>
                                {users.total_admins}
                            </h2>

                        </div>

                    </div>

                </div>


                {/* FIELD EXECUTIVES */}

                <div className="col-md-6 col-xl-3">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Field Executives
                            </h6>

                            <h2>
                                {users.total_field_executives}
                            </h2>

                        </div>

                    </div>

                </div>


                {/* CUSTOMERS */}

                <div className="col-md-6 col-xl-3">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Customers
                            </h6>

                            <h2>
                                {users.total_customers}
                            </h2>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================
                STAFF STATISTICS
            ================================== */}

            <div className="row g-4 mb-4">

                <div className="col-md-4">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Legal Team
                            </h6>

                            <h2>
                                {users.total_legal}
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-4">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Security Team
                            </h6>

                            <h2>
                                {users.total_security}
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-4">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Active Users
                            </h6>

                            <h2>
                                {users.active_users}
                            </h2>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================
                PROPERTY STATISTICS
            ================================== */}

            <div className="row g-4 mb-4">

                <div className="col-md-4">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Total Properties
                            </h6>

                            <h2>
                                {properties.total_properties}
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-4">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Pending Verification
                            </h6>

                            <h2>
                                {properties.pending_properties}
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-4">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Verified Properties
                            </h6>

                            <h2>
                                {properties.verified_properties}
                            </h2>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================
                RECENT USERS
            ================================== */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h5 className="mb-3">
                        Recent Users
                    </h5>

                    <div className="table-responsive">

                        <table className="table table-hover">

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {dashboard.recent_users.map(
                                    (user) => (

                                        <tr key={user.id}>

                                            <td>
                                                {user.id}
                                            </td>

                                            <td>
                                                {user.full_name}
                                            </td>

                                            <td>
                                                {user.email}
                                            </td>

                                            <td>
                                                <span className="badge bg-dark">
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        user.status === "active"
                                                            ? "badge bg-success"
                                                            : "badge bg-secondary"
                                                    }
                                                >
                                                    {user.status}
                                                </span>
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>


            {/* ==================================
                RECENT PROPERTIES
            ================================== */}

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    <h5 className="mb-3">
                        Recent Properties
                    </h5>

                    <div className="table-responsive">

                        <table className="table table-hover">

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Property</th>
                                    <th>Survey Number</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {dashboard.recent_properties.map(
                                    (property) => (

                                        <tr key={property.id}>

                                            <td>
                                                {property.id}
                                            </td>

                                            <td>
                                                {property.property_name}
                                            </td>

                                            <td>
                                                {property.survey_number}
                                            </td>

                                            <td>
                                                {property.city},{" "}
                                                {property.state}
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        property.verification_status === "Verified"
                                                            ? "badge bg-success"
                                                            : property.verification_status === "Rejected"
                                                                ? "badge bg-danger"
                                                                : "badge bg-warning text-dark"
                                                    }
                                                >
                                                    {
                                                        property.verification_status
                                                    }
                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default SuperAdminDashboard;