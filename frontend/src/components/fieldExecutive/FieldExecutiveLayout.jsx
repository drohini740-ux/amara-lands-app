
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
        }}
      >
        <FieldExecutiveNavbar />

        <main
          style={{
            padding: "30px",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FieldExecutiveLayout;

