import React from "react";

import { Box } from "@mui/material";

import CoordinatorSidebar from "../CoordinatorSidebar";
import CoordinatorNavbar from "../CoordinatorNavbar";

export default function CoordinatorLayout({
  children,
}) {
  return (
    <Box>

      <CoordinatorSidebar />

      <CoordinatorNavbar />

      <Box
        component="main"
        sx={{
          mr: "260px",
          pt: 10,
          p: 3,
        }}
      >
        {children}
      </Box>

    </Box>
  );
}