
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
  LoginRounded,
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

export default function OTPLogin() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /*
   * ============================================================
   * SEND OTP
   * ============================================================
   */

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

  /*
   * ============================================================
   * ENTER KEY
   * ============================================================
   */

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      sendOTP();
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
          BACKGROUND DECORATION
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

                  background: colors.softBlue,

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
                  احراز هویت سریع
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
                ورود سریع و امن
                <br />

                <Box
                  component="span"
                  sx={{
                    color: colors.primary,
                  }}
                >
                  بدون رمز عبور
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
                با استفاده از کد یکبار مصرف، بدون نیاز به
                حفظ رمز عبور وارد حساب کاربری خود شوید و
                به خدمات سامانه امداد دسترسی پیدا کنید.
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
            RIGHT OTP PANEL
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
                <SmsRounded
                  sx={{
                    fontSize: 25,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: colors.text,

                  fontSize: {
                    xs: 25,
                    sm: 28,
                  },

                  fontWeight: 900,

                  lineHeight: 1.4,

                  letterSpacing: "-.5px",
                }}
              >
                ورود با کد یکبار مصرف
              </Typography>

              <Typography
                sx={{
                  color: colors.muted,

                  fontSize: 12,

                  lineHeight: 2,

                  mt: 0.8,
                }}
              >
                شماره موبایل خود را وارد کنید تا کد تأیید
                برای شما ارسال شود.
              </Typography>
            </Box>

            {/* =================================================
                OTP INFO
            ================================================= */}

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1.5,

                p: 1.5,

                mb: 2.7,

                borderRadius: "14px",

                background: "#F9FAFB",

                border:
                  `1px solid ${colors.softBorder}`,
              }}
            >
              <Box
                sx={{
                  width: 40,

                  height: 40,

                  flexShrink: 0,

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  borderRadius: "11px",

                  background: colors.softBlue,

                  color: colors.primary,
                }}
              >
                <KeyRounded
                  sx={{
                    fontSize: 20,
                  }}
                />
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

                    fontSize: 11,

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

                    mt: 0.25,

                    lineHeight: 1.7,
                  }}
                >
                  کد تأیید به شماره موبایل شما ارسال می‌شود.
                </Typography>
              </Box>
            </Box>

            {/* =================================================
                PHONE
            ================================================= */}

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
                          fontSize: 19,
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* =================================================
                HELPER
            ================================================= */}

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.8}
              sx={{
                mt: 1,

                mb: 2.1,

                px: 0.5,
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

                  lineHeight: 1.7,
                }}
              >
                شماره شما فقط برای احراز هویت استفاده می‌شود.
              </Typography>
            </Stack>

            {/* =================================================
                SEND OTP BUTTON
            ================================================= */}

            <Button
              fullWidth

              variant="contained"

              disabled={loading}

              onClick={sendOTP}

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
                <>
                  <CircularProgress
                    size={20}
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

            {/* =================================================
                BACK TO PASSWORD LOGIN
            ================================================= */}

            <Button
              fullWidth

              variant="text"

              onClick={() =>
                navigate("/login")
              }

              startIcon={
                <LoginRounded
                  sx={{
                    fontSize: 18,
                  }}
                />
              }

              sx={{
                height: 44,

                mt: 1.1,

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
              بازگشت به ورود با رمز عبور
            </Button>

            {/* =================================================
                DIVIDER
            ================================================= */}

            <Divider
              sx={{
                my: 2.5,

                borderColor:
                  colors.softBorder,
              }}
            />

            {/* =================================================
                SECURITY
            ================================================= */}

            <Stack
              direction="row"

              alignItems="center"

              justifyContent="center"

              spacing={0.8}

              sx={{
                px: 1,
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

                  fontSize: 9,

                  lineHeight: 1.8,

                  textAlign: "center",
                }}
              >
                کد تأیید فقط برای شماره موبایل شما ارسال می‌شود
                و اطلاعات شما امن باقی خواهد ماند.
              </Typography>
            </Stack>

            {/* =================================================
                STATUS
            ================================================= */}

            <Stack
              direction="row"

              spacing={0.8}

              justifyContent="center"

              alignItems="center"

              sx={{
                mt: 1.8,
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

                  fontSize: 9,
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
