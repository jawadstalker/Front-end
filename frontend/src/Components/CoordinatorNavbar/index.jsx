import React from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from "@mui/material";

import { Menu, Groups } from "@mui/icons-material";

export default function CoordinatorNavbar({ onMenuClick }) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: "calc(100% - 260px)" },
        mr: { md: "260px" },
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(12px)",
        color: "#1e293b",
        borderBottom: "1px solid #e2e8f0",
        zIndex: 1201,
      }}
    >
      <Toolbar sx={{ width: "100%" }}>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 0.5, display: { md: "none" } }}
          >
            <Menu />
          </IconButton>

          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "12px",
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #0e9384, #34d399)",
              color: "#fff",
            }}
          >
            <Groups fontSize="small" />
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
              پنل هماهنگ‌کننده
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", display: { xs: "none", sm: "block" } }}
            >
              مدیریت بحران‌ها، مأموریت‌ها و داوطلب‌ها
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}