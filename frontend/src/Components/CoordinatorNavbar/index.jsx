import React from "react";

import {
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";

export default function CoordinatorNavbar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1201,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          fontWeight="bold"
        >
          پنل هماهنگ‌کننده
        </Typography>
      </Toolbar>
    </AppBar>
  );
}