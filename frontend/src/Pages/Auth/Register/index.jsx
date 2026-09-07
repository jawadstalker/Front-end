import React, { useState } from "react";
import { Box, Button, CircularProgress, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { ArrowBackRounded, CheckCircleRounded, LockRounded, PersonAddRounded, PersonRounded, PhoneIphoneRounded, SecurityRounded, VisibilityOffRounded, VisibilityRounded, VolunteerActivismRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { toast } from "react-hot-toast";

// ============================================================
// COLOR PALETTE — MATCHES THE LOGIN PAGE
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

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", phone: "", password: "", confirm_password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    if (!form.full_name.trim() || !form.phone.trim() || !form.password || !form.confirm_password) return toast.error("لطفاً همه فیلدها را کامل کنید");
    if (form.password !== form.confirm_password) return toast.error("رمز عبور و تکرار آن یکسان نیست");
    try {
      setLoading(true);
      await api.post("/users/register", { full_name: form.full_name, phone: form.phone, password: form.password });
      toast.success("ثبت نام با موفقیت انجام شد");
      navigate("/login");
    } catch (error) { toast.error(error.response?.data?.detail || "خطا در ثبت نام"); }
    finally { setLoading(false); }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      handleRegister();
    }
  };

  const passwordMismatch =
    form.confirm_password.length > 0 &&
    form.password !== form.confirm_password;

  const passwordMatched =
    form.confirm_password.length > 0 &&
    form.password === form.confirm_password;

  // ============================================================
  // FIELD STYLES — UPDATED TO MATCH LOGIN PAGE COLORS
  // ============================================================
  const fieldSx = {
    mb: 1.6,
    "& .MuiOutlinedInput-root": {
      minHeight: 56,
      borderRadius: 2.5,
      backgroundColor: "rgba(255,255,255,0.025)",
      color: colors.text,
      transition: "border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",
      "& fieldset": {
        borderColor: "rgba(0,0,0,0.10)",
      },
      "&:hover": {
        backgroundColor: "rgba(37,99,235,0.035)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(37,99,235,0.45)",
      },
      "&.Mui-focused": {
        backgroundColor: "rgba(37,99,235,0.035)",
        boxShadow: "0 0 0 3px rgba(37,99,235,0.08)",
      },
      "&.Mui-focused fieldset": {
        borderColor: colors.primary,
        borderWidth: 1.5,
      },
    },
    "& .MuiInputLabel-root": {
      right: 14,
      left: "auto",
      color: "rgba(0,0,0,0.42)",
      transformOrigin: "top right",
      "&.Mui-focused": {
        color: colors.primary,
      },
    },
    "& .MuiInputLabel-shrink": {
      transformOrigin: "top right",
    },
    "& .MuiInputBase-input": {
      padding: 2,
      textAlign: "right",
      color: colors.text,
      "&::placeholder": {
        color: "rgba(0,0,0,0.25)",
      },
    },
    "& .MuiInputAdornment-root": {
      color: colors.primary,
    },
  };

  return (
    <Box
      dir="rtl"
      sx={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 1.5, sm: 2, md: 3 },
        background: "linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 48%, #ECFEFF 100%)",
      }}
    >

      {/* =====================================================
          BACKGROUND DECORATIONS — UPDATED COLORS
      ====================================================== */}

      <Box
        sx={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          top: -190,
          right: -130,
          background: "radial-gradient(circle, rgba(37,99,235,0.16), transparent 68%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          bottom: -250,
          left: -170,
          background: "radial-gradient(circle, rgba(124,58,237,0.13), transparent 68%)",
          pointerEvents: "none",
        }}
      />

      {/* =====================================================
          MAIN CARD — UPDATED TO LIGHT THEME
      ====================================================== */}

      <Box
        onKeyDown={handleKeyDown}
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 1120,
          display: { xs: "block", md: "grid" },
          gridTemplateColumns: "1fr 1fr",
          height: { xs: "auto", md: "min(700px, calc(100dvh - 48px))" },
          maxHeight: { xs: "calc(100dvh - 24px)", md: "calc(100dvh - 48px)" },
          minHeight: 0,
          overflow: "hidden",
          boxSizing: "border-box",
          borderRadius: { xs: 3.5, md: 5 },
          border: "1px solid rgba(255,255,255,0.9)",
          background: colors.surface,
          boxShadow: "0 30px 80px rgba(30,41,59,.14)",
        }}
      >

        {/* =====================================================
            LEFT SIDE — BRAND (UPDATED TO LIGHT, FEATURES REMOVED)
        ====================================================== */}

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            minWidth: 0,
            minHeight: 0,
            overflow: "hidden",
            boxSizing: "border-box",
            p: { md: 4.5, lg: 5 },
            borderLeft: "1px solid #E5E7EB",
            background: "linear-gradient(145deg, #EFF6FF 0%, #EEF2FF 52%, #ECFEFF 100%)",
          }}
        >

          <Box>

            {/* Logo */}

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2.5,
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`,
                  boxShadow: "0 12px 28px rgba(37,99,235,0.22)",
                }}
              >
                <VolunteerActivismRounded sx={{ color: "#fff", fontSize: 27 }} />
              </Box>

              <Box>
                <Typography sx={{ paddingRight: 1, color: colors.text, fontSize: 19, fontWeight: 900, lineHeight: 1.2 }}>
                  سامانه امداد
                </Typography>
                <Typography sx={{ paddingRight: 1, color: "#64748B", fontSize: 8.5, fontWeight: 800, letterSpacing: 1.2, mt: 0.4, whiteSpace: "nowrap" }}>
                  VOLUNTEER MANAGEMENT PLATFORM
                </Typography>
              </Box>
            </Stack>

            {/* Heading */}

            <Box sx={{ mt: 6 }}>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.8, px: 1.4, py: 0.6, borderRadius: 10, background: "#DBEAFE", border: "1px solid #BFDBFE" }}>
                <PersonAddRounded sx={{ color: colors.primary, fontSize: 16 }} />
                <Typography sx={{ color: colors.primary, fontSize: 11, fontWeight: 800 }}>
                  شروع همکاری
                </Typography>
              </Box>

              <Typography sx={{ mt: 2.2, color: colors.text, fontSize: { md: 34, lg: 40 }, fontWeight: 900, lineHeight: 1.35, letterSpacing: "-0.8px" }}>
                به سامانه
                <br />
                <Box component="span" sx={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  امداد بپیوندید
                </Box>
              </Typography>

              <Typography sx={{ mt: 2.2, maxWidth: 400, color: colors.muted, fontSize: 13, lineHeight: 1.95 }}>
                حساب کاربری خود را ایجاد کنید و به مجموعه‌ای یکپارچه برای مدیریت داوطلبان، مأموریت‌ها و فعالیت‌های امدادی دسترسی داشته باشید.
              </Typography>
            </Box>

          </Box>

          <Typography sx={{ color: "#94A3B8", fontSize: 9.5 }}>
            سامانه مدیریت و هماهنگی نیروهای امدادی
          </Typography>

        </Box>

        {/* =====================================================
            RIGHT SIDE — REGISTER (UPDATED TO LIGHT)
        ====================================================== */}

        <Box
          sx={{
            minWidth: 0,
            minHeight: 0,
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
            px: { xs: 2.5, sm: 4, md: 5, lg: 6 },
            py: { xs: 3, sm: 3.5, md: 4 },
            background: "#FFFFFF",
          }}
        >

          <Box sx={{ width: "100%", maxWidth: 430, minWidth: 0 }}>

            {/* Mobile Logo */}

            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.2} sx={{ display: { xs: "flex", md: "none" }, mb: 3 }}>
              <Box sx={{ width: 43, height: 43, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2.2, background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})` }}>
                <VolunteerActivismRounded sx={{ color: "#fff", fontSize: 23 }} />
              </Box>
              <Typography sx={{ color: colors.text, fontSize: 19, fontWeight: 900 }}>
                سامانه امداد
              </Typography>
            </Stack>

            {/* Register Header */}

            <Box sx={{ mb: 2.7 }}>
              <Box sx={{ width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2.7, background: "#EFF6FF", border: "1px solid #DBEAFE", mb: 2 }}>
                <PersonAddRounded sx={{ color: colors.primary, fontSize: 27 }} />
              </Box>

              <Typography sx={{ color: colors.text, fontSize: { xs: 25, sm: 28 }, fontWeight: 900, lineHeight: 1.35 }}>
                ایجاد حساب کاربری
              </Typography>

              <Typography sx={{ color: colors.muted, fontSize: 12.5, lineHeight: 1.9, mt: 0.8, maxWidth: 390 }}>
                اطلاعات خود را وارد کنید تا حساب شما در سامانه امداد ایجاد شود.
              </Typography>
            </Box>

            {/* Form */}

            <Stack spacing={0}>

              {/* Full Name */}

              <TextField
                fullWidth
                label="نام و نام خانوادگی"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                autoComplete="name"
                variant="outlined"
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRounded sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Phone */}

              <TextField
                fullWidth
                label="شماره موبایل"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                inputMode="tel"
                variant="outlined"
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIphoneRounded sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password */}

              <TextField
                fullWidth
                label="رمز عبور"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                variant="outlined"
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRounded sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
                        sx={{
                          color: "#98A2B3",
                          "&:hover": { color: colors.primary, background: "#EFF6FF" },
                        }}
                      >
                        {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Confirm Password */}

              <TextField
                fullWidth
                label="تکرار رمز عبور"
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirm_password}
                onChange={handleChange}
                autoComplete="new-password"
                variant="outlined"
                error={passwordMismatch}
                helperText={passwordMismatch ? "رمز عبور یکسان نیست" : " "}
                sx={{
                  ...fieldSx,
                  "& .MuiFormHelperText-root": {
                    textAlign: "right",
                    color: passwordMismatch ? "#f87171" : "transparent",
                    marginRight: 1,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CheckCircleRounded
                        sx={{
                          fontSize: 20,
                          color: passwordMatched ? "#34d399" : colors.primary,
                        }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        edge="end"
                        aria-label={showConfirmPassword ? "مخفی کردن تکرار رمز عبور" : "نمایش تکرار رمز عبور"}
                        sx={{
                          color: "#98A2B3",
                          "&:hover": { color: colors.primary, background: "#EFF6FF" },
                        }}
                      >
                        {showConfirmPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

            </Stack>

            {/* Password Hint */}

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: -0.4, mb: 1.5 }}>
              <SecurityRounded sx={{ fontSize: 15, color: colors.primary }} />
              <Typography sx={{ color: colors.muted, fontSize: 10.5, lineHeight: 1.7 }}>
                برای امنیت بیشتر از رمز عبور قوی استفاده کنید.
              </Typography>
            </Box>

            {/* Register Button — UPDATED GRADIENT */}

            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              onClick={handleRegister}
              startIcon={loading ? <CircularProgress size={19} color="inherit" /> : <PersonAddRounded />}
              sx={{
                height: 54,
                borderRadius: 2.5,
                mt: 0.5,
                fontSize: "0.95rem",
                fontWeight: 800,
                color: "#fff",
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`,
                boxShadow: "0 12px 28px rgba(37,99,235,0.22)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
                "&:hover": {
                  background: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.cyan})`,
                  transform: "translateY(-1px)",
                  boxShadow: "0 16px 34px rgba(37,99,235,0.30)",
                  filter: "brightness(1.03)",
                },
                "&:active": { transform: "translateY(0)" },
                "&.Mui-disabled": {
                  color: "rgba(255,255,255,0.65)",
                  background: "#BFDBFE",
                },
              }}
            >
              {loading ? "در حال ایجاد حساب..." : "ایجاد حساب کاربری"}
            </Button>

            {/* Divider */}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, my: 2.4 }}>
              <Divider sx={{ flex: 1, borderColor: colors.border }} />
              <Typography sx={{ color: colors.muted, fontSize: 10.5, whiteSpace: "nowrap" }}>
                قبلاً حساب دارید؟
              </Typography>
              <Divider sx={{ flex: 1, borderColor: colors.border }} />
            </Box>

            {/* Login Button */}

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => navigate("/login")}
              endIcon={<ArrowBackRounded />}
              sx={{
                height: 50,
                borderRadius: 2.5,
                color: colors.primary,
                borderColor: "#DBEAFE",
                background: "#EFF6FF",
                fontSize: "0.88rem",
                fontWeight: 700,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#BFDBFE",
                  background: "#DBEAFE",
                  transform: "translateY(-1px)",
                },
              }}
            >
              ورود به حساب کاربری
            </Button>

            {/* Security Footer */}

            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.7} sx={{ mt: 2 }}>
              <SecurityRounded sx={{ fontSize: 14, color: "#98A2B3" }} />
              <Typography sx={{ color: "#98A2B3", fontSize: 9.5, textAlign: "center" }}>
                اطلاعات شما در محیطی امن نگهداری می‌شود
              </Typography>
            </Stack>

          </Box>
        </Box>
      </Box>
    </Box>
  );
}