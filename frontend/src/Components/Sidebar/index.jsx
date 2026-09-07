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
  Assignment,
  Person,
  Notifications,
  Logout,
  VolunteerActivismRounded,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import { colors, gradient } from "../../theme/colors";

const drawerWidth = 260;

export default function Sidebar({ variant = "permanent", open = false, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { title: "داشبورد", icon: <Dashboard />, path: "/volunteer/dashboard" },
    { title: "ماموریت‌های من", icon: <Assignment />, path: "/volunteer/missions" },
    { title: "پروفایل", icon: <Person />, path: "/profile" },
    { title: "اعلان‌ها", icon: <Notifications />, path: "/notifications" },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      anchor="right"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: colors.surface,
          borderLeft: `1px solid ${colors.border}`,
          overflowX: "hidden",
        },
      }}
    >
      <Box
        sx={{
          pt: 8,
          px: 3,
          pb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Avatar
          sx={{
            width: 46,
            height: 46,
            background: gradient,
            boxShadow: "0 10px 22px rgba(37,99,235,.28)",
          }}
        >
          <VolunteerActivismRounded />
        </Avatar>

        <Box>
          <Typography variant="subtitle1" fontWeight={800} sx={{ color: colors.text }}>
            ایلیا سافت
          </Typography>
          <Typography variant="caption" sx={{ color: colors.muted }}>
            سامانه امداد
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, py: 2, px: 2 }}>
        <Typography
          variant="caption"
          sx={{ px: 1.5, mb: 1, display: "block", color: "#98A2B3", fontWeight: 700 }}
        >
          منو
        </Typography>

        <List sx={{ p: 0 }}>
          {menu.map((item) => {
            const active = location.pathname === item.path;

            return (
              <ListItemButton
                key={item.title}
                onClick={() => {
                  navigate(item.path);
                  if (onClose) onClose();
                }}
                sx={{
                  borderRadius: 3,
                  mb: 0.5,
                  py: 1.1,
                  px: 1.5,
                  color: active ? colors.primary : "#475569",
                  background: active ? "#EFF6FF" : "transparent",
                  border: active ? "1px solid #DBEAFE" : "1px solid transparent",
                  transition: "all .18s ease",
                  "&:hover": { background: active ? "#EFF6FF" : colors.bg },
                }}
              >
                <ListItemIcon sx={{ color: active ? colors.primary : "#98A2B3", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: "0.9rem" }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: `1px solid ${colors.border}` }}>
        <Divider sx={{ mb: 1.5, borderColor: colors.border }} />
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 3,
            py: 1.1,
            px: 1.5,
            color: colors.danger,
            transition: "all .18s ease",
            "&:hover": { background: colors.dangerBg },
          }}
        >
          <ListItemIcon sx={{ color: colors.danger, minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="خروج از حساب" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }} />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}