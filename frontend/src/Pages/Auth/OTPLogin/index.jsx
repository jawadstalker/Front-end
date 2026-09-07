import React, { useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowBackRounded,
  CheckCircleRounded,
  KeyRounded,
  PhoneIphoneRounded,
  SecurityRounded,
  SmsRounded,
  VolunteerActivismRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import api from "../../../api/axios";
import toast from "react-hot-toast";

const colors = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  cyan: "#06B6D4",
  purple: "#7C3AED",
  text: "#172033",
  muted: "#667085",
  border: "#E5E7EB",
};

export default function OTPLogin() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!phone.trim()) {
      toast.error("شماره موبایل را وارد کنید");
      return;
    }

    try {
      setLoading(true);

      // Backend logic intentionally unchanged
      await api.post("/auth/send-otp", {
        phone,
      });

      localStorage.setItem("otp_phone", phone);

      toast.success("کد ارسال شد");

      navigate("/verify-otp");
    } catch (error) {
      console.log(error);

      toast.error("خطا در ارسال کد");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      sendOTP();
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      height: 58,
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
      padding: "0 10px",
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
      marginRight: 10,
      color: colors.primary,
    },
  };

  return (
    <Box
      dir="rtl"
      onKeyDown={handleKeyDown}
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
      {/* Background decoration */}

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

      {/* Main Card */}

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
            md: 650,
          },

          overflow: "hidden",

          borderRadius: {
            xs: 4,
            md: 5,
          },

          border: "1px solid rgba(255,255,255,.9)",

          background: "#FFFFFF",

          boxShadow: "0 30px 80px rgba(30,41,59,.14)",
        }}
      >
        {/* ========================================================= */}
        {/* LEFT INFORMATION PANEL */}
        {/* ========================================================= */}

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
              spacing={1.5}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2.7,

                  color: "#FFFFFF",

                  background: `linear-gradient(
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
                    fontSize: 28,
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: colors.text,
                    fontSize: 19,
                    fontWeight: 900,
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
                    mt: 0.4,
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
                  gap: 0.8,

                  px: 1.4,
                  py: 0.7,

                  borderRadius: 10,

                  color: colors.primary,

                  background: "#DBEAFE",

                  border: "1px solid #BFDBFE",
                }}
              >
                <CheckCircleRounded
                  sx={{
                    fontSize: 17,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  احراز هویت سریع
                </Typography>
              </Box>

              <Typography
                sx={{
                  mt: 2.2,

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
                ورود سریع و امن
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
                  بدون رمز عبور
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 2.2,

                  maxWidth: 410,

                  color: colors.muted,

                  fontSize: 13,

                  lineHeight: 2,
                }}
              >
                با استفاده از کد یکبار مصرف، بدون نیاز به حفظ رمز عبور وارد
                حساب کاربری خود شوید و به خدمات سامانه امداد دسترسی پیدا کنید.
              </Typography>
            </Box>
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

        {/* ========================================================= */}
        {/* RIGHT FORM PANEL */}
        {/* ========================================================= */}

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
              spacing={1.2}
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
                  width: 44,
                  height: 44,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2.3,

                  color: "#FFFFFF",

                  background:
                    `linear-gradient(
                      135deg,
                      ${colors.primary},
                      ${colors.cyan}
                    )`,
                }}
              >
                <VolunteerActivismRounded />
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

            {/* Header */}

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

                  border:
                    "1px solid #DBEAFE",

                  mb: 2,
                }}
              >
                <SmsRounded
                  sx={{
                    fontSize: 28,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: colors.text,

                  fontSize: {
                    xs: 26,
                    sm: 30,
                  },

                  fontWeight: 900,

                  lineHeight: 1.3,
                }}
              >
                ورود با کد یکبار مصرف
              </Typography>

              <Typography
                sx={{
                  color: colors.muted,

                  fontSize: 13,

                  lineHeight: 1.9,

                  mt: 0.8,
                }}
              >
                شماره موبایل خود را وارد کنید تا کد تأیید برای شما ارسال شود.
              </Typography>
            </Box>

            {/* Info Notice */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                gap: 1.3,

                p: 1.6,

                mb: 2.3,

                borderRadius: 3,

                background:
                  "linear-gradient(135deg, #EFF6FF, #F5F3FF)",

                border:
                  "1px solid #DBEAFE",
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,

                  flexShrink: 0,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2,

                  color: colors.primary,

                  background: "#FFFFFF",
                }}
              >
                <KeyRounded
                  sx={{
                    fontSize: 20,
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: colors.text,
                    fontSize: 11.5,
                    fontWeight: 800,
                  }}
                >
                  ورود بدون رمز عبور
                </Typography>

                <Typography
                  sx={{
                    color: colors.muted,
                    fontSize: 9.5,
                    mt: 0.25,
                    lineHeight: 1.7,
                  }}
                >
                  کد تأیید به شماره موبایل شما ارسال خواهد شد.
                </Typography>
              </Box>
            </Box>

            {/* Phone Field */}

            <Box>
              <Typography
                sx={{
                  color: "#344054",
                  fontSize: 12,
                  fontWeight: 800,
                  mb: 0.8,
                }}
              >
                شماره موبایل
              </Typography>

              <TextField
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09123456789"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="rtl"
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
            </Box>

            {/* Send Button */}

            <Button
              fullWidth
              variant="contained"
              disabled={loading}
              onClick={sendOTP}
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
                height: 57,

                borderRadius: 3,

                mt: 1,

                textTransform: "none",

                fontSize: 13.5,

                fontWeight: 900,

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
                  color: "#FFFFFF",
                },
              }}
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={21}
                    thickness={4}
                    sx={{
                      color: "#FFFFFF",
                      mr: 1,
                    }}
                  />

                  در حال ارسال...
                </>
              ) : (
                "ارسال کد تأیید"
              )}
            </Button>

            {/* Back to Password Login */}

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate("/login")}
              startIcon={
                <ArrowBackRounded
                  sx={{
                    fontSize: 18,
                  }}
                />
              }
              sx={{
                height: 44,

                mt: 1.2,

                borderRadius: 2.3,

                color: "#667085",

                fontSize: 11.5,

                fontWeight: 700,

                textTransform: "none",

                "&:hover": {
                  color: colors.primary,
                  background: "#EFF6FF",
                },
              }}
            >
              بازگشت به ورود با رمز عبور
            </Button>

            <Divider
              sx={{
                my: 2.5,
                borderColor: colors.border,
              }}
            />

            {/* Security */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                gap: 0.8,

                p: 1.5,

                borderRadius: 3,

                background: "#F8FAFC",

                border:
                  "1px solid #E5E7EB",
              }}
            >
              <SecurityRounded
                sx={{
                  fontSize: 17,
                  color: "#64748B",
                }}
              />

              <Typography
                sx={{
                  color: "#667085",

                  fontSize: 10,

                  textAlign: "center",

                  lineHeight: 1.7,
                }}
              >
                کد تأیید فقط برای شماره موبایل شما ارسال می‌شود
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={0.7}
              justifyContent="center"
              alignItems="center"
              sx={{
                mt: 2,
              }}
            >
              <CheckCircleRounded
                sx={{
                  fontSize: 14,
                  color: "#16A34A",
                }}
              />

              <Typography
                sx={{
                  color: "#98A2B3",
                  fontSize: 9.5,
                }}
              >
                ارتباط شما با سامانه امن است
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}