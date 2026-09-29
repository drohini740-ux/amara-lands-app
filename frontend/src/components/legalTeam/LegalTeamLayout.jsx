import React from "react";
import { Outlet } from "react-router-dom";

import LegalTeamSidebar from "./LegalTeamSidebar";
import LegalTeamNavbar from "./LegalTeamNavbar";

const LegalTeamLayout = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
      }}
    >
      <LegalTeamSidebar />

      <div
        style={{
          marginLeft: "250px",
          minHeight: "100vh",
        }}
      >
        <LegalTeamNavbar />

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

export default LegalTeamLayout;