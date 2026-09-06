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

import api from "../../api/axios";
import toast from "react-hot-toast";

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
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // JSON نیست
      }

      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  // =========================================================
  // Load User
  // =========================================================

  useEffect(() => {
    if (!user) {
      return;
    }

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

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "فقط عکس‌های JPG، PNG یا WEBP مجاز هستند"
      );

      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        "حجم عکس نباید بیشتر از ۵ مگابایت باشد"
      );

      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error(
          "لطفاً دوباره وارد حساب شوید"
        );

        navigate("/");
        return;
      }

      const formData = new FormData();

      formData.append("file", file);

      console.log(
        "Uploading profile image:",
        file.name,
        file.type,
        file.size
      );

      console.log(
        "FormData file:",
        formData.get("file")
      );

      // مهم:
      // Content-Type را اینجا تعیین نکن.
      // axios interceptor خودش برای FormData هدر را حذف می‌کند.
      const response = await api.put(
        "/users/profile-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Profile image response:",
        response.data
      );

      if (response.data) {
        setUser(response.data);
      }

      toast.success(
        "عکس پروفایل با موفقیت تغییر کرد ✅"
      );
    } catch (error) {
      console.error(
        "===================================="
      );

      console.error(
        "PROFILE IMAGE ERROR"
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "Message:",
        error.message
      );

      console.error(
        "===================================="
      );

      if (error.response?.status === 401) {
        toast.error(
          "نشست شما منقضی شده است. دوباره وارد شوید."
        );

        localStorage.removeItem("token");
        navigate("/");

        return;
      }

      toast.error(
        error.response?.data?.detail ||
        "خطا در آپلود عکس"
      );
    } finally {
      setUploadingImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
        toast.error(
          "لطفاً دوباره وارد حساب شوید"
        );

        navigate("/");
        return;
      }

      const skillsValue = JSON.stringify(skills);

      const response = await api.put(
        "/users/profile",
        {
          city,
          region,
          availability_status:
            user?.availability_status || "available",
          location,
          skills: skillsValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);

      toast.success(
        "پروفایل و مهارت‌ها با موفقیت ذخیره شد ✅"
      );

      const role = response.data?.role;

      if (role === "volunteer") {
        navigate("/volunteer/dashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "coordinator") {
        navigate("/coordinator/missions");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(
        "Profile Save Error:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.detail ||
        "خطا در ذخیره اطلاعات"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // Profile Image URL
  // =========================================================

  const profileImageUrl = user?.profile_image
    ? `http://127.0.0.1:8000${user.profile_image}`
    : undefined;

  // =========================================================
  // Loading
  // =========================================================

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <CircularProgress sx={{ color: "#16a34a" }} />
      </Box>
    );
  }

  // =========================================================
  // Render
  // =========================================================

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#16a34a",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#16a34a",
    },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 550,
        mx: "auto",
        p: 4,
        borderRadius: 4,
        border: "1px solid rgba(22,101,52,0.15)",
        boxShadow: "-8px 0 24px rgba(20,83,45,0.08)",
      }}
    >
      {/* Avatar */}

      <Box
        sx={{
          position: "relative",
          width: 90,
          height: 90,
          mx: "auto",
          mb: 2,
          cursor: uploadingImage
            ? "default"
            : "pointer",
        }}
        onClick={() => {
          if (!uploadingImage) {
            fileInputRef.current?.click();
          }
        }}
      >
        <Avatar
          src={profileImageUrl}
          sx={{
            width: 90,
            height: 90,
            fontSize: 36,
            background: "linear-gradient(135deg, #16a34a, #4ade80)",
            boxShadow: "0 8px 18px rgba(22,163,74,0.3)",
          }}
        >
          {!user.profile_image &&
            user.full_name?.charAt(0)}
        </Avatar>

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
              bgcolor: "rgba(20,83,45,0.65)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 11,
              textAlign: "center",
              gap: 0.5,
            }}
          >
            <CircularProgress
              size={24}
              sx={{
                color: "white",
              }}
            />

            در حال آپلود...
          </Box>
        )}
      </Box>

      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          color: "text.secondary",
          mb: 2,
        }}
      >
        برای تغییر عکس پروفایل روی عکس کلیک کنید
      </Typography>

      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#14532d",
        }}
      >
        {user.full_name}
      </Typography>

      <Typography
        sx={{
          textAlign: "center",
          color: "gray",
          mb: 2,
        }}
      >
        {user.role === "volunteer"
          ? "داوطلب امدادی"
          : user.role === "admin"
          ? "مدیر سامانه"
          : user.role === "coordinator"
          ? "هماهنگ‌کننده"
          : user.role}
      </Typography>

      <Divider sx={{ mb: 3, borderColor: "rgba(22,101,52,0.15)" }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
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
          onChange={(e) =>
            setCity(e.target.value)
          }
          sx={fieldSx}
        />

        <TextField
          fullWidth
          label="منطقه"
          value={region}
          onChange={(e) =>
            setRegion(e.target.value)
          }
          sx={fieldSx}
        />

        <TextField
          fullWidth
          label="لوکیشن"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          sx={fieldSx}
        />

        <FormControl fullWidth sx={fieldSx}>
          <InputLabel id="skills-label">
            مهارت‌ها
          </InputLabel>

          <Select
            labelId="skills-label"
            multiple
            value={skills}
            onChange={(e) => {
              const value = e.target.value;

              setSkills(
                typeof value === "string"
                  ? value.split(",")
                  : value
              );
            }}
            input={
              <OutlinedInput
                label="مهارت‌ها"
              />
            }
            renderValue={(selected) => (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                }}
              >
                {selected.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    sx={{
                      bgcolor: "#dcfce7",
                      color: "#15803d",
                      fontWeight: 600,
                    }}
                  />
                ))}
              </Box>
            )}
          >
            {SKILL_OPTIONS.map((skill) => (
              <MenuItem
                key={skill}
                value={skill}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "#dcfce7 !important",
                  },
                }}
              >
                <Checkbox
                  checked={
                    skills.indexOf(skill) > -1
                  }
                  sx={{
                    color: "#16a34a",
                    "&.Mui-checked": {
                      color: "#16a34a",
                    },
                  }}
                />

                <ListItemText
                  primary={skill}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {user.role === "volunteer" && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: -1,
              lineHeight: 1.8,
            }}
          >
            مهارت‌های واقعی خود را انتخاب کنید.
            این اطلاعات در زمان تخصیص مأموریت
            برای انتخاب داوطلب مناسب استفاده می‌شود.
          </Typography>
        )}

        {skills.length > 0 && (
          <Box>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                mb: 1,
                color: "#14532d",
              }}
            >
              مهارت‌های انتخاب‌شده:
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: "#16a34a",
                    color: "#15803d",
                    fontWeight: 600,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 2,
            height: 50,
            fontWeight: 700,
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            boxShadow: "0 8px 16px rgba(21,128,61,0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #15803d, #14532d)",
            },
            "&.Mui-disabled": {
              background: "#e2e8f0",
            },
          }}
          onClick={handleSave}
          disabled={
            saving ||
            uploadingImage
          }
        >
          {saving ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CircularProgress
                size={20}
                sx={{
                  color: "white",
                }}
              />

              در حال ذخیره...
            </Box>
          ) : (
            "ذخیره اطلاعات"
          )}
        </Button>
      </Box>
    </Paper>
  );
}
