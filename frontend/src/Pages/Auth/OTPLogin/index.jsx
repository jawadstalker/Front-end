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

const features = [
  {
    icon: <VolunteerActivismRounded />,
    title: "مدیریت داوطلبان",
    text: "مدیریت اطلاعات و فعالیت‌های داوطلبان",
  },
  {
    icon: <KeyRounded />,
    title: "ورود سریع",
    text: "دسترسی سریع بدون نیاز به حفظ رمز عبور",
  },
  {
    icon: <SecurityRounded />,
    title: "امنیت بیشتر",
    text: "احراز هویت امن با کد یکبار مصرف",
  },
];

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

      // Backend logic — unchanged
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
      marginRight: 16,
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
      {/* =========================================================
          BACKGROUND DECORATIONS
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
        {/* =========================================================
            LEFT INFORMATION PANEL
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

                  color: "#FFFFFF",

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

                  border:
                    "1px solid #BFDBFE",
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
                  احراز هویت سریع
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

                    WebkitBackgroundClip:
                      "text",

                    WebkitTextFillColor:
                      "transparent",
                  }}
                >
                  بدون رمز عبور
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
                با استفاده از کد یکبار مصرف، بدون نیاز به حفظ رمز عبور وارد
                حساب کاربری خود شوید و به خدمات سامانه امداد دسترسی پیدا کنید.
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

                    background:
                      "rgba(255,255,255,.72)",

                    border:
                      "1px solid rgba(148,163,184,.18)",

                    transition:
                      "all .2s ease",

                    "&:hover": {
                      transform:
                        "translateX(-3px)",

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
                    {React.cloneElement(
                      item.icon,
                      {
                        sx: {
                          fontSize: 21,
                        },
                      }
                    )}
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
            RIGHT OTP PANEL
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

            {/* Header */}

            <Box
              sx={{
                mb: 3.5,
              }}
            >
              <Box
                sx={{
                  width: 58,
                  height: 58,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2.8,

                  color: colors.primary,

                  background: "#EFF6FF",

                  border:
                    "1px solid #DBEAFE",

                  mb: 2.5,
                }}
              >
                <SmsRounded
                  sx={{
                    fontSize: 30,
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

                  lineHeight: 1.35,
                }}
              >
                ورود با کد یکبار مصرف
              </Typography>

              <Typography
                sx={{
                  color: colors.muted,

                  fontSize: 13,

                  lineHeight: 1.9,

                  mt: 1,
                }}
              >
                شماره موبایل خود را وارد کنید تا کد تأیید برای شما ارسال شود.
              </Typography>
            </Box>

            {/* Information Card */}

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1.7,

                p: 1.7,

                mb: 2.8,

                borderRadius: 3,

                background:
                  "linear-gradient(135deg, #EFF6FF, #F5F3FF)",

                border:
                  "1px solid #DBEAFE",
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,

                  flexShrink: 0,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2.2,

                  color: colors.primary,

                  background: "#FFFFFF",

                  boxShadow:
                    "0 4px 12px rgba(37,99,235,.07)",
                }}
              >
                <KeyRounded
                  sx={{
                    fontSize: 21,
                  }}
                />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    color: colors.text,

                    fontSize: 11.5,

                    fontWeight: 800,

                    lineHeight: 1.6,
                  }}
                >
                  ورود بدون رمز عبور
                </Typography>

                <Typography
                  sx={{
                    color: colors.muted,

                    fontSize: 9.5,

                    mt: 0.4,

                    lineHeight: 1.8,
                  }}
                >
                  یک کد تأیید امن به شماره موبایل شما ارسال خواهد شد.
                </Typography>
              </Box>
            </Box>

            {/* Phone Label */}

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

            {/* Phone Field */}

            <TextField
              fullWidth
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="09123456789"
              type="tel"
              inputMode="tel"
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
                        fontSize: 21,
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {/* Helper */}

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                mt: 0.2,
                mb: 1.8,
                px: 0.5,
              }}
            >
              <SecurityRounded
                sx={{
                  fontSize: 15,
                  color: "#94A3B8",
                }}
              />

              <Typography
                sx={{
                  color: "#98A2B3",

                  fontSize: 9.5,

                  lineHeight: 1.7,
                }}
              >
                شماره شما فقط برای احراز هویت استفاده می‌شود.
              </Typography>
            </Stack>

            {/* Send OTP */}

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
                height: 58,

                borderRadius: 3,

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

                  transform:
                    "translateY(-1px)",

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

            {/* Back to Login */}

            <Button
              fullWidth
              variant="text"
              onClick={() =>
                navigate("/login")
              }
              startIcon={
                <ArrowBackRounded
                  sx={{
                    fontSize: 18,
                  }}
                />
              }
              sx={{
                height: 46,

                mt: 1.3,

                borderRadius: 2.4,

                color: "#667085",

                fontSize: 11.5,

                fontWeight: 700,

                textTransform: "none",

                gap: 1,

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
                my: 2.7,

                borderColor: colors.border,
              }}
            />

            {/* Security Card */}

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                gap: 1.3,

                p: 1.7,

                borderRadius: 3,

                background: "#F8FAFC",

                border:
                  "1px solid #E5E7EB",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,

                  flexShrink: 0,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2,

                  background: "#FFFFFF",

                  color: "#64748B",
                }}
              >
                <SecurityRounded
                  sx={{
                    fontSize: 18,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: "#667085",

                  fontSize: 10,

                  lineHeight: 1.8,

                  textAlign: "right",
                }}
              >
                کد تأیید فقط برای شماره موبایل شما ارسال می‌شود و اطلاعات
                شما در محیطی امن نگهداری خواهد شد.
              </Typography>
            </Box>

            {/* Status */}

            <Stack
              direction="row"
              spacing={0.9}
              justifyContent="center"
              alignItems="center"
              sx={{
                mt: 2.2,
              }}
            >
              <CheckCircleRounded
                sx={{
                  fontSize: 15,

                  color: "#16A34A",
                }}
              />

              <Typography
                sx={{
                  color: "#98A2B3",

                  fontSize: 9.5,
                }}
              >
                سرویس احراز هویت امن و فعال است
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}