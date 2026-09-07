import React, { useEffect, useState } from "react";

import { Box, Typography, Grid, CircularProgress, Button, Paper } from "@mui/material";
import { Add, WavesRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import toast from "react-hot-toast";

import DisasterCard from "./DisasterCard";
import { colors, gradient } from "../../theme/colors";

export default function Disasters() {
  const navigate = useNavigate();

  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDisasters();
  }, []);

  const loadDisasters = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/disasters/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDisasters(response.data);
    } catch (error) {
      console.log(error);
      toast.error("خطا در دریافت بحران‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/disasters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("بحران حذف شد");
      loadDisasters();
    } catch (error) {
      console.log(error);
      toast.error("خطا در حذف بحران");
    }
  };

  const handleEdit = (id) => navigate(`/admin/disasters/edit/${id}`);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  return (
    <Box dir="rtl">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 4 }}>
        <Box>
          <Typography sx={{ color: colors.text, fontSize: { xs: 22, sm: 26 }, fontWeight: 900 }}>
            مدیریت بحران‌ها
          </Typography>
          <Typography sx={{ color: colors.muted, fontSize: 13, mt: 0.5 }}>
            ثبت و پیگیری وضعیت بحران‌های فعال و گذشته
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/admin/disasters/create")}
          sx={{
            height: 46,
            borderRadius: 2.5,
            px: 3,
            gap: 1,
            fontWeight: 800,
            textTransform: "none",
            background: gradient,
            boxShadow: "0 12px 26px rgba(37,99,235,.22)",
            "&:hover": { background: gradient, filter: "brightness(1.05)" },
          }}
        >
          ثبت بحران جدید
        </Button>
      </Box>

      {disasters.length === 0 ? (
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
          <WavesRounded sx={{ fontSize: 34, color: "#BFDBFE", mb: 1 }} />
          <Typography sx={{ color: colors.muted, fontSize: 14 }}>هنوز هیچ بحرانی ثبت نشده است.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {disasters.map((disaster) => (
            <Grid item xs={12} md={6} lg={4} key={disaster.id}>
              <DisasterCard disaster={disaster} onDelete={handleDelete} onEdit={handleEdit} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}