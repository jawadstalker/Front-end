
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
  SecurityRounded,
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
  surface: "#FFFFFF",
};

export default function VerifyOTP() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const phone = localStorage.getItem("otp_phone");

  const handleVerify = async () => {
    if (!code) {
      toast.error("کد را وارد کنید");
      return;
    }

    try {
      setLoading(true);

      const phone = localStorage.getItem("otp_phone");

      const response = await api.post("/auth/verify-otp", {
        phone,
        code,
      });

      localStorage.setItem("token", response.data.access_token);

      toast.success("ورود موفق بود ✅");

      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data);

      toast.error("کد وارد شده اشتباه است");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      handleVerify();
    }
  };

  const handleCodeChange = (event) => {
    const value = event.target.value;

    // فقط اعداد و حداکثر 6 رقم
    const numericValue = value.replace(/\D/g, "").slice(0, 6);

    setCode(numericValue);
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      height: 62,
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
      padding: "0 14px",
      textAlign: "center",
      direction: "ltr",
      color: colors.text,
      fontSize: 24,
      fontWeight: 800,
      letterSpacing: "8px",

      "&::placeholder": {
        color: "#98A2B3",
        opacity: 1,
        letterSpacing: "4px",
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
      {/* Decorative background */}
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
            md: 620,
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
        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

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
            {/* Brand */}
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
                  color: "#fff",

                  background:
                    `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`,

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

            {/* Content */}
            <Box sx={{ mt: 7 }}>
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
                <SecurityRounded
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
                  ورود امن
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
                امنیت بیشتر،
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
                  ورود مطمئن‌تر
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
                کد یکبار مصرف ارسال‌شده به شماره موبایل شما را وارد کنید
                تا ورود به حساب کاربری با امنیت بیشتری انجام شود.
              </Typography>

              {/* Security Card */}
              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  borderRadius: 3,

                  background: "rgba(255,255,255,.7)",

                  border: "1px solid rgba(191,219,254,.8)",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.3}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      borderRadius: 2,

                      color: colors.primary,
                      background: "#EFF6FF",
                    }}
                  >
                    <SecurityRounded
                      sx={{
                        fontSize: 21,
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
                      کد یکبار مصرف
                    </Typography>

                    <Typography
                      sx={{
                        color: colors.muted,
                        fontSize: 10,
                        mt: 0.35,
                      }}
                    >
                      کد ارسال‌شده فقط برای ورود فعلی معتبر است.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
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

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

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
            {/* Mobile Brand */}
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

                  color: "#fff",

                  background:
                    `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`,
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
            <Box sx={{ mb: 3.2 }}>
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

                  mb: 2,
                }}
              >
                <KeyRounded
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
                  lineHeight: 1.3,
                }}
              >
                تایید کد پیامکی
              </Typography>

              <Typography
                sx={{
                  color: colors.muted,
                  fontSize: 13,
                  lineHeight: 1.9,
                  mt: 0.7,
                }}
              >
                کد یکبار مصرف ارسال‌شده به شماره موبایل شما را وارد کنید.
              </Typography>

              {/* Phone */}
              {phone && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    mt: 1.5,
                    px: 1.5,
                    py: 0.8,

                    borderRadius: 2,

                    background: "#F8FAFC",

                    border: "1px solid #E5E7EB",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#475467",
                      fontSize: 11.5,
                      fontWeight: 700,
                      direction: "ltr",
                    }}
                  >
                    {phone}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Form */}
            <Stack spacing={2.1}>
              <Box>
                <Typography
                  sx={{
                    color: "#344054",
                    fontSize: 12,
                    fontWeight: 800,
                    mb: 0.8,
                  }}
                >
                  کد یکبار مصرف
                </Typography>

                <TextField
                  fullWidth
                  autoFocus
                  value={code}
                  onChange={handleCodeChange}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  dir="ltr"
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyRounded
                          sx={{
                            fontSize: 20,
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />

                <Typography
                  sx={{
                    color: "#98A2B3",
                    fontSize: 9.5,
                    mt: 0.8,
                    textAlign: "right",
                  }}
                >
                  کد ۶ رقمی ارسال‌شده را وارد کنید.
                </Typography>
              </Box>

              {/* Verify Button */}
              <Button
                fullWidth
                variant="contained"
                disabled={loading}
                onClick={handleVerify}
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
                  mt: 0.4,

                  textTransform: "none",

                  fontSize: 13.5,
                  fontWeight: 900,

                  background:
                    `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`,

                  boxShadow:
                    "0 12px 28px rgba(37,99,235,.20)",

                  transition: "all .2s ease",

                  "&:hover": {
                    background:
                      `linear-gradient(135deg, ${colors.primaryDark}, ${colors.cyan})`,

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
                  "تایید و ورود"
                )}
              </Button>

              {/* Back */}
              <Button
                fullWidth
                variant="text"
                disabled={loading}
                onClick={() => navigate("/otp-login")}
                sx={{
                  height: 42,
                  borderRadius: 2.2,

                  color: "#667085",

                  fontSize: 12,
                  fontWeight: 700,

                  textTransform: "none",

                  "&:hover": {
                    color: colors.primary,
                    background: "#EFF6FF",
                  },
                }}
              >
                بازگشت و تغییر شماره موبایل
              </Button>
            </Stack>

            <Divider
              sx={{
                my: 2.5,
                borderColor: colors.border,
              }}
            />

            {/* Security Footer */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.8,

                p: 1.8,

                borderRadius: 3,

                background: "#F8FAFC",

                border: "1px solid #E5E7EB",
              }}
            >
              <SecurityRounded
                sx={{
                  fontSize: 16,
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

              <CheckCircleRounded
                sx={{
                  fontSize: 15,
                  color: "#22C55E",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

