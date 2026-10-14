const pool = require("../../config/db");

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const isValidDate = (date) => {
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
};

const isValidTime = (value) =>
  value == null ||
  value === "" ||
  (
    typeof value === "string" &&
    /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value)
  );

const timeToSeconds = (value) => {
  if (!value) return null;

  const [hours, minutes, seconds = 0] =
    value.split(":").map(Number);

  return hours * 3600 + minutes * 60 + seconds;
};

const allowedStatuses = [
  "Pending",
  "In Progress",
  "Completed",
  "Cancelled",
];

// =====================================================
// CHECK PATROL ACCESS
// =====================================================

const getAccessiblePatrol = async (userId, patrolId) => {
  return pool.query(
    `
    SELECT pl.id, pl.property_id
    FROM patrol_logs pl
    WHERE pl.id = $1
      AND EXISTS (
        SELECT 1
        FROM staff_assignments sa
        WHERE sa.staff_id = $2
          AND sa.property_id = pl.property_id
          AND LOWER(COALESCE(sa.status, '')) = 'active'
      )
    LIMIT 1
    `,
    [patrolId, userId]
  );
};

// =====================================================
// GET SECURITY PATROL LOGS
// =====================================================

const getSecurityPatrols = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        pl.id AS patrol_id,
        pl.property_id,
        pl.user_id AS patrol_user_id,
        pl.patrol_date,
        pl.check_in,
        pl.check_out,
        pl.patrol_status,
        pl.remarks,
        pl.created_at,

        p.property_name,
        p.survey_number,
        p.property_type,
        p.area,
        p.address,
        p.city,
        p.state,
        p.pincode,

        patrol_user.full_name AS patrol_user_name,

        'Active' AS assignment_status

      FROM patrol_logs pl

      INNER JOIN properties p
        ON p.id = pl.property_id

      LEFT JOIN users patrol_user
        ON patrol_user.id = pl.user_id

      WHERE EXISTS (
        SELECT 1
        FROM staff_assignments sa
        WHERE sa.staff_id = $1
          AND sa.property_id = pl.property_id
          AND LOWER(COALESCE(sa.status, '')) = 'active'
      )

      ORDER BY pl.patrol_date DESC, pl.id DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Security patrol logs fetched successfully.",
      patrols: result.rows,
    });
  } catch (error) {
    console.error("Get Security Patrols Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch Security patrol logs.",
    });
  }
};

// =====================================================
// GET SECURITY PATROL DETAILS BY ID
// =====================================================

const getSecurityPatrolById = async (req, res) => {
  try {
    const userId = req.user.id;
    const patrolId = Number(req.params.id);

    if (!Number.isInteger(patrolId) || patrolId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid patrol ID is required.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        pl.id AS patrol_id,
        pl.property_id,
        pl.user_id AS patrol_user_id,
        pl.patrol_date,
        pl.check_in,
        pl.check_out,
        pl.patrol_status,
        pl.remarks,
        pl.created_at,

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

        patrol_user.full_name AS patrol_user_name,
        patrol_user.email AS patrol_user_email,

        sa.assignment_type,
        sa.assignment_date,
        sa.status AS assignment_status,
        sa.notes AS assignment_notes

      FROM patrol_logs pl

      INNER JOIN properties p
        ON p.id = pl.property_id

      LEFT JOIN users patrol_user
        ON patrol_user.id = pl.user_id

      LEFT JOIN LATERAL (
        SELECT
          sa.assignment_type,
          sa.assignment_date,
          sa.status,
          sa.notes
        FROM staff_assignments sa
        WHERE sa.property_id = pl.property_id
          AND sa.staff_id = $1
          AND LOWER(COALESCE(sa.status, '')) = 'active'
        ORDER BY sa.id DESC
        LIMIT 1
      ) sa ON TRUE

      WHERE pl.id = $2
        AND sa.status IS NOT NULL

      LIMIT 1
      `,
      [userId, patrolId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Patrol record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Security patrol details fetched successfully.",
      patrol: result.rows[0],
    });
  } catch (error) {
    console.error("Get Security Patrol By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch patrol details.",
    });
  }
};

// =====================================================
// CREATE SECURITY PATROL
// =====================================================

const createSecurityPatrol = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      property_id,
      patrol_date,
      check_in,
      check_out,
      patrol_status,
      remarks,
    } = req.body;

    if (!property_id || !patrol_date) {
      return res.status(400).json({
        success: false,
        message: "Property and patrol date are required.",
      });
    }

    const propertyId = Number(property_id);

    if (!Number.isInteger(propertyId) || propertyId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid property.",
      });
    }

    if (!isValidDate(patrol_date)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid patrol date.",
      });
    }

    if (!isValidTime(check_in) || !isValidTime(check_out)) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid check-in and check-out times.",
      });
    }

    if (
      check_in &&
      check_out &&
      timeToSeconds(check_out) <= timeToSeconds(check_in)
    ) {
      return res.status(400).json({
        success: false,
        message: "Check-out time must be later than check-in time.",
      });
    }

    const status = patrol_status || "Pending";

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patrol status.",
      });
    }

    const assignment = await pool.query(
      `
      SELECT id
      FROM staff_assignments
      WHERE staff_id = $1
        AND property_id = $2
        AND LOWER(COALESCE(status, '')) = 'active'
      LIMIT 1
      `,
      [userId, propertyId]
    );

    if (assignment.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You are not actively assigned to this property.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO patrol_logs (
        property_id,
        user_id,
        patrol_date,
        check_in,
        check_out,
        patrol_status,
        remarks
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        propertyId,
        userId,
        patrol_date,
        check_in || null,
        check_out || null,
        status,
        typeof remarks === "string" ? remarks.trim() || null : null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Security patrol created successfully.",
      patrol: result.rows[0],
    });
  } catch (error) {
    console.error("Create Security Patrol Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create security patrol.",
    });
  }
};

// =====================================================
// GET ASSIGNED PROPERTIES
// =====================================================

const getAssignedPatrolProperties = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT DISTINCT
        p.id AS property_id,
        p.property_name,
        p.survey_number,
        p.property_type,
        p.address,
        p.city,
        p.state

      FROM staff_assignments sa

      INNER JOIN properties p
        ON p.id = sa.property_id

      WHERE sa.staff_id = $1
        AND LOWER(COALESCE(sa.status, '')) = 'active'

      ORDER BY p.property_name ASC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Assigned properties fetched successfully.",
      properties: result.rows,
    });
  } catch (error) {
    console.error("Get Assigned Patrol Properties Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch assigned properties.",
    });
  }
};

// =====================================================
// UPDATE SECURITY PATROL
// =====================================================

const updateSecurityPatrol = async (req, res) => {
  try {
    const userId = req.user.id;
    const patrolId = Number(req.params.id);

    if (!Number.isInteger(patrolId) || patrolId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid patrol ID is required.",
      });
    }

    const {
      patrol_date,
      check_in,
      check_out,
      patrol_status,
      remarks,
    } = req.body;

    if (!isValidDate(patrol_date)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid patrol date.",
      });
    }

    if (!isValidTime(check_in) || !isValidTime(check_out)) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid patrol times.",
      });
    }

    if (
      check_in &&
      check_out &&
      timeToSeconds(check_out) <= timeToSeconds(check_in)
    ) {
      return res.status(400).json({
        success: false,
        message: "Check-out time must be later than check-in time.",
      });
    }

    if (!allowedStatuses.includes(patrol_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patrol status.",
      });
    }

    if (remarks != null && typeof remarks !== "string") {
      return res.status(400).json({
        success: false,
        message: "Remarks must be text.",
      });
    }

    const access = await getAccessiblePatrol(userId, patrolId);

    if (access.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Patrol not found or not assigned to you.",
      });
    }

    const result = await pool.query(
      `
      UPDATE patrol_logs
      SET
        patrol_date = $1,
        check_in = $2,
        check_out = $3,
        patrol_status = $4,
        remarks = $5
      WHERE id = $6
      RETURNING *
      `,
      [
        patrol_date,
        check_in || null,
        check_out || null,
        patrol_status,
        remarks?.trim() || null,
        patrolId,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Security patrol updated successfully.",
      patrol: result.rows[0],
    });
  } catch (error) {
    console.error("Update Security Patrol Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update security patrol.",
    });
  }
};

// =====================================================
// DELETE SECURITY PATROL
// =====================================================

const deleteSecurityPatrol = async (req, res) => {
  try {
    const userId = req.user.id;
    const patrolId = Number(req.params.id);

    if (!Number.isInteger(patrolId) || patrolId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid patrol ID is required.",
      });
    }

    const access = await getAccessiblePatrol(userId, patrolId);

    if (access.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Patrol not found or not assigned to you.",
      });
    }

    await pool.query(
      `
      DELETE FROM patrol_logs
      WHERE id = $1
      `,
      [patrolId]
    );

    return res.status(200).json({
      success: true,
      message: "Security patrol deleted successfully.",
      patrol_id: patrolId,
    });
  } catch (error) {
    console.error("Delete Security Patrol Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete security patrol.",
    });
  }
};

// =====================================================
// GET SECURITY PATROL REPORTS
// =====================================================

const getSecurityPatrolReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      status,
      from,
      to,
      search,
    } = req.query;

    // -------------------------------------------------
    // BUILD FILTERS SAFELY
    // -------------------------------------------------

    const values = [userId];
    const conditions = [
      `EXISTS (
        SELECT 1
        FROM staff_assignments sa
        WHERE sa.property_id = pl.property_id
          AND sa.staff_id = $1
          AND LOWER(sa.status) = 'active'
      )`,
    ];

    if (status && status !== "all") {
      values.push(status);
      conditions.push(
        `LOWER(pl.patrol_status) = LOWER($${values.length})`
      );
    }

    if (from) {
      values.push(from);
      conditions.push(
        `pl.patrol_date >= $${values.length}::date`
      );
    }

    if (to) {
      values.push(to);
      conditions.push(
        `pl.patrol_date <= $${values.length}::date`
      );
    }

    if (search && search.trim()) {
      values.push(`%${search.trim()}%`);

      const parameter = `$${values.length}`;

      conditions.push(`(
        p.property_name ILIKE ${parameter}
        OR p.survey_number ILIKE ${parameter}
        OR p.address ILIKE ${parameter}
        OR pl.remarks ILIKE ${parameter}
        OR CAST(pl.id AS TEXT) ILIKE ${parameter}
      )`);
    }

    // -------------------------------------------------
    // FETCH REPORTS
    // -------------------------------------------------

    const result = await pool.query(
      `
      SELECT
        pl.id AS patrol_id,
        pl.property_id,
        pl.user_id,
        pl.patrol_date,
        pl.check_in,
        pl.check_out,
        pl.patrol_status,
        pl.remarks,
        pl.created_at,

        p.property_name,
        p.survey_number,
        p.property_type,
        p.address,
        p.city,
        p.state,

        u.full_name AS security_name,
        u.email AS security_email

      FROM patrol_logs pl

      LEFT JOIN properties p
        ON p.id = pl.property_id

      LEFT JOIN users u
        ON u.id = pl.user_id

      WHERE ${conditions.join(" AND ")}

      ORDER BY
        pl.patrol_date DESC,
        pl.id DESC
      `,
      values
    );

    return res.status(200).json({
      success: true,
      message: "Security patrol reports fetched successfully.",
      total: result.rows.length,
      reports: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Security Patrol Reports Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch security patrol reports.",
    });
  }
};

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  getSecurityPatrols,
  getSecurityPatrolById,
  createSecurityPatrol,
  getAssignedPatrolProperties,
  updateSecurityPatrol,
  deleteSecurityPatrol,
  getSecurityPatrolReports,
};
