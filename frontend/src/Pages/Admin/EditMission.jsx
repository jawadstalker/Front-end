import React, { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";

import { Save } from "@mui/icons-material";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../api/axios";
import toast from "react-hot-toast";

export default function EditMission() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [disasters, setDisasters] = useState([]);

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState({
    disaster_id: "",
    title: "",
    description: "",
    required_skills: "",
    location: "",
    priority: "medium",
    required_volunteers: 1,
  });

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [missionRes, disastersRes] =
        await Promise.all([
          api.get(`/missions/${id}`, config),
          api.get("/disasters/", config),
        ]);

      const mission = missionRes.data;

      console.log(
        "========== EDIT MISSION =========="
      );

      console.log("MISSION:", mission);

      console.log(
        "REQUIRED SKILLS:",
        mission.required_skills
      );

      console.log(
        "=================================="
      );

      setDisasters(
        disastersRes.data || []
      );

      // =================================================
      // IMPORTANT
      // مقدار قبلی مهارت را داخل فرم می‌گذاریم
      // =================================================

      setForm({
        disaster_id:
          mission.disaster_id ||
          mission.disaster?.id ||
          "",

        title:
          mission.title || "",

        description:
          mission.description || "",

        required_skills:
          mission.required_skills || "",

        location:
          mission.location || "",

        priority:
          mission.priority || "medium",

        required_volunteers:
          mission.required_volunteers || 1,
      });
    } catch (error) {
      console.error(
        "Load Edit Mission Error:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.detail ||
          "خطا در دریافت اطلاعات مأموریت"
      );

      navigate("/admin/missions");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

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
    // Validation
    // -----------------------------------------------

    if (!form.title.trim()) {
      toast.error(
        "عنوان مأموریت الزامی است"
      );
      return;
    }

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

      const token =
        localStorage.getItem("token");

      // =================================================
      // NORMALIZE SKILLS
      // =================================================

      const requiredSkills =
        form.required_skills
          .split(/[,،;؛|]+/)
          .map(
            (skill) =>
              skill.trim()
          )
          .filter(Boolean)
          .join(", ");

      // =================================================
      // DATA
      // =================================================

      const payload = {
        disaster_id: Number(
          form.disaster_id
        ),

        title:
          form.title.trim(),

        description:
          form.description.trim() ||
          null,

        // ⭐ مهارت‌ها
        required_skills:
          requiredSkills ||
          null,

        location:
          form.location.trim() ||
          null,

        priority:
          form.priority,

        required_volunteers:
          Number(
            form.required_volunteers
          ),
      };

      console.log(
        "========== UPDATE MISSION =========="
      );

      console.log(payload);

      console.log(
        "====================================="
      );

      // =================================================
      // UPDATE
      // =================================================

      await api.put(
        `/missions/${id}`,
        payload,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "مأموریت با موفقیت ویرایش شد ✅"
      );

      navigate(
        "/admin/missions"
      );
    } catch (error) {
      console.error(
        "Update Mission Error:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.detail ||
          "خطا در ویرایش مأموریت"
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
        ویرایش مأموریت
      </Typography>

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
            value={
              form.disaster_id
            }
            onChange={
              handleChange
            }
            fullWidth
          >
            {disasters.map(
              (disaster) => (
                <MenuItem
                  key={
                    disaster.id
                  }
                  value={
                    disaster.id
                  }
                >
                  {
                    disaster.title
                  }
                </MenuItem>
              )
            )}
          </TextField>

          {/* =================================================
              TITLE
          ================================================= */}

          <TextField
            label="عنوان مأموریت"
            name="title"
            value={
              form.title
            }
            onChange={
              handleChange
            }
            required
            fullWidth
          />

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <TextField
            label="توضیحات"
            name="description"
            value={
              form.description
            }
            onChange={
              handleChange
            }
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
            value={
              form.required_skills
            }
            onChange={
              handleChange
            }
            placeholder="مثال: نجات، کمک‌های اولیه، برق"
            helperText="مهارت‌ها را با کاما (,) از هم جدا کنید"
            fullWidth
          />

          {/* =================================================
              LOCATION
          ================================================= */}

          <TextField
            label="موقعیت"
            name="location"
            value={
              form.location
            }
            onChange={
              handleChange
            }
            fullWidth
          />

          {/* =================================================
              PRIORITY
          ================================================= */}

          <TextField
            select
            label="اولویت"
            name="priority"
            value={
              form.priority
            }
            onChange={
              handleChange
            }
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
            label="تعداد داوطلب"
            name="required_volunteers"
            value={
              form.required_volunteers
            }
            onChange={
              handleChange
            }
            inputProps={{
              min: 1,
            }}
            required
            fullWidth
          />

          {/* =================================================
              SAVE
          ================================================= */}

          <Button
            type="submit"
            variant="contained"
            startIcon={
              <Save />
            }
            disabled={
              saving
            }
            fullWidth
            sx={{
              height: 48,
              borderRadius: 2,
              fontWeight: "bold",
            }}
          >
            {saving
              ? "در حال ذخیره..."
              : "ذخیره تغییرات"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}