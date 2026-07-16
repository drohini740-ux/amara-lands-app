const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

// =======================================
// Upload Property Document
// =======================================

const uploadDocument = async (req, res) => {

  try {

    const { propertyId } = req.params;
    const { document_name, document_type } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      `INSERT INTO property_documents
      (
        property_id,
        document_name,
        document_type,
        file_url
      )
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
      [
        propertyId,
        document_name,
        document_type,
        fileUrl,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Document Uploaded Successfully",
      document: result.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

// =======================================
// Get Documents
// =======================================

const getDocuments = async (req, res) => {

  try {

    const result = await pool.query(
      `SELECT *
       FROM property_documents
       WHERE property_id=$1
       ORDER BY id DESC`,
      [req.params.propertyId]
    );

    res.json({
      success: true,
      documents: result.rows,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

// =======================================
// Delete Document
// =======================================

const deleteDocument = async (req, res) => {

  try {

    const result = await pool.query(
      `DELETE FROM property_documents
       WHERE id=$1
       RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Document Not Found",
      });
    }

    const filePath = path.join(
      __dirname,
      "../uploads",
      path.basename(result.rows[0].file_url)
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      success: true,
      message: "Document Deleted Successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument,
};