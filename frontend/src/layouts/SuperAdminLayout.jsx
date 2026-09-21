import React from "react";
import { Outlet } from "react-router-dom";

import SuperAdminSidebar from "../components/superAdmin/SuperAdminSidebar";
import SuperAdminNavbar from "../components/superAdmin/SuperAdminNavbar";

const SuperAdminLayout = () => {
  return (
    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
      }}
    >

      {/* SIDEBAR */}
      <SuperAdminSidebar />

      {/* MAIN AREA */}
      <div
        className="flex-grow-1"
        style={{
          minWidth: 0,
        }}
      >

        {/* NAVBAR */}
        <SuperAdminNavbar />

        {/* PAGE CONTENT */}
        <main
          className="p-4"
          style={{
            minHeight: "calc(100vh - 70px)",
            backgroundColor: "#F5F5F5",
          }}
        >
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default SuperAdminLayout;