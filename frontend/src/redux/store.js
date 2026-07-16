import { configureStore } from "@reduxjs/toolkit";

import dashboardReducer from "./dashboardSlice";
import propertyReducer from "./propertySlice";
import propertyDocumentReducer from "./propertyDocumentSlice";
import legalReducer from "./legalSlice";
import appointmentReducer from "./appointmentSlice";

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    //auth: authReducer,
    property: propertyReducer,
    documents: propertyDocumentReducer,
    legal: legalReducer,
     appointments: appointmentReducer
  },
});

export default store;