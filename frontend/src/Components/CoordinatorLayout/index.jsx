import React, { useState } from "react";

import { Box, useMediaQuery, useTheme } from "@mui/material";

import CoordinatorSidebar from "../CoordinatorSidebar";
import CoordinatorNavbar from "../CoordinatorNavbar";

export default function CoordinatorLayout({ children }) {
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
      <CoordinatorSidebar
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile && mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <CoordinatorNavbar onMenuClick={() => setMobileOpen(true)} />

      <Box
        component="main"
        sx={{
          mr: isMobile ? 0 : "260px",
          pt: isMobile ? "80px" : "96px",
          px: isMobile ? 2 : 4,
          pb: 6,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}