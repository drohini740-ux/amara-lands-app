
const pool = require("../../config/db");

// =====================================================
// CHECK SECURITY ROLE
// =====================================================
const checkSecurityRole = (req, res) => {
  if (String(req.user?.role || "").toLowerCase() !== "security") {
    res.status(403).json({
      success: false,
      message: "Only Security users can access analytics.",
    });
    return false;
  }

  return true;
};

// =====================================================
// GET SECURITY ANALYTICS
// GET /api/v1/security/analytics
// Optional filters: ?from=2026-10-01&to=2026-10-31
// =====================================================
const getSecurityAnalytics = async (req, res) => {
  try {
    if (!checkSecurityRole(req, res)) return;

    const userId = req.user.id;
    const { from, to } = req.query;

    // Validate dates in YYYY-MM-DD format.
    const isValidDate = (value) => {
      if (!value) return true;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

      const date = new Date(`${value}T00:00:00Z`);
      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    };

    if (!isValidDate(from) || !isValidDate(to)) {
      return res.status(400).json({
        success: false,
        message: "Dates must use the YYYY-MM-DD format.",
      });
    }

    if (from && to && from > to) {
      return res.status(400).json({
        success: false,
        message: "'from' date cannot be after 'to' date.",
      });
    }

    const params = [userId, from || null, to || null];

    // Common date filter. The end date is inclusive.
    const dateFilter = `
      AND ($2::date IS NULL OR created_at >= $2::date)
      AND (
        $3::date IS NULL
        OR created_at < ($3::date + INTERVAL '1 day')
      )
    `;

    // -------------------------------------------------
    // 1. REPORTS BY STATUS
    // -------------------------------------------------
    const reportsByStatusQuery = pool.query(
      `
      SELECT
        COALESCE(sr.report_status, 'Unknown') AS status,
        COUNT(*)::int AS total
      FROM security_reports sr
      WHERE (
        sr.user_id = $1
        OR EXISTS (
          SELECT 1
          FROM staff_assignments sa
          WHERE sa.staff_id = $1
            AND sa.property_id = sr.property_id
            AND LOWER(COALESCE(sa.status, '')) = 'active'
        )
      )
      ${dateFilter.replaceAll("created_at", "sr.created_at")}
      GROUP BY COALESCE(sr.report_status, 'Unknown')
      ORDER BY total DESC
      `,
      params
    );

    // -------------------------------------------------
    // 2. REPORTS BY TYPE
    // -------------------------------------------------
    const reportsByTypeQuery = pool.query(
      `
      SELECT
        COALESCE(sr.report_type, 'Other') AS report_type,
        COUNT(*)::int AS total
      FROM security_reports sr
      WHERE (
        sr.user_id = $1
        OR EXISTS (
          SELECT 1
          FROM staff_assignments sa
          WHERE sa.staff_id = $1
            AND sa.property_id = sr.property_id
            AND LOWER(COALESCE(sa.status, '')) = 'active'
        )
      )
      ${dateFilter.replaceAll("created_at", "sr.created_at")}
      GROUP BY COALESCE(sr.report_type, 'Other')
      ORDER BY total DESC
      LIMIT 10
      `,
      params
    );

    // -------------------------------------------------
    // 3. INTRUSION INCIDENTS BY STATUS
    // -------------------------------------------------
    const incidentsByStatusQuery = pool.query(
      `
      SELECT
        COALESCE(i.status, 'Unknown') AS status,
        COUNT(*)::int AS total
      FROM intrusion_notifications i
      INNER JOIN surveillance_cameras c
        ON c.id = i.camera_id
      WHERE c.user_id = $1
      ${dateFilter.replaceAll("created_at", "i.created_at")}
      GROUP BY COALESCE(i.status, 'Unknown')
      ORDER BY total DESC
      `,
      params
    );

    // -------------------------------------------------
    // 4. MOTION ALERTS BY STATUS
    // -------------------------------------------------
    const motionAlertsByStatusQuery = pool.query(
      `
      SELECT
        COALESCE(m.status, 'Unknown') AS status,
        COUNT(*)::int AS total
      FROM motion_detection_alerts m
      INNER JOIN surveillance_cameras c
        ON c.id = m.camera_id
      WHERE c.user_id = $1
      ${dateFilter.replaceAll("created_at", "m.created_at")}
      GROUP BY COALESCE(m.status, 'Unknown')
      ORDER BY total DESC
      `,
      params
    );

    // -------------------------------------------------
    // 5. PATROLS BY STATUS
    // -------------------------------------------------
    const patrolsByStatusQuery = pool.query(
      `
      SELECT
        COALESCE(pl.patrol_status, 'Unknown') AS status,
        COUNT(*)::int AS total
      FROM patrol_logs pl
      WHERE pl.user_id = $1
      ${dateFilter.replaceAll("created_at", "pl.created_at")}
      GROUP BY COALESCE(pl.patrol_status, 'Unknown')
      ORDER BY total DESC
      `,
      params
    );

    // -------------------------------------------------
    // 6. MONTHLY SECURITY REPORT TREND
    // -------------------------------------------------
    const monthlyTrendQuery = pool.query(
      `
      SELECT
        TO_CHAR(
          DATE_TRUNC('month', sr.created_at),
          'YYYY-MM'
        ) AS month,
        COUNT(*)::int AS total
      FROM security_reports sr
      WHERE (
        sr.user_id = $1
        OR EXISTS (
          SELECT 1
          FROM staff_assignments sa
          WHERE sa.staff_id = $1
            AND sa.property_id = sr.property_id
            AND LOWER(COALESCE(sa.status, '')) = 'active'
        )
      )
      ${dateFilter.replaceAll("created_at", "sr.created_at")}
      GROUP BY DATE_TRUNC('month', sr.created_at)
      ORDER BY DATE_TRUNC('month', sr.created_at)
      `,
      params
    );

    // Run analytics queries together.
    const [
      reportsByStatus,
      reportsByType,
      incidentsByStatus,
      motionAlertsByStatus,
      patrolsByStatus,
      monthlyTrend,
    ] = await Promise.all([
      reportsByStatusQuery,
      reportsByTypeQuery,
      incidentsByStatusQuery,
      motionAlertsByStatusQuery,
      patrolsByStatusQuery,
      monthlyTrendQuery,
    ]);

    // Calculate summary totals.
    const sumTotals = (rows) =>
      rows.reduce((sum, row) => sum + Number(row.total), 0);

    const reportStatuses = reportsByStatus.rows;
    const patrolStatuses = patrolsByStatus.rows;

    const pendingReports = reportStatuses
      .filter((row) =>
        ["pending", "new", "open"].includes(
          String(row.status).toLowerCase()
        )
      )
      .reduce((sum, row) => sum + Number(row.total), 0);

    const resolvedReports = reportStatuses
      .filter((row) =>
        ["resolved", "completed", "closed"].includes(
          String(row.status).toLowerCase()
        )
      )
      .reduce((sum, row) => sum + Number(row.total), 0);

    const completedPatrols = patrolStatuses
      .filter(
        (row) =>
          String(row.status).toLowerCase() === "completed"
      )
      .reduce((sum, row) => sum + Number(row.total), 0);

    const totalPatrols = sumTotals(patrolStatuses);
    const totalIncidents = sumTotals(incidentsByStatus.rows);
    const totalMotionAlerts = sumTotals(motionAlertsByStatus.rows);

    return res.status(200).json({
      success: true,
      message: "Security analytics fetched successfully.",
      filters: {
        from: from || null,
        to: to || null,
      },
      data: {
        overview: {
          total_reports: sumTotals(reportStatuses),
          pending_reports: pendingReports,
          resolved_reports: resolvedReports,
          total_incidents: totalIncidents,
          total_motion_alerts: totalMotionAlerts,
          total_patrols: totalPatrols,
          completed_patrols: completedPatrols,
          patrol_completion_rate:
            totalPatrols === 0
              ? 0
              : Number(
                  ((completedPatrols / totalPatrols) * 100).toFixed(2)
                ),
        },
        reports_by_status: reportStatuses,
        reports_by_type: reportsByType.rows,
        incidents_by_status: incidentsByStatus.rows,
        motion_alerts_by_status: motionAlertsByStatus.rows,
        patrols_by_status: patrolStatuses,
        monthly_report_trend: monthlyTrend.rows,
      },
    });
  } catch (error) {
    console.error("Security Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch security analytics.",
    });
  }
};

module.exports = {
  getSecurityAnalytics,
};
