import React, { useEffect, useState } from "react";

import { Box, Typography, Grid, CircularProgress, Button } from "@mui/material";
import { People, Warning, Assignment, WavesRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import toast from "react-hot-toast";

import StatsCard from "../../Components/StatsCard";
import { colors, gradient } from "../../theme/colors";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({ users: 0, disasters: 0, missions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.log(error);
      toast.error("خطا در دریافت اطلاعات ادمین");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  return (
    <Box dir="rtl">
      <Typography sx={{ color: colors.text, fontSize: { xs: 22, sm: 26 }, fontWeight: 900, mb: 0.5 }}>
        داشبورد مدیریت 👨‍💼
      </Typography>
      <Typography sx={{ color: colors.muted, fontSize: 13, mb: 4 }}>
        نمای کلی از وضعیت داوطلبان، بحران‌ها و مأموریت‌های سامانه
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatsCard title="تعداد داوطلبان" value={stats.users} icon={<People />} accent={colors.primary} />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatsCard title="تعداد بحران‌ها" value={stats.disasters} icon={<Warning />} accent="#DC2626" />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatsCard title="ماموریت‌ها" value={stats.missions} icon={<Assignment />} accent={colors.cyan} />
        </Grid>
      </Grid>

      {/* Admin Actions */}
      <Box sx={{ mt: 5 }}>
        <Typography sx={{ color: colors.text, fontWeight: 800, fontSize: 14, mb: 1.5 }}>
          دسترسی سریع
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<WavesRounded />}
            onClick={() => navigate("/admin/disasters")}
            sx={{
              height: 50,
              borderRadius: 2.5,
              px: 3,
              fontWeight: 800,
              textTransform: "none",
              background: gradient,
              boxShadow: "0 12px 28px rgba(37,99,235,.22)",
              "&:hover": { background: gradient, filter: "brightness(1.05)" },
            }}
          >
            مدیریت بحران‌ها
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<People />}
            onClick={() => navigate("/admin/users")}
            sx={{
              height: 50,
              borderRadius: 2.5,
              px: 3,
              fontWeight: 700,
              textTransform: "none",
              color: colors.primary,
              borderColor: "#DBEAFE",
              background: "#EFF6FF",
              "&:hover": { borderColor: "#BFDBFE", background: "#DBEAFE" },
            }}
          >
            مدیریت داوطلبان
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<Assignment />}
            onClick={() => navigate("/admin/missions")}
            sx={{
              height: 50,
              borderRadius: 2.5,
              px: 3,
              fontWeight: 700,
              textTransform: "none",
              color: colors.primary,
              borderColor: "#DBEAFE",
              background: "#EFF6FF",
              "&:hover": { borderColor: "#BFDBFE", background: "#DBEAFE" },
            }}
          >
            مدیریت مأموریت‌ها
          </Button>
        </Box>
      </Box>
    </Box>
  );
}