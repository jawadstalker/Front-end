import React, { useState } from "react";

import { Box, useMediaQuery, useTheme } from "@mui/material";

import AdminSidebar from "../AdminSidebar";
import AdminNavbar from "../AdminNavbar";
import { colors } from "../../theme/colors";

export default function AdminLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", background: colors.bg, direction: "rtl" }}>
      <AdminNavbar onMenuClick={() => setMobileOpen(true)} isMobile={isMobile} />

      <AdminSidebar
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile && mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          mr: isMobile ? 0 : "270px",
          pt: isMobile ? 10 : "96px",
          px: { xs: 2, md: 4 },
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