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

const drawerWidth = 260;

export default function Sidebar({ variant = "permanent", open = false, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      title: "داشبورد",
      icon: <Dashboard />,
      path: "/volunteer/dashboard",
    },
    {
      title: "ماموریت‌های من",
      icon: <Assignment />,
      path: "/volunteer/missions",
    },
    {
      title: "پروفایل",
      icon: <Person />,
      path: "/profile",
    },
    {
      title: "اعلان‌ها",
      icon: <Notifications />,
      path: "/notifications",
    },
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
          background: "#ffffff",
          borderLeft: "1px solid #e2e8f0",
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
          borderBottom: "1px solid #eef2f6",
        }}
      >
        <Avatar
          sx={{
            width: 46,
            height: 46,
            background: "linear-gradient(135deg, #059669, #34d399)",
            boxShadow: "0 6px 14px rgba(5,150,105,0.35)",
          }}
        >
          <VolunteerActivismRounded />
        </Avatar>

        <Box>
          <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#065f46" }}>
            ایلیا سافت
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            سامانه امداد
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, py: 2, px: 2 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            mb: 1,
            display: "block",
            color: "text.disabled",
            fontWeight: 600,
          }}
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
                  color: active ? "#059669" : "#475569",
                  background: active ? "#ecfdf5" : "transparent",
                  border: active ? "1px solid #a7f3d0" : "1px solid transparent",
                  transition: "all .18s ease",
                  "&:hover": {
                    background: active ? "#ecfdf5" : "#f8fafc",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? "#059669" : "#94a3b8",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    fontSize: "0.9rem",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid #eef2f6" }}>
        <Divider sx={{ mb: 1.5 }} />
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 3,
            py: 1.1,
            px: 1.5,
            color: "#dc2626",
            transition: "all .18s ease",
            "&:hover": {
              background: "#fef2f2",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#dc2626", minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="خروج از حساب"
            primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}