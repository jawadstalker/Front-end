import React from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
} from "@mui/material";

export default function AdminNavbar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: "calc(100% - 260px)",
        mr: "260px",
        background: "#ffffff",
        color: "#1e293b",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        direction: "rtl",
        zIndex: 1200,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
          >
            پنل مدیریت سامانه امداد
          </Typography>

          <Typography
            variant="caption"
            color="gray"
          >
            مدیریت بحران‌ها، داوطلب‌ها و مأموریت‌ها
          </Typography>
        </Box>

        <Avatar
          sx={{
            bgcolor: "#1e3a8a",
          }}
        >
          ا
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}