import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import { PersonRounded } from "@mui/icons-material";
import api from "../../api/axios";
import ProfileForm from "../Dashboard/ProfileForm";

const colors = {
  primary: "#2563EB",
  cyan: "#06B6D4",
  text: "#172033",
  muted: "#667085",
  border: "#E5E7EB",
  surface: "#FFFFFF",
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.log("Profile Error:", error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        dir="rtl"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            p: 4,
            borderRadius: 4,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            boxShadow: "0 10px 30px rgba(23,32,51,.06)",
          }}
        >
          <Typography sx={{ color: colors.text, fontWeight: 800, fontSize: 16 }}>
            اطلاعات کاربر دریافت نشد.
          </Typography>
          <Typography sx={{ color: colors.muted, fontSize: 12.5, mt: 1 }}>
            لطفاً دوباره وارد حساب کاربری خود شوید.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box dir="rtl" sx={{ maxWidth: 900, mx: "auto" }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2.6,
            color: colors.primary,
            background: "#EFF6FF",
            border: "1px solid #DBEAFE",
            flexShrink: 0,
          }}
        >
          <PersonRounded sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography sx={{ color: colors.text, fontSize: { xs: 20, sm: 24 }, fontWeight: 900 }}>
            پروفایل من
          </Typography>
          <Typography sx={{ color: colors.muted, fontSize: 12.5, mt: 0.3 }}>
            مشاهده و ویرایش اطلاعات حساب کاربری شما
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          height: 3,
          width: 64,
          borderRadius: 3,
          mt: 1.8,
          mb: 3.5,
          background: `linear-gradient(90deg, ${colors.primary}, ${colors.cyan})`,
        }}
      />

      <ProfileForm user={user} setUser={setUser} />
    </Box>
  );
}