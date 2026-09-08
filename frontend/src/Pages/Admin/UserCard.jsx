import React from "react";
import axios from "../../api/axios";

import { Paper, Typography, Box, Button, MenuItem, Select, Avatar } from "@mui/material";
import { colors, gradient } from "../../theme/colors";

export default function UserCard({ user, refresh }) {
  const changeRole = async (role) => {
    await axios.patch(`/users/${user.id}/role`, { role });
    refresh();
  };

  const toggleStatus = async () => {
    await axios.patch(`/users/${user.id}/status`, { is_active: !user.is_active });
    refresh();
  };

  const deleteUser = async () => {
    if (!window.confirm("حذف شود؟")) return;
    await axios.delete(`/users/${user.id}`);
    refresh();
  };

  return (
    <Paper
      elevation={0}
      dir="rtl"
      sx={{
        p: 3,
        borderRadius: 4,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 12px 30px rgba(23,32,51,.06)",
        transition: "all .25s ease",
        "&:hover": { transform: "translateY(-3px)", boxShadow: "0 18px 40px rgba(23,32,51,.1)" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Avatar
          src={user?.profile_image ? `http://127.0.0.1:8000${user.profile_image}` : undefined}
          alt={user?.full_name || "پروفایل"}
          sx={{ width: 65, height: 65, fontSize: 27, fontWeight: 700, background: gradient }}
        >
          {!user?.profile_image && user?.full_name?.charAt(0)}
        </Avatar>

        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 16, color: colors.text }}>{user.full_name}</Typography>
          <Typography sx={{ color: colors.muted, fontSize: 13 }}>{user.phone}</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "inline-flex",
            px: 1.4,
            py: 0.4,
            borderRadius: 10,
            fontSize: 11.5,
            fontWeight: 800,
            color: user.is_active ? "#059669" : colors.danger,
            background: user.is_active ? "#ECFDF5" : colors.dangerBg,
            border: `1px solid ${user.is_active ? "#A7F3D0" : "#FECACA"}`,
          }}
        >
          {user.is_active ? "فعال" : "غیرفعال"}
        </Box>
      </Box>

      <Select
        fullWidth
        size="small"
        value={user.role}
        onChange={(e) => changeRole(e.target.value)}
        sx={{
          mb: 2,
          borderRadius: 2.2,
          background: colors.bg,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.border },
        }}
      >
        <MenuItem value="admin">ادمین</MenuItem>
        <MenuItem value="coordinator">هماهنگ‌کننده</MenuItem>
        <MenuItem value="volunteer">داوطلب</MenuItem>
      </Select>

      <Button
        fullWidth
        variant="outlined"
        onClick={toggleStatus}
        sx={{
          mb: 1,
          borderRadius: 2.2,
          fontWeight: 700,
          textTransform: "none",
          color: user.is_active ? "#B45309" : "#059669",
          borderColor: user.is_active ? "#FDE68A" : "#A7F3D0",
          background: user.is_active ? "#FFFBEB" : "#ECFDF5",
          "&:hover": { filter: "brightness(0.97)" },
        }}
      >
        {user.is_active ? "غیرفعال کردن" : "فعال کردن"}
      </Button>

      <Button
        fullWidth
        variant="outlined"
        onClick={deleteUser}
        sx={{
          borderRadius: 2.2,
          fontWeight: 700,
          textTransform: "none",
          color: colors.danger,
          borderColor: "#FECACA",
          background: colors.dangerBg,
          "&:hover": { borderColor: "#FCA5A5", background: "#FEE2E2" },
        }}
      >
        حذف کاربر
      </Button>
    </Paper>
  );
}