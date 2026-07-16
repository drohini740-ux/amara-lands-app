import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/main.css";

import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";

import App from "./App";
import store from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer
          position="top-right"
          
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);