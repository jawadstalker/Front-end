import React, { useEffect, useState } from "react";

import { Paper, Avatar, Typography, TextField, Button, Box, Divider, CircularProgress } from "@mui/material";
import { SaveRounded } from "@mui/icons-material";

import api from "../../api/axios";
import toast from "react-hot-toast";
import { colors, gradient, fieldSx } from "../../theme/colors";

export default function AdminProfileForm({ user, setUser }) {
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setCity(user.city || "");
      setRegion(user.region || "");
      setLocation(user.location || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("نام و نام خانوادگی را وارد کنید");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.put(
        "/users/profile",
        {
          full_name: fullName.trim(),
          city: city.trim() || null,
          region: region.trim() || null,
          availability_status: user?.availability_status || "available",
          location: location.trim() || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response.data);
      setFullName(response.data.full_name || "");
      setCity(response.data.city || "");
      setRegion(response.data.region || "");
      setLocation(response.data.location || "");

      toast.success("اطلاعات پروفایل ذخیره شد ✅");
    } catch (error) {
      console.log("Admin Profile Error:", error.response?.data || error);

      if (error.response?.status === 401) {
        toast.error("نشست شما منقضی شده، دوباره وارد شوید");
      } else {
        toast.error("خطا در ذخیره اطلاعات پروفایل");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 580,
        mx: "auto",
        p: { xs: 3, sm: 4 },
        borderRadius: 4,
        direction: "rtl",
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 20px 50px rgba(23,32,51,.06)",
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: 92,
          height: 92,
          mx: "auto",
          mb: 2,
          fontSize: 34,
          fontWeight: 800,
          background: gradient,
          boxShadow: "0 12px 26px rgba(37,99,235,.25)",
          border: "3px solid #FFFFFF",
          outline: `1px solid ${colors.border}`,
        }}
      >
        {fullName ? fullName.charAt(0) : "ا"}
      </Avatar>

      <Typography sx={{ textAlign: "center", fontWeight: 900, fontSize: 20, color: colors.text }}>
        {fullName || "ادمین"}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 0.8, mb: 3 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1.6,
            py: 0.5,
            borderRadius: 10,
            fontSize: 11.5,
            fontWeight: 800,
            color: colors.primary,
            background: "#EFF6FF",
            border: "1px solid #DBEAFE",
          }}
        >
          مدیر سامانه
        </Box>
      </Box>

      <Divider sx={{ mb: 3, borderColor: colors.border }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
        <TextField fullWidth label="نام و نام خانوادگی" value={fullName} onChange={(e) => setFullName(e.target.value)} sx={fieldSx} />

        <TextField fullWidth label="شماره موبایل" value={user?.phone || ""} disabled sx={fieldSx} />

        <TextField fullWidth label="نقش" value="ادمین" disabled sx={fieldSx} />

        <TextField fullWidth label="شهر" value={city} onChange={(e) => setCity(e.target.value)} sx={fieldSx} />

        <TextField fullWidth label="منطقه" value={region} onChange={(e) => setRegion(e.target.value)} sx={fieldSx} />

        <TextField fullWidth label="موقعیت" value={location} onChange={(e) => setLocation(e.target.value)} sx={fieldSx} />

        <Button
  variant="contained"
  size="large"
  disabled={loading}
  onClick={handleSave}
  startIcon={loading ? <CircularProgress size={19} sx={{ color: "#fff" }} /> : <SaveRounded />}
  sx={{
    mt: 1,
    height: 54,
    borderRadius: 2.5,
    fontSize: 14,
    fontWeight: 800,
    textTransform: "none",
    background: gradient,
    boxShadow: "0 12px 28px rgba(37,99,235,.22)",
    gap: 2, 
    "&:hover": { background: gradient, filter: "brightness(1.05)" },
    "&.Mui-disabled": { background: "#BFDBFE", color: "#fff" },
  }}
>
  {loading ? "در حال ذخیره..." : "ذخیره اطلاعات"}
</Button>
      </Box>
    </Paper>
  );
}