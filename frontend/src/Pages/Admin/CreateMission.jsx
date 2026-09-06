import React, { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";

import { Save } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import toast from "react-hot-toast";

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

  // =====================================================
  // LOAD DISASTERS
  // =====================================================

  const loadDisasters = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get("/disasters/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDisasters(response.data || []);
    } catch (error) {
      console.log("Load Disasters Error:", error);

      toast.error(
        error.response?.data?.detail ||
          "خطا در دریافت بحران‌ها"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -----------------------------------------------
    // Validate disaster
    // -----------------------------------------------

    if (!form.disaster_id) {
      toast.error("بحران را انتخاب کنید");
      return;
    }

    // -----------------------------------------------
    // Validate title
    // -----------------------------------------------

    if (!form.title.trim()) {
      toast.error("عنوان مأموریت الزامی است");
      return;
    }

    // -----------------------------------------------
    // Validate volunteers
    // -----------------------------------------------

    if (
      !form.required_volunteers ||
      Number(form.required_volunteers) < 1
    ) {
      toast.error(
        "تعداد داوطلب باید حداقل ۱ نفر باشد"
      );
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      // =================================================
      // IMPORTANT
      // مهارت‌ها را تمیز و یکدست می‌کنیم
      // =================================================

      const requiredSkills = form.required_skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
        .join(", ");

      console.log(
        "========== CREATE MISSION =========="
      );

      console.log({
        disaster_id: Number(form.disaster_id),
        title: form.title.trim(),
        description:
          form.description.trim() || null,
        required_skills:
          requiredSkills || null,
        location:
          form.location.trim() || null,
        priority: form.priority,
        required_volunteers: Number(
          form.required_volunteers
        ),
      });

      console.log(
        "====================================="
      );

      // =================================================
      // CREATE MISSION
      // =================================================

      await api.post(
        "/missions/",
        {
          disaster_id: Number(
            form.disaster_id
          ),

          title: form.title.trim(),

          description:
            form.description.trim() || null,

          // ⭐ مهم‌ترین قسمت
          required_skills:
            requiredSkills || null,

          location:
            form.location.trim() || null,

          priority: form.priority,

          required_volunteers: Number(
            form.required_volunteers
          ),
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "مأموریت با موفقیت ایجاد شد ✅"
      );

      navigate("/admin/missions");
    } catch (error) {
      console.log(
        "Create Mission Error:",
        error
      );

      console.log(
        "Response:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.detail ||
          "خطا در ایجاد مأموریت"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

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

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Box
      sx={{
        direction: "rtl",
      }}
    >
      {/* =================================================
          TITLE
      ================================================= */}

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
      >
        ایجاد مأموریت
      </Typography>

      {/* =================================================
          FORM
      ================================================= */}

      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* =================================================
              DISASTER
          ================================================= */}

          <TextField
            select
            label="بحران"
            name="disaster_id"
            value={form.disaster_id}
            onChange={handleChange}
            required
            fullWidth
          >
            {disasters
              .filter(
                (disaster) =>
                  disaster.status ===
                  "active"
              )
              .map((disaster) => (
                <MenuItem
                  key={disaster.id}
                  value={disaster.id}
                >
                  {disaster.title}
                </MenuItem>
              ))}
          </TextField>

          {/* =================================================
              TITLE
          ================================================= */}

          <TextField
            label="عنوان مأموریت"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            fullWidth
          />

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <TextField
            label="توضیحات"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />

          {/* =================================================
              REQUIRED SKILLS
          ================================================= */}

          <TextField
            label="مهارت‌های موردنیاز"
            name="required_skills"
            value={form.required_skills}
            onChange={handleChange}
            placeholder="مثال: نجات، کمک‌های اولیه، برق"
            helperText="مهارت‌ها را با کاما (,) از هم جدا کنید"
            fullWidth
          />

          {/* =================================================
              SKILL EXAMPLE
          ================================================= */}

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor:
                "#f0fdf4",
              border:
                "1px solid #bbf7d0",
            }}
          >
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                color: "#166534",
                mb: 1,
              }}
            >
              مثال
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label="نجات"
                color="success"
                size="small"
              />

              <Chip
                label="کمک‌های اولیه"
                color="success"
                size="small"
              />

              <Chip
                label="برق"
                color="success"
                size="small"
              />
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 1,
              }}
            >
              مثلاً بنویسید:
              {" "}
              نجات, کمک‌های اولیه, برق
            </Typography>
          </Paper>

          {/* =================================================
              LOCATION
          ================================================= */}

          <TextField
            label="موقعیت"
            name="location"
            value={form.location}
            onChange={handleChange}
            fullWidth
          />

          {/* =================================================
              PRIORITY
          ================================================= */}

          <TextField
            select
            label="اولویت"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="low">
              کم
            </MenuItem>

            <MenuItem value="medium">
              متوسط
            </MenuItem>

            <MenuItem value="high">
              زیاد
            </MenuItem>

            <MenuItem value="critical">
              بحرانی
            </MenuItem>
          </TextField>

          {/* =================================================
              REQUIRED VOLUNTEERS
          ================================================= */}

          <TextField
            type="number"
            label="تعداد داوطلب موردنیاز"
            name="required_volunteers"
            value={
              form.required_volunteers
            }
            onChange={handleChange}
            inputProps={{
              min: 1,
            }}
            required
            fullWidth
          />

          {/* =================================================
              SUBMIT
          ================================================= */}

          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={saving}
            fullWidth
            sx={{
              height: 48,
              borderRadius: 2,
              fontWeight: "bold",
            }}
          >
            {saving
              ? "در حال ثبت..."
              : "ثبت مأموریت"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}