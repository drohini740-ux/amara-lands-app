
import React from "react";
import { Outlet } from "react-router-dom";

import SecuritySidebar from "./SecuritySidebar";
import SecurityNavbar from "./SecurityNavbar";

const SecurityLayout = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
      }}
    >
      <SecuritySidebar />

      <div
        style={{
          marginLeft: "250px",
          minHeight: "100vh",
        }}
      >
        <SecurityNavbar />

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

export default SecurityLayout;

