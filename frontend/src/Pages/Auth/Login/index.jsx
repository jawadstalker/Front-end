
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
    if (event.key === "Enter") {
      handleLogin();
    }
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
        boxSizing: "border-box",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        px: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },

        py: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },

        background:
          "radial-gradient(circle at 15% 15%, rgba(20,184,166,0.13), transparent 28%), radial-gradient(circle at 85% 85%, rgba(59,130,246,0.11), transparent 30%), #07111f",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          top: -190,
          right: -130,
          background:
            "radial-gradient(circle, rgba(20,184,166,0.15), transparent 70%)",
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
          background:
            "radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* =====================================================
          MAIN AUTH CARD
      ====================================================== */}

      <Box
        sx={{
          position: "relative",
          zIndex: 2,

          width: "100%",
          maxWidth: 1120,

          /*
           * دو ستون کاملاً مساوی
           */
          display: {
            xs: "block",
            md: "grid",
          },

          gridTemplateColumns: "1fr 1fr",

          height: {
            xs: "auto",
            md: "min(700px, calc(100dvh - 48px))",
          },

          maxHeight: {
            xs: "calc(100dvh - 24px)",
            md: "calc(100dvh - 48px)",
          },

          minHeight: 0,

          overflow: "hidden",

          boxSizing: "border-box",

          borderRadius: {
            xs: 3.5,
            md: 5,
          },

          border: "1px solid rgba(255,255,255,0.07)",

          background: "rgba(9,22,36,0.95)",

          boxShadow:
            "0 28px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",

          backdropFilter: "blur(20px)",
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
              md: 4.5,
              lg: 5,
            },

            borderLeft:
              "1px solid rgba(255,255,255,0.06)",

            background:
              "linear-gradient(145deg, rgba(13,148,136,0.16), rgba(8,25,40,0.4) 60%, rgba(15,23,42,0.55))",
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
                  width: 50,
                  height: 50,
                  flexShrink: 0,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2.5,

                  background:
                    "linear-gradient(135deg, #14b8a6, #0f766e)",

                  boxShadow:
                    "0 12px 28px rgba(20,184,166,0.25)",
                }}
              >
                <VolunteerActivismRounded
                  sx={{
                    color: "#fff",
                    fontSize: 27,
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    paddingRight: 1,
                     color: "#fff",
                    fontSize: 19,
                    fontWeight: 900,
                    lineHeight: 1.2,
                  }}
                >
                  سامانه امداد
                </Typography>

                <Typography
                  sx={{
                    paddingRight: 1,
                    color: "rgba(255,255,255,0.38)",
                    fontSize: 8.5,
                    fontWeight: 800,
                    letterSpacing: 1.2,
                    mt: 0.4,
                    whiteSpace: "nowrap",
                  }}
                >
                  VOLUNTEER MANAGEMENT PLATFORM
                </Typography>
              </Box>
            </Stack>

            {/* Heading */}
            <Box sx={{ mt: 6 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.8,

                  px: 1.4,
                  py: 0.6,

                  borderRadius: 10,

                  background:
                    "rgba(20,184,166,0.09)",

                  border:
                    "1px solid rgba(20,184,166,0.16)",
                }}
              >
                <CheckCircleRounded
                  sx={{
                    color: "#2dd4bf",
                    fontSize: 16,
                  }}
                />

                <Typography
                  sx={{
                    color: "#5eead4",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  آماده برای خدمت
                </Typography>
              </Box>

              <Typography
                sx={{
                  mt: 2.2,

                  color: "#fff",

                  fontSize: {
                    md: 34,
                    lg: 40,
                  },

                  fontWeight: 900,

                  lineHeight: 1.35,

                  letterSpacing: "-0.8px",
                }}
              >
                مدیریت هوشمند
                <br />

                <Box
                  component="span"
                  sx={{
                    color: "#2dd4bf",
                  }}
                >
                  عملیات امدادی
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 2.2,

                  maxWidth: 400,

                  color:
                    "rgba(255,255,255,0.48)",

                  fontSize: 13,

                  lineHeight: 1.95,
                }}
              >
                یک محیط یکپارچه برای مدیریت داوطلبان،
                مأموریت‌ها و فعالیت‌های امدادی با دسترسی
                سریع و امن.
              </Typography>
            </Box>

            {/* Features */}
            <Stack
              spacing={1.2}
              sx={{
                mt: 4,
              }}
            >
              {[
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
              ].map((item) => (
                <Box
                  key={item.title}
                  sx={{
                    display: "flex",
                    alignItems: "center",

                    gap: 1.7,

                    p: 1.35,

                    borderRadius: 2.7,

                    background:
                      "rgba(255,255,255,0.025)",

                    border:
                      "1px solid rgba(255,255,255,0.05)",

                    transition:
                      "all 0.2s ease",

                    "&:hover": {
                      background:
                        "rgba(255,255,255,0.045)",

                      transform:
                        "translateX(-3px)",
                    },
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

                      background:
                        "rgba(20,184,166,0.09)",

                      color: "#2dd4bf",
                    }}
                  >
                    {React.cloneElement(item.icon, {
                      sx: {
                        fontSize: 19,
                      },
                    })}
                  </Box>

                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          "rgba(255,255,255,0.37)",

                        fontSize: 10,

                        mt: 0.3,
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
              color:
                "rgba(255,255,255,0.22)",

              fontSize: 9.5,
            }}
          >
            سامانه مدیریت و هماهنگی نیروهای امدادی
          </Typography>
        </Box>

        {/* =====================================================
            RIGHT SIDE — LOGIN
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

            /*
             * فضای داخلی بیشتر برای اینکه سمت راست
             * کوچک دیده نشود
             */
            px: {
              xs: 2.5,
              sm: 4,
              md: 5.5,
              lg: 6.5,
            },

            py: {
              xs: 2.5,
              sm: 3,
              md: 4,
            },

            background:
              "linear-gradient(180deg, rgba(255,255,255,0.028), rgba(255,255,255,0.012))",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 430,
              minWidth: 0,
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
                  width: 43,
                  height: 43,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2.2,

                  background:
                    "linear-gradient(135deg, #14b8a6, #0f766e)",
                }}
              >
                <VolunteerActivismRounded
                  sx={{
                    color: "#fff",
                    fontSize: 23,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: "#fff",
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
                mb: 3.2,
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2.7,

                  background:
                    "rgba(20,184,166,0.1)",

                  border:
                    "1px solid rgba(20,184,166,0.16)",

                  mb: 2,
                }}
              >
                <LoginRounded
                  sx={{
                    color: "#2dd4bf",
                    fontSize: 25,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: "#fff",

                  fontSize: {
                    xs: 27,
                    sm: 30,
                  },

                  fontWeight: 900,

                  lineHeight: 1.3,
                }}
              >
                خوش آمدید 
              </Typography>

              <Typography
                sx={{
                  color:
                    "rgba(255,255,255,0.45)",

                  fontSize: 13,

                  lineHeight: 1.9,

                  mt: 0.7,
                }}
              >
                برای ورود به حساب کاربری خود،
                اطلاعات زیر را وارد کنید.
              </Typography>
            </Box>

            {/* Form */}
            <Stack spacing={2.2}>
              {/* Phone */}
              <Box>
                <Typography
                  sx={{
                    color:
                      "rgba(255,255,255,0.8)",

                    fontSize: 12,

                    fontWeight: 800,

                    mb: 0.8,

                    textAlign: "right",
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
                  sx={{
                    width: "100%",

                    "& .MuiOutlinedInput-root": {
                      width: "100%",
                      height: 57,

                      boxSizing: "border-box",

                      borderRadius: 3,

                      background:
                        "rgba(255,255,255,0.035)",

                      direction: "rtl",

                      transition:
                        "all 0.2s ease",

                      "& fieldset": {
                        borderColor:
                          "rgba(255,255,255,0.09)",
                      },

                      "&:hover fieldset": {
                        borderColor:
                          "rgba(45,212,191,0.38)",
                      },

                      "&.Mui-focused": {
                        background:
                          "rgba(20,184,166,0.045)",
                      },

                      "&.Mui-focused fieldset": {
                        borderColor:
                          "#14b8a6",

                        borderWidth: 1,
                      },
                    },

                    "& .MuiInputBase-input": {
                      boxSizing: "border-box",

                      height: "100%",

                      padding: "0 10px",

                      textAlign: "right",

                      direction: "rtl",

                      color: "#fff",

                      fontSize: 13.5,

                      "&::placeholder": {
                        color:
                          "rgba(255,255,255,0.25)",
                        opacity: 1,
                      },
                    },

                    "& .MuiInputAdornment-root": {
                      marginRight: 11,
                      marginLeft: 0,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            flexShrink: 0,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            borderRadius: 2,

                            background:
                              "rgba(20,184,166,0.1)",

                            color: "#2dd4bf",
                          }}
                        >
                          <PhoneIphoneRounded
                            sx={{
                              fontSize: 18,
                            }}
                          />
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Password */}
              <Box>
                <Typography
                  sx={{
                    color:
                      "rgba(255,255,255,0.8)",

                    fontSize: 12,

                    fontWeight: 800,

                    mb: 0.8,

                    textAlign: "right",
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
                  sx={{
                    width: "100%",

                    "& .MuiOutlinedInput-root": {
                      width: "100%",
                      height: 57,

                      boxSizing: "border-box",

                      borderRadius: 3,

                      background:
                        "rgba(255,255,255,0.035)",

                      direction: "rtl",

                      transition:
                        "all 0.2s ease",

                      "& fieldset": {
                        borderColor:
                          "rgba(255,255,255,0.09)",
                      },

                      "&:hover fieldset": {
                        borderColor:
                          "rgba(45,212,191,0.38)",
                      },

                      "&.Mui-focused": {
                        background:
                          "rgba(20,184,166,0.045)",
                      },

                      "&.Mui-focused fieldset": {
                        borderColor:
                          "#14b8a6",

                        borderWidth: 1,
                      },
                    },

                    "& .MuiInputBase-input": {
                      boxSizing: "border-box",

                      height: "100%",

                      padding: "0 10px",

                      textAlign: "right",

                      direction: "rtl",

                      color: "#fff",

                      fontSize: 13.5,

                      "&::placeholder": {
                        color:
                          "rgba(255,255,255,0.25)",
                        opacity: 1,
                      },
                    },

                    "& .MuiInputAdornment-root": {
                      marginRight: 11,
                      marginLeft: 0,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            flexShrink: 0,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            borderRadius: 2,

                            background:
                              "rgba(20,184,166,0.1)",

                            color: "#2dd4bf",
                          }}
                        >
                          <LockRounded
                            sx={{
                              fontSize: 18,
                            }}
                          />
                        </Box>
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
                              ? "پنهان کردن رمز عبور"
                              : "نمایش رمز عبور"
                          }
                          sx={{
                            width: 36,
                            height: 36,

                            color:
                              "rgba(255,255,255,0.4)",

                            "&:hover": {
                              color: "#2dd4bf",

                              background:
                                "rgba(20,184,166,0.07)",
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
                  width: "100%",

                  height: 57,

                  mt: 0.4,

                  borderRadius: 3,

                  textTransform: "none",

                  fontSize: 13.5,

                  fontWeight: 900,

                  background:
                    "linear-gradient(135deg, #14b8a6, #0f766e)",

                  boxShadow:
                    "0 12px 28px rgba(20,184,166,0.22)",

                  transition:
                    "all 0.2s ease",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2dd4bf, #0f766e)",

                    transform:
                      "translateY(-1px)",

                    boxShadow:
                      "0 16px 34px rgba(20,184,166,0.27)",
                  },

                  "&:disabled": {
                    background:
                      "rgba(20,184,166,0.3)",

                    color:
                      "rgba(255,255,255,0.65)",
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
                      paddingLeft: 1,
                      fontSize: 18,
                    }}
                  />
                }
                sx={{
                  height: 41,

                  borderRadius: 2.2,

                  color:
                    "rgba(255,255,255,0.5)",

                  fontSize: 12,

                  fontWeight: 700,

                  textTransform: "none",

                  "&:hover": {
                    color: "#2dd4bf",

                    background:
                      "rgba(20,184,166,0.05)",
                  },
                }}
              >
                ورود با رمز یکبار مصرف
              </Button>
            </Stack>

            <Divider
              sx={{
                my: 2.5,

                borderColor:
                  "rgba(255,255,255,0.065)",
              }}
            />

            {/* Register */}
            <Box
              sx={{
                width: "100%",

                boxSizing: "border-box",

                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",

                gap: 2,

                p: 1.8,

                borderRadius: 3,

                background:
                  "rgba(255,255,255,0.025)",

                border:
                  "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    color:
                      "rgba(255,255,255,0.72)",

                    fontSize: 11.5,

                    fontWeight: 700,

                    textAlign: "right",
                  }}
                >
                  حساب کاربری ندارید؟
                </Typography>

                <Typography
                  sx={{
                    color:
                      "rgba(255,255,255,0.32)",

                    fontSize: 9.5,

                    mt: 0.35,

                    textAlign: "right",
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

                  minWidth: 125,

                  height: 40,

                  px: 1.8,

                  borderRadius: 2.2,

                  color: "#2dd4bf",

                  background:
                    "rgba(20,184,166,0.08)",

                  border:
                    "1px solid rgba(20,184,166,0.15)",

                  fontSize: 11,

                  fontWeight: 800,

                  textTransform: "none",

                  whiteSpace: "nowrap",

                  "&:hover": {
                    background:
                      "rgba(20,184,166,0.14)",

                    borderColor:
                      "rgba(20,184,166,0.25)",
                  },
                }}
              >
                ایجاد حساب
              </Button>
            </Box>

            {/* Security */}
            <Stack
              direction="row"
              spacing={0.7}
              justifyContent="center"
              alignItems="center"
              sx={{
                mt: 2,
              }}
            >
              <SecurityRounded
                sx={{
                  fontSize: 14,

                  color:
                    "rgba(255,255,255,0.22)",
                }}
              />

              <Typography
                sx={{
                  color:
                    "rgba(255,255,255,0.22)",

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
