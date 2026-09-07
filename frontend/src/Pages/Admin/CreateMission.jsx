import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, TextField, MenuItem, Button, CircularProgress } from "@mui/material";
import { Save, AddTaskRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { colors, gradient, fieldSx } from "../../theme/colors";

export default function CreateMission() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [disasters, setDisasters] = useState([]);

  const [form, setForm] = useState({
    disaster_id: "",
    title: "",
    description: "",
    required_skills: "",
    location: "",
    priority: "medium",
    required_volunteers: 1,
  });

  useEffect(() => {
    loadDisasters();
  }, []);

  const loadDisasters = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get("/disasters/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDisasters(response.data || []);
    } catch (error) {
      console.log("Load Disasters Error:", error);
      toast.error(error.response?.data?.detail || "خطا در دریافت بحران‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.disaster_id) return toast.error("بحران را انتخاب کنید");
    if (!form.title.trim()) return toast.error("عنوان مأموریت الزامی است");
    if (!form.required_volunteers || Number(form.required_volunteers) < 1) {
      return toast.error("تعداد داوطلب باید حداقل ۱ نفر باشد");
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const requiredSkills = form.required_skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
        .join(", ");

      await api.post(
        "/missions/",
        {
          disaster_id: Number(form.disaster_id),
          title: form.title.trim(),
          description: form.description.trim() || null,
          required_skills: requiredSkills || null,
          location: form.location.trim() || null,
          priority: form.priority,
          required_volunteers: Number(form.required_volunteers),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("مأموریت با موفقیت ایجاد شد ");
      navigate("/admin/missions");
    } catch (error) {
      console.log("Create Mission Error:", error.response?.data || error);
      toast.error(error.response?.data?.detail || "خطا در ایجاد مأموریت");
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

  const fieldSxWithoutIcon = {
    ...fieldSx,
    "& .MuiInputBase-input": {
      ...fieldSx["& .MuiInputBase-input"],
      paddingRight: 2,
    },
  };

  return (
    <Box dir="rtl" sx={{ maxWidth: 720, mx: "auto" }}>
      <Typography sx={{ color: colors.text, fontSize: { xs: 22, sm: 26 }, fontWeight: 900, mb: 0.5 }}>
        ایجاد مأموریت
      </Typography>
      <Typography sx={{ color: colors.muted, fontSize: 13, mb: 4 }}>
        یک مأموریت جدید برای یکی از بحران‌های فعال تعریف کنید
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
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.6 }}>
          <TextField
            select
            label="بحران"
            name="disaster_id"
            value={form.disaster_id}
            onChange={handleChange}
            required
            fullWidth
            sx={fieldSxWithoutIcon}
            SelectProps={{
              IconComponent: null,
            }}
          >
            {disasters
              .filter((disaster) => disaster.status === "active")
              .map((disaster) => (
                <MenuItem key={disaster.id} value={disaster.id}>
                  {disaster.title}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            label="عنوان مأموریت"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            fullWidth
            sx={fieldSx}
          />

          <TextField
            label="توضیحات"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            sx={fieldSx}
          />

          <TextField
            label="مهارت‌های موردنیاز"
            name="required_skills"
            value={form.required_skills}
            onChange={handleChange}
            placeholder="مثال: نجات، کمک‌های اولیه، برق"
            helperText="مهارت‌ها را با کاما (,) از هم جدا کنید"
            fullWidth
            sx={fieldSx}
          />

          <Paper
            elevation={0}
            sx={{ p: 2, borderRadius: 3, background: "#EFF6FF", border: "1px solid #DBEAFE" }}
          >
            <Typography sx={{ color: colors.primary, fontWeight: 800, fontSize: 12.5, mb: 1 }}>
              مثال
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {["نجات", "کمک‌های اولیه", "برق"].map((s) => (
                <Box
                  key={s}
                  sx={{
                    px: 1.4,
                    py: 0.4,
                    borderRadius: 10,
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: colors.primary,
                    background: colors.surface,
                    border: "1px solid #DBEAFE",
                  }}
                >
                  {s}
                </Box>
              ))}
            </Box>

            <Typography sx={{ color: colors.muted, fontSize: 11, mt: 1 }}>
              مثلاً بنویسید: نجات, کمک‌های اولیه, برق
            </Typography>
          </Paper>

          <TextField
            label="موقعیت"
            name="location"
            value={form.location}
            onChange={handleChange}
            fullWidth
            sx={fieldSx}
          />

          <TextField
            select
            label="اولویت"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            fullWidth
            sx={fieldSx}
          >
            <MenuItem value="low">کم</MenuItem>
            <MenuItem value="medium">متوسط</MenuItem>
            <MenuItem value="high">زیاد</MenuItem>
            <MenuItem value="critical">بحرانی</MenuItem>
          </TextField>

          <TextField
            type="number"
            label="تعداد داوطلب موردنیاز"
            name="required_volunteers"
            value={form.required_volunteers}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            required
            fullWidth
            sx={fieldSx}
          />

          <Button
            type="submit"
            variant="contained"
            startIcon={saving ? <CircularProgress size={19} sx={{ color: "#fff" }} /> : <AddTaskRounded />}
            disabled={saving}
            fullWidth
            sx={{
              gap: 1,
              height: 52,
              borderRadius: 2.5,
              fontWeight: 800,
              fontSize: 14,
              textTransform: "none",
              background: gradient,
              boxShadow: "0 12px 28px rgba(37,99,235,.22)",
              "&:hover": { background: gradient, filter: "brightness(1.05)" },
              "&.Mui-disabled": { background: "#BFDBFE", color: "#fff" },
            }}
          >
            {saving ? "در حال ثبت..." : "ثبت مأموریت"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}