const pool = require("../../config/db");
const bcrypt = require("bcrypt");

// ==========================================
// GET ADMIN PROFILE
// ==========================================

const getAdminProfile = async (req, res) => {

    try {

        console.log("Settings req.user:", req.user);

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const adminId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                id,
                full_name,
                mobile,
                email,
                role,
                status,
                profile_image,
                created_at,
                updated_at
            FROM users
            WHERE id = $1
              AND role = 'admin'
            `,
            [adminId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {

        console.error("Get Admin Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load admin profile"
        });
    }
};


// ==========================================
// UPDATE ADMIN PROFILE
// ==========================================

const updateAdminProfile = async (req, res) => {

    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const adminId = req.user.id;

        const {
            full_name,
            mobile,
            email
        } = req.body;

        if (!full_name || !mobile || !email) {
            return res.status(400).json({
                success: false,
                message: "Full name, mobile and email are required"
            });
        }

        const cleanName = full_name.trim();
        const cleanMobile = mobile.trim();
        const cleanEmail = email.trim().toLowerCase();

        // Check duplicate email/mobile
        const existingUser = await pool.query(
            `
            SELECT id
            FROM users
            WHERE (email = $1 OR mobile = $2)
              AND id != $3
            `,
            [
                cleanEmail,
                cleanMobile,
                adminId
            ]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email or mobile number already exists"
            });
        }

        const result = await pool.query(
            `
            UPDATE users
            SET
                full_name = $1,
                mobile = $2,
                email = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
              AND role = 'admin'
            RETURNING
                id,
                full_name,
                mobile,
                email,
                role,
                status,
                profile_image,
                created_at,
                updated_at
            `,
            [
                cleanName,
                cleanMobile,
                cleanEmail,
                adminId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Admin profile updated successfully",
            data: result.rows[0]
        });

    } catch (error) {

        console.error("Update Admin Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update admin profile"
        });
    }
};


// ==========================================
// CHANGE ADMIN PASSWORD
// ==========================================

const changeAdminPassword = async (req, res) => {

    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const adminId = req.user.id;

        const {
            current_password,
            new_password,
            confirm_password
        } = req.body;

        if (
            !current_password ||
            !new_password ||
            !confirm_password
        ) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required"
            });
        }

        if (new_password !== confirm_password) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match"
            });
        }

        if (new_password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        const result = await pool.query(
            `
            SELECT password
            FROM users
            WHERE id = $1
              AND role = 'admin'
            `,
            [adminId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const admin = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            current_password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(
            new_password,
            10
        );

        await pool.query(
            `
            UPDATE users
            SET
                password = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            `,
            [
                hashedPassword,
                adminId
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {

        console.error("Change Admin Password Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to change password"
        });
    }
};


module.exports = {
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword
};