import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/dashboard/Dashboard";
import Properties from "../pages/property/Properties";
import AddProperty from "../pages/property/AddProperty";
import EditProperty from "../pages/property/EditProperty";

import Legal from "../pages/legal/Legal";
import Appointments from "../pages/appointment/Appointments";
import Payments from "../pages/payment/Payments";
import Profile from "../pages/profile/Profile";
import ViewProperty from "../pages/property/ViewProperty";
import PropertyDocuments from "../pages/property/PropertyDocuments";
import MainLayout from "../layouts/MainLayout";
import AddLegalCase from "../pages/legal/AddLegalCase";
import ViewLegalCase from "../pages/legal/ViewLegalCase";
import EditLegalCase from "../pages/legal/EditLegalCase";
import AddAppointment from "../pages/appointment/AddAppointment";
import ViewAppointment from "../pages/appointment/ViewAppointment";
import EditAppointment from "../pages/appointment/EditAppointment";
import AddPayment from "../pages/payment/AddPayment";
import ViewPayment from "../pages/payment/ViewPayment";
import EditPayment from "../pages/payment/EditPayment";
import NotificationList from "../pages/notification/NotificationList";
import PaymentReceipt from "../pages/payment/PaymentReceipt";
import PaymentDashboard from "../pages/payment/PaymentDashboard";
import PaymentHistory from "../pages/payment/PaymentHistory";
import EditProfile from "../pages/profile/EditProfile";
import SecurityReports from "../pages/security-monitoring/security-reports/SecurityReports";
import AddSecurityReport from "../pages/security-monitoring/security-reports/AddSecurityReport";
import ViewSecurityReport from "../pages/security-monitoring/security-reports/ViewSecurityReport";
import EditSecurityReport from "../pages/security-monitoring/security-reports/EditSecurityReport";
import FieldVisits from "../pages/security-monitoring/field-visits/FieldVisits";
import AddFieldVisit from "../pages/security-monitoring/field-visits/AddFieldVisit";
import ViewFieldVisit from "../pages/security-monitoring/field-visits/ViewFieldVisit";
import EditFieldVisit from "../pages/security-monitoring/field-visits/EditFieldVisit";
import SecurityMonitoring from "../pages/security-monitoring/SecurityMonitoring";
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
import Tickets from "../pages/customer-support/tickets/Tickets";
import AddTicket from "../pages/customer-support/tickets/AddTicket";
import ViewTicket from "../pages/customer-support/tickets/ViewTicket";

import CustomerSupport from "../pages/customer-support/CustomerSupport";
import FAQs from "../pages/customer-support/faq/FAQs";
import LiveChat from "../pages/customer-support/live-chat/LiveChat";
import WhatsAppSupport from "../pages/customer-support/whatsapp/WhatsAppSupport";


export default function AppRoutes() {
  return (
    <Routes>
      {/* Authentication */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Property */}
        <Route path="/properties" element={<Properties />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/properties/edit/:id" element={<EditProperty />} />

        {/* Other Modules */}
        <Route path="/legal" element={<Legal />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/properties/view/:id" element={<ViewProperty />} />
        <Route
          path="/properties/:propertyId/documents"
          element={<PropertyDocuments />}
        />
        <Route path="/legal/add" element={<AddLegalCase />} />
        <Route path="/legal/view/:id" element={<ViewLegalCase />} />
        <Route path="/legal/edit/:id" element={<EditLegalCase />} />
        <Route path="/appointments/add" element={<AddAppointment />} />
        <Route path="/appointments/view/:id" element={<ViewAppointment />} />
        <Route path="/appointments/edit/:id" element={<EditAppointment />} />
        <Route path="/payments/add" element={<AddPayment />} />
        <Route path="/payments/view/:id" element={<ViewPayment />} />
        <Route path="/payments/edit/:id" element={<EditPayment />} />
        <Route path="/notifications" element={<NotificationList />} />
        <Route path="/payments/receipt/:id" element={<PaymentReceipt />} />
        <Route path="/payment-dashboard" element={<PaymentDashboard />} />
        <Route path="/payments/history" element={<PaymentHistory />} />
        {/* Profile */}
        {<Route path="/profile" element={<Profile />} />}
        <Route path="/profile/edit" element={<EditProfile />} />
        {/* Security Monitoring */}

        <Route path="/security-reports" element={<SecurityReports />} />
        <Route path="/security-monitoring" element={<SecurityMonitoring />} />
        <Route path="/security-reports/add" element={<AddSecurityReport />} />
        <Route
          path="/security-reports/view/:id"
          element={<ViewSecurityReport />}
        />
        <Route
          path="/security-reports/edit/:id"
          element={<EditSecurityReport />}
        />

        <Route path="/field-visits" element={<FieldVisits />} />
        <Route path="/field-visits/add" element={<AddFieldVisit />} />
        <Route path="/field-visits/view/:id" element={<ViewFieldVisit />} />
        <Route path="/field-visits/edit/:id" element={<EditFieldVisit />} />
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
        <Route path="/patrol-logs" element={<PatrolLogs />} />
        <Route path="/patrol-logs/add" element={<AddPatrolLog />} />
        <Route path="/patrol-logs/view/:id" element={<ViewPatrolLog />} />
        <Route path="/patrol-logs/edit/:id" element={<EditPatrolLog />} />
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
       <Route path="/support" element={<CustomerSupport />} />

<Route path="/tickets" element={<Tickets />} />
<Route path="/tickets/add" element={<AddTicket />} />
<Route path="/tickets/view/:id" element={<ViewTicket />} />

<Route path="/faq" element={<FAQs />} />
<Route path="/whatsapp" element={<WhatsAppSupport />} />
<Route path="/live-chat" element={<LiveChat />} />

      </Route>
    </Routes>
  );
}
