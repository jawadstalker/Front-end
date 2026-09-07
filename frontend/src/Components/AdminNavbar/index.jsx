import React from "react";

import { AppBar, Toolbar, Typography, Box, Avatar, IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { colors, gradient } from "../../theme/colors";

export default function AdminNavbar({ onMenuClick, isMobile }) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: isMobile ? "100%" : "calc(100% - 270px)",
        mr: isMobile ? 0 : "270px",
        background: "rgba(255,255,255,.92)",
        backdropFilter: "blur(12px)",
        color: colors.text,
        borderBottom: `1px solid ${colors.border}`,
        direction: "rtl",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: { xs: 64, md: 72 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {isMobile && (
            <IconButton edge="start" onClick={onMenuClick} sx={{ color: colors.text }}>
              <Menu />
            </IconButton>
          )}

          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: 15, md: 18 }, color: colors.text }}>
              پنل مدیریت سامانه امداد
            </Typography>
            <Typography variant="caption" sx={{ color: colors.muted, display: { xs: "none", sm: "block" } }}>
              مدیریت بحران‌ها، داوطلب‌ها و مأموریت‌ها
            </Typography>
          </Box>
        </Box>

        <Avatar sx={{ background: gradient, boxShadow: "0 8px 18px rgba(37,99,235,.25)" }}>ا</Avatar>
      </Toolbar>
    </AppBar>
  );
}