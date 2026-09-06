import React, { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import ProfileForm from "./ProfileForm";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const response = await api.get(
          "/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const currentUser = response.data;

        setUser(currentUser);

        // =============================
        // Admin
        // =============================

        if (currentUser.role === "admin") {
          navigate("/admin/dashboard");
          return;
        }

        // =============================
        // Coordinator
        // =============================

        if (currentUser.role === "coordinator") {
          navigate("/coordinator/missions");
          return;
        }

        // =============================
        // Volunteer
        // =============================

        if (currentUser.role === "volunteer") {
          const profileCompleted =
            Boolean(
              currentUser.city &&
              currentUser.region &&
              currentUser.location
            );

          if (profileCompleted) {
            navigate("/volunteer/dashboard");
            return;
          }

          return;
        }

        // =============================
        // Unknown Role
        // =============================

        navigate("/");
      } catch (error) {
        console.log(
          "Dashboard Error:",
          error
        );

        localStorage.removeItem("token");

        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (
    user &&
    user.role === "volunteer"
  ) {
    const profileCompleted =
      Boolean(
        user.city &&
        user.region &&
        user.location
      );

    if (!profileCompleted) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            p: 4,
            direction: "rtl",
            background: "#f5f7fb",
          }}
        >
          <ProfileForm
            user={user}
            setUser={setUser}
          />
        </Box>
      );
    }
  }

  return null;
}