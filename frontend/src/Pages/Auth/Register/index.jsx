
import React, { useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowBackRounded,
  CheckCircleRounded,
  LockRounded,
  PersonAddRounded,
  PersonRounded,
  PhoneIphoneRounded,
  SecurityRounded,
  VisibilityOffRounded,
  VisibilityRounded,
  VolunteerActivismRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import api from "../../../api/axios";

import { toast } from "react-hot-toast";

// ============================================================
// COLOR PALETTE
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

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

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

  // ============================================================
  // REGISTER — BACKEND LOGIC UNCHANGED
  // ============================================================

  const handleRegister = async () => {
    if (
      !form.full_name.trim() ||
      !form.phone.trim() ||
      !form.password ||
      !form.confirm_password
    ) {
      return toast.error("لطفاً همه فیلدها را کامل کنید");
    }

    if (form.password !== form.confirm_password) {
      return toast.error("رمز عبور و تکرار آن یکسان نیست");
    }

    try {
      setLoading(true);

      await api.post("/users/register", {
        full_name: form.full_name,
        phone: form.phone,
        password: form.password,
      });

      toast.success("ثبت نام با موفقیت انجام شد");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.detail || "خطا در ثبت نام");
    } finally {
      setLoading(false);
    }
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
  // FIELD STYLES
  // ============================================================

  const fieldSx = {
    mb: 1.25,

    "& .MuiOutlinedInput-root": {
      height: 54,
      borderRadius: 2.5,
      backgroundColor: "#F8FAFC",
      color: colors.text,

      transition:
        "border-color .2s ease, background-color .2s ease, box-shadow .2s ease",

      "& fieldset": {
        borderColor: colors.border,
      },

      "&:hover": {
        backgroundColor: "#F1F5F9",
      },

      "&:hover fieldset": {
        borderColor: "#BFDBFE",
      },

      "&.Mui-focused": {
        backgroundColor: "#FFFFFF",
        boxShadow: "0 0 0 3px rgba(37,99,235,.08)",
      },

      "&.Mui-focused fieldset": {
        borderColor: colors.primary,
        borderWidth: 1.5,
      },
    },

    "& .MuiInputLabel-root": {
      right: 15,
      left: "auto",
      color: "#667085",
      transformOrigin: "top right",

      "&.Mui-focused": {
        color: colors.primary,
      },
    },

    "& .MuiInputLabel-shrink": {
      transformOrigin: "top right",
    },

    "& .MuiInputBase-input": {
      padding: "0 10px",
      textAlign: "right",
      direction: "rtl",
      color: colors.text,
      fontSize: 13,

      "&::placeholder": {
        color: "#98A2B3",
        opacity: 1,
      },
    },

    "& .MuiInputAdornment-root": {
      color: colors.primary,
    },

    "& .MuiInputAdornment-positionStart": {
      marginRight: 13,
    },

    "& .MuiInputAdornment-positionEnd": {
      marginLeft: 1,
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

        boxSizing: "border-box",

        px: {
          xs: 1.2,
          sm: 2,
          md: 3,
        },

        py: {
          xs: 1.2,
          sm: 2,
          md: 2.5,
        },

        background:
          "linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 48%, #ECFEFF 100%)",
      }}
    >
      {/* =====================================================
          BACKGROUND DECORATIONS
      ====================================================== */}

      <Box
        sx={{
          position: "absolute",

          width: {
            xs: 250,
            md: 360,
          },

          height: {
            xs: 250,
            md: 360,
          },

          borderRadius: "50%",

          top: {
            xs: -150,
            md: -190,
          },

          right: {
            xs: -110,
            md: -130,
          },

          background:
            "radial-gradient(circle, rgba(37,99,235,.14), transparent 68%)",

          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",

          width: {
            xs: 300,
            md: 420,
          },

          height: {
            xs: 300,
            md: 420,
          },

          borderRadius: "50%",

          bottom: {
            xs: -190,
            md: -250,
          },

          left: {
            xs: -130,
            md: -170,
          },

          background:
            "radial-gradient(circle, rgba(124,58,237,.11), transparent 68%)",

          pointerEvents: "none",
        }}
      />

      {/* =====================================================
          MAIN CARD
      ====================================================== */}

      <Box
        onKeyDown={handleKeyDown}
        sx={{
          position: "relative",
          zIndex: 2,

          width: "100%",
          maxWidth: 1080,

          height: {
            xs: "calc(100dvh - 24px)",
            sm: "calc(100dvh - 32px)",
            md: "min(650px, calc(100dvh - 40px))",
          },

          minHeight: 0,

          display: {
            xs: "block",
            md: "grid",
          },

          gridTemplateColumns: "0.95fr 1.05fr",

          overflow: "hidden",

          boxSizing: "border-box",

          borderRadius: {
            xs: 3.5,
            md: 4.5,
          },

          border: "1px solid rgba(255,255,255,.95)",

          background: "#FFFFFF",

          boxShadow: "0 24px 65px rgba(30,41,59,.13)",
        }}
      >
        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },

            flexDirection: "column",
            justifyContent: "space-between",

            minWidth: 0,
            minHeight: 0,

            overflow: "hidden",

            boxSizing: "border-box",

            p: {
              md: 4,
              lg: 4.5,
            },

            borderLeft: "1px solid #E5E7EB",

            background:
              "linear-gradient(145deg, #EFF6FF 0%, #EEF2FF 52%, #ECFEFF 100%)",
          }}
        >
          <Box>
            {/* Logo */}

            <Stack
              direction="row"
              spacing={1.7}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,

                  flexShrink: 0,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2.4,

                  background:
                    `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`,

                  boxShadow:
                    "0 10px 24px rgba(37,99,235,.18)",
                }}
              >
                <VolunteerActivismRounded
                  sx={{
                    color: "#FFFFFF",
                    fontSize: 25,
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: colors.text,
                    fontSize: 18,
                    fontWeight: 900,
                    lineHeight: 1.2,
                  }}
                >
                  سامانه امداد
                </Typography>

                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: 7.8,
                    fontWeight: 800,
                    letterSpacing: 1,

                    mt: 0.5,

                    whiteSpace: "nowrap",
                  }}
                >
                  VOLUNTEER MANAGEMENT PLATFORM
                </Typography>
              </Box>
            </Stack>

            {/* Main Left Content */}

            <Box
              sx={{
                mt: {
                  md: 7,
                  lg: 8,
                },
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",

                  gap: 0.9,

                  px: 1.3,
                  py: 0.6,

                  borderRadius: 10,

                  background: "#DBEAFE",
                  border: "1px solid #BFDBFE",
                }}
              >
                <PersonAddRounded
                  sx={{
                    color: colors.primary,
                    fontSize: 16,
                  }}
                />

                <Typography
                  sx={{
                    color: colors.primary,
                    fontSize: 10.5,
                    fontWeight: 800,
                  }}
                >
                  شروع همکاری
                </Typography>
              </Box>

              <Typography
                sx={{
                  mt: 2,

                  color: colors.text,

                  fontSize: {
                    md: 31,
                    lg: 37,
                  },

                  fontWeight: 900,

                  lineHeight: 1.35,

                  letterSpacing: "-0.7px",
                }}
              >
                به سامانه
                <br />

                <Box
                  component="span"
                  sx={{
                    background:
                      `linear-gradient(90deg, ${colors.primary}, ${colors.purple})`,

                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  امداد بپیوندید
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 2,

                  maxWidth: 370,

                  color: colors.muted,

                  fontSize: 12,

                  lineHeight: 1.9,
                }}
              >
                حساب کاربری خود را ایجاد کنید و به مجموعه‌ای یکپارچه
                برای مدیریت داوطلبان، مأموریت‌ها و فعالیت‌های امدادی
                دسترسی داشته باشید.
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              color: "#94A3B8",
              fontSize: 9,
            }}
          >
            سامانه مدیریت و هماهنگی نیروهای امدادی
          </Typography>
        </Box>

        {/* =====================================================
            RIGHT SIDE
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

            overflow: "hidden",

            px: {
              xs: 2.2,
              sm: 3.5,
              md: 4.5,
              lg: 5.5,
            },

            py: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },

            background: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 410,
              minWidth: 0,
            }}
          >
            {/* =================================================
                MOBILE LOGO
            ================================================== */}

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1.5}
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },

                mb: 2.3,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2.1,

                  background:
                    `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`,
                }}
              >
                <VolunteerActivismRounded
                  sx={{
                    color: "#FFFFFF",
                    fontSize: 21,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: colors.text,
                  fontSize: 18,
                  fontWeight: 900,
                }}
              >
                سامانه امداد
              </Typography>
            </Stack>

            {/* =================================================
                HEADER
            ================================================== */}

            <Box
              sx={{
                mb: 2.2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2.4,

                  background: "#EFF6FF",
                  border: "1px solid #DBEAFE",

                  mb: 1.6,
                }}
              >
                <PersonAddRounded
                  sx={{
                    color: colors.primary,
                    fontSize: 25,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: colors.text,

                  fontSize: {
                    xs: 23,
                    sm: 26,
                  },

                  fontWeight: 900,

                  lineHeight: 1.3,
                }}
              >
                ایجاد حساب کاربری
              </Typography>

              <Typography
                sx={{
                  color: colors.muted,

                  fontSize: 11.5,

                  lineHeight: 1.8,

                  mt: 0.7,

                  maxWidth: 380,
                }}
              >
                اطلاعات خود را وارد کنید تا حساب شما در سامانه امداد
                ایجاد شود.
              </Typography>
            </Box>

            {/* =================================================
                FORM
            ================================================== */}

            <Box>
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
                      <PersonRounded
                        sx={{
                          fontSize: 20,
                        }}
                      />
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
                      <PhoneIphoneRounded
                        sx={{
                          fontSize: 20,
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password */}

              <TextField
                fullWidth
                label="رمز عبور"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                variant="outlined"
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRounded
                        sx={{
                          fontSize: 20,
                        }}
                      />
                    </InputAdornment>
                  ),

                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword(
                            (prev) => !prev
                          )
                        }
                        edge="end"
                        aria-label={
                          showPassword
                            ? "مخفی کردن رمز عبور"
                            : "نمایش رمز عبور"
                        }
                        sx={{
                          width: 38,
                          height: 38,

                          color: "#98A2B3",

                          "&:hover": {
                            color: colors.primary,
                            background: "#EFF6FF",
                          },
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOffRounded />
                        ) : (
                          <VisibilityRounded />
                        )}
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
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={form.confirm_password}
                onChange={handleChange}
                autoComplete="new-password"
                variant="outlined"
                error={passwordMismatch}
                helperText={
                  passwordMismatch
                    ? "رمز عبور یکسان نیست"
                    : " "
                }
                sx={{
                  ...fieldSx,

                  "& .MuiFormHelperText-root": {
                    textAlign: "right",

                    color: passwordMismatch
                      ? "#EF4444"
                      : "transparent",

                    marginRight: 1,

                    fontSize: 10,
                  },

                  "& .MuiOutlinedInput-root.Mui-error": {
                    "& fieldset": {
                      borderColor: "#FCA5A5",
                    },

                    "&.Mui-focused": {
                      boxShadow:
                        "0 0 0 3px rgba(239,68,68,.08)",
                    },

                    "&.Mui-focused fieldset": {
                      borderColor: "#EF4444",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CheckCircleRounded
                        sx={{
                          fontSize: 20,

                          color: passwordMatched
                            ? "#22C55E"
                            : colors.primary,

                          transition:
                            "color .2s ease",
                        }}
                      />
                    </InputAdornment>
                  ),

                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(
                            (prev) => !prev
                          )
                        }
                        edge="end"
                        aria-label={
                          showConfirmPassword
                            ? "مخفی کردن تکرار رمز عبور"
                            : "نمایش تکرار رمز عبور"
                        }
                        sx={{
                          width: 38,
                          height: 38,

                          color: "#98A2B3",

                          "&:hover": {
                            color: colors.primary,
                            background: "#EFF6FF",
                          },
                        }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffRounded />
                        ) : (
                          <VisibilityRounded />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* =================================================
                PASSWORD HINT
            ================================================== */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                gap: 0.9,

                mt: -0.2,
                mb: 1.4,

                px: 0.2,
              }}
            >
              <SecurityRounded
                sx={{
                  fontSize: 15,
                  color: colors.primary,
                  flexShrink: 0,
                }}
              />

              <Typography
                sx={{
                  color: colors.muted,
                  fontSize: 10,
                  lineHeight: 1.6,
                }}
              >
                برای امنیت بیشتر از رمز عبور قوی استفاده کنید.
              </Typography>
            </Box>

            {/* =================================================
                REGISTER BUTTON
            ================================================== */}

            <Button
              fullWidth
              variant="contained"
              disabled={loading}
              onClick={handleRegister}
              startIcon={
                loading ? (
                  <CircularProgress
                    size={18}
                    color="inherit"
                  />
                ) : (
                  <PersonAddRounded
                    sx={{
                      fontSize: 20,
                    }}
                  />
                )
              }
              sx={{
                height: 52,

                borderRadius: 2.5,

                mt: 0.3,

                fontSize: 13,

                fontWeight: 900,

                color: "#FFFFFF",

                textTransform: "none",

                gap: 1,

                background:
                  `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`,

                boxShadow:
                  "0 10px 24px rgba(37,99,235,.19)",

                transition:
                  "transform .2s ease, box-shadow .2s ease",

                "&:hover": {
                  background:
                    `linear-gradient(135deg, ${colors.primaryDark}, ${colors.cyan})`,

                  transform: "translateY(-1px)",

                  boxShadow:
                    "0 14px 30px rgba(37,99,235,.26)",
                },

                "&:active": {
                  transform: "translateY(0)",
                },

                "&.Mui-disabled": {
                  color: "rgba(255,255,255,.7)",
                  background: "#BFDBFE",
                },
              }}
            >
              {loading
                ? "در حال ایجاد حساب..."
                : "ایجاد حساب کاربری"}
            </Button>

            {/* =================================================
                DIVIDER
            ================================================== */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                gap: 1.3,

                my: 1.8,
              }}
            >
              <Divider
                sx={{
                  flex: 1,
                  borderColor: colors.border,
                }}
              />

              <Typography
                sx={{
                  color: colors.muted,
                  fontSize: 10,

                  whiteSpace: "nowrap",
                }}
              >
                قبلاً حساب دارید؟
              </Typography>

              <Divider
                sx={{
                  flex: 1,
                  borderColor: colors.border,
                }}
              />
            </Box>

            {/* =================================================
                LOGIN BUTTON
            ================================================== */}

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/login")}
              endIcon={
                <ArrowBackRounded
                  sx={{
                    fontSize: 18,
                  }}
                />
              }
              sx={{
                height: 48,

                borderRadius: 2.5,

                color: colors.primary,

                borderColor: "#DBEAFE",

                background: "#EFF6FF",

                fontSize: 12,

                fontWeight: 800,

                textTransform: "none",

                gap: 0.8,

                transition: "all .2s ease",

                "&:hover": {
                  borderColor: "#BFDBFE",
                  background: "#DBEAFE",
                  transform: "translateY(-1px)",
                },
              }}
            >
              ورود به حساب کاربری
            </Button>

            {/* =================================================
                SECURITY FOOTER
            ================================================== */}

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={0.8}
              sx={{
                mt: 1.5,
              }}
            >
              <SecurityRounded
                sx={{
                  fontSize: 14,
                  color: "#98A2B3",
                  flexShrink: 0,
                }}
              />

              <Typography
                sx={{
                  color: "#98A2B3",
                  fontSize: 9,
                  textAlign: "center",
                }}
              >
                اطلاعات شما در محیطی امن نگهداری می‌شود
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
