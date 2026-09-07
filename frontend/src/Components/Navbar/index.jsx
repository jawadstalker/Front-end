import React from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  Notifications,
  Menu,
  Person,
} from "@mui/icons-material";

export default function Navbar({ user, onMenuClick }) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(12px)",
        color: "#1e293b",
        borderBottom: "1px solid #e2e8f0",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 72 } }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 0.5, display: { md: "none" } }}
        >
          <Menu />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "12px",
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #059669, #34d399)",
              color: "#fff",
            }}
          >
            <Person fontSize="small" />
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
              پنل داوطلب امداد
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", display: { xs: "none", sm: "block" } }}
            >
              مدیریت ماموریت‌ها و عملیات بحران
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Tooltip title="اعلان‌ها">
            <IconButton
              sx={{
                color: "#64748b",
                background: "#f1f5f9",
                "&:hover": { background: "#e2e8f0" },
              }}
            >
              <Notifications fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              px: 1,
              py: 0.5,
              borderRadius: "12px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            <Avatar
              src={
                user?.profile_image
                  ? `http://127.0.0.1:8000${user.profile_image}`
                  : undefined
              }
              alt={user?.full_name || "پروفایل"}
              sx={{
                width: 34,
                height: 34,
                fontSize: 14,
                fontWeight: 700,
                background: "linear-gradient(135deg, #059669, #34d399)",
              }}
            >
              {!user?.profile_image && (user?.full_name?.charAt(0) || "د")}
            </Avatar>

            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                color: "#1f2937",
                display: { xs: "none", sm: "block" },
                maxWidth: 140,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {user?.full_name || "داوطلب"}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}