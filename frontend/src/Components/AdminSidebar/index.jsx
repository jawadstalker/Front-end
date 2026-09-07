import React from "react";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";

import {
  Dashboard,
  Warning,
  People,
  Assignment,
  Person,
  Logout,
  LocalHospitalRounded,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import { colors, gradient } from "../../theme/colors";

export default function AdminSidebar({ variant = "permanent", open = false, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { title: "داشبورد", icon: <Dashboard />, path: "/admin/dashboard" },
    { title: "مدیریت بحران‌ها", icon: <Warning />, path: "/admin/disasters" },
    { title: "مدیریت کاربران", icon: <People />, path: "/admin/users" },
    { title: "مدیریت مأموریت‌ها", icon: <Assignment />, path: "/admin/missions" },
    { title: "پروفایل", icon: <Person />, path: "/admin/profile" },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const go = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      anchor="right"
      sx={{
        width: 270,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 270,
          boxSizing: "border-box",
          background: colors.surface,
          color: colors.text,
          borderLeft: `1px solid ${colors.border}`,
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          overflowX: "hidden",
        },
      }}
    >
      <Box sx={{ p: 3, textAlign: "center", borderBottom: `1px solid ${colors.border}` }}>
        <Avatar
          sx={{
            mx: "auto",
            width: 56,
            height: 56,
            mb: 1.5,
            background: gradient,
            boxShadow: "0 10px 24px rgba(37,99,235,.25)",
          }}
        >
          <LocalHospitalRounded sx={{ fontSize: 28 }} />
        </Avatar>

        <Typography variant="h6" fontWeight={800} sx={{ color: colors.text }}>
          ایلیا سافت
        </Typography>

        <Typography variant="body2" sx={{ mt: 0.5, color: colors.muted }}>
          سامانه مدیریت امداد
        </Typography>
      </Box>

      <List sx={{ p: 2, flexGrow: 1 }}>
        <Typography
          variant="caption"
          sx={{ px: 1.5, mb: 1, display: "block", color: "#98A2B3", fontWeight: 700 }}
        >
          منو مدیریت
        </Typography>

        {menu.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.title}
              onClick={() => go(item.path)}
              sx={{
                borderRadius: 2.5,
                mb: 1,
                py: 1.2,
                px: 1.5,
                color: active ? "#fff" : "#475569",
                background: active ? gradient : "transparent",
                boxShadow: active ? "0 10px 22px rgba(37,99,235,.28)" : "none",
                border: active ? "none" : "1px solid transparent",
                transition: "all .2s ease",
                "&:hover": {
                  background: active ? gradient : colors.bg,
                },
              }}
            >
              <ListItemIcon sx={{ color: active ? "#fff" : colors.primary, minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.title}
                primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: "0.92rem" }}
              />
            </ListItemButton>
          );
        })}

        <Divider sx={{ my: 2, borderColor: colors.border }} />

        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2.5,
            py: 1.2,
            px: 1.5,
            color: colors.danger,
            transition: "all .2s ease",
            "&:hover": { background: colors.dangerBg },
          }}
        >
          <ListItemIcon sx={{ color: colors.danger, minWidth: 40 }}>
            <Logout />
          </ListItemIcon>

          <ListItemText primary="خروج" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.92rem" }} />
        </ListItemButton>
      </List>
    </Drawer>
  );
}