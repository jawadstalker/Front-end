import React from "react";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Divider,
} from "@mui/material";

import {
  Assignment,
  Warning,
  Add,
} from "@mui/icons-material";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function CoordinatorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    {
      title: "مأموریت‌ها",
      path: "/coordinator/missions",
      icon: <Assignment />,
    },
    {
      title: "ایجاد مأموریت",
      path: "/coordinator/create-mission",
      icon: <Add />,
    },
    {
      title: "بحران‌ها",
      path: "/coordinator/disasters",
      icon: <Warning />,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: 260,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: 260,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />

      <Divider />

      <List sx={{ p: 1 }}>
        {menus.map((item) => (
          <ListItemButton
            key={item.path}
            selected={
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`)
            }
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              gap: 1,
            }}
          >
            {item.icon}

            <ListItemText
              primary={item.title}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}