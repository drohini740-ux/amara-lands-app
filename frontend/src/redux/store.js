import { configureStore } from "@reduxjs/toolkit";
import adminUsersReducer from "./adminUserSlice";
import dashboardReducer from "./dashboardSlice";
import propertyReducer from "./propertySlice";
import propertyDocumentReducer from "./propertyDocumentSlice";
import legalReducer from "./legalSlice";
import appointmentReducer from "./appointmentSlice";
import paymentReducer from "./paymentSlice";
import notificationReducer from "./notificationSlice";
import consultationReducer from "./consultationSlice";
import securityReportReducer from "./securityReportSlice";
import fieldVisitReducer from "./fieldVisitSlice";
import geoTaggedReportReducer from "./geoTaggedReportSlice";
import patrolLogReducer from "./patrolLogSlice";
import surveillanceCameraReducer from "./surveillanceCameraSlice";
import ticketReducer from "./ticketSlice";
import adminLegalReducer from "./adminLegalSlice";
import motionDetectionAlertReducer from "./motionDetectionAlertSlice";
import liveSnapshotReducer from "./liveSnapshotSlice";
import liveCameraFeedReducer from "./liveCameraFeedSlice";
import intrusionNotificationReducer from "./intrusionNotificationSlice";
import securityMonitoringDashboardReducer from "./securityMonitoringDashboardSlice";
import staffAssignmentReducer from "./staffAssignmentSlice";
import superAdminDashboardReducer from "./superAdminDashboardSlice";
import superAdminProperty from "./superAdminPropertySlice";
import superAdminLegal from "./superAdminLegalSlice";
import superAdminSecurity from "./superAdminSecuritySlice";
import superAdminAppointment from "./superAdminAppointmentSlice";
import superAdminPayment from "./superAdminPaymentSlice";
import superAdminStaff from "./superAdminStaffSlice";
import superAdminSupport from "./superAdminSupportSlice";
import superAdminFaq from "./superAdminFaqSlice";
import superAdminNotification from "./superAdminNotificationSlice";
import superAdminReport from "./superAdminReportSlice";
import superAdminAuditLog from "./superAdminAuditLogSlice";
import superAdminSettingsReducer from "./superAdminSettingsSlice";
import superAdminSecuritySessionReducer from "./superAdminSecuritySessionSlice";
import superAdminBackupReducer from "./superAdminBackupSlice";
import superAdminIntegrationReducer from "./superAdminIntegrationSlice";
import legalTeamReportReducer from "./legalTeamReportSlice";
import legalTeamProfileReducer from "./legalTeamProfileSlice";
import fieldExecutiveDashboardReducer from "./fieldExecutiveDashboardSlice";
import fieldExecutivePropertyReducer from "./fieldExecutivePropertySlice";
import fieldExecutiveVisitReducer from "./fieldExecutiveVisitSlice";
import fieldExecutiveGeoAttendanceReducer from "./fieldExecutiveGeoAttendanceSlice";
import fieldExecutiveMediaReducer from "./fieldExecutiveMediaSlice";
import fieldExecutiveVerificationReducer
  from "./fieldExecutiveVerificationSlice";
  import fieldExecutiveVisitReportReducer
  from "./fieldExecutiveVisitReportSlice";
  import fieldExecutiveSecurityReportReducer
  from "./fieldExecutiveSecurityReportSlice";
  import fieldExecutiveDocumentReducer
  from "./fieldExecutiveDocumentSlice";
  import fieldExecutiveAppointmentReducer
  from "./fieldExecutiveAppointmentSlice";
const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,

    property: propertyReducer,
    documents: propertyDocumentReducer,

    legal: legalReducer,
    appointments: appointmentReducer,
    payment: paymentReducer,
    notifications: notificationReducer,

    securityReports: securityReportReducer,
    fieldVisits: fieldVisitReducer,
    geoReports: geoTaggedReportReducer,
    patrolLogs: patrolLogReducer,
    surveillanceCameras: surveillanceCameraReducer,

    tickets: ticketReducer,
    consultations: consultationReducer,
    adminUsers: adminUsersReducer,
    adminLegal: adminLegalReducer,
    motionDetectionAlerts: motionDetectionAlertReducer,
    liveSnapshots: liveSnapshotReducer,
    liveCameraFeed: liveCameraFeedReducer,
    intrusionNotifications: intrusionNotificationReducer,
    securityMonitoringDashboard: securityMonitoringDashboardReducer,
    staffAssignment: staffAssignmentReducer,
    superAdminDashboard: superAdminDashboardReducer,
    superAdminProperty: superAdminProperty,
    superAdminLegal: superAdminLegal,
    superAdminSecurity: superAdminSecurity,
    superAdminAppointment: superAdminAppointment,
    superAdminPayment: superAdminPayment,
    superAdminStaff: superAdminStaff,
    superAdminSupport: superAdminSupport,
    superAdminFaq: superAdminFaq,
    superAdminNotification: superAdminNotification,
    superAdminReport: superAdminReport,
    superAdminAuditLog: superAdminAuditLog,
    superAdminSettings: superAdminSettingsReducer,
    superAdminSettings: superAdminSettingsReducer,
    superAdminSecuritySession:superAdminSecuritySessionReducer,
    superAdminBackup: superAdminBackupReducer,
    superAdminIntegration:superAdminIntegrationReducer,
    legalTeamReport: legalTeamReportReducer,
    legalTeamProfile: legalTeamProfileReducer,
    fieldExecutiveDashboard:fieldExecutiveDashboardReducer,
    fieldExecutiveProperty: fieldExecutivePropertyReducer,
    fieldExecutiveVisit:
  fieldExecutiveVisitReducer,
  fieldExecutiveGeoAttendance:
  fieldExecutiveGeoAttendanceReducer,
  fieldExecutiveMedia:
  fieldExecutiveMediaReducer,
  fieldExecutiveVerification:
  fieldExecutiveVerificationReducer,
  fieldExecutiveVisitReport:
  fieldExecutiveVisitReportReducer,
  fieldExecutiveSecurityReport:
  fieldExecutiveSecurityReportReducer,
  fieldExecutiveDocument:
  fieldExecutiveDocumentReducer,
  fieldExecutiveAppointment:
  fieldExecutiveAppointmentReducer,
  },
});

export default store;
