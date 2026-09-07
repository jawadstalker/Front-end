import React, { useState } from "react";

import { Box, useMediaQuery, useTheme } from "@mui/material";

import Sidebar from "../Sidebar/index";
import Navbar from "../Navbar/index";

export default function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile && mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <Navbar onMenuClick={() => setMobileOpen(true)} />

      <Box
        component="main"
        sx={{
          mr: isMobile ? 0 : "260px",
          pt: isMobile ? 2 : 5,
          px: isMobile ? 2 : 4,
          pb: 6,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}