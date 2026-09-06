import React, { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import api from "../../api/axios";
import ProfileForm from "../Dashboard/ProfileForm";

export default function Profile() {
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
          "Profile Error:",
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Typography
        variant="h6"
        sx={{
          direction: "rtl",
          textAlign: "center",
          mt: 5,
        }}
      >
        اطلاعات کاربر دریافت نشد.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        direction: "rtl",
        p: 2,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 4,
        }}
      >
        پروفایل من
      </Typography>

      <ProfileForm
        user={user}
        setUser={setUser}
      />
    </Box>
  );
}
