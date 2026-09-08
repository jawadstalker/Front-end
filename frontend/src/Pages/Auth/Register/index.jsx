
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

  text: "#172033",
  muted: "#667085",
  lightText: "#98A2B3",

  border: "#E5E7EB",
  surface: "#FFFFFF",
  input: "#F8FAFC",
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

  // ============================================================
  // FORM CHANGE
  // ============================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // REGISTER
  // BACKEND LOGIC UNCHANGED
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

  // ============================================================
  // ENTER KEY
  // ============================================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      handleRegister();
    }
  };

  // ============================================================
  // PASSWORD STATE
  // ============================================================

  const passwordMismatch =
    form.confirm_password.length > 0 &&
    form.password !== form.confirm_password;

  const passwordMatched =
    form.confirm_password.length > 0 &&
    form.password === form.confirm_password;

  // ============================================================
  // FIELD STYLE
  // ============================================================

  const fieldSx = {
    mb: 1.5,

    "& .MuiOutlinedInput-root": {
      height: 56,
      borderRadius: 2.5,
      backgroundColor: colors.input,
      color: colors.text,

      transition:
        "background-color .2s ease, border-color .2s ease, box-shadow .2s ease",

      "& fieldset": {
        borderColor: colors.border,
      },

      "&:hover": {
        backgroundColor: "#F1F5F9",
      },

      "&:hover fieldset": {
        borderColor: "#CBD5E1",
      },

      "&.Mui-focused": {
        backgroundColor: "#FFFFFF",
        boxShadow: "0 0 0 4px rgba(37,99,235,.07)",
      },

      "&.Mui-focused fieldset": {
        borderColor: colors.primary,
        borderWidth: 1.5,
      },
    },

    "& .MuiInputLabel-root": {
      right: 15,
      left: "auto",
      color: colors.muted,
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
        color: colors.lightText,
        opacity: 1,
      },
    },

    "& .MuiInputAdornment-root": {
      color: "#64748B",
    },

    "& .MuiInputAdornment-positionStart": {
      marginRight: 13,
    },

    "& .MuiInputAdornment-positionEnd": {
      marginLeft: 2,
    },
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Box
      dir="rtl"
      sx={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100dvh",
        overflow: "auto",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        boxSizing: "border-box",

        px: {
          xs: 1.5,
          sm: 2.5,
          md: 3,
        },

        py: {
          xs: 1.5,
          sm: 2.5,
          md: 3,
        },

        background: "#F7F9FC",
      }}
    >
      {/* ========================================================
          SUBTLE BACKGROUND
      ========================================================= */}

      <Box
        sx={{
          position: "absolute",
          width: {
            xs: 260,
            md: 420,
          },

          height: {
            xs: 260,
            md: 420,
          },

          top: {
            xs: -150,
            md: -220,
          },

          right: {
            xs: -130,
            md: -180,
          },

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(37,99,235,.09), transparent 70%)",

          pointerEvents: "none",
        }}
      />

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

          bottom: {
            xs: -150,
            md: -180,
          },

          left: {
            xs: -120,
            md: -160,
          },

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(6,182,212,.07), transparent 70%)",

          pointerEvents: "none",
        }}
      />

      {/* ========================================================
          MAIN CARD
      ========================================================= */}

      <Box
        onKeyDown={handleKeyDown}
        sx={{
          position: "relative",
          zIndex: 2,

          width: "100%",
          maxWidth: 1040,

          minHeight: {
            xs: "auto",
            md: 630,
          },

          display: {
            xs: "block",
            md: "grid",
          },

          gridTemplateColumns: "0.9fr 1.1fr",

          overflow: "hidden",

          borderRadius: {
            xs: 3.5,
            md: 4,
          },

          border: "1px solid rgba(226,232,240,.9)",

          background: colors.surface,

          boxShadow:
            "0 20px 60px rgba(15,23,42,.08)",
        }}
      >
        {/* ======================================================
            LEFT BRAND PANEL
        ======================================================= */}

        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },

            flexDirection: "column",
            justifyContent: "space-between",

            minWidth: 0,

            p: {
              md: 4.5,
              lg: 5,
            },

            background:
              "linear-gradient(145deg, #F8FBFF 0%, #F3F6FF 100%)",

            borderLeft: `1px solid ${colors.border}`,
          }}
        >
          <Box>
            {/* LOGO */}

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 46,
                  height: 46,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2.4,

                  color: "#FFFFFF",

                  background:
                    `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`,

                  boxShadow:
                    "0 8px 20px rgba(37,99,235,.16)",
                }}
              >
                <VolunteerActivismRounded
                  sx={{
                    fontSize: 24,
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
                    color: "#94A3B8",
                    fontSize: 7.5,
                    fontWeight: 800,
                    letterSpacing: 1,
                    mt: 0.5,
                  }}
                >
                  VOLUNTEER MANAGEMENT PLATFORM
                </Typography>
              </Box>
            </Stack>

            {/* HERO */}

            <Box
              sx={{
                mt: {
                  md: 10,
                  lg: 12,
                },

                maxWidth: 360,
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.8,

                  px: 1.25,
                  py: 0.65,

                  borderRadius: 10,

                  background: "#EFF6FF",
                  border: "1px solid #DBEAFE",

                  color: colors.primary,
                }}
              >
                <PersonAddRounded
                  sx={{
                    fontSize: 16,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                >
                  شروع همکاری
                </Typography>
              </Box>

              <Typography
                sx={{
                  mt: 2.5,

                  color: colors.text,

                  fontSize: {
                    md: 31,
                    lg: 37,
                  },

                  fontWeight: 900,
                  lineHeight: 1.4,

                  letterSpacing: "-0.7px",
                }}
              >
                حساب خود را بسازید
                <br />

                <Box
                  component="span"
                  sx={{
                    background:
                      `linear-gradient(90deg, ${colors.primary}, ${colors.cyan})`,

                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  و همراه ما باشید
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 2.2,

                  color: colors.muted,

                  fontSize: 12,
                  lineHeight: 2,

                  maxWidth: 350,
                }}
              >
                با ایجاد حساب کاربری به سامانه امداد بپیوندید
                و از امکانات سامانه برای مدیریت و هماهنگی
                فعالیت‌های امدادی استفاده کنید.
              </Typography>
            </Box>
          </Box>

          {/* FOOTER */}

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.8}
          >
            <SecurityRounded
              sx={{
                fontSize: 14,
                color: "#94A3B8",
              }}
            />

            <Typography
              sx={{
                color: "#94A3B8",
                fontSize: 9,
              }}
            >
              سامانه مدیریت و هماهنگی نیروهای امدادی
            </Typography>
          </Stack>
        </Box>

        {/* ======================================================
            RIGHT FORM PANEL
        ======================================================= */}

        <Box
          sx={{
            minWidth: 0,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            px: {
              xs: 2.2,
              sm: 4,
              md: 5,
              lg: 6,
            },

            py: {
              xs: 3,
              sm: 4,
              md: 4.5,
            },

            background: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
            }}
          >
            {/* ==================================================
                MOBILE LOGO
            ================================================== */}

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1.3}
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },

                mb: 3,
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

                  color: "#FFFFFF",

                  background:
                    `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`,
                }}
              >
                <VolunteerActivismRounded
                  sx={{
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

            {/* ==================================================
                HEADER
            ================================================== */}

            <Box
              sx={{
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2.3,

                  background: "#EFF6FF",
                  color: colors.primary,

                  border: "1px solid #DBEAFE",

                  mb: 1.8,
                }}
              >
                <PersonAddRounded
                  sx={{
                    fontSize: 24,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: colors.text,

                  fontSize: {
                    xs: 24,
                    sm: 27,
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
                  lineHeight: 1.9,

                  mt: 0.8,

                  maxWidth: 370,
                }}
              >
                اطلاعات خود را وارد کنید تا حساب شما در سامانه
                امداد ایجاد شود.
              </Typography>
            </Box>

            {/* ==================================================
                FORM
            ================================================== */}

            <Box>
              {/* FULL NAME */}

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

              {/* PHONE */}

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

              {/* PASSWORD */}

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
                          setShowPassword((prev) => !prev)
                        }
                        edge="end"
                        aria-label={
                          showPassword
                            ? "مخفی کردن رمز عبور"
                            : "نمایش رمز عبور"
                        }
                        sx={{
                          width: 36,
                          height: 36,

                          color: "#94A3B8",

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

              {/* CONFIRM PASSWORD */}

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
                        "0 0 0 4px rgba(239,68,68,.06)",
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
                            : "#64748B",

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
                          width: 36,
                          height: 36,

                          color: "#94A3B8",

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

            {/* ==================================================
                PASSWORD HINT
            ================================================== */}

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.8}
              sx={{
                mt: -0.2,
                mb: 1.8,
                px: 0.2,
              }}
            >
              <SecurityRounded
                sx={{
                  fontSize: 14,
                  color: colors.primary,
                }}
              />

              <Typography
                sx={{
                  color: colors.muted,
                  fontSize: 9.5,
                  lineHeight: 1.6,
                }}
              >
                برای امنیت بیشتر از رمز عبور قوی استفاده کنید.
              </Typography>
            </Stack>

            {/* ==================================================
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
                      fontSize: 19,
                    }}
                  />
                )
              }
              sx={{
                height: 54,

                borderRadius: 2.5,

                fontSize: 13,
                fontWeight: 900,

                color: "#FFFFFF",

                textTransform: "none",

                gap: 1,

                background:
                  `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`,

                boxShadow:
                  "0 10px 24px rgba(37,99,235,.17)",

                transition:
                  "transform .2s ease, box-shadow .2s ease",

                "&:hover": {
                  background:
                    `linear-gradient(135deg, ${colors.primaryDark}, ${colors.cyan})`,

                  transform: "translateY(-1px)",

                  boxShadow:
                    "0 14px 28px rgba(37,99,235,.22)",
                },

                "&:active": {
                  transform: "translateY(0)",
                },

                "&.Mui-disabled": {
                  color: "rgba(255,255,255,.75)",
                  background: "#BFDBFE",
                },
              }}
            >
              {loading
                ? "در حال ایجاد حساب..."
                : "ایجاد حساب کاربری"}
            </Button>

            {/* ==================================================
                LOGIN DIVIDER
            ================================================== */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,

                my: 2,
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
                  fontSize: 9.5,
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

            {/* ==================================================
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

                background: "#F8FAFF",

                fontSize: 12,
                fontWeight: 800,

                textTransform: "none",

                gap: 0.8,

                transition: "all .2s ease",

                "&:hover": {
                  borderColor: "#BFDBFE",
                  background: "#EFF6FF",
                  transform: "translateY(-1px)",
                },
              }}
            >
              ورود به حساب کاربری
            </Button>

            {/* ==================================================
                SECURITY FOOTER
            ================================================== */}

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={0.7}
              sx={{
                mt: 1.7,
              }}
            >
              <SecurityRounded
                sx={{
                  fontSize: 13,
                  color: "#A0AAB8",
                }}
              />

              <Typography
                sx={{
                  color: "#98A2B3",
                  fontSize: 8.8,
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
