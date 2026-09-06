import React, {
  useEffect,
  useState,
} from "react";

import {
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";

import api from "../../api/axios";
import toast from "react-hot-toast";

export default function AdminProfileForm({
  user,
  setUser,
}) {
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // Load User Data
  // =====================================================

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setCity(user.city || "");
      setRegion(user.region || "");
      setLocation(user.location || "");
    }
  }, [user]);

  // =====================================================
  // Save Profile
  // =====================================================

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error(
        "نام و نام خانوادگی را وارد کنید"
      );
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await api.put(
        "/users/profile",
        {
          full_name: fullName.trim(),
          city: city.trim() || null,
          region: region.trim() || null,
          availability_status:
            user?.availability_status ||
            "available",
          location:
            location.trim() || null,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      // به‌روزرسانی اطلاعات داخل صفحه
      setUser(response.data);

      // هماهنگ کردن فرم با اطلاعات جدید
      setFullName(
        response.data.full_name || ""
      );

      setCity(
        response.data.city || ""
      );

      setRegion(
        response.data.region || ""
      );

      setLocation(
        response.data.location || ""
      );

      toast.success(
        "اطلاعات پروفایل ذخیره شد ✅"
      );

    } catch (error) {
      console.log(
        "Admin Profile Error:",
        error
      );

      console.log(
        "Response:",
        error.response?.data
      );

      if (
        error.response?.status === 401
      ) {
        toast.error(
          "نشست شما منقضی شده، دوباره وارد شوید"
        );
      } else {
        toast.error(
          "خطا در ذخیره اطلاعات پروفایل"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 4,
        borderRadius: 4,
        direction: "rtl",
      }}
    >
      {/* Avatar */}

      <Avatar
        sx={{
          width: 90,
          height: 90,
          mx: "auto",
          mb: 2,
          bgcolor: "#14532d",
          fontSize: 36,
        }}
      >
        {fullName
          ? fullName.charAt(0)
          : "ا"}
      </Avatar>

      {/* Name */}

      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
      >
        {fullName || "ادمین"}
      </Typography>

      {/* Role */}

      <Typography
        sx={{
          textAlign: "center",
          color: "gray",
          mt: 1,
        }}
      >
        مدیر سامانه
      </Typography>

      <Divider
        sx={{
          my: 3,
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Full Name */}

        <TextField
          fullWidth
          label="نام و نام خانوادگی"
          value={fullName}
          onChange={(e) =>
            setFullName(
              e.target.value
            )
          }
        />

        {/* Phone */}

        <TextField
          fullWidth
          label="شماره موبایل"
          value={
            user?.phone || ""
          }
          disabled
        />

        {/* Role */}

        <TextField
          fullWidth
          label="نقش"
          value="ادمین"
          disabled
        />

        {/* City */}

        <TextField
          fullWidth
          label="شهر"
          value={city}
          onChange={(e) =>
            setCity(e.target.value)
          }
        />

        {/* Region */}

        <TextField
          fullWidth
          label="منطقه"
          value={region}
          onChange={(e) =>
            setRegion(
              e.target.value
            )
          }
        />

        {/* Location */}

        <TextField
          fullWidth
          label="موقعیت"
          value={location}
          onChange={(e) =>
            setLocation(
              e.target.value
            )
          }
        />

        {/* Save */}

        <Button
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            mt: 2,
            height: 50,
            backgroundColor:
              "#14532d",

            "&:hover": {
              backgroundColor:
                "#166534",
            },
          }}
          onClick={handleSave}
        >
          {loading
            ? "در حال ذخیره..."
            : "ذخیره اطلاعات"}
        </Button>
      </Box>
    </Paper>
  );
}