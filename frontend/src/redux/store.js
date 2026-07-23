import { configureStore } from "@reduxjs/toolkit";

import dashboardReducer from "./dashboardSlice";
import propertyReducer from "./propertySlice";
import propertyDocumentReducer from "./propertyDocumentSlice";
import legalReducer from "./legalSlice";
import appointmentReducer from "./appointmentSlice";
import paymentReducer from "./paymentSlice";
import notificationReducer from "./notificationSlice";

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    //auth: authReducer,
    property: propertyReducer,
    documents: propertyDocumentReducer,
    legal: legalReducer,
     appointments: appointmentReducer,
     payment: paymentReducer,
        notifications: notificationReducer,
  },
});

export default store;