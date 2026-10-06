
const pool = require("../../config/db");

// =====================================================
// GET ALL DOCUMENTS
// =====================================================

const getAllDocuments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        pd.id,
        pd.property_id,
        pd.document_name,
        pd.document_type,
        pd.file_url,
        pd.uploaded_at,

        p.property_name,
        p.survey_number,
        p.property_type,
        p.address,
        p.city,
        p.state,
        p.pincode,
        p.verification_status,

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

      FROM property_documents pd

      LEFT JOIN properties p
        ON pd.property_id = p.id

      LEFT JOIN users u
        ON p.user_id = u.id

      ORDER BY pd.uploaded_at DESC, pd.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Legal Team documents fetched successfully.",
      documents: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Legal Team Documents Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents.",
    });
  }
};

// =====================================================
// GET DOCUMENT BY ID
// =====================================================

const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        pd.id,
        pd.property_id,
        pd.document_name,
        pd.document_type,
        pd.file_url,
        pd.uploaded_at,

        p.property_name,
        p.survey_number,
        p.property_type,
        p.area,
        p.address,
        p.city,
        p.state,
        p.pincode,
        p.latitude,
        p.longitude,
        p.verification_status,
        p.verified_by,
        p.created_at AS property_created_at,

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile,
        u.role AS customer_role,
        u.status AS customer_status

      FROM property_documents pd

      LEFT JOIN properties p
        ON pd.property_id = p.id

      LEFT JOIN users u
        ON p.user_id = u.id

      WHERE pd.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document fetched successfully.",
      document: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get Legal Team Document Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch document.",
    });
  }
};

module.exports = {
  getAllDocuments,
  getDocumentById,
};

