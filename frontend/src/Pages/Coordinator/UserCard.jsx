import React from "react";
import axios from "../../api/axios";

import {
  Paper,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";

import toast from "react-hot-toast";

export default function CoordinatorUserCard({
  user,
  refresh,
}) {
  const toggleStatus = async () => {
    try {
      await axios.patch(
        `/users/${user.id}/status`,
        {
          is_active: !user.is_active,
        }
      );

      toast.success(
        user.is_active
          ? "کاربر غیرفعال شد"
          : "کاربر فعال شد ✅"
      );

      refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "خطا در تغییر وضعیت کاربر"
      );
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        direction: "rtl",
      }}
    >
      {/* نام */}

      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: 1 }}
      >
        {user.full_name || "-"}
      </Typography>

      {/* تلفن */}

      <Typography
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        {user.phone || "-"}
      </Typography>

      {/* نقش */}

      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 2,
        }}
      >
        <Typography fontWeight="bold">
          نقش:
        </Typography>

        <Chip
          label={
            user.role === "admin"
              ? "ادمین"
              : user.role === "coordinator"
              ? "هماهنگ‌کننده"
              : "داوطلب"
          }
          color={
            user.role === "admin"
              ? "error"
              : user.role === "coordinator"
              ? "info"
              : "success"
          }
          size="small"
        />
      </Box>

      {/* وضعیت حساب */}

      <Box sx={{ mb: 2 }}>
        <Chip
          label={
            user.is_active
              ? "فعال"
              : "غیرفعال"
          }
          color={
            user.is_active
              ? "success"
              : "error"
          }
          size="small"
        />
      </Box>

      {/* شهر */}

      {user.city && (
        <Typography
          variant="body2"
          sx={{ mb: 1 }}
        >
          <strong>شهر:</strong>{" "}
          {user.city}
        </Typography>
      )}

      {/* منطقه */}

      {user.region && (
        <Typography
          variant="body2"
          sx={{ mb: 2 }}
        >
          <strong>منطقه:</strong>{" "}
          {user.region}
        </Typography>
      )}

      {/* فعال / غیرفعال */}

      <Button
        fullWidth
        variant={
          user.is_active
            ? "outlined"
            : "contained"
        }
        color={
          user.is_active
            ? "error"
            : "success"
        }
        onClick={toggleStatus}
      >
        {user.is_active
          ? "غیرفعال کردن کاربر"
          : "فعال کردن کاربر"}
      </Button>
    </Paper>
  );
}