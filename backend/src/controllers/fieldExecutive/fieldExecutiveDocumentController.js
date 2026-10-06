
const pool = require("../../config/db");

// =====================================================
// GET MY PROPERTY DOCUMENTS
// =====================================================

const getMyDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

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
        p.verification_status

      FROM property_documents pd

      INNER JOIN properties p
        ON p.id = pd.property_id

      INNER JOIN staff_assignments sa
        ON sa.property_id = pd.property_id

      WHERE sa.staff_id = $1

      ORDER BY
        pd.uploaded_at DESC,
        pd.id DESC
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      message:
        "Field Executive documents fetched successfully.",
      documents: result.rows,
    });
  } catch (error) {
    console.error(
      "Get My Documents Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch property documents.",
    });
  }
};

// =====================================================
// GET DOCUMENT BY ID
// =====================================================

const getDocumentById = async (req, res) => {
  try {
    const userId = req.user.id;
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
        p.verification_status

      FROM property_documents pd

      INNER JOIN properties p
        ON p.id = pd.property_id

      INNER JOIN staff_assignments sa
        ON sa.property_id = pd.property_id

      WHERE pd.id = $1
        AND sa.staff_id = $2

      LIMIT 1
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Document not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Document fetched successfully.",
      document: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get Document By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch document.",
    });
  }
};

// =====================================================
// DELETE DOCUMENT
// =====================================================

const deleteDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existingDocument =
      await pool.query(
        `
        SELECT
          pd.id,
          pd.file_url
        FROM property_documents pd

        INNER JOIN staff_assignments sa
          ON sa.property_id = pd.property_id

        WHERE pd.id = $1
          AND sa.staff_id = $2

        LIMIT 1
        `,
        [id, userId]
      );

    if (
      existingDocument.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Document not found or access denied.",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM property_documents
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message:
        "Document deleted successfully.",
      document: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Delete Document Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to delete document.",
    });
  }
};

// =====================================================
// UPLOAD DOCUMENT
// =====================================================

const uploadDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      property_id,
      document_name,
      document_type,
    } = req.body;

    if (!property_id) {
      return res.status(400).json({
        success: false,
        message:
          "Property ID is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Document file is required.",
      });
    }

    // -------------------------------------------------
    // CHECK PROPERTY ASSIGNMENT
    // -------------------------------------------------

    const assignment =
      await pool.query(
        `
        SELECT id
        FROM staff_assignments
        WHERE staff_id = $1
          AND property_id = $2
        LIMIT 1
        `,
        [userId, property_id]
      );

    if (assignment.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message:
          "This property is not assigned to you.",
      });
    }

    // -------------------------------------------------
    // CREATE FILE URL
    // -------------------------------------------------

    const fileUrl =
      `/uploads/fieldDocuments/${req.file.filename}`;

    // -------------------------------------------------
    // INSERT DOCUMENT
    // -------------------------------------------------

    const result = await pool.query(
      `
      INSERT INTO property_documents (
        property_id,
        document_name,
        document_type,
        file_url
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        property_id,
        document_name ||
          req.file.originalname,
        document_type ||
          "Document",
        fileUrl,
      ]
    );

    res.status(201).json({
      success: true,
      message:
        "Document uploaded successfully.",
      document: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Upload Document Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to upload document.",
    });
  }
};

module.exports = {
  getMyDocuments,
  getDocumentById,
  uploadDocument,
  deleteDocument,
};

