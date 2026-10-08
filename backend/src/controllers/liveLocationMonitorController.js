
const pool = require("../config/db");

// =====================================================
// CHECK ADMIN ACCESS
// =====================================================

const checkMonitorAccess = (req, res) => {
  const allowedRoles = [
    "admin",
    "super_admin",
  ];

  if (
    !allowedRoles.includes(req.user?.role)
  ) {
    res.status(403).json({
      success: false,
      message:
        "Only Admin and Super Admin can monitor live locations.",
    });

    return false;
  }

  return true;
};

// =====================================================
// GET ALL FIELD EXECUTIVE LIVE LOCATIONS
// =====================================================

const getFieldExecutiveLiveLocations = async (
  req,
  res
) => {
  try {
    if (!checkMonitorAccess(req, res)) {
      return;
    }

    const result = await pool.query(
      `
      SELECT
        fll.id,
        fll.user_id,
        fll.latitude,
        fll.longitude,
        fll.accuracy_meters,
        fll.is_sharing,
        fll.last_updated_at,
        fll.created_at,

        u.full_name,
        u.email,
        u.mobile,
        u.role,
        u.status

      FROM field_live_locations fll

      INNER JOIN users u
        ON u.id = fll.user_id

      WHERE u.role = 'field_executive'

      ORDER BY
        fll.is_sharing DESC,
        fll.last_updated_at DESC,
        u.full_name ASC
      `
    );

    res.status(200).json({
      success: true,
      message:
        "Field Executive live locations fetched successfully.",
      locations: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Field Executive Live Locations Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch Field Executive live locations.",
    });
  }
};

// =====================================================
// GET SINGLE FIELD EXECUTIVE LIVE LOCATION
// =====================================================

const getFieldExecutiveLiveLocationById =
  async (req, res) => {
    try {
      if (!checkMonitorAccess(req, res)) {
        return;
      }

      const { userId } = req.params;

      const result = await pool.query(
        `
        SELECT
          fll.id,
          fll.user_id,
          fll.latitude,
          fll.longitude,
          fll.accuracy_meters,
          fll.is_sharing,
          fll.last_updated_at,
          fll.created_at,

          u.full_name,
          u.email,
          u.mobile,
          u.role,
          u.status

        FROM field_live_locations fll

        INNER JOIN users u
          ON u.id = fll.user_id

        WHERE
          fll.user_id = $1
          AND u.role = 'field_executive'

        LIMIT 1
        `,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Field Executive live location not found.",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Field Executive live location fetched successfully.",
        location: result.rows[0],
      });
    } catch (error) {
      console.error(
        "Get Field Executive Live Location By ID Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to fetch Field Executive live location.",
      });
    }
  };

module.exports = {
  getFieldExecutiveLiveLocations,
  getFieldExecutiveLiveLocationById,
};

