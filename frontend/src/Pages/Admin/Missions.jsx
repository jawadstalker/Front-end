import React, { useEffect, useState } from "react";

import { Box, Typography, Grid, CircularProgress, Paper, Button } from "@mui/material";
import { Add, AssignmentRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import toast from "react-hot-toast";

import MissionCard from "./MissionCard";
import { colors, gradient } from "../../theme/colors";

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

      const response = await api.get("/missions/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMissions(response.data);
    } catch (error) {
      console.log("Admin Missions Error:", error);
      toast.error("خطا در دریافت مأموریت‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (missionId) => {
    const confirmDelete = window.confirm("آیا از حذف این مأموریت مطمئن هستید؟");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/missions/${missionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("مأموریت با موفقیت حذف شد");
      await loadData();
    } catch (error) {
      console.log("Delete Mission Error:", error);
      toast.error(error.response?.data?.detail || "خطا در حذف مأموریت");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  return (
    <Box dir="rtl">
      <Typography sx={{ color: colors.text, fontSize: { xs: 22, sm: 26 }, fontWeight: 900, mb: 0.5 }}>
        مدیریت مأموریت‌ها
      </Typography>
      <Typography sx={{ color: colors.muted, fontSize: 13, mb: 4 }}>
        ایجاد، ویرایش و پیگیری مأموریت‌های امدادی
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: "0 12px 30px rgba(23,32,51,.06)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2.4,
              color: colors.primary,
              background: "#EFF6FF",
            }}
          >
            <AssignmentRounded />
          </Box>
          <Typography sx={{ color: colors.text, fontWeight: 800, fontSize: 15 }}>
            لیست مأموریت‌ها ({missions.length})
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/admin/missions/create")}
          sx={{
            height: 46,
            borderRadius: 2.5,
            px: 3,
            fontWeight: 800,
            textTransform: "none",
            background: gradient,
            boxShadow: "0 12px 26px rgba(37,99,235,.22)",
            "&:hover": { background: gradient, filter: "brightness(1.05)" },
          }}
        >
          ایجاد مأموریت
        </Button>
      </Paper>

      {missions.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Typography sx={{ color: colors.muted, fontSize: 14 }}>هنوز هیچ مأموریتی ایجاد نشده است.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {missions.map((mission) => (
            <Grid item xs={12} md={6} lg={4} key={mission.id}>
              <MissionCard mission={mission} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}