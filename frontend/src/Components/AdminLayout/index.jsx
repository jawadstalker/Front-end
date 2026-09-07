import React, { useState } from "react";

import { Box, useMediaQuery, useTheme } from "@mui/material";

import AdminSidebar from "../AdminSidebar";
import AdminNavbar from "../AdminNavbar";

export default function AdminLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f7faf9",
      }}
    >
      {/* Admin Navbar */}
      <AdminNavbar onMenuClick={() => setMobileOpen(true)} />

      {/* Admin Sidebar */}
      <AdminSidebar
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile && mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          mr: isMobile ? 0 : "260px",

          // فاصله از Navbar
          pt: isMobile ? "80px" : "96px",

          // فاصله از اطراف محتوا
          px: isMobile ? 2 : 4,
          pb: 6,

          minHeight: "100vh",

          boxSizing: "border-box",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}