import React from "react";
import { Outlet } from "react-router-dom";

import FieldExecutiveSidebar from "./FieldExecutiveSidebar";
import FieldExecutiveNavbar from "./FieldExecutiveNavbar";

const FieldExecutiveLayout = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
      }}
    >
      <FieldExecutiveSidebar />

      <div
        style={{
          marginLeft: "250px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <FieldExecutiveNavbar />

        <main
          style={{
            flex: 1,
            minWidth: 0,
            padding: "24px",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FieldExecutiveLayout;