const pool = require("../../config/db");

// ======================================================
// GET SUPER ADMIN DASHBOARD
// ======================================================

const getSuperAdminDashboard = async (req, res) => {

    try {

        // ==========================================
        // CHECK SUPER ADMIN
        // ==========================================

        if (!req.user || !req.user.id) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

        }

        if (req.user.role !== "super_admin") {

            return res.status(403).json({
                success: false,
                message: "Access denied. Super Admin only."
            });

        }


        // ==========================================
        // USER COUNTS
        // ==========================================

        const userCountResult = await pool.query(`
            SELECT
                COUNT(*) AS total_users,

                COUNT(*) FILTER (
                    WHERE role = 'admin'
                ) AS total_admins,

                COUNT(*) FILTER (
                    WHERE role = 'field_executive'
                ) AS total_field_executives,

                COUNT(*) FILTER (
                    WHERE role = 'legal'
                ) AS total_legal,

                COUNT(*) FILTER (
                    WHERE role = 'security'
                ) AS total_security,

                COUNT(*) FILTER (
                    WHERE role = 'customer'
                ) AS total_customers,

                COUNT(*) FILTER (
                    WHERE status = 'active'
                ) AS active_users,

                COUNT(*) FILTER (
                    WHERE status = 'inactive'
                ) AS inactive_users

            FROM users
        `);


        // ==========================================
        // PROPERTY COUNTS
        // ==========================================

        const propertyCountResult = await pool.query(`
            SELECT
                COUNT(*) AS total_properties,

                COUNT(*) FILTER (
                    WHERE verification_status = 'Pending'
                ) AS pending_properties,

                COUNT(*) FILTER (
                    WHERE verification_status = 'Verified'
                ) AS verified_properties,

                COUNT(*) FILTER (
                    WHERE verification_status = 'Rejected'
                ) AS rejected_properties

            FROM properties
        `);


        // ==========================================
        // RECENT USERS
        // ==========================================

        const recentUsersResult = await pool.query(`
            SELECT
                id,
                full_name,
                email,
                role,
                status,
                created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT 5
        `);


        // ==========================================
        // RECENT PROPERTIES
        // ==========================================

        const recentPropertiesResult = await pool.query(`
            SELECT
                id,
                property_name,
                survey_number,
                city,
                state,
                verification_status,
                created_at
            FROM properties
            ORDER BY created_at DESC
            LIMIT 5
        `);


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            data: {

                users: userCountResult.rows[0],

                properties: propertyCountResult.rows[0],

                recent_users: recentUsersResult.rows,

                recent_properties: recentPropertiesResult.rows

            }

        });

    } catch (error) {

        console.error(
            "Super Admin Dashboard Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load Super Admin dashboard"
        });

    }

};


module.exports = {
    getSuperAdminDashboard
};