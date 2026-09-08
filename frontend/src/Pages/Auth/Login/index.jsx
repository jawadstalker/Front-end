
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
  cyan: "#0891B2",

  text: "#111827",
  muted: "#667085",

  border: "#E4E7EC",
  softBorder: "#EAECF0",

  background: "#F8FAFC",
  surface: "#FFFFFF",
  softBlue: "#EFF6FF",
  blueBorder: "#DBEAFE",
};

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
   * ============================================================
   * INPUT STYLE
   * ============================================================
   */

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      height: 56,
      borderRadius: "14px",

      backgroundColor: "#F9FAFB",

      color: colors.text,

      transition:
        "background-color .2s ease, border-color .2s ease, box-shadow .2s ease",

      "& fieldset": {
        borderColor: colors.border,
        borderWidth: 1,
      },

      "&:hover": {
        backgroundColor: "#FFFFFF",
      },

      "&:hover fieldset": {
        borderColor: "#C7D2FE",
      },

      "&.Mui-focused": {
        backgroundColor: "#FFFFFF",

        boxShadow:
          "0 0 0 4px rgba(37,99,235,.07)",
      },

      "&.Mui-focused fieldset": {
        borderColor: colors.primary,
        borderWidth: 1,
      },
    },

    "& .MuiInputBase-input": {
      height: "100%",
      boxSizing: "border-box",

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
      color: "#667085",
    },

    "& .MuiInputAdornment-positionStart": {
      marginRight: 10,
      paddingLeft: 2,
    },

    "& .MuiInputAdornment-positionEnd": {
      marginLeft: 4,
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

        position: "relative",

        overflow: "hidden",

        background: colors.background,

        px: {
          xs: 1.5,
          sm: 3,
        },

        py: {
          xs: 2,
          sm: 4,
        },
      }}
    >
      {/* =========================================================
          SUBTLE BACKGROUND
      ========================================================= */}

      <Box
        sx={{
          position: "absolute",

          width: {
            xs: 260,
            md: 430,
          },

          height: {
            xs: 260,
            md: 430,
          },

          top: {
            xs: -160,
            md: -230,
          },

          right: {
            xs: -120,
            md: -150,
          },

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(37,99,235,.08), transparent 70%)",

          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",

          width: 400,
          height: 400,

          bottom: -250,
          left: -170,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(8,145,178,.06), transparent 70%)",

          pointerEvents: "none",
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
          maxWidth: 1080,

          display: {
            xs: "block",
            md: "grid",
          },

          gridTemplateColumns: "0.92fr 1.08fr",

          minHeight: {
            md: 610,
          },

          overflow: "hidden",

          borderRadius: {
            xs: "22px",
            md: "28px",
          },

          backgroundColor: colors.surface,

          border:
            "1px solid rgba(255,255,255,.9)",

          boxShadow:
            "0 24px 70px rgba(15,23,42,.08)",
        }}
      >
        {/* =======================================================
            LEFT INFORMATION PANEL
        ======================================================= */}

        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },

            flexDirection: "column",

            justifyContent: "space-between",

            minHeight: 610,

            p: {
              md: 5,
              lg: 5.5,
            },

            background:
              "linear-gradient(145deg, #F8FAFF 0%, #F8FAFC 100%)",

            borderLeft:
              `1px solid ${colors.softBorder}`,
          }}
        >
          <Box>
            {/* Logo */}

            <Stack
              direction="row"
              alignItems="center"
              spacing={1.6}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: "14px",

                  color: "#FFFFFF",

                  background:
                    `linear-gradient(
                      135deg,
                      ${colors.primary},
                      ${colors.cyan}
                    )`,

                  boxShadow:
                    "0 8px 20px rgba(37,99,235,.16)",
                }}
              >
                <VolunteerActivismRounded
                  sx={{
                    fontSize: 25,
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: colors.text,

                    fontSize: 17,

                    fontWeight: 900,

                    lineHeight: 1.4,
                  }}
                >
                  سامانه امداد
                </Typography>

                <Typography
                  sx={{
                    color: "#98A2B3",

                    fontSize: 7.5,

                    fontWeight: 800,

                    letterSpacing: 1,

                    mt: 0.3,
                  }}
                >
                  VOLUNTEER MANAGEMENT PLATFORM
                </Typography>
              </Box>
            </Stack>

            {/* Hero */}

            <Box
              sx={{
                mt: 10,
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",

                  alignItems: "center",

                  gap: 0.8,

                  px: 1.3,
                  py: 0.65,

                  borderRadius: 20,

                  background: "#EFF6FF",

                  border:
                    `1px solid ${colors.blueBorder}`,

                  color: colors.primary,
                }}
              >
                <CheckCircleRounded
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
                  آماده برای خدمت
                </Typography>
              </Box>

              <Typography
                sx={{
                  mt: 2.5,

                  color: colors.text,

                  fontSize: {
                    md: 34,
                    lg: 39,
                  },

                  fontWeight: 900,

                  lineHeight: 1.4,

                  letterSpacing: "-1px",
                }}
              >
                مدیریت هوشمند
                <br />

                <Box
                  component="span"
                  sx={{
                    color: colors.primary,
                  }}
                >
                  عملیات امدادی
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 2,

                  maxWidth: 390,

                  color: colors.muted,

                  fontSize: 12,

                  lineHeight: 2.1,
                }}
              >
                یک محیط یکپارچه برای مدیریت داوطلبان،
                مأموریت‌ها و فعالیت‌های امدادی با دسترسی
                سریع و امن.
              </Typography>
            </Box>
          </Box>

          {/* Footer */}

          <Typography
            sx={{
              color: "#98A2B3",

              fontSize: 9,
            }}
          >
            سامانه مدیریت و هماهنگی نیروهای امدادی
          </Typography>
        </Box>

        {/* =======================================================
            LOGIN PANEL
        ======================================================= */}

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
              md: 6,
            },

            background: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              width: "100%",

              maxWidth: 410,
            }}
          >
            {/* =================================================
                MOBILE LOGO
            ================================================= */}

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

                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: "12px",

                  color: "#FFFFFF",

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
                    fontSize: 22,
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
            ================================================= */}

            <Box
              sx={{
                mb: 3.5,
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: "14px",

                  background: colors.softBlue,

                  border:
                    `1px solid ${colors.blueBorder}`,

                  color: colors.primary,

                  mb: 2.2,
                }}
              >
                <LoginRounded
                  sx={{
                    fontSize: 25,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: colors.text,

                  fontSize: {
                    xs: 26,
                    sm: 29,
                  },

                  fontWeight: 900,

                  lineHeight: 1.4,

                  letterSpacing: "-.5px",
                }}
              >
                خوش آمدید
              </Typography>

              <Typography
                sx={{
                  color: colors.muted,

                  fontSize: 12,

                  lineHeight: 2,

                  mt: 0.8,
                }}
              >
                برای ورود به حساب کاربری، اطلاعات خود را
                وارد کنید.
              </Typography>
            </Box>

            {/* =================================================
                FORM
            ================================================= */}

            <Stack
              spacing={2.2}
            >
              {/* PHONE */}

              <Box>
                <Typography
                  sx={{
                    color: "#344054",

                    fontSize: 11.5,

                    fontWeight: 800,

                    mb: 0.9,
                  }}
                >
                  شماره موبایل
                </Typography>

                <TextField
                  fullWidth

                  value={phone}

                  onChange={(e) =>
                    setPhone(e.target.value)
                  }

                  onKeyDown={handleKeyDown}

                  placeholder="09123456789"

                  type="tel"

                  autoComplete="tel"

                  dir="rtl"

                  sx={fieldSx}

                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphoneRounded
                          sx={{
                            fontSize: 19,
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* PASSWORD */}

              <Box>
                <Typography
                  sx={{
                    color: "#344054",

                    fontSize: 11.5,

                    fontWeight: 800,

                    mb: 0.9,
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
                      <InputAdornment position="start">
                        <LockRounded
                          sx={{
                            fontSize: 19,
                          }}
                        />
                      </InputAdornment>
                    ),

                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{
                          marginLeft: 0,
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
                            width: 38,
                            height: 38,

                            color: "#98A2B3",

                            "&:hover": {
                              color:
                                colors.primary,

                              background:
                                colors.softBlue,
                            },
                          }}
                        >
                          {showPassword ? (
                            <VisibilityOffRounded
                              sx={{
                                fontSize: 19,
                              }}
                            />
                          ) : (
                            <VisibilityRounded
                              sx={{
                                fontSize: 19,
                              }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* LOGIN */}

              <Button
                fullWidth

                variant="contained"

                disabled={loading}

                onClick={handleLogin}

                endIcon={
                  !loading ? (
                    <ArrowBackRounded
                      sx={{
                        fontSize: 19,
                      }}
                    />
                  ) : null
                }

                sx={{
                  height: 55,

                  borderRadius: "14px",

                  mt: 0.3,

                  textTransform: "none",

                  fontSize: 13,

                  fontWeight: 800,

                  gap: 0.9,

                  color: "#FFFFFF",

                  background:
                    colors.primary,

                  boxShadow:
                    "0 8px 20px rgba(37,99,235,.16)",

                  transition:
                    "transform .2s ease, background .2s ease, box-shadow .2s ease",

                  "&:hover": {
                    background:
                      colors.primaryDark,

                    transform:
                      "translateY(-1px)",

                    boxShadow:
                      "0 12px 25px rgba(37,99,235,.20)",
                  },

                  "&:active": {
                    transform:
                      "translateY(0)",
                  },

                  "&:disabled": {
                    background: "#BFDBFE",

                    color: "#FFFFFF",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={20}
                    thickness={4}
                    sx={{
                      color: "#FFFFFF",
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
                      fontSize: 18,
                    }}
                  />
                }

                sx={{
                  height: 42,

                  borderRadius: "11px",

                  color: "#667085",

                  fontSize: 11.5,

                  fontWeight: 700,

                  textTransform: "none",

                  gap: 0.6,

                  "&:hover": {
                    color: colors.primary,

                    background:
                      colors.softBlue,
                  },
                }}
              >
                ورود با رمز یکبار مصرف
              </Button>
            </Stack>

            {/* =================================================
                DIVIDER
            ================================================= */}

            <Divider
              sx={{
                my: 2.6,

                borderColor:
                  colors.softBorder,
              }}
            />

            {/* =================================================
                REGISTER
            ================================================= */}

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                justifyContent:
                  "space-between",

                gap: 2,

                p: 1.6,

                borderRadius: "14px",

                background: "#F9FAFB",

                border:
                  `1px solid ${colors.softBorder}`,
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

                    fontSize: 11,

                    fontWeight: 700,

                    lineHeight: 1.6,
                  }}
                >
                  حساب کاربری ندارید؟
                </Typography>

                <Typography
                  sx={{
                    color: "#98A2B3",

                    fontSize: 9,

                    mt: 0.3,

                    lineHeight: 1.6,
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
                      fontSize: 16,
                    }}
                  />
                }

                sx={{
                  flexShrink: 0,

                  minWidth: 116,

                  height: 40,

                  px: 1.5,

                  borderRadius: "10px",

                  color: colors.primary,

                  background:
                    colors.softBlue,

                  border:
                    `1px solid ${colors.blueBorder}`,

                  fontSize: 10.5,

                  fontWeight: 800,

                  textTransform: "none",

                  gap: 0.5,

                  whiteSpace:
                    "nowrap",

                  "&:hover": {
                    background:
                      "#DBEAFE",

                    borderColor:
                      "#BFDBFE",
                  },
                }}
              >
                ایجاد حساب
              </Button>
            </Box>

            {/* =================================================
                SECURITY
            ================================================= */}

            <Stack
              direction="row"
              spacing={0.8}

              justifyContent="center"
              alignItems="center"

              sx={{
                mt: 2.2,
              }}
            >
              <SecurityRounded
                sx={{
                  fontSize: 14,

                  color: "#98A2B3",
                }}
              />

              <Typography
                sx={{
                  color: "#98A2B3",

                  fontSize: 9,

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
