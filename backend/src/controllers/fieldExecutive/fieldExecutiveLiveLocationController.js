
const pool = require("../../config/db");

const {
  emitFieldLiveLocation,
  emitFieldLocationStopped,
} = require("../../socket");

// =====================================================
// UPDATE LIVE LOCATION
// =====================================================

const updateLiveLocation = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      latitude,
      longitude,
      accuracy_meters,
      is_sharing = true,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Latitude and longitude are required.",
      });
    }

    const latitudeValue = Number(latitude);
    const longitudeValue = Number(longitude);

    if (
      Number.isNaN(latitudeValue) ||
      latitudeValue < -90 ||
      latitudeValue > 90
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude.",
      });
    }

    if (
      Number.isNaN(longitudeValue) ||
      longitudeValue < -180 ||
      longitudeValue > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid longitude.",
      });
    }

    // =================================================
    // CHECK FIELD EXECUTIVE
    // =================================================

    const userResult = await pool.query(
      `
      SELECT
        id,
        full_name,
        role,
        status
      FROM users
      WHERE id = $1
        AND role = 'field_executive'
      LIMIT 1
      `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message:
          "Only Field Executives can share live location.",
      });
    }

    // =================================================
    // UPSERT LOCATION
    // =================================================

    const result = await pool.query(
      `
      INSERT INTO field_live_locations
      (
        user_id,
        latitude,
        longitude,
        accuracy_meters,
        is_sharing,
        last_updated_at
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        CURRENT_TIMESTAMP
      )

      ON CONFLICT (user_id)
      DO UPDATE SET
        latitude =
          EXCLUDED.latitude,

        longitude =
          EXCLUDED.longitude,

        accuracy_meters =
          EXCLUDED.accuracy_meters,

        is_sharing =
          EXCLUDED.is_sharing,

        last_updated_at =
          CURRENT_TIMESTAMP

      RETURNING *
      `,
      [
        userId,
        latitudeValue,
        longitudeValue,
        accuracy_meters ?? null,
        Boolean(is_sharing),
      ]
    );

    const location = result.rows[0];

    // =================================================
    // SOCKET.IO LIVE LOCATION UPDATE
    // =================================================

    emitFieldLiveLocation(
      userId,
      location
    );

    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({
      success: true,
      message:
        "Live location updated successfully.",
      location,
    });
  } catch (error) {
    console.error(
      "Update Field Executive Live Location Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update live location.",
    });
  }
};

// =====================================================
// GET MY LIVE LOCATION
// =====================================================

const getMyLiveLocation = async (req, res) => {
  try {
    const userId = req.user.id;

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

        u.full_name,
        u.email,
        u.mobile

      FROM field_live_locations fll

      INNER JOIN users u
        ON u.id = fll.user_id

      WHERE fll.user_id = $1

      LIMIT 1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Live location not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Live location fetched successfully.",
      location: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get My Live Location Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch live location.",
    });
  }
};

// =====================================================
// STOP LIVE LOCATION
// =====================================================

const stopLiveLocation = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      UPDATE field_live_locations
      SET
        is_sharing = FALSE,
        last_updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING *
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Live location not found.",
      });
    }

    const location = result.rows[0];

    // =================================================
    // SOCKET.IO LOCATION STOP
    // =================================================

    emitFieldLocationStopped(
      userId,
      location
    );

    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({
      success: true,
      message:
        "Live location sharing stopped.",
      location,
    });
  } catch (error) {
    console.error(
      "Stop Live Location Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to stop live location.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  updateLiveLocation,
  getMyLiveLocation,
  stopLiveLocation,
};

