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
import Support from "../pages/support/Support";
// import Profile from "../pages/profile/Profile"; // Uncomment if created
import ViewProperty from "../pages/property/ViewProperty";
import PropertyDocuments from "../pages/property/PropertyDocuments";
import MainLayout from "../layouts/MainLayout";
import AddLegalCase from "../pages/legal/AddLegalCase";
import ViewLegalCase from "../pages/legal/ViewLegalCase";
import EditLegalCase from "../pages/legal/EditLegalCase";
import AddAppointment from "../pages/appointment/AddAppointment";
import ViewAppointment from "../pages/appointment/ViewAppointment";
import EditAppointment from "../pages/appointment/EditAppointment";

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
        <Route path="/support" element={<Support />} />
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

        {/* Profile */}
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Route>
    </Routes>
  );
}
