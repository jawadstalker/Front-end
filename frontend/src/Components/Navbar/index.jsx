import React from "react";

import { AppBar, Toolbar, Typography, Box, Avatar, IconButton, Tooltip } from "@mui/material";
import { Notifications, Menu, Person } from "@mui/icons-material";
import { colors, gradient } from "../../theme/colors";

export default function Navbar({ user, onMenuClick }) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,.92)",
        backdropFilter: "blur(12px)",
        color: colors.text,
        borderBottom: `1px solid ${colors.border}`,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 72 } }}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 0.5, display: { md: "none" } }}>
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
              background: gradient,
              color: "#fff",
            }}
          >
            <Person fontSize="small" />
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2} sx={{ color: colors.text }}>
              پنل داوطلب امداد
            </Typography>
            <Typography variant="caption" sx={{ color: colors.muted, display: { xs: "none", sm: "block" } }}>
              مدیریت ماموریت‌ها و عملیات بحران
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Tooltip title="اعلان‌ها">
            <IconButton sx={{ color: colors.primary, background: "#EFF6FF", "&:hover": { background: "#DBEAFE" } }}>
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
              background: colors.bg,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Avatar
              src={user?.profile_image ? `http://127.0.0.1:8000${user.profile_image}` : undefined}
              alt={user?.full_name || "پروفایل"}
              sx={{ width: 34, height: 34, fontSize: 14, fontWeight: 700, background: gradient }}
            >
              {!user?.profile_image && (user?.full_name?.charAt(0) || "د")}
            </Avatar>

            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                color: colors.text,
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