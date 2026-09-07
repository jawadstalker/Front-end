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
  Groups,
  WarningAmber,
  Assignment,
  AddCircle,
  People,
} from "@mui/icons-material";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

const drawerWidth = 260;

export default function CoordinatorSidebar({ variant = "permanent", open = false, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    {
      title: "مدیریت بحران‌ها",
      icon: <WarningAmber />,
      path: "/coordinator/disasters",
    },
    {
      title: "ماموریت‌ها",
      icon: <Assignment />,
      path: "/coordinator/missions",
    },
    {
      title: "ایجاد ماموریت",
      icon: <AddCircle />,
      path: "/coordinator/create-mission",
    },
    {
      title: "مدیریت کاربران",
      icon: <People />,
      path: "/coordinator/users",
    },
  ];

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
            background: "linear-gradient(135deg, #0e9384, #34d399)",
            boxShadow: "0 6px 14px rgba(14,147,132,0.35)",
          }}
        >
          <Groups />
        </Avatar>

        <Box>
          <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#0f766e" }}>
            ایلیا سافت
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            پنل هماهنگ‌کننده
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
          {menus.map((item) => {
            const active = location.pathname === item.path;

            return (
              <ListItemButton
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (onClose) onClose();
                }}
                sx={{
                  borderRadius: 3,
                  mb: 0.5,
                  py: 1.1,
                  px: 1.5,
                  color: active ? "#0e9384" : "#475569",
                  background: active ? "#e6f7f4" : "transparent",
                  border: active ? "1px solid #a7f3d0" : "1px solid transparent",
                  transition: "all .18s ease",
                  "&:hover": {
                    background: active ? "#e6f7f4" : "#f8fafc",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? "#0e9384" : "#94a3b8",
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
        <Divider sx={{ mb: 1 }} />
      </Box>
    </Drawer>
  );
}