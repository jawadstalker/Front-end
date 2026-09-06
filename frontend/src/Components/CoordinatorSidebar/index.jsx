import React from "react";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function CoordinatorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    {
      title: "مدیریت بحران‌ها",
      path: "/coordinator/Disasters",
    },
    {
      title: "ماموریت‌ها",
      path: "/coordinator/missions",
    },
    {
      title: "ایجاد ماموریت",
      path: "/coordinator/create-mission",
    },
    {
      title: "مدیریت کاربران",
      path: "/coordinator/users",
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

      <List>
        {menus.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}