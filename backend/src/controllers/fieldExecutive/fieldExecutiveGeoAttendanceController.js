
const pool = require("../../config/db");

// =====================================================
// CALCULATE DISTANCE BETWEEN TWO GPS LOCATIONS
// Haversine Formula
// =====================================================

const calculateDistance = (
  latitude1,
  longitude1,
  latitude2,
  longitude2
) => {
  const earthRadius = 6371000; // meters

  const toRadians = (value) => {
    return (value * Math.PI) / 180;
  };

  const lat1 = toRadians(latitude1);
  const lat2 = toRadians(latitude2);

  const deltaLatitude = toRadians(
    latitude2 - latitude1
  );

  const deltaLongitude = toRadians(
    longitude2 - longitude1
  );

  const a =
    Math.sin(deltaLatitude / 2) *
      Math.sin(deltaLatitude / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
};

// =====================================================
// RECORD GEO ATTENDANCE
// =====================================================

const recordGeoAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      visit_id,
      latitude,
      longitude,
      accuracy_meters,
      attendance_type,
    } = req.body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !visit_id ||
      latitude === undefined ||
      longitude === undefined ||
      !attendance_type
    ) {
      return res.status(400).json({
        success: false,
        message:
          "visit_id, latitude, longitude and attendance_type are required.",
      });
    }

    if (
      !["check_in", "check_out"].includes(
        attendance_type
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "attendance_type must be check_in or check_out.",
      });
    }

    // -------------------------------------------------
    // GET VISIT + PROPERTY
    // -------------------------------------------------

    const visitResult = await pool.query(
      `
      SELECT
        fv.id AS visit_id,
        fv.user_id,
        fv.property_id,
        fv.check_in,
        fv.check_out,
        fv.visit_status,

        p.property_name,
        p.latitude AS property_latitude,
        p.longitude AS property_longitude

      FROM field_visits fv

      INNER JOIN properties p
        ON p.id = fv.property_id

      WHERE fv.id = $1
        AND fv.user_id = $2

      LIMIT 1
      `,
      [visit_id, userId]
    );

    if (visitResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Visit not found or not assigned to this Field Executive.",
      });
    }

    const visit = visitResult.rows[0];

    // -------------------------------------------------
    // CHECK PROPERTY GPS
    // -------------------------------------------------

    if (
      visit.property_latitude === null ||
      visit.property_longitude === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Property GPS coordinates are not available.",
      });
    }

    // -------------------------------------------------
    // CALCULATE DISTANCE
    // -------------------------------------------------

    const distanceMeters = calculateDistance(
      Number(latitude),
      Number(longitude),
      Number(visit.property_latitude),
      Number(visit.property_longitude)
    );

    // -------------------------------------------------
    // ALLOWED RADIUS
    // -------------------------------------------------

    const allowedRadius = 100;

    const withinRadius =
      distanceMeters <= allowedRadius;

    // -------------------------------------------------
    // SAVE GEO ATTENDANCE
    // -------------------------------------------------

    const result = await pool.query(
      `
      INSERT INTO geo_attendance (
        visit_id,
        user_id,
        property_id,
        attendance_type,
        latitude,
        longitude,
        property_latitude,
        property_longitude,
        distance_meters,
        within_radius,
        accuracy_meters
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
        $10,
        $11
      )
      RETURNING *
      `,
      [
        visit.visit_id,
        userId,
        visit.property_id,
        attendance_type,
        latitude,
        longitude,
        visit.property_latitude,
        visit.property_longitude,
        distanceMeters,
        withinRadius,
        accuracy_meters || null,
      ]
    );

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        withinRadius
          ? "Geo attendance recorded successfully."
          : "Geo attendance recorded, but the Field Executive is outside the allowed property radius.",

      data: {
        ...result.rows[0],
        allowed_radius_meters:
          allowedRadius,
      },
    });
  } catch (error) {
    console.error(
      "Geo Attendance Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to record geo attendance.",
      error: error.message,
    });
  }
};

// =====================================================
// GET GEO ATTENDANCE FOR CURRENT USER
// =====================================================

const getMyGeoAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        ga.*,
        p.property_name,
        p.survey_number
      FROM geo_attendance ga

      INNER JOIN properties p
        ON p.id = ga.property_id

      WHERE ga.user_id = $1

      ORDER BY ga.created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Geo Attendance Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch geo attendance.",
      error: error.message,
    });
  }
};

// =====================================================
// GET GEO ATTENDANCE BY VISIT
// =====================================================

const getGeoAttendanceByVisit = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;
    const visitId = req.params.visitId;

    const result = await pool.query(
      `
      SELECT
        ga.*,
        p.property_name,
        p.survey_number
      FROM geo_attendance ga

      INNER JOIN properties p
        ON p.id = ga.property_id

      WHERE ga.visit_id = $1
        AND ga.user_id = $2

      ORDER BY ga.created_at ASC
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
      "Get Geo Attendance By Visit Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch visit geo attendance.",
      error: error.message,
    });
  }
};

module.exports = {
  recordGeoAttendance,
  getMyGeoAttendance,
  getGeoAttendanceByVisit,
};

