import React, { useEffect, useState } from "react";

import { Box, Paper, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { Save } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import toast from "react-hot-toast";
import { colors, gradient, fieldSx } from "../../theme/colors";

export default function EditDisaster() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    city: "",
    region: "",
    location: "",
  });

  useEffect(() => {
    loadDisaster();
  }, []);

  const loadDisaster = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/disasters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm(response.data);
    } catch (error) {
      console.log(error);
      toast.error("خطا در دریافت اطلاعات بحران");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      await api.put(
        `/disasters/${id}`,
        {
          title: form.title,
          description: form.description,
          type: form.type,
          city: form.city,
          region: form.region,
          location: form.location,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("بحران با موفقیت ویرایش شد");
      navigate("/admin/disasters");
    } catch (error) {
      console.log(error);
      toast.error("خطا در ویرایش بحران");
    } finally {
      setSaving(false);
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
    <Box dir="rtl" sx={{ maxWidth: 640, mx: "auto" }}>
      <Typography sx={{ color: colors.text, fontSize: { xs: 22, sm: 26 }, fontWeight: 900, mb: 0.5 }}>
        ویرایش بحران 
      </Typography>
      <Typography sx={{ color: colors.muted, fontSize: 13, mb: 4 }}>
        اطلاعات این بحران را به‌روزرسانی کنید
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: "0 20px 50px rgba(23,32,51,.06)",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.6 }}>
          <TextField fullWidth label="عنوان" name="title" value={form.title} onChange={handleChange} sx={fieldSx} />

          <TextField fullWidth label="نوع بحران" name="type" value={form.type} onChange={handleChange} sx={fieldSx} />

          <TextField fullWidth label="شهر" name="city" value={form.city} onChange={handleChange} sx={fieldSx} />

          <TextField fullWidth label="منطقه" name="region" value={form.region} onChange={handleChange} sx={fieldSx} />

          <TextField fullWidth label="موقعیت" name="location" value={form.location} onChange={handleChange} sx={fieldSx} />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="توضیحات"
            name="description"
            value={form.description}
            onChange={handleChange}
            sx={fieldSx}
          />

          <Button
            fullWidth
            variant="contained"
            startIcon={saving ? <CircularProgress size={19} sx={{ color: "#fff" }} /> : <Save />}
            disabled={saving}
            onClick={handleSubmit}
            sx={{
              height: 52,
              borderRadius: 2.5,
              mt: 0.5,
              fontWeight: 800,
              fontSize: 14,
              textTransform: "none",
              background: gradient,
              boxShadow: "0 12px 28px rgba(37,99,235,.22)",
              "&:hover": { background: gradient, filter: "brightness(1.05)" },
              "&.Mui-disabled": { background: "#BFDBFE", color: "#fff" },
            }}
          >
            {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}