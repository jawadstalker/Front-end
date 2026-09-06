
import React, { useState } from "react";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";

import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import { useNavigate } from "react-router-dom";

import api from "../../../api/axios";
import toast from "react-hot-toast";


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


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  const handleRegister = async () => {
    if (
      !form.full_name.trim() ||
      !form.phone.trim() ||
      !form.password ||
      !form.confirm_password
    ) {
      toast.error("لطفاً همه فیلدها را کامل کنید");
      return;
    }

    if (form.password !== form.confirm_password) {
      toast.error("رمز عبور و تکرار آن یکسان نیست");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/users/register",
        {
          full_name: form.full_name,
          phone: form.phone,
          password: form.password,
        }
      );

      toast.success("ثبت نام با موفقیت انجام شد");

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
        "خطا در ثبت نام"
      );
    } finally {
      setLoading(false);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleRegister();
    }
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        direction: "rtl",
        position: "relative",
        overflow: "hidden",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 5 },

        background:
          "linear-gradient(135deg, #eef6ff 0%, #f7fbff 45%, #e3f2fd 100%)",

        "&::before": {
          content: '""',
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(21, 101, 192, 0.10)",
          top: -180,
          right: -150,
        },

        "&::after": {
          content: '""',
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "rgba(100, 181, 246, 0.12)",
          bottom: -180,
          left: -130,
        },
      }}
    >

      <Paper
        elevation={0}
        onKeyDown={handleKeyDown}
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 470,

          p: {
            xs: 3,
            sm: 4.5,
          },

          borderRadius: {
            xs: 3,
            sm: 4,
          },

          background: "rgba(255, 255, 255, 0.96)",

          border: "1px solid rgba(21, 101, 192, 0.08)",

          boxShadow:
            "0 24px 70px rgba(21, 101, 192, 0.14)",

          backdropFilter: "blur(12px)",
        }}
      >

        {/* Header */}
        <Stack
          alignItems="center"
          spacing={1.5}
          sx={{ mb: 3.5 }}
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,

              bgcolor: "primary.main",

              boxShadow:
                "0 10px 28px rgba(21, 101, 192, 0.28)",
            }}
          >
            <PersonAddRoundedIcon
              sx={{
                fontSize: 34,
              }}
            />
          </Avatar>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "#17324d",
              mt: 0.5,
              textAlign: "center",
            }}
          >
            ایجاد حساب کاربری
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              textAlign: "center",
              lineHeight: 1.9,
              maxWidth: 340,
            }}
          >
            برای شروع، اطلاعات خود را وارد کنید و حساب کاربری خود را بسازید.
          </Typography>
        </Stack>


        {/* Full Name */}
        <TextField
          fullWidth
          label="نام و نام خانوادگی"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          autoComplete="name"
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonRoundedIcon
                  sx={{
                    color: "primary.main",
                    fontSize: 21,
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              backgroundColor: "#fbfdff",

              "&:hover fieldset": {
                borderColor: "#90caf9",
              },

              "&.Mui-focused fieldset": {
                borderWidth: 2,
              },
            },

            "& .MuiInputLabel-root": {
              right: 0,
              left: "auto",
              transformOrigin: "top right",
            },

            "& .MuiInputLabel-shrink": {
              transformOrigin: "top right",
            },
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
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIphoneRoundedIcon
                  sx={{
                    color: "primary.main",
                    fontSize: 21,
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              backgroundColor: "#fbfdff",

              "&:hover fieldset": {
                borderColor: "#90caf9",
              },

              "&.Mui-focused fieldset": {
                borderWidth: 2,
              },
            },

            "& .MuiInputLabel-root": {
              right: 0,
              left: "auto",
              transformOrigin: "top right",
            },

            "& .MuiInputLabel-shrink": {
              transformOrigin: "top right",
            },
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
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockRoundedIcon
                  sx={{
                    color: "primary.main",
                    fontSize: 21,
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
                    color: "text.secondary",
                  }}
                >
                  {showPassword ? (
                    <VisibilityOffRoundedIcon />
                  ) : (
                    <VisibilityRoundedIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              backgroundColor: "#fbfdff",

              "&:hover fieldset": {
                borderColor: "#90caf9",
              },

              "&.Mui-focused fieldset": {
                borderWidth: 2,
              },
            },

            "& .MuiInputLabel-root": {
              right: 0,
              left: "auto",
              transformOrigin: "top right",
            },

            "& .MuiInputLabel-shrink": {
              transformOrigin: "top right",
            },
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
          margin="normal"
          error={
            form.confirm_password.length > 0 &&
            form.password !== form.confirm_password
          }
          helperText={
            form.confirm_password.length > 0 &&
            form.password !== form.confirm_password
              ? "رمز عبور یکسان نیست"
              : " "
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CheckCircleRoundedIcon
                  sx={{
                    color:
                      form.confirm_password &&
                      form.password === form.confirm_password
                        ? "success.main"
                        : "primary.main",
                    fontSize: 21,
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
                    color: "text.secondary",
                  }}
                >
                  {showConfirmPassword ? (
                    <VisibilityOffRoundedIcon />
                  ) : (
                    <VisibilityRoundedIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              backgroundColor: "#fbfdff",

              "&:hover fieldset": {
                borderColor: "#90caf9",
              },

              "&.Mui-focused fieldset": {
                borderWidth: 2,
              },
            },

            "& .MuiInputLabel-root": {
              right: 0,
              left: "auto",
              transformOrigin: "top right",
            },

            "& .MuiInputLabel-shrink": {
              transformOrigin: "top right",
            },

            "& .MuiFormHelperText-root": {
              textAlign: "right",
              marginRight: 1,
            },
          }}
        />


        {/* Password hint */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "text.secondary",
            mt: 0.5,
            mb: 2,
            px: 0.5,
            lineHeight: 1.8,
          }}
        >
          برای امنیت بیشتر، از یک رمز عبور قوی استفاده کنید.
        </Typography>


        {/* Register Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          onClick={handleRegister}
          startIcon={
            loading ? (
              <CircularProgress
                size={20}
                color="inherit"
              />
            ) : (
              <PersonAddRoundedIcon />
            )
          }
          sx={{
            height: 54,
            borderRadius: 2.5,
            mt: 1,

            fontSize: "1rem",
            fontWeight: 700,

            boxShadow:
              "0 10px 24px rgba(21, 101, 192, 0.24)",

            transition:
              "transform 0.2s ease, box-shadow 0.2s ease",

            "&:hover": {
              transform: "translateY(-1px)",

              boxShadow:
                "0 14px 30px rgba(21, 101, 192, 0.30)",
            },

            "&:active": {
              transform: "translateY(0)",
            },

            "&.Mui-disabled": {
              opacity: 0.75,
            },
          }}
        >
          {loading ? "در حال ثبت نام..." : "ایجاد حساب کاربری"}
        </Button>


        {/* Divider */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            my: 3,
          }}
        >
          <Divider sx={{ flex: 1 }} />

          <Typography
            variant="caption"
            sx={{
              color: "text.disabled",
              whiteSpace: "nowrap",
            }}
          >
            قبلاً حساب دارید؟
          </Typography>

          <Divider sx={{ flex: 1 }} />
        </Box>


        {/* Login Button */}
        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={() => navigate("/login")}
          endIcon={<ArrowBackRoundedIcon />}
          sx={{
            height: 50,
            borderRadius: 2.5,

            fontWeight: 700,

            borderWidth: 1.5,

            "&:hover": {
              borderWidth: 1.5,
              backgroundColor: "rgba(21, 101, 192, 0.04)",
            },
          }}
        >
          ورود به حساب کاربری
        </Button>


        {/* Footer */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: "text.disabled",
            mt: 3,
            lineHeight: 1.8,
          }}
        >
          با ایجاد حساب کاربری، می‌توانید از امکانات سامانه استفاده کنید.
        </Typography>

      </Paper>

    </Box>
  );
}

