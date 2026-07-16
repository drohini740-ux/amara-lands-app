const pool = require("../config/db");

// ========================
// Add Property
// ========================

const addProperty = async (req, res) => {
    try {

        const {
            property_name,
            survey_number,
            property_type,
            area,
            address,
            city,
            state,
            pincode,
            latitude,
            longitude
        } = req.body;

        if (!property_name || !survey_number) {
            return res.status(400).json({
                success: false,
                message: "Property Name and Survey Number are required."
            });
        }

       const result = await pool.query(
    `INSERT INTO properties
    (
        user_id,
        property_name,
        survey_number,
        property_type,
        area,
        address,
        city,
        state,
        pincode,
        latitude,
        longitude
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *`,
    [
        req.user.id,
        property_name,
        survey_number,
        property_type,
        area,
        address,
        city,
        state,
        pincode,
        latitude,
        longitude
    ]
);

console.log("Values:", [
  req.user.id,
  property_name,
  survey_number,
  property_type,
  area,
  address,
  city,
  state,
  pincode,
  latitude,
  longitude,
]
        );

        res.status(201).json({
            success: true,
            message: "Property Added Successfully",
            property: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ========================
// Get All Properties
// ========================

const getProperties = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM properties
             WHERE user_id=$1
             ORDER BY id DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            properties: result.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// ========================
// Get Property By Id
// ========================

const getProperty = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM properties
             WHERE id=$1
             AND user_id=$2`,
            [
                req.params.id,
                req.user.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Property Not Found"
            });
        }

        res.json({
            success: true,
            property: result.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// ========================
// Update Property
// ========================

const updateProperty = async (req, res) => {

    try {

        const {
            property_name,
            survey_number,
            property_type,
            area,
            address,
            city,
            state,
            pincode,
            latitude,
            longitude
        } = req.body;

        const result = await pool.query(
            `UPDATE properties
            SET
                property_name=$1,
                survey_number=$2,
                property_type=$3,
                area=$4,
                address=$5,
                city=$6,
                state=$7,
                pincode=$8,
                latitude=$9,
                longitude=$10
            WHERE id=$11
            AND user_id=$12
            RETURNING *`,
            [
                property_name,
                survey_number,
                property_type,
                area,
                address,
                city,
                state,
                pincode,
                latitude,
                longitude,
                req.params.id,
                req.user.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Property Not Found"
            });
        }

        res.json({
            success: true,
            message: "Property Updated",
            property: result.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// ========================
// Delete Property
// ========================

const deleteProperty = async (req, res) => {

    try {

        const result = await pool.query(
            `DELETE FROM properties
             WHERE id=$1
             AND user_id=$2
             RETURNING *`,
            [
                req.params.id,
                req.user.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Property Not Found"
            });
        }

        res.json({
            success: true,
            message: "Property Deleted"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

module.exports = {
    addProperty,
    getProperties,
    getProperty,
    updateProperty,
    deleteProperty
};