import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";

import {
  Add,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import toast from "react-hot-toast";

import MissionCard from "./MissionCard";

export default function Missions() {
  const navigate = useNavigate();

  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get(
        "/missions/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMissions(response.data);
    } catch (error) {
      console.log(
        "Admin Missions Error:",
        error
      );

      toast.error(
        "خطا در دریافت مأموریت‌ها"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    missionId
  ) => {
    const confirmDelete = window.confirm(
      "آیا از حذف این مأموریت مطمئن هستید؟"
    );

    if (!confirmDelete) return;

    try {
      const token =
        localStorage.getItem("token");

      await api.delete(
        `/missions/${missionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "مأموریت با موفقیت حذف شد"
      );

      await loadData();
    } catch (error) {
      console.log(
        "Delete Mission Error:",
        error
      );

      toast.error(
        error.response?.data?.detail ||
          "خطا در حذف مأموریت"
      );
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ direction: "rtl" }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
      >
        مدیریت مأموریت‌ها
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 5,
          borderRadius: 4,
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
        >
          لیست مأموریت‌ها
        </Typography>

        <Button
          variant="contained"
          color="success"
          startIcon={<Add />}
          onClick={() =>
            navigate(
              "/admin/missions/create"
            )
          }
        >
          ایجاد مأموریت
        </Button>
      </Paper>

      {missions.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 4,
          }}
        >
          <Typography color="text.secondary">
            هنوز هیچ مأموریتی ایجاد نشده
            است.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {missions.map((mission) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={mission.id}
            >
              <MissionCard
                mission={mission}
                onDelete={
                  handleDelete
                }
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}