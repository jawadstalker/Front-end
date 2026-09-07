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
  BadgeRounded,
  CheckCircleRounded,
  KeyRounded,
  LockRounded,
  LoginRounded,
  PhoneIphoneRounded,
  SecurityRounded,
  VisibilityOffRounded,
  VisibilityRounded,
  VolunteerActivismRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { toast } from "react-hot-toast";

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

const features = [
  {
    icon: <VolunteerActivismRounded />,
    title: "مدیریت داوطلبان",
    text: "مدیریت اطلاعات و فعالیت‌های داوطلبان",
  },
  {
    icon: <BadgeRounded />,
    title: "مدیریت مأموریت‌ها",
    text: "دسترسی سریع به مأموریت‌ها و عملیات",
  },
  {
    icon: <SecurityRounded />,
    title: "امنیت و دسترسی",
    text: "محیط امن برای اطلاعات و کاربران",
  },
];

export default function Login() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      toast.error("لطفاً شماره موبایل و رمز عبور را وارد کنید");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        phone,
        password,
      });

      localStorage.setItem("token", response.data.access_token);

      toast.success("ورود موفق بود");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "شماره موبایل یا رمز عبور اشتباه است"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  /*
   * فاصله‌های آیکون و متن در این نسخه عمداً
   * بیشتر شده‌اند تا UI خلوت‌تر و حرفه‌ای‌تر باشد.
   */
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      height: 60,
      borderRadius: 3,
      backgroundColor: "#F8FAFC",
      color: colors.text,
      transition: "all .2s ease",

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
        boxShadow: "0 0 0 4px rgba(37,99,235,.08)",
      },

      "&.Mui-focused fieldset": {
        borderColor: colors.primary,
        borderWidth: 1.5,
      },
    },

    "& .MuiInputBase-input": {
      padding: "0 12px",
      textAlign: "right",
      direction: "rtl",
      color: colors.text,
      fontSize: 14,

      "&::placeholder": {
        color: "#98A2B3",
        opacity: 1,
      },
    },

    "& .MuiInputAdornment-root": {
      marginRight: 14,
      color: colors.primary,
    },

    "& .MuiInputAdornment-positionStart": {
      paddingLeft: 2,
    },
  };

  return (
    <Box
      dir="rtl"
      sx={{
        minHeight: "100dvh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: {
          xs: 1.5,
          sm: 3,
        },
        overflow: "auto",
        position: "relative",

        background:
          "linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 48%, #ECFEFF 100%)",
      }}
    >
      {/* =========================================================
          BACKGROUND DECORATION
      ========================================================= */}

      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          top: -230,
          right: -130,

          background:
            "radial-gradient(circle, rgba(37,99,235,.16), transparent 68%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 460,
          height: 460,
          borderRadius: "50%",
          bottom: -280,
          left: -170,

          background:
            "radial-gradient(circle, rgba(124,58,237,.13), transparent 68%)",
        }}
      />

      {/* =========================================================
          MAIN CARD
      ========================================================= */}

      <Box
        sx={{
          position: "relative",
          zIndex: 1,

          width: "100%",
          maxWidth: 1120,

          display: {
            xs: "block",
            md: "grid",
          },

          gridTemplateColumns: "1fr 1fr",

          minHeight: {
            md: 660,
          },

          overflow: "hidden",

          borderRadius: {
            xs: 4,
            md: 5,
          },

          border: "1px solid rgba(255,255,255,.9)",

          background: colors.surface,

          boxShadow: "0 30px 80px rgba(30,41,59,.14)",
        }}
      >
        {/* =========================================================
            LEFT PANEL
        ========================================================= */}

        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },

            flexDirection: "column",
            justifyContent: "space-between",

            p: {
              md: 5,
              lg: 6,
            },

            background:
              "linear-gradient(145deg, #EFF6FF 0%, #EEF2FF 52%, #ECFEFF 100%)",

            borderLeft: "1px solid #E5E7EB",
          }}
        >
          <Box>
            {/* Logo */}

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  flexShrink: 0,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2.8,

                  color: "#fff",

                  background:
                    `linear-gradient(
                      135deg,
                      ${colors.primary},
                      ${colors.cyan}
                    )`,

                  boxShadow:
                    "0 12px 25px rgba(37,99,235,.22)",
                }}
              >
                <VolunteerActivismRounded
                  sx={{
                    fontSize: 29,
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: colors.text,
                    fontSize: 19,
                    fontWeight: 900,
                    lineHeight: 1.4,
                  }}
                >
                  سامانه امداد
                </Typography>

                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: 8.5,
                    fontWeight: 800,
                    letterSpacing: 1.1,
                    mt: 0.6,
                  }}
                >
                  VOLUNTEER MANAGEMENT PLATFORM
                </Typography>
              </Box>
            </Stack>

            {/* Hero */}

            <Box
              sx={{
                mt: 7,
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",

                  gap: 1.1,

                  px: 1.6,
                  py: 0.8,

                  borderRadius: 10,

                  color: colors.primary,

                  background: "#DBEAFE",

                  border: "1px solid #BFDBFE",
                }}
              >
                <CheckCircleRounded
                  sx={{
                    fontSize: 18,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  آماده برای خدمت
                </Typography>
              </Box>

              <Typography
                sx={{
                  mt: 2.5,

                  color: colors.text,

                  fontSize: {
                    md: 35,
                    lg: 42,
                  },

                  fontWeight: 900,

                  lineHeight: 1.35,

                  letterSpacing: "-.8px",
                }}
              >
                مدیریت هوشمند
                <br />

                <Box
                  component="span"
                  sx={{
                    background:
                      `linear-gradient(
                        90deg,
                        ${colors.primary},
                        ${colors.purple}
                      )`,

                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  عملیات امدادی
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 2.4,

                  maxWidth: 410,

                  color: colors.muted,

                  fontSize: 13,

                  lineHeight: 2,
                }}
              >
                یک محیط یکپارچه برای مدیریت داوطلبان، مأموریت‌ها و
                فعالیت‌های امدادی با دسترسی سریع و امن.
              </Typography>
            </Box>

            {/* Features */}

            <Stack
              spacing={1.4}
              sx={{
                mt: 4.2,
              }}
            >
              {features.map((item) => (
                <Box
                  key={item.title}
                  sx={{
                    display: "flex",
                    alignItems: "center",

                    gap: 2,

                    p: 1.6,

                    borderRadius: 3,

                    background: "rgba(255,255,255,.72)",

                    border:
                      "1px solid rgba(148,163,184,.18)",

                    transition: "all .2s ease",

                    "&:hover": {
                      transform: "translateX(-3px)",

                      boxShadow:
                        "0 8px 24px rgba(37,99,235,.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 43,
                      height: 43,

                      flexShrink: 0,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      borderRadius: 2.3,

                      background: "#DBEAFE",

                      color: colors.primary,
                    }}
                  >
                    {React.cloneElement(item.icon, {
                      sx: {
                        fontSize: 21,
                      },
                    })}
                  </Box>

                  <Box
                    sx={{
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: colors.text,
                        fontSize: 12,
                        fontWeight: 800,
                        lineHeight: 1.6,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: colors.muted,
                        fontSize: 10,
                        mt: 0.5,
                        lineHeight: 1.7,
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          <Typography
            sx={{
              color: "#94A3B8",
              fontSize: 9.5,
            }}
          >
            سامانه مدیریت و هماهنگی نیروهای امدادی
          </Typography>
        </Box>

        {/* =========================================================
            RIGHT LOGIN PANEL
        ========================================================= */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",
            justifyContent: "center",

            px: {
              xs: 2.5,
              sm: 5,
              md: 6,
              lg: 7,
            },

            py: {
              xs: 4,
              sm: 5,
            },

            background: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 430,
            }}
          >
            {/* Mobile Logo */}

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"

              spacing={1.8}

              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },

                mb: 3.5,
              }}
            >
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  flexShrink: 0,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2.4,

                  color: "#fff",

                  background:
                    `linear-gradient(
                      135deg,
                      ${colors.primary},
                      ${colors.cyan}
                    )`,
                }}
              >
                <VolunteerActivismRounded
                  sx={{
                    fontSize: 24,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: colors.text,
                  fontSize: 19,
                  fontWeight: 900,
                }}
              >
                سامانه امداد
              </Typography>
            </Stack>

            {/* Login Header */}

            <Box
              sx={{
                mb: 3.5,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2.8,

                  color: colors.primary,

                  background: "#EFF6FF",

                  border: "1px solid #DBEAFE",

                  mb: 2.4,
                }}
              >
                <LoginRounded
                  sx={{
                    fontSize: 28,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: colors.text,

                  fontSize: {
                    xs: 27,
                    sm: 30,
                  },

                  fontWeight: 900,

                  lineHeight: 1.35,
                }}
              >
                خوش آمدید
              </Typography>

              <Typography
                sx={{
                  color: colors.muted,

                  fontSize: 13,

                  lineHeight: 1.9,

                  mt: 0.9,
                }}
              >
                برای ورود به حساب کاربری خود، اطلاعات زیر را وارد کنید.
              </Typography>
            </Box>

            {/* Form */}

            <Stack
              spacing={2.4}
            >
              {/* Phone */}

              <Box>
                <Typography
                  sx={{
                    color: "#344054",
                    fontSize: 12,
                    fontWeight: 800,
                    mb: 1,
                  }}
                >
                  شماره موبایل
                </Typography>

                <TextField
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="09123456789"
                  type="tel"
                  autoComplete="tel"
                  dir="rtl"
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                      >
                        <PhoneIphoneRounded
                          sx={{
                            fontSize: 20,
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Password */}

              <Box>
                <Typography
                  sx={{
                    color: "#344054",
                    fontSize: 12,
                    fontWeight: 800,
                    mb: 1,
                  }}
                >
                  رمز عبور
                </Typography>

                <TextField
                  fullWidth
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="رمز عبور خود را وارد کنید"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  dir="rtl"
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                      >
                        <LockRounded
                          sx={{
                            fontSize: 20,
                          }}
                        />
                      </InputAdornment>
                    ),

                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{
                          marginRight: 0,
                          marginLeft: 1,
                        }}
                      >
                        <IconButton
                          onClick={() =>
                            setShowPassword(
                              (prev) => !prev
                            )
                          }
                          edge="end"
                          aria-label={
                            showPassword
                              ? "پنهان کردن رمز عبور"
                              : "نمایش رمز عبور"
                          }
                          sx={{
                            color: "#98A2B3",

                            "&:hover": {
                              color: colors.primary,
                              background:
                                "#EFF6FF",
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
              </Box>

              {/* Login Button */}

              <Button
                fullWidth
                variant="contained"
                disabled={loading}
                onClick={handleLogin}
                endIcon={
                  !loading ? (
                    <ArrowBackRounded
                      sx={{
                        fontSize: 20,
                      }}
                    />
                  ) : null
                }
                sx={{
                  height: 58,

                  borderRadius: 3,

                  mt: 0.2,

                  textTransform: "none",

                  fontSize: 13.5,

                  fontWeight: 900,

                  gap: 1.2,

                  background:
                    `linear-gradient(
                      135deg,
                      ${colors.primary},
                      ${colors.cyan}
                    )`,

                  boxShadow:
                    "0 12px 28px rgba(37,99,235,.20)",

                  transition: "all .2s ease",

                  "&:hover": {
                    background:
                      `linear-gradient(
                        135deg,
                        ${colors.primaryDark},
                        ${colors.cyan}
                      )`,

                    transform: "translateY(-1px)",

                    boxShadow:
                      "0 16px 34px rgba(37,99,235,.25)",
                  },

                  "&:disabled": {
                    background: "#BFDBFE",
                    color: "#fff",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={21}
                    thickness={4}
                    sx={{
                      color: "#fff",
                    }}
                  />
                ) : (
                  "ورود به حساب کاربری"
                )}
              </Button>

              {/* OTP */}

              <Button
                fullWidth
                variant="text"
                onClick={() =>
                  navigate("/otp-login")
                }
                startIcon={
                  <KeyRounded
                    sx={{
                      fontSize: 19,
                    }}
                  />
                }
                sx={{
                  height: 44,

                  borderRadius: 2.3,

                  color: "#667085",

                  fontSize: 12,

                  fontWeight: 700,

                  textTransform: "none",

                  gap: 0.8,

                  "&:hover": {
                    color: colors.primary,
                    background: "#EFF6FF",
                  },
                }}
              >
                ورود با رمز یکبار مصرف
              </Button>
            </Stack>

            <Divider
              sx={{
                my: 2.8,
                borderColor: colors.border,
              }}
            />

            {/* Register Card */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                justifyContent: "space-between",

                gap: 2.5,

                p: 2,

                borderRadius: 3,

                background: "#F8FAFC",

                border:
                  "1px solid #E5E7EB",
              }}
            >
              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Typography
                  sx={{
                    color: "#344054",
                    fontSize: 11.5,
                    fontWeight: 700,
                    lineHeight: 1.6,
                  }}
                >
                  حساب کاربری ندارید؟
                </Typography>

                <Typography
                  sx={{
                    color: "#98A2B3",
                    fontSize: 9.5,
                    mt: 0.45,
                    lineHeight: 1.7,
                  }}
                >
                  در کمتر از یک دقیقه ثبت‌نام کنید
                </Typography>
              </Box>

              <Button
                onClick={() =>
                  navigate("/register")
                }
                endIcon={
                  <ArrowBackRounded
                    sx={{
                      fontSize: 17,
                    }}
                  />
                }
                sx={{
                  flexShrink: 0,

                  minWidth: 128,

                  height: 42,

                  px: 1.8,

                  borderRadius: 2.3,

                  color: colors.primary,

                  background: "#EFF6FF",

                  border:
                    "1px solid #DBEAFE",

                  fontSize: 11,

                  fontWeight: 800,

                  textTransform: "none",

                  gap: 0.7,

                  whiteSpace: "nowrap",

                  "&:hover": {
                    background: "#DBEAFE",
                    borderColor: "#BFDBFE",
                  },
                }}
              >
                ایجاد حساب
              </Button>
            </Box>

            {/* Security */}

            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              alignItems="center"
              sx={{
                mt: 2.3,
              }}
            >
              <SecurityRounded
                sx={{
                  fontSize: 15,
                  color: "#98A2B3",
                }}
              />

              <Typography
                sx={{
                  color: "#98A2B3",
                  fontSize: 9.5,
                  textAlign: "center",
                }}
              >
                اطلاعات شما با امنیت بالا محافظت می‌شود
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}