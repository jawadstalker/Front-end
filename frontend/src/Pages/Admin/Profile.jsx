import React, { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import api from "../../api/axios";
import AdminProfileForm from "./AdminProfileForm";

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          "/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data);

      } catch (error) {
        console.log(
          "Admin Profile Error:",
          error
        );

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
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Typography
        sx={{
          direction: "rtl",
          textAlign: "center",
          mt: 5,
        }}
      >
        اطلاعات ادمین دریافت نشد.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        direction: "rtl",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 4,
        }}
      >
        پروفایل ادمین 👨‍💼
      </Typography>

      <AdminProfileForm
        user={user}
        setUser={setUser}
      />
    </Box>
  );
}
