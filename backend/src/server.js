require("dotenv").config();

require("./config/db");

const http = require("http");
const { initSocket } = require("./socket");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const propertyDocumentRoutes = require("./routes/propertyDocumentRoutes");
const legalRoutes = require("./routes/legalRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminPaymentRoutes = require("./routes/admin/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");
const securityReportRoutes = require("./routes/securityReportRoutes");
const fieldVisitRoutes = require("./routes/fieldVisitRoutes");
const geoTaggedReportRoutes = require("./routes/geoTaggedReportRoutes");
const surveillanceCameraRoutes = require("./routes/surveillanceCameraRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const patrolLogRoutes = require("./routes/patrolLogRoutes");
const faqRoutes = require("./routes/faqRoutes");
const liveChatRoutes = require("./routes/liveChatRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const caseTrackingRoutes = require("./routes/caseTrackingRoutes");
const adminUserRoutes = require("./routes/admin/userRoutes");
const adminPropertyRoutes = require("./routes/admin/propertyRoutes");
const refundRoutes = require("./routes/refundRoutes");
const adminRefundRoutes = require("./routes/admin/refundRoutes");
const invoiceRoutes = require("./routes/admin/invoiceRoutes");
const analyticsRoutes = require("./routes/admin/analyticsRoutes");
const adminLegalRoutes = require("./routes/admin/legalRoutes");
const motionDetectionAlertRoutes = require("./routes/admin/motionDetectionAlertRoutes");
const intrusionNotificationRoutes = require("./routes/admin/intrusionNotificationRoutes");
const liveSnapshotRoutes = require("./routes/admin/liveSnapshotRoutes");
const liveCameraFeedRoutes = require("./routes/admin/liveCameraFeedRoutes");
const securityMonitoringDashboardRoutes = require("./routes/admin/securityMonitoringDashboardRoutes");
const staffAssignmentRoutes = require("./routes/admin/staffAssignmentRoutes");
const settingsRoutes = require("./routes/admin/settingsRoutes");
const superAdminDashboardRoutes = require("./routes/superAdmin/superAdminDashboardRoutes");
const superAdminUserRoutes = require("./routes/superAdmin/superAdminUserRoutes");
const superAdminRoleRoutes = require("./routes/superAdmin/superAdminRoleRoutes");
const superAdminPermissionRoutes = require("./routes/superAdmin/superAdminPermissionRoutes");
const superAdminPropertyRoutes = require("./routes/superAdmin/superAdminPropertyRoutes");
const superAdminLegalRoutes = require("./routes/superAdmin/superAdminLegalRoutes");
const superAdminSecurityRoutes = require("./routes/superAdmin/superAdminSecurityRoutes");
const superAdminAppointmentRoutes = require("./routes/superAdmin/superAdminAppointmentRoutes");
const superAdminPaymentRoutes = require("./routes/superAdmin/superAdminPaymentRoutes");
const superAdminStaffRoutes = require("./routes/superAdmin/superAdminStaffRoutes");
const superAdminSupportRoutes = require("./routes/superAdmin/superAdminSupportRoutes");
const superAdminFaqRoutes = require("./routes/superAdmin/superAdminFaqRoutes");
const superAdminNotificationRoutes = require("./routes/superAdmin/superAdminNotificationRoutes");
const superAdminReportRoutes = require("./routes/superAdmin/superAdminReportRoutes");
const superAdminAuditLogRoutes = require("./routes/superAdmin/superAdminAuditLogRoutes");
const superAdminSettingsRoutes = require("./routes/superAdmin/superAdminSettingsRoutes");
const superAdminSecuritySessionRoutes =
  require("./routes/superAdmin/superAdminSecuritySessionRoutes");
  const superAdminBackupRoutes = require("./routes/superAdmin/superAdminBackupRoutes");
  const superAdminIntegrationRoutes = require("./routes/superAdmin/superAdminIntegrationRoutes");
  const legalTeamCaseRoutes = require("./routes/legalTeam/legalTeamCaseRoutes");
  const legalTeamConsultationRoutes = require(
  "./routes/legalTeam/legalTeamConsultationRoutes"
);
const legalTeamAppointmentRoutes = require("./routes/legalTeam/legalTeamAppointmentRoutes");
const legalTeamPropertyRoutes = require("./routes/legalTeam/legalTeamPropertyRoutes");
const legalTeamDocumentRoutes = require("./routes/legalTeam/legalTeamDocumentRoutes");
const legalTeamNotificationRoutes = require("./routes/legalTeam/legalTeamNotificationRoutes");
const legalTeamReportRoutes = require("./routes/legalTeam/legalTeamReportRoutes");
const legalTeamProfileRoutes = require("./routes/legalTeam/legalTeamProfileRoutes");
const fieldExecutiveDashboardRoutes = require("./routes/fieldExecutive/fieldExecutiveDashboardRoutes");
const fieldExecutivePropertyRoutes = require("./routes/fieldExecutive/fieldExecutivePropertyRoutes");
const fieldExecutiveVisitRoutes = require(
  "./routes/fieldExecutive/fieldExecutiveVisitRoutes"
);
const fieldExecutiveGeoAttendanceRoutes =
  require(
    "./routes/fieldExecutive/fieldExecutiveGeoAttendanceRoutes"
  );
  const fieldExecutiveMediaRoutes =
  require(
    "./routes/fieldExecutive/fieldExecutiveMediaRoutes"
  );
  const fieldExecutiveVerificationRoutes =
  require(
    "./routes/fieldExecutive/fieldExecutiveVerificationRoutes"
  );
  const fieldExecutiveVisitReportRoutes =
  require(
    "./routes/fieldExecutive/fieldExecutiveVisitReportRoutes"
  );
  const fieldExecutiveSecurityReportRoutes =
  require(
    "./routes/fieldExecutive/fieldExecutiveSecurityReportRoutes"
  );
  const fieldExecutiveDocumentRoutes =
  require(
    "./routes/fieldExecutive/fieldExecutiveDocumentRoutes"
  );
  const fieldExecutiveAppointmentRoutes =
  require(
    "./routes/fieldExecutive/fieldExecutiveAppointmentRoutes"
  );
const app = express();

app.disable("etag");

/* ------------------------- Middleware ------------------------- */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

/* ---------------------- Static Uploads ------------------------ */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("Current directory:", __dirname);

const uploadPath = path.join(__dirname, "uploads");

console.log("Upload Path:", uploadPath);

app.use("/uploads", express.static(uploadPath));
/* --------------------------- Routes --------------------------- */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Amara Lands API",
    version: "v1",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/property-documents", propertyDocumentRoutes);
app.use("/api/v1/legal", legalRoutes);
app.use("/api/v1/consultations", consultationRoutes);
app.use("/api/v1/case-tracking", caseTrackingRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin/invoices", invoiceRoutes);
//app.use("/api/security-reports", securityReportRoutes);
app.use("/api/v1/field-visits", fieldVisitRoutes);
app.use("/api/v1/security-reports", securityReportRoutes);
app.use("/api/v1/geo-tagged-reports", geoTaggedReportRoutes);
app.use("/api/v1/patrol-logs", patrolLogRoutes);
app.use("/api/v1/surveillance-cameras", surveillanceCameraRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/v1/faqs", faqRoutes);

app.use("/api/v1/live-chat", liveChatRoutes);
app.use("/api/v1/admin/properties", adminPropertyRoutes);
app.use("/api/v1/admin/payments", adminPaymentRoutes);
app.use("/api/v1/refunds", refundRoutes);
app.use("/api/v1/admin/refunds", adminRefundRoutes);
app.use("/api/v1/admin/analytics", analyticsRoutes);
app.use("/api/v1/admin/legal", adminLegalRoutes);
app.use("/api/v1/motion-detection-alerts", motionDetectionAlertRoutes);
app.use("/api/v1/live-snapshots", liveSnapshotRoutes);
app.use("/api/v1/live-camera-feeds", liveCameraFeedRoutes);
app.use("/api/v1/intrusion-notifications", intrusionNotificationRoutes);
app.use(
  "/api/v1/admin/security-monitoring/dashboard",
  securityMonitoringDashboardRoutes,
);
app.use(
  "/api/v1/admin/staff-assignments",
  staffAssignmentRoutes
);
app.use(
  "/api/v1/admin/settings",
  settingsRoutes
);
app.use(
  "/api/v1/super-admin/dashboard",
  superAdminDashboardRoutes
);
app.use(
  "/api/v1/super-admin/users",
  superAdminUserRoutes
);
app.use(
  "/api/v1/super-admin/roles",
  superAdminRoleRoutes
);
app.use(
  "/api/v1/super-admin/permissions",
  superAdminPermissionRoutes
);
app.use(
  "/api/v1/super-admin/properties",
  superAdminPropertyRoutes
);
app.use(
  "/api/v1/super-admin/legal",
  superAdminLegalRoutes
);
app.use(
  "/api/v1/super-admin/security",
  superAdminSecurityRoutes
);
app.use(
  "/api/v1/super-admin/appointments",
  superAdminAppointmentRoutes
);
app.use(
  "/api/v1/super-admin/payments",
  superAdminPaymentRoutes
);
app.use(
  "/api/v1/super-admin/staff",
  superAdminStaffRoutes
);
app.use(
  "/api/v1/super-admin/support",
  superAdminSupportRoutes
);
app.use(
  "/api/v1/super-admin/faqs",
  superAdminFaqRoutes
);
app.use(
  "/api/v1/super-admin/notifications",
  superAdminNotificationRoutes
);
app.use(
  "/api/v1/super-admin/reports",
  superAdminReportRoutes
);
app.use(
  "/api/v1/super-admin/audit-logs",
  superAdminAuditLogRoutes
);
app.use(
  "/api/v1/super-admin/settings",
  superAdminSettingsRoutes
);
app.use(
  "/api/v1/super-admin/security-sessions",
  superAdminSecuritySessionRoutes
);
app.use(
  "/api/v1/super-admin/backup",
  superAdminBackupRoutes
);
app.use(
  "/api/v1/super-admin/integrations",
  superAdminIntegrationRoutes
);
app.use(
  "/api/v1/legal-team/cases",
  legalTeamCaseRoutes
);
app.use(
  "/api/v1/legal-team/consultations",
  legalTeamConsultationRoutes
);
app.use(
  "/api/v1/legal-team/appointments",
  legalTeamAppointmentRoutes
);
app.use(
  "/api/v1/legal-team/properties",
  legalTeamPropertyRoutes
);
app.use(
  "/api/v1/legal-team/documents",
  legalTeamDocumentRoutes
);
app.use(
  "/api/v1/legal-team/notifications",
  legalTeamNotificationRoutes
);
app.use(
  "/api/v1/legal-team/reports",
  legalTeamReportRoutes
);
app.use(
  "/api/v1/legal-team/profile",
  legalTeamProfileRoutes
);
app.use(
  "/api/v1/field/dashboard",
  fieldExecutiveDashboardRoutes
);
app.use(
  "/api/v1/field/properties",
  fieldExecutivePropertyRoutes
);
app.use(
  "/api/v1/field/visits",
  fieldExecutiveVisitRoutes
);
app.use(
  "/api/v1/field/geo-attendance",
  fieldExecutiveGeoAttendanceRoutes
);
app.use(
  "/api/v1/field/media",
  fieldExecutiveMediaRoutes
);
app.use(
  "/api/v1/field/verification",
  fieldExecutiveVerificationRoutes
);
app.use(
  "/api/v1/field/visit-reports",
  fieldExecutiveVisitReportRoutes
);
app.use(
  "/api/v1/field/security-reports",
  fieldExecutiveSecurityReportRoutes
);
app.use(
  "/api/v1/field/documents",
  fieldExecutiveDocumentRoutes
);
app.use(
  "/api/v1/field/appointments",
  fieldExecutiveAppointmentRoutes
);
/* ------------------------- 404 Handler ------------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Not Found",
  });
});

/* ---------------------- Global Error Handler ------------------- */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* --------------------------- Server ---------------------------- */

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
