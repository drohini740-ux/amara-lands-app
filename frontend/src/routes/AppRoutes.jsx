import { Routes, Route, Navigate } from "react-router-dom";

// =====================================================
// ADMIN
// =====================================================

import AdminLayout from "../layouts/AdminLayout";

import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";

import Users from "../pages/admin/users/Users";
import AddUser from "../pages/admin/users/AddUser";
import ViewUser from "../pages/admin/users/ViewUser";
import EditUser from "../pages/admin/users/EditUser";

import RefundManagement from "../pages/admin/refunds/RefundManagement";

import InvoiceManagement from "../pages/admin/payments/InvoiceManagement";
import PaymentDashboard from "../pages/admin/payments/PaymentDashboard";
import AdminPayments from "../pages/admin/payments/Payments";

import Analytics from "../pages/admin/analytics/Analytics";

import AdminLegal from "../pages/admin/legal/AdminLegal";
import LegalCaseView from "../pages/admin/legal/LegalCaseView";
import LegalCaseEdit from "../pages/admin/legal/LegalCaseEdit";
import ProtectedRoute from "../components/common/ProtectedRoute";

// =====================================================
// ADMIN SECURITY
// =====================================================

import AdminSecurityMonitoring from "../pages/admin/security/SecurityMonitoring";
import AdminSurveillanceCameras from "../pages/admin/security/SurveillanceCameras";

import MotionDetectionAlerts from "../pages/admin/security/MotionDetectionAlerts";
import MotionDetectionAlertView from "../pages/admin/security/MotionDetectionAlertView";

import LiveSnapshots from "../pages/admin/security/LiveSnapshots";
import LiveCameraFeed from "../pages/admin/security/LiveCameraFeed";

import IntrusionNotifications from "../pages/admin/security/IntrusionNotifications";
import IntrusionNotificationView from "../pages/admin/security/IntrusionNotificationView";

import SecurityDashboard from "../pages/admin/security/SecurityDashboard";
import StaffAssignments from "../pages/admin/staff/StaffAssignments";
import AddStaffAssignment from "../pages/admin/staff/AddStaffAssignment";
import ViewStaffAssignment from "../pages/admin/staff/ViewStaffAssignment";
import EditStaffAssignment from "../pages/admin/staff/EditStaffAssignment";
import AdminSettings from "../pages/admin/settings/AdminSettings";
import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";
import SuperAdminLayout from "../layouts/SuperAdminLayout";
import SuperAdminUsers from "../pages/superAdmin/SuperAdminUsers";
import SuperAdminAddUser from "../pages/superAdmin/SuperAdminAddUser";
import SuperAdminEditUser from "../pages/superAdmin/SuperAdminEditUser";
import SuperAdminRoles from "../pages/superAdmin/SuperAdminRoles";
import SuperAdminAddRole from "../pages/superAdmin/SuperAdminAddRole";
import SuperAdminEditRole from "../pages/superAdmin/SuperAdminEditRole";
import SuperAdminRolePermissions from "../pages/superAdmin/SuperAdminRolePermissions";
import SuperAdminProperties from "../pages/superAdmin/SuperAdminProperties";
import SuperAdminLegal from "../pages/superAdmin/SuperAdminLegal";
import SuperAdminSecurity from "../pages/superAdmin/SuperAdminSecurity";
import SuperAdminAppointments from "../pages/superAdmin/SuperAdminAppointments";
import SuperAdminPayments from "../pages/superAdmin/SuperAdminPayments";
import SuperAdminStaff from "../pages/superAdmin/SuperAdminStaff";
import SuperAdminSupport from "../pages/superAdmin/SuperAdminSupport";
import SuperAdminFaqs from "../pages/superAdmin/SuperAdminFaqs";
import SuperAdminNotifications from "../pages/superAdmin/SuperAdminNotifications";
import SuperAdminReports from "../pages/superAdmin/SuperAdminReports";
import SuperAdminAuditLogs from "../pages/superAdmin/SuperAdminAuditLogs";
import SuperAdminSettings from "../pages/superAdmin/SuperAdminSettings";
import SuperAdminSecuritySessions from "../pages/superAdmin/SuperAdminSecuritySessions";
import SuperAdminBackup from "../pages/superAdmin/SuperAdminBackup";
import SuperAdminIntegrations from "../pages/superAdmin/SuperAdminIntegrations";
import LegalTeamLayout from "../components/legalTeam/LegalTeamLayout";
import LegalTeamDashboard from "../pages/legalTeam/LegalTeamDashboard";
import LegalTeamCases from "../pages/legalTeam/LegalTeamCases";
import LegalTeamCaseDetails from "../pages/legalTeam/LegalTeamCaseDetails";
import LegalTeamConsultations from "../pages/legalTeam/LegalTeamConsultations";
import LegalTeamConsultationDetails from "../pages/legalTeam/LegalTeamConsultationDetails";
import LegalTeamAppointments from "../pages/legalTeam/LegalTeamAppointments";
import LegalTeamAppointmentDetails from "../pages/legalTeam/LegalTeamAppointmentDetails";
import LegalTeamProperties from "../pages/legalTeam/LegalTeamProperties";
import LegalTeamPropertyDetails from "../pages/legalTeam/LegalTeamPropertyDetails";
import LegalTeamDocuments from "../pages/legalTeam/LegalTeamDocuments";
import LegalTeamDocumentDetails from "../pages/legalTeam/LegalTeamDocumentDetails";
import LegalTeamNotifications from "../pages/legalTeam/LegalTeamNotifications";
import LegalTeamNotificationDetails from "../pages/legalTeam/LegalTeamNotificationDetails";
import LegalTeamReports from "../pages/legalTeam/LegalTeamReports";
import LegalTeamProfile from "../pages/legalTeam/LegalTeamProfile";
import FieldExecutiveLayout from "../components/fieldExecutive/FieldExecutiveLayout";
import FieldExecutiveDashboard from "../pages/fieldExecutive/FieldExecutiveDashboard";
import FieldExecutiveProperties from "../pages/fieldExecutive/FieldExecutiveProperties";
import FieldExecutivePropertyDetails from "../pages/fieldExecutive/FieldExecutivePropertyDetails";
import FieldExecutiveVisits from "../pages/fieldExecutive/FieldExecutiveVisits";
import FieldExecutiveVisitDetails from "../pages/fieldExecutive/FieldExecutiveVisitDetails";
//import FieldExecutiveVisitDetails from "../pages/fieldExecutive/FieldExecutiveVisitDetails";
import FieldExecutiveSecurityReports
  from "../pages/fieldExecutive/FieldExecutiveSecurityReports";
  import FieldExecutiveDocuments
  from "../pages/fieldExecutive/FieldExecutiveDocuments";
  import FieldExecutiveAppointments
  from "../pages/fieldExecutive/FieldExecutiveAppointments";
// =====================================================
// AUTH
// =====================================================

import Login from "../pages/auth/Login";

import Register from "../pages/auth/Register";

// =====================================================
// CUSTOMER / MAIN LAYOUT
// =====================================================

import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Customer/dashboard/Dashboard";

// =====================================================
// PROPERTY
// =====================================================

import Properties from "../pages/Customer/property/Properties";
import AddProperty from "../pages/Customer/property/AddProperty";
import EditProperty from "../pages/Customer/property/EditProperty";
import ViewProperty from "../pages/Customer/property/ViewProperty";
import PropertyDocuments from "../pages/Customer/property/PropertyDocuments";

// =====================================================
// LEGAL
// =====================================================

import Legal from "../pages/legal/Legal";
import AddLegalCase from "../pages/legal/AddLegalCase";
import ViewLegalCase from "../pages/legal/ViewLegalCase";
import EditLegalCase from "../pages/legal/EditLegalCase";
import CaseTracking from "../pages/legal/CaseTracking";

import Consultation from "../pages/legal/consultation/Consultation";
import AddConsultation from "../pages/legal/consultation/AddConsultation";
import EditConsultation from "../pages/legal/consultation/EditConsultation";
import ViewConsultation from "../pages/legal/consultation/ViewConsultation";

// =====================================================
// APPOINTMENTS
// =====================================================

import Appointments from "../pages/Customer/appointment/Appointments";
import AddAppointment from "../pages/Customer/appointment/AddAppointment";
import ViewAppointment from "../pages/Customer/appointment/ViewAppointment";
import EditAppointment from "../pages/Customer/appointment/EditAppointment";

// =====================================================
// CUSTOMER PAYMENTS
// =====================================================

import Payments from "../pages/Customer/payment/Payments";
import AddPayment from "../pages/Customer/payment/AddPayment";
import ViewPayment from "../pages/Customer/payment/ViewPayment";
import EditPayment from "../pages/Customer/payment/EditPayment";
import PaymentReceipt from "../pages/Customer/payment/PaymentReceipt";
import PaymentHistory from "../pages/Customer/payment/PaymentHistory";
import Invoice from "../pages/Customer/payment/Invoice";
import Refund from "../pages/Customer/payment/Refund";

// =====================================================
// NOTIFICATIONS
// =====================================================

import NotificationList from "../pages/Customer/notification/NotificationList";

// =====================================================
// PROFILE
// =====================================================

import Profile from "../pages/Customer/profile/Profile";
import EditProfile from "../pages/Customer/profile/EditProfile";

// =====================================================
// CUSTOMER SECURITY MONITORING
// =====================================================

import SecurityMonitoring from "../pages/security-monitoring/SecurityMonitoring";

import SecurityReports from "../pages/security-monitoring/security-reports/SecurityReports";
import AddSecurityReport from "../pages/security-monitoring/security-reports/AddSecurityReport";
import ViewSecurityReport from "../pages/security-monitoring/security-reports/ViewSecurityReport";
import EditSecurityReport from "../pages/security-monitoring/security-reports/EditSecurityReport";

import FieldVisits from "../pages/security-monitoring/field-visits/FieldVisits";
import AddFieldVisit from "../pages/security-monitoring/field-visits/AddFieldVisit";
import ViewFieldVisit from "../pages/security-monitoring/field-visits/ViewFieldVisit";
import EditFieldVisit from "../pages/security-monitoring/field-visits/EditFieldVisit";

import GeoTaggedReports from "../pages/security-monitoring/geo-tagged-reports/GeoTaggedReports";
import AddGeoTaggedReport from "../pages/security-monitoring/geo-tagged-reports/AddGeoTaggedReport";
import ViewGeoTaggedReport from "../pages/security-monitoring/geo-tagged-reports/ViewGeoTaggedReport";
import EditGeoTaggedReport from "../pages/security-monitoring/geo-tagged-reports/EditGeoTaggedReport";

import PatrolLogs from "../pages/security-monitoring/patrol-logs/PatrolLogs";
import AddPatrolLog from "../pages/security-monitoring/patrol-logs/AddPatrolLog";
import ViewPatrolLog from "../pages/security-monitoring/patrol-logs/ViewPatrolLog";
import EditPatrolLog from "../pages/security-monitoring/patrol-logs/EditPatrolLog";

import SurveillanceCameras from "../pages/security-monitoring/surveillance-cameras/SurveillanceCameras";
import AddSurveillanceCamera from "../pages/security-monitoring/surveillance-cameras/AddSurveillanceCamera";
import ViewSurveillanceCamera from "../pages/security-monitoring/surveillance-cameras/ViewSurveillanceCamera";
import EditSurveillanceCamera from "../pages/security-monitoring/surveillance-cameras/EditSurveillanceCamera";
import FieldExecutiveRouteNavigation from "../pages/fieldExecutive/FieldExecutiveRouteNavigation";
import FieldExecutivePropertyVerification
  from "../pages/fieldExecutive/FieldExecutivePropertyVerification";
  import FieldExecutiveSiteVisits
  from "../pages/fieldExecutive/FieldExecutiveSiteVisits";
  import FieldExecutiveVisitReports
  from "../pages/fieldExecutive/FieldExecutiveVisitReports";
// =====================================================
// CUSTOMER SUPPORT
// =====================================================

import CustomerSupport from "../pages/customer-support/CustomerSupport";

import Tickets from "../pages/customer-support/tickets/Tickets";
import AddTicket from "../pages/customer-support/tickets/AddTicket";
import ViewTicket from "../pages/customer-support/tickets/ViewTicket";
import EditTicket from "../pages/customer-support/tickets/EditTicket";

import FAQs from "../pages/customer-support/faq/FAQs";
import LiveChat from "../pages/customer-support/live-chat/LiveChat";
import WhatsAppSupport from "../pages/customer-support/whatsapp/WhatsAppSupport";

// =====================================================
// ADMIN PROPERTIES
// =====================================================

import AdminProperties from "../pages/admin/properties/Properties";

// =====================================================
// PROTECTION
// =====================================================

//import ProtectedRoute from "./ProtectedRoute";

// =====================================================
// APP ROUTES
// =====================================================

export default function AppRoutes() {
  return (
    <Routes>
      {/* =====================================================
          AUTHENTICATION
      ===================================================== */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* =====================================================
          CUSTOMER / MAIN APPLICATION
      ===================================================== */}
      <Route element={<MainLayout />}>
        {/* ================= DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            PROPERTY
        ================================================= */}

        <Route path="/properties" element={<Properties />} />

        <Route path="/add-property" element={<AddProperty />} />

        <Route path="/properties/edit/:id" element={<EditProperty />} />

        <Route path="/properties/view/:id" element={<ViewProperty />} />

        <Route
          path="/properties/:propertyId/documents"
          element={<PropertyDocuments />}
        />

        {/* =================================================
            LEGAL
        ================================================= */}

        <Route path="/legal" element={<Legal />} />

        <Route path="/legal/add" element={<AddLegalCase />} />

        <Route path="/legal/view/:id" element={<ViewLegalCase />} />

        <Route path="/legal/edit/:id" element={<EditLegalCase />} />

        <Route path="/case-tracking" element={<CaseTracking />} />

        {/* =================================================
            CONSULTATIONS
        ================================================= */}

        <Route path="/consultations" element={<Consultation />} />

        <Route path="/consultations/add" element={<AddConsultation />} />

        <Route path="/consultations/view/:id" element={<ViewConsultation />} />

        <Route path="/consultations/edit/:id" element={<EditConsultation />} />

        {/* =================================================
            APPOINTMENTS
        ================================================= */}

        <Route path="/appointments" element={<Appointments />} />

        <Route path="/appointments/add" element={<AddAppointment />} />

        <Route path="/appointments/view/:id" element={<ViewAppointment />} />

        <Route path="/appointments/edit/:id" element={<EditAppointment />} />

        {/* =================================================
            CUSTOMER PAYMENTS
        ================================================= */}

        <Route path="/payments" element={<Payments />} />

        <Route path="/payments/add" element={<AddPayment />} />

        <Route path="/payments/view/:id" element={<ViewPayment />} />

        <Route path="/payments/edit/:id" element={<EditPayment />} />

        <Route path="/payments/receipt/:id" element={<PaymentReceipt />} />

        <Route path="/payments/history" element={<PaymentHistory />} />

        <Route path="/payments/invoice/:id" element={<Invoice />} />

        <Route path="/payments/refund/:id" element={<Refund />} />

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <Route path="/notifications" element={<NotificationList />} />

        {/* =================================================
            PROFILE
        ================================================= */}

        <Route path="/profile" element={<Profile />} />

        <Route path="/profile/edit" element={<EditProfile />} />

        {/* =================================================
            CUSTOMER SECURITY MONITORING
        ================================================= */}

        <Route path="/security-monitoring" element={<SecurityMonitoring />} />

        {/* ================= SECURITY REPORTS ================= */}

        <Route path="/security-reports" element={<SecurityReports />} />

        <Route path="/security-reports/add" element={<AddSecurityReport />} />

        <Route
          path="/security-reports/view/:id"
          element={<ViewSecurityReport />}
        />

        <Route
          path="/security-reports/edit/:id"
          element={<EditSecurityReport />}
        />

        {/* ================= FIELD VISITS ================= */}

        <Route path="/field-visits" element={<FieldVisits />} />

        <Route path="/field-visits/add" element={<AddFieldVisit />} />

        <Route path="/field-visits/view/:id" element={<ViewFieldVisit />} />

        <Route path="/field-visits/edit/:id" element={<EditFieldVisit />} />

        {/* ================= GEO TAGGED REPORTS ================= */}

        <Route path="/geo-tagged-reports" element={<GeoTaggedReports />} />

        <Route
          path="/geo-tagged-reports/add"
          element={<AddGeoTaggedReport />}
        />

        <Route
          path="/geo-tagged-reports/view/:id"
          element={<ViewGeoTaggedReport />}
        />

        <Route
          path="/geo-tagged-reports/edit/:id"
          element={<EditGeoTaggedReport />}
        />

        {/* ================= PATROL LOGS ================= */}

        <Route path="/patrol-logs" element={<PatrolLogs />} />

        <Route path="/patrol-logs/add" element={<AddPatrolLog />} />

        <Route path="/patrol-logs/view/:id" element={<ViewPatrolLog />} />

        <Route path="/patrol-logs/edit/:id" element={<EditPatrolLog />} />

        {/* ================= SURVEILLANCE CAMERAS ================= */}

        <Route path="/surveillance-cameras" element={<SurveillanceCameras />} />

        <Route
          path="/surveillance-cameras/add"
          element={<AddSurveillanceCamera />}
        />

        <Route
          path="/surveillance-cameras/view/:id"
          element={<ViewSurveillanceCamera />}
        />

        <Route
          path="/surveillance-cameras/edit/:id"
          element={<EditSurveillanceCamera />}
        />

        {/* =================================================
            CUSTOMER SUPPORT
        ================================================= */}

        <Route path="/support" element={<CustomerSupport />} />

        <Route path="/tickets" element={<Tickets />} />

        <Route path="/tickets/add" element={<AddTicket />} />

        <Route path="/tickets/view/:id" element={<ViewTicket />} />

        <Route path="/tickets/edit/:id" element={<EditTicket />} />

        <Route path="/faq" element={<FAQs />} />

        <Route path="/whatsapp" element={<WhatsAppSupport />} />

        <Route path="/live-chat" element={<LiveChat />} />
      </Route>
      {/* =====================================================
          ADMIN MODULE
      ===================================================== */}
      <Route element={<AdminLayout />}>
        {/* =================================================
            ADMIN DASHBOARD
        ================================================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN USERS
        ================================================= */}

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/view/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ViewUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditUser />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN PROPERTIES
        ================================================= */}

        <Route
          path="/admin/properties"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProperties />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN PAYMENTS
        ================================================= */}

        <Route
          path="/admin/payment-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PaymentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPayments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/invoices"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <InvoiceManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/refunds"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RefundManagement />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN ANALYTICS
        ================================================= */}

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN LEGAL
        ================================================= */}

        <Route
          path="/admin/legal"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLegal />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/legal/view/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LegalCaseView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/legal/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LegalCaseEdit />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            ADMIN SECURITY MONITORING
        ===================================================== */}

        {/* Security Dashboard */}

        <Route
          path="/admin/security"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SecurityDashboard />
            </ProtectedRoute>
          }
        />

        {/* Security Monitoring Main Page */}

        <Route
          path="/admin/security/monitoring"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSecurityMonitoring />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            SURVEILLANCE CAMERAS
        ================================================= */}

        <Route
          path="/admin/security/surveillance-cameras"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSurveillanceCameras />
            </ProtectedRoute>
          }
        />

        {/* Camera View */}

        <Route
          path="/admin/security/surveillance-cameras/view/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSurveillanceCameras />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            LIVE CAMERA FEED
        ================================================= */}

        <Route
          path="/admin/security/live-feed"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LiveCameraFeed />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            LIVE SNAPSHOTS
        ================================================= */}

        <Route
          path="/admin/security/live-snapshots"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LiveSnapshots />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            MOTION DETECTION ALERTS
        ================================================= */}

        <Route
          path="/admin/security/motion-detection-alerts"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MotionDetectionAlerts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/security/motion-detection-alerts/view/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MotionDetectionAlertView />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            INTRUSION NOTIFICATIONS
        ================================================= */}

        <Route
          path="/admin/security/intrusion-notifications"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <IntrusionNotifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/security/intrusion-notifications/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <IntrusionNotificationView />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            SECURITY REPORTS
        ================================================= */}

        <Route
          path="/admin/security/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SecurityReports />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            FIELD VISITS
        ================================================= */}

        <Route
          path="/admin/security/field-visits"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FieldVisits />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            GEO-TAGGED REPORTS
        ================================================= */}

        <Route
          path="/admin/security/geo-reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <GeoTaggedReports />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            PATROL LOGS
        ================================================= */}

        <Route
          path="/admin/security/patrol-logs"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PatrolLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <StaffAssignments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/staff/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddStaffAssignment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/staff/view/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ViewStaffAssignment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/staff/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditStaffAssignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="users" element={<SuperAdminUsers />} />
        <Route path="users/add" element={<SuperAdminAddUser />} />
        <Route path="users/edit/:id" element={<SuperAdminEditUser />} />
        <Route path="roles" element={<SuperAdminRoles />} />
        <Route path="roles/add" element={<SuperAdminAddRole />} />
        <Route path="roles/edit/:id" element={<SuperAdminEditRole />} />
        <Route
          path="roles/:roleId/permissions"
          element={<SuperAdminRolePermissions />}
        />
        <Route path="properties" element={<SuperAdminProperties />} />
        <Route path="legal" element={<SuperAdminLegal />} />
        <Route path="security" element={<SuperAdminSecurity />} />
        <Route path="appointments" element={<SuperAdminAppointments />} />
        <Route path="payments" element={<SuperAdminPayments />} />
        <Route path="staff" element={<SuperAdminStaff />} />
        <Route path="support" element={<SuperAdminSupport />} />
        <Route path="faqs" element={<SuperAdminFaqs />} />
        <Route path="notifications" element={<SuperAdminNotifications />} />
        <Route path="reports" element={<SuperAdminReports />} />
        <Route path="audit-logs" element={<SuperAdminAuditLogs />} />
        <Route path="settings" element={<SuperAdminSettings />} />
        <Route
          path="security-sessions"
          element={<SuperAdminSecuritySessions />}
        />
        <Route path="backup" element={<SuperAdminBackup />} />
        <Route path="integrations" element={<SuperAdminIntegrations />} />
      </Route>
      <Route
  path="/legal/dashboard"
  element={<Navigate to="/legal-team/dashboard" replace />}
/>
      <Route
        path="/legal-team"
        element={
          <ProtectedRoute allowedRoles={["legal"]}>
            <LegalTeamLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<LegalTeamDashboard />} />
         <Route
    path="cases"
    element={<LegalTeamCases />}
  />
   <Route
    path="cases/view/:id"
    element={<LegalTeamCaseDetails />}
  />
  <Route
  path="consultations"
  element={<LegalTeamConsultations />}
/>
<Route
  path="consultations/view/:id"
  element={<LegalTeamConsultationDetails />}
/>
<Route
  path="appointments"
  element={<LegalTeamAppointments />}
/>
<Route
  path="appointments/view/:id"
  element={<LegalTeamAppointmentDetails />}
/>
<Route
  path="properties"
  element={<LegalTeamProperties />}
/>
<Route
  path="properties/view/:id"
  element={<LegalTeamPropertyDetails />}
/>
<Route
  path="documents"
  element={<LegalTeamDocuments />}
/>
<Route
  path="documents/view/:id"
  element={<LegalTeamDocumentDetails />}
/>
<Route
  path="notifications"
  element={<LegalTeamNotifications />}
/>
<Route
  path="notifications/view/:id"
  element={<LegalTeamNotificationDetails />}
/>
<Route
  path="reports"
  element={<LegalTeamReports />}
/>
<Route
  path="profile"
  element={<LegalTeamProfile />}
/>
      </Route>
      <Route
  path="/field"
  element={
    <ProtectedRoute
      allowedRoles={["field_executive"]}
    >
      <FieldExecutiveLayout />
    </ProtectedRoute>
  }
>
  <Route
    path="dashboard"
    element={<FieldExecutiveDashboard />}
  />
  <Route
  path="properties"
  element={<FieldExecutiveProperties />}
/>
<Route
  path="properties/:id"
  element={<FieldExecutivePropertyDetails />}
/>
<Route
  path="visits"
  element={<FieldExecutiveVisits />}
/>
<Route
  path="visits/:id"
  element={
    <FieldExecutiveVisitDetails />
  }
/>
<Route
  path="route-navigation"
  element={
    <FieldExecutiveRouteNavigation />
  }
/>
<Route
  path="verification"
  element={
    <FieldExecutivePropertyVerification />
  }
/>
<Route
  path="site-visits"
  element={
    <FieldExecutiveSiteVisits />
  }
/>
<Route
  path="visit-reports"
  element={
    <FieldExecutiveVisitReports />
  }
/>
<Route
  path="security-reports"
  element={
    <FieldExecutiveSecurityReports />
  }
/>
<Route
  path="documents"
  element={
    <FieldExecutiveDocuments />
  }
/>
<Route
  path="appointments"
  element={
    <FieldExecutiveAppointments />
  }
/>
</Route>
    </Routes>
  );
}
