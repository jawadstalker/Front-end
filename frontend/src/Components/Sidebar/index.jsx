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

export default function Sidebar() {
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
      variant="permanent"
      anchor="right"
      sx={{
        width: 270,
        "& .MuiDrawer-paper": {
          width: 270,
          boxSizing: "border-box",
          background:
            "linear-gradient(180deg, #f0faf3 0%, #dff3e5 100%)",
          color: "#1a1a1a",
          borderLeft: "1px solid rgba(22,101,52,0.15)",
          boxShadow: "-8px 0 24px rgba(20,83,45,0.08)",
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
            background: "linear-gradient(135deg, #16a34a, #4ade80)",
            boxShadow: "0 8px 18px rgba(22,163,74,0.3)",
          }}
        >
          <VolunteerActivismRounded sx={{ fontSize: 28 }} />
        </Avatar>

        <Typography
          variant="h6"
          fontWeight={800}
          sx={{ color: "#14532d" }}
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
          سامانه امداد
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(22,101,52,0.15)" }} />

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
                  ? "linear-gradient(135deg, #16a34a, #15803d)"
                  : "transparent",
                boxShadow: active
                  ? "0 8px 16px rgba(21,128,61,0.3)"
                  : "none",
                transition: "all .2s ease",
                "&:hover": {
                  background: active
                    ? "linear-gradient(135deg, #15803d, #14532d)"
                    : "rgba(22,163,74,0.1)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? "#fff" : "#16a34a",
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

        <Divider sx={{ my: 2, borderColor: "rgba(22,101,52,0.15)" }} />

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
