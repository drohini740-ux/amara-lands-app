
const fs = require("fs");
const path = require("path");

const pool = require("../../config/db");

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDirectory = path.join(
  __dirname,
  "../../uploads/fieldVisits"
);

// Create directory if it does not exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// =====================================================
// GET MY VISIT MEDIA
// =====================================================

const getMyVisitMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const visitId = req.params.visitId;

    const result = await pool.query(
      `
      SELECT
        fvm.id,
        fvm.visit_id,
        fvm.property_id,
        fvm.user_id,
        fvm.file_name,
        fvm.file_path,
        fvm.file_url,
        fvm.file_type,
        fvm.file_size,
        fvm.media_type,
        fvm.caption,
        fvm.created_at,

        p.property_name,
        p.survey_number

      FROM field_visit_media fvm

      INNER JOIN properties p
        ON p.id = fvm.property_id

      WHERE fvm.visit_id = $1
        AND fvm.user_id = $2

      ORDER BY fvm.created_at DESC
      `,
      [visitId, userId]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Field Visit Media Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch visit media.",
      error: error.message,
    });
  }
};

// =====================================================
// UPLOAD VISIT MEDIA
// =====================================================

const uploadVisitMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const visitId = req.params.visitId;

    // -------------------------------------------------
    // CHECK FILE
    // -------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file to upload.",
      });
    }

    // -------------------------------------------------
    // GET VISIT
    // -------------------------------------------------

    const visitResult = await pool.query(
      `
      SELECT
        fv.id,
        fv.property_id,
        fv.user_id,
        fv.visit_status,
        p.property_name

      FROM field_visits fv

      INNER JOIN properties p
        ON p.id = fv.property_id

      WHERE fv.id = $1
        AND fv.user_id = $2

      LIMIT 1
      `,
      [visitId, userId]
    );

    if (visitResult.rows.length === 0) {
      // Remove uploaded file if visit is invalid
      if (req.file.path) {
        fs.unlink(
          req.file.path,
          () => {}
        );
      }

      return res.status(404).json({
        success: false,
        message:
          "Visit not found or not assigned to this Field Executive.",
      });
    }

    const visit = visitResult.rows[0];

    // -------------------------------------------------
    // FILE INFORMATION
    // -------------------------------------------------

    const fileName =
      req.file.originalname;

    const filePath =
      req.file.path;

    const relativePath =
      path.relative(
        path.join(__dirname, "../../"),
        filePath
      );

    const fileUrl =
      `/uploads/fieldVisits/${req.file.filename}`;

    const fileType =
      req.file.mimetype;

    const fileSize =
      req.file.size;

    // -------------------------------------------------
    // MEDIA TYPE
    // -------------------------------------------------

    let mediaType = "file";

    if (
      fileType &&
      fileType.startsWith("image/")
    ) {
      mediaType = "image";
    } else if (
      fileType &&
      fileType.startsWith("video/")
    ) {
      mediaType = "video";
    }

    // -------------------------------------------------
    // CAPTION
    // -------------------------------------------------

    const caption =
      req.body.caption || null;

    // -------------------------------------------------
    // SAVE DATABASE RECORD
    // -------------------------------------------------

    const result = await pool.query(
      `
      INSERT INTO field_visit_media (
        visit_id,
        property_id,
        user_id,
        file_name,
        file_path,
        file_url,
        file_type,
        file_size,
        media_type,
        caption
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10
      )
      RETURNING *
      `,
      [
        visit.id,
        visit.property_id,
        userId,
        fileName,
        relativePath,
        fileUrl,
        fileType,
        fileSize,
        mediaType,
        caption,
      ]
    );

    return res.status(201).json({
      success: true,
      message:
        "Visit media uploaded successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Upload Field Visit Media Error:",
      error
    );

    // Remove file if database operation fails
    if (req.file?.path) {
      fs.unlink(
        req.file.path,
        () => {}
      );
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to upload visit media.",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE VISIT MEDIA
// =====================================================

const deleteVisitMedia = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;
    const mediaId = req.params.id;

    // -------------------------------------------------
    // GET MEDIA
    // -------------------------------------------------

    const mediaResult = await pool.query(
      `
      SELECT
        id,
        user_id,
        file_path
      FROM field_visit_media
      WHERE id = $1
        AND user_id = $2
      LIMIT 1
      `,
      [mediaId, userId]
    );

    if (mediaResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Media not found.",
      });
    }

    const media =
      mediaResult.rows[0];

    // -------------------------------------------------
    // DELETE DATABASE RECORD
    // -------------------------------------------------

    await pool.query(
      `
      DELETE FROM field_visit_media
      WHERE id = $1
        AND user_id = $2
      `,
      [mediaId, userId]
    );

    // -------------------------------------------------
    // DELETE FILE
    // -------------------------------------------------

    if (media.file_path) {
      const absolutePath =
        path.join(
          __dirname,
          "../../",
          media.file_path
        );

      if (
        fs.existsSync(absolutePath)
      ) {
        fs.unlink(
          absolutePath,
          () => {}
        );
      }
    }

    return res.status(200).json({
      success: true,
      message:
        "Visit media deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Field Visit Media Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete visit media.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyVisitMedia,
  uploadVisitMedia,
  deleteVisitMedia,
};

