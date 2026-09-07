
import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

import { WavesRounded } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import toast from "react-hot-toast";

import {
  colors,
  gradient,
  fieldSx,
} from "../../theme/colors";

export default function CreateDisaster() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    city: "",
    region: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================================================
  // استایل اختصاصی فیلدها
  // برای جلوگیری از چسبیدن متن به سمت راست در RTL
  // =========================================================

  const createFieldSx = {
    ...fieldSx,

    direction: "rtl",

    "& .MuiOutlinedInput-root": {
      ...fieldSx?.["& .MuiOutlinedInput-root"],

      direction: "rtl",
      borderRadius: 2.5,

      "& input": {
        paddingRight: "16px",
        paddingLeft: "16px",
        textAlign: "right",
      },

      "& textarea": {
        paddingRight: "16px",
        paddingLeft: "16px",
        textAlign: "right",
      },
    },

    "& .MuiInputLabel-root": {
      ...fieldSx?.["& .MuiInputLabel-root"],

      right: "14px",
      left: "auto",
      transformOrigin: "top right",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      right: "14px",
      left: "auto",
    },

    "& .MuiOutlinedInput-notchedOutline": {
      textAlign: "right",
    },

    "& .MuiInputBase-input::placeholder": {
      textAlign: "right",
      opacity: 0.65,
    },
  };

  // =========================================================
  // تغییر فیلد
  // =========================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================================
  // ثبت بحران
  // =========================================================

  const handleSubmit = async () => {
    if (!form.title || !form.type) {
      toast.error("عنوان و نوع بحران الزامی است");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await api.post("/disasters/", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("بحران با موفقیت ثبت شد");

      navigate("/admin/disasters");
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      toast.error(
        error.response?.data?.detail ||
          "خطا در ثبت بحران"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      dir="rtl"
      sx={{
        maxWidth: 640,
        mx: "auto",
        width: "100%",
      }}
    >
      {/* =================================================
          عنوان صفحه
      ================================================= */}

      <Typography
        sx={{
          color: colors.text,
          fontSize: {
            xs: 22,
            sm: 26,
          },
          fontWeight: 900,
          mb: 0.5,
        }}
      >
        ثبت بحران جدید
      </Typography>

      <Typography
        sx={{
          color: colors.muted,
          fontSize: 13,
          mb: 4,
        }}
      >
        اطلاعات یک رویداد بحرانی جدید را وارد کنید
      </Typography>

      {/* =================================================
          فرم
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 3,
            sm: 4,
          },

          borderRadius: 4,

          background: colors.surface,

          border: `1px solid ${colors.border}`,

          boxShadow:
            "0 20px 50px rgba(23,32,51,.06)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.6,
          }}
        >
          {/* عنوان بحران */}

          <TextField
            fullWidth
            label="عنوان بحران"
            name="title"
            value={form.title}
            onChange={handleChange}
            sx={createFieldSx}
            inputProps={{
              dir: "rtl",
            }}
          />

          {/* نوع بحران */}

          <TextField
            fullWidth
            label="نوع بحران"
            name="type"
            placeholder="مثلا flood"
            value={form.type}
            onChange={handleChange}
            sx={createFieldSx}
            inputProps={{
              dir: "rtl",
            }}
          />

          {/* شهر */}

          <TextField
            fullWidth
            label="شهر"
            name="city"
            value={form.city}
            onChange={handleChange}
            sx={createFieldSx}
            inputProps={{
              dir: "rtl",
            }}
          />

          {/* منطقه */}

          <TextField
            fullWidth
            label="منطقه"
            name="region"
            value={form.region}
            onChange={handleChange}
            sx={createFieldSx}
            inputProps={{
              dir: "rtl",
            }}
          />

          {/* مکان دقیق */}

          <TextField
            fullWidth
            label="مکان دقیق"
            name="location"
            value={form.location}
            onChange={handleChange}
            sx={createFieldSx}
            inputProps={{
              dir: "rtl",
            }}
          />

          {/* توضیحات */}

          <TextField
            fullWidth
            label="توضیحات"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={4}
            sx={createFieldSx}
            inputProps={{
              dir: "rtl",
            }}
          />

          {/* =================================================
              دکمه ثبت
          ================================================= */}

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={
              loading ? (
                <CircularProgress
                  size={19}
                  sx={{
                    color: "#fff",
                  }}
                />
              ) : (
                <WavesRounded />
              )
            }
            disabled={loading}
            onClick={handleSubmit}
            sx={{
              height: 52,
              borderRadius: 2.5,
              mt: 0.5,
              gap: 1,
              fontWeight: 800,
              fontSize: 14,
              textTransform: "none",
              background: gradient,
              boxShadow:
                "0 12px 28px rgba(37,99,235,.22)",

              "&:hover": {
                background: gradient,
                filter: "brightness(1.05)",
              },

              "&.Mui-disabled": {
                background: "#BFDBFE",
                color: "#fff",
              },
            }}
          >
            {loading
              ? "در حال ثبت..."
              : "ثبت بحران"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

