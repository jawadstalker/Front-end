import React, { useEffect, useRef, useState } from "react";

import {
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
  CircularProgress,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { CameraAltRounded, SaveRounded } from "@mui/icons-material";

import api from "../../api/axios";
import toast from "react-hot-toast";

// ============================================================
// COLOR PALETTE — MATCHES LOGIN / REGISTER
// ============================================================
const colors = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  cyan: "#06B6D4",
  purple: "#7C3AED",
  text: "#172033",
  muted: "#667085",
  border: "#E5E7EB",
  surface: "#FFFFFF",
};

const ROLE_LABELS = {
  volunteer: "داوطلب امدادی",
  admin: "مدیر سامانه",
  coordinator: "هماهنگ‌کننده",
};

const SKILL_OPTIONS = [
  "کمک‌های اولیه",
  "امداد و نجات",
  "آواربرداری",
  "اطفای حریق",
  "نجات در سیلاب",
  "نجات در زلزله",
  "رانندگی",
  "پشتیبانی لجستیکی",
  "مدیریت بحران",
  "ارتباطات و بی‌سیم",
  "پزشکی",
  "پرستاری",
  "امداد روانی",
];

export default function ProfileForm({ user, setUser }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState([]);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // =========================================================
  // Parse Skills
  // =========================================================

  const parseSkills = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // JSON نیست
      }
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }

    return [];
  };

  // =========================================================
  // Load User
  // =========================================================

  useEffect(() => {
    if (!user) return;
    setCity(user.city || "");
    setRegion(user.region || "");
    setLocation(user.location || "");
    setSkills(parseSkills(user.skills));
  }, [user]);

  // =========================================================
  // Upload Profile Image
  // =========================================================

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("فقط عکس‌های JPG، PNG یا WEBP مجاز هستند");
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("حجم عکس نباید بیشتر از ۵ مگابایت باشد");
      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("لطفاً دوباره وارد حساب شوید");
        navigate("/");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.put("/users/profile-image", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) setUser(response.data);

      toast.success("عکس پروفایل با موفقیت تغییر کرد ✅");
    } catch (error) {
      console.error("Profile Image Error:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        toast.error("نشست شما منقضی شده است. دوباره وارد شوید.");
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      toast.error(error.response?.data?.detail || "خطا در آپلود عکس");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // =========================================================
  // Save Profile
  // =========================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("لطفاً دوباره وارد حساب شوید");
        navigate("/");
        return;
      }

      const skillsValue = JSON.stringify(skills);

      const response = await api.put(
        "/users/profile",
        {
          city,
          region,
          availability_status: user?.availability_status || "available",
          location,
          skills: skillsValue,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response.data);
      toast.success("پروفایل و مهارت‌ها با موفقیت ذخیره شد ✅");

      const role = response.data?.role;

      if (role === "volunteer") navigate("/volunteer/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else if (role === "coordinator") navigate("/coordinator/missions");
      else navigate("/dashboard");
    } catch (error) {
      console.error("Profile Save Error:", error.response?.data || error);
      toast.error(error.response?.data?.detail || "خطا در ذخیره اطلاعات");
    } finally {
      setSaving(false);
    }
  };

  const profileImageUrl = user?.profile_image
    ? `http://127.0.0.1:8000${user.profile_image}`
    : undefined;

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  // =========================================================
  // Field Style — matches Login/Register
  // =========================================================

  const fieldSx = {
    mb: 0.2,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      backgroundColor: "#F8FAFC",
      transition: "all .2s ease",
      "& fieldset": { borderColor: colors.border },
      "&:hover": { backgroundColor: "#F1F5F9" },
      "&:hover fieldset": { borderColor: "#BFDBFE" },
      "&.Mui-focused": { backgroundColor: "#FFFFFF", boxShadow: "0 0 0 3px rgba(37,99,235,.08)" },
      "&.Mui-focused fieldset": { borderColor: colors.primary, borderWidth: 1.5 },
      "&.Mui-disabled": { backgroundColor: "#F1F5F9" },
    },
    "& .MuiInputLabel-root": {
      right: 14,
      left: "auto",
      color: colors.muted,
      transformOrigin: "top right",
      "&.Mui-focused": { color: colors.primary },
    },
    "& .MuiInputLabel-shrink": { transformOrigin: "top right" },
    "& .MuiInputBase-input": { textAlign: "right", color: colors.text },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 580,
        mx: "auto",
        p: { xs: 3, sm: 4 },
        borderRadius: 4,
        border: `1px solid ${colors.border}`,
        background: colors.surface,
        boxShadow: "0 20px 50px rgba(23,32,51,.06)",
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          position: "relative",
          width: 92,
          height: 92,
          mx: "auto",
          mb: 2,
          cursor: uploadingImage ? "default" : "pointer",
        }}
        onClick={() => !uploadingImage && fileInputRef.current?.click()}
      >
        <Avatar
          src={profileImageUrl}
          sx={{
            width: 92,
            height: 92,
            fontSize: 34,
            fontWeight: 800,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`,
            boxShadow: "0 12px 26px rgba(37,99,235,.25)",
            border: "3px solid #FFFFFF",
            outline: `1px solid ${colors.border}`,
          }}
        >
          {!user.profile_image && user.full_name?.charAt(0)}
        </Avatar>

        <Box
          sx={{
            position: "absolute",
            bottom: -2,
            left: -2,
            width: 30,
            height: 30,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            background: colors.primary,
            border: "2px solid #fff",
            boxShadow: "0 4px 10px rgba(37,99,235,.35)",
          }}
        >
          <CameraAltRounded sx={{ fontSize: 15 }} />
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={handleImageUpload}
        />

        {uploadingImage && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              bgcolor: "rgba(23,32,51,.55)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 10,
              gap: 0.5,
            }}
          >
            <CircularProgress size={22} sx={{ color: "#fff" }} />
            در حال آپلود...
          </Box>
        )}
      </Box>

      <Typography sx={{ textAlign: "center", color: colors.muted, fontSize: 11.5, mb: 2 }}>
        برای تغییر عکس پروفایل روی آن کلیک کنید
      </Typography>

      <Typography sx={{ textAlign: "center", fontWeight: 900, fontSize: 20, color: colors.text }}>
        {user.full_name}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 0.8, mb: 3 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1.6,
            py: 0.5,
            borderRadius: 10,
            fontSize: 11.5,
            fontWeight: 800,
            color: colors.primary,
            background: "#EFF6FF",
            border: "1px solid #DBEAFE",
          }}
        >
          {ROLE_LABELS[user.role] || user.role}
        </Box>
      </Box>

      <Divider sx={{ mb: 3, borderColor: colors.border }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
        <TextField
          fullWidth
          label="شماره موبایل"
          value={user.phone || ""}
          disabled
          sx={fieldSx}
        />

        <TextField
          fullWidth
          label="شهر"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          sx={fieldSx}
        />

        <TextField
          fullWidth
          label="منطقه"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          sx={fieldSx}
        />

        <TextField
          fullWidth
          label="لوکیشن"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          sx={fieldSx}
        />

        <FormControl fullWidth sx={fieldSx}>
          <InputLabel id="skills-label">مهارت‌ها</InputLabel>
          <Select
            labelId="skills-label"
            multiple
            value={skills}
            onChange={(e) => {
              const value = e.target.value;
              setSkills(typeof value === "string" ? value.split(",") : value);
            }}
            input={<OutlinedInput label="مهارت‌ها" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6 }}>
                {selected.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    sx={{ bgcolor: "#EFF6FF", color: colors.primary, fontWeight: 700 }}
                  />
                ))}
              </Box>
            )}
          >
            {SKILL_OPTIONS.map((skill) => (
              <MenuItem
                key={skill}
                value={skill}
                sx={{ "&.Mui-selected": { bgcolor: "#EFF6FF !important" } }}
              >
                <Checkbox
                  checked={skills.indexOf(skill) > -1}
                  sx={{ color: colors.primary, "&.Mui-checked": { color: colors.primary } }}
                />
                <ListItemText primary={skill} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {user.role === "volunteer" && (
          <Typography sx={{ color: colors.muted, fontSize: 11.5, mt: -1, lineHeight: 1.9 }}>
            مهارت‌های واقعی خود را انتخاب کنید. این اطلاعات در زمان تخصیص مأموریت برای انتخاب داوطلب مناسب استفاده می‌شود.
          </Typography>
        )}

        {skills.length > 0 && (
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 12.5, mb: 1, color: colors.text }}>
              مهارت‌های انتخاب‌شده:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  variant="outlined"
                  size="small"
                  sx={{ borderColor: "#DBEAFE", color: colors.primary, fontWeight: 700 }}
                />
              ))}
            </Box>
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={saving || uploadingImage}
          onClick={handleSave}
          startIcon={saving ? <CircularProgress size={19} sx={{ color: "#fff" }} /> : <SaveRounded />}
          sx={{
            height: 54,
            mt: 1,
            borderRadius: 2.5,
            fontSize: 14,
            fontWeight: 800,
            textTransform: "none",
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`,
            boxShadow: "0 12px 28px rgba(37,99,235,.22)",
            "&:hover": {
              background: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.cyan})`,
              transform: "translateY(-1px)",
              boxShadow: "0 16px 34px rgba(37,99,235,.28)",
            },
            "&.Mui-disabled": { background: "#BFDBFE", color: "#fff" },
          }}
        >
          {saving ? "در حال ذخیره..." : "ذخیره اطلاعات"}
        </Button>
      </Box>
    </Paper>
  );
}