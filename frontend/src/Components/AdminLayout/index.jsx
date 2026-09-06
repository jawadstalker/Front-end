import React from "react";

import { Box } from "@mui/material";

import AdminSidebar from "../AdminSidebar";
import AdminNavbar from "../AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f8fafc",
        direction: "rtl",
      }}
    >

      {/* Admin Navbar */}
      <AdminNavbar />

      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          mr: "260px",

          // فاصله از Navbar
          pt: "90px",

          // فاصله از اطراف محتوا
          px: 4,
          pb: 4,

          minHeight: "100vh",

          boxSizing: "border-box",
        }}
      >
        {children}
      </Box>

    </Box>
  );
}
