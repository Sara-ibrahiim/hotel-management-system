import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebarr";
import { Box } from "@mui/material";

export default function MasterLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: collapsed ? "102px" : "243px", // Collapsed or expanded width
          transition: "width 0.3s",
          overflowX: "hidden", // Prevent horizontal scroll when collapsed
        }}
      >
        <Sidebar onToggle={toggleSidebar} collapsed={collapsed} />
      </Box>

      {/* Main Content (Outlet) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 2,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
