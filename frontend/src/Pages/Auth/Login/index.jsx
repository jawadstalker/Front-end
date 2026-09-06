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
} from "@mui/material";

import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import { useNavigate } from "react-router-dom";

import api from "../../../api/axios";
import toast from "react-hot-toast";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!phone || !password) {
      toast.error("شماره موبایل و رمز عبور را وارد کنید");
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
      toast.error("شماره موبایل یا رمز عبور اشتباه است");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        direction: "rtl",
        px: 2,
        background:
          "linear-gradient(160deg, #eaf3ff 0%, #f4f8ff 45%, #ffffff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* دایره‌های تزئینی پس‌زمینه */}
      <Box
        sx={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(25,118,210,0.15) 0%, rgba(25,118,210,0) 70%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -140,
          left: -140,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(211,47,47,0.10) 0%, rgba(211,47,47,0) 70%)",
        }}
      />

      <Paper
        elevation={0}
        sx={{
          width: 400,
          maxWidth: "100%",
          p: { xs: 3, sm: 4.5 },
          borderRadius: 5,
          textAlign: "center",
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(25,118,210,0.08)",
          boxShadow:
            "0 20px 45px -10px rgba(25,118,210,0.25), 0 8px 16px -8px rgba(0,0,0,0.05)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Avatar
          sx={{
            mx: "auto",
            width: 68,
            height: 68,
            background: "linear-gradient(135deg, #1976d2, #42a5f5)",
            boxShadow: "0 8px 20px rgba(25,118,210,0.35)",
          }}
        >
          <LocalHospitalRoundedIcon sx={{ fontSize: 34 }} />
        </Avatar>

        <Typography
          variant="h5"
          sx={{
            mt: 2.5,
            mb: 0.5,
            fontWeight: 800,
            color: "#0d47a1",
          }}
        >
          ورود به سامانه امداد
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 3.5,
            color: "text.secondary",
          }}
        >
          پلتفرم مدیریت داوطلبان بحران
        </Typography>

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="شماره موبایل"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphoneRoundedIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                backgroundColor: "#f7f9fc",
              },
            }}
          />

          <TextField
            fullWidth
            label="رمز عبور"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockRoundedIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <VisibilityOffRoundedIcon fontSize="small" />
                    ) : (
                      <VisibilityRoundedIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                backgroundColor: "#f7f9fc",
              },
            }}
          />
        </Stack>

        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          onClick={handleLogin}
          sx={{
            mt: 3.5,
            height: 52,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: "1rem",
            background: "linear-gradient(135deg, #1976d2, #1565c0)",
            boxShadow: "0 10px 20px rgba(21,101,192,0.35)",
            transition: "all .25s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #1565c0, #0d47a1)",
              boxShadow: "0 12px 24px rgba(13,71,161,0.4)",
              transform: "translateY(-1px)",
            },
          }}
        >
          {loading ? "در حال ورود..." : "ورود"}
        </Button>

        <Typography
          sx={{
            mt: 2.5,
            cursor: "pointer",
            color: "success.main",
            fontWeight: 600,
            fontSize: "0.9rem",
            transition: "opacity .2s",
            "&:hover": { opacity: 0.75 },
          }}
          onClick={() => navigate("/otp-login")}
        >
          ورود با کد یکبار مصرف
        </Typography>

        <Divider sx={{ my: 2.5 }} />

        <Typography
          sx={{
            cursor: "pointer",
            color: "primary.main",
            fontWeight: 600,
            fontSize: "0.9rem",
            transition: "opacity .2s",
            "&:hover": { opacity: 0.75 },
          }}
          onClick={() => navigate("/register")}
        >
          حساب کاربری ندارید؟{" "}
          <Box component="span" sx={{ fontWeight: 800 }}>
            ثبت نام کنید
          </Box>
        </Typography>
      </Paper>
    </Box>
  );
}