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
  },
});

export default store;