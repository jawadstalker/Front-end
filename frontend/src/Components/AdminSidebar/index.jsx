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

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      title: "داشبورد",
      icon: <Dashboard />,
      path: "/admin/dashboard",
    },
    {
      title: "مدیریت بحران‌ها",
      icon: <Warning />,
      path: "/admin/disasters",
    },
    {
      title: "مدیریت کاربران",
      icon: <People />,
      path: "/admin/users",
    },
    {
      title: "مدیریت مأموریت‌ها",
      icon: <Assignment />,
      path: "/admin/missions",
    },
    {
      title: "پروفایل",
      icon: <Person />,
      path: "/admin/profile",
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: 270,
        "& .MuiDrawer-paper": {
          width: 270,
          boxSizing: "border-box",
          background:
            "linear-gradient(180deg, #f0f6ff 0%, #e3edfb 100%)",
          color: "#1a1a1a",
          borderLeft: "1px solid rgba(25,118,210,0.15)",
          boxShadow: "-8px 0 24px rgba(13,71,161,0.08)",
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          textAlign: "center",
        }}
      >
        <Avatar
          sx={{
            mx: "auto",
            width: 56,
            height: 56,
            mb: 1.5,
            background: "linear-gradient(135deg, #1976d2, #42a5f5)",
            boxShadow: "0 8px 18px rgba(25,118,210,0.3)",
          }}
        >
          <LocalHospitalRounded sx={{ fontSize: 28 }} />
        </Avatar>

        <Typography
          variant="h6"
          fontWeight={800}
          sx={{ color: "#0d47a1" }}
        >
          ایلیا سافت
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: "text.secondary",
          }}
        >
          سامانه مدیریت امداد
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(25,118,210,0.15)" }} />

      <List sx={{ p: 2, flexGrow: 1 }}>
        {menu.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.title}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2.5,
                mb: 1,
                py: 1.2,
                color: active ? "#fff" : "#334155",
                background: active
                  ? "linear-gradient(135deg, #1976d2, #1565c0)"
                  : "transparent",
                boxShadow: active
                  ? "0 8px 16px rgba(21,101,192,0.3)"
                  : "none",
                transition: "all .2s ease",
                "&:hover": {
                  background: active
                    ? "linear-gradient(135deg, #1565c0, #0d47a1)"
                    : "rgba(25,118,210,0.1)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? "#fff" : "#1976d2",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: active ? 700 : 500,
                  fontSize: "0.92rem",
                }}
              />
            </ListItemButton>
          );
        })}

        <Divider sx={{ my: 2, borderColor: "rgba(25,118,210,0.15)" }} />

        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2.5,
            py: 1.2,
            color: "#d32f2f",
            transition: "all .2s ease",
            "&:hover": {
              background: "rgba(211,47,47,0.08)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: "#d32f2f",
              minWidth: 40,
            }}
          >
            <Logout />
          </ListItemIcon>

          <ListItemText
            primary="خروج"
            primaryTypographyProps={{ fontWeight: 600, fontSize: "0.92rem" }}
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
}