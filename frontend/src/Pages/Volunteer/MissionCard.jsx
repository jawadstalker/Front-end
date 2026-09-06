import React, { useState } from "react";

import {
  Paper,
  Typography,
  Chip,
  Box,
  TextField,
  Button,
  Alert,
  Divider,
} from "@mui/material";

import {
  CheckCircle,
  LocationCity,
  LocationOn,
  Send,
} from "@mui/icons-material";

export default function MissionCard({
  mission,
  onReportSubmitted,
}) {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const statusConfig = {
    active: {
      label: "آزاد",
      bg: "#ecfdf5",
      color: "#047857",
      border: "#a7f3d0",
    },

    accepted: {
      label: "پذیرفته شده",
      bg: "#fff7ed",
      color: "#c2410c",
      border: "#fed7aa",
    },

    completed: {
      label: "تکمیل شده",
      bg: "#ecfdf5",
      color: "#047857",
      border: "#a7f3d0",
    },

    cancelled: {
      label: "لغو شده",
      bg: "#fef2f2",
      color: "#b91c1c",
      border: "#fecaca",
    },
  };

  const status = statusConfig[mission.status] || {
    label: mission.status,
    bg: "#f8fafc",
    color: "#475569",
    border: "#e2e8f0",
  };

  // ------------------------------------------
  // Submit Report
  // ------------------------------------------

  const submitReport = async () => {
    setError("");
    setSuccess("");

    const cleanReport = report.trim();

    if (cleanReport.length < 10) {
      setError("گزارش باید حداقل ۱۰ کاراکتر باشد.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://127.0.0.1:8000/missions/${mission.id}/report`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            report: cleanReport,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "گزارش ارسال نشد."
        );
      }

      setSuccess(
        "گزارش با موفقیت ارسال شد و در انتظار بررسی هماهنگ‌کننده است."
      );

      setReport("");

      if (onReportSubmitted) {
        onReportSubmitted(data);
      }
    } catch (err) {
      setError(
        err.message || "گزارش ارسال نشد."
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------
  // Render
  // ------------------------------------------

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",

        p: {
          xs: 2.2,
          sm: 2.8,
          md: 3,
        },

        borderRadius: 4,
        direction: "rtl",
        height: "100%",

        display: "flex",
        flexDirection: "column",

        border:
          "1px solid rgba(15, 118, 110, 0.10)",

        background:
          "linear-gradient(145deg, #ffffff 0%, #fbfffd 100%)",

        boxShadow:
          "0 10px 35px rgba(15, 23, 42, 0.06)",

        transition:
          "transform 0.25s ease, box-shadow 0.25s ease",

        "&:hover": {
          transform: "translateY(-4px)",

          boxShadow:
            "0 18px 45px rgba(15, 23, 42, 0.10)",
        },

        "&::before": {
          content: '""',
          position: "absolute",

          top: 0,
          right: 0,
          left: 0,

          height: 4,

          background:
            "linear-gradient(90deg, #15803d, #22c55e, #34d399)",
        },
      }}
    >
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",

          gap: 2,

          pt: 0.5,
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
              fontSize: {
                xs: 17,
                sm: 18,
              },

              fontWeight: 900,

              color: "#0f3d2e",

              lineHeight: 1.7,

              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {mission.disaster?.title ||
              mission.title ||
              "مأموریت امدادی"}
          </Typography>

          <Typography
            sx={{
              mt: 0.3,

              fontSize: 11.5,

              color: "#94a3b8",

              fontWeight: 500,
            }}
          >
            جزئیات مأموریت امدادی
          </Typography>
        </Box>

        <Chip
          icon={
            <CheckCircle
              sx={{
                fontSize: "17px !important",
              }}
            />
          }
          label={status.label}
          size="small"
          sx={{
            flexShrink: 0,

            height: 32,

            px: 0.5,

            fontWeight: 800,

            bgcolor: status.bg,
            color: status.color,

            border:
              `1px solid ${status.border}`,

            borderRadius: 2.5,

            "& .MuiChip-icon": {
              color: status.color,
            },

            "& .MuiChip-label": {
              px: 1,
            },
          }}
        />
      </Box>

      {/* ========================================= */}
      {/* LOCATION */}
      {/* ========================================= */}

      <Box
        sx={{
          mt: 2.5,

          p: 2,

          borderRadius: 3,

          background:
            "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)",

          border:
            "1px solid rgba(22, 163, 74, 0.10)",

          position: "relative",
          overflow: "hidden",

          "&::after": {
            content: '""',
            position: "absolute",

            width: 80,
            height: 80,

            left: -35,
            bottom: -40,

            borderRadius: "50%",

            background:
              "rgba(34,197,94,0.06)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            mb: 1.2,
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,

              flexShrink: 0,

              borderRadius: 2,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              background: "#dcfce7",
              color: "#15803d",
            }}
          >
            <LocationCity
              sx={{ fontSize: 19 }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 10.5,
                color: "#94a3b8",
                mb: 0.2,
              }}
            >
              شهر
            </Typography>

            <Typography
              sx={{
                fontSize: 13.5,
                fontWeight: 800,
                color: "#14532d",
              }}
            >
              {mission.disaster?.city || "-"}
            </Typography>
          </Box>
        </Box>

        <Divider
          sx={{
            my: 1.2,
            borderColor:
              "rgba(22,101,52,0.08)",
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,

              flexShrink: 0,

              borderRadius: 2,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              background: "#eff6ff",
              color: "#2563eb",
            }}
          >
            <LocationOn
              sx={{ fontSize: 19 }}
            />
          </Box>

          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: 10.5,
                color: "#94a3b8",
                mb: 0.2,
              }}
            >
              منطقه و موقعیت
            </Typography>

            <Typography
              sx={{
                fontSize: 13.5,
                fontWeight: 800,
                color: "#334155",

                lineHeight: 1.8,
              }}
            >
              {mission.disaster?.region || "-"}
            </Typography>

            <Typography
              sx={{
                fontSize: 12,

                color: "#64748b",

                lineHeight: 1.8,

                mt: 0.2,
              }}
            >
              {mission.disaster?.location ||
                mission.location ||
                "-"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ========================================= */}
      {/* ACCEPTED */}
      {/* ========================================= */}

      {mission.status === "accepted" && (
        <Box
          sx={{
            mt: 3,
          }}
        >
          <Divider
            sx={{
              mb: 2.5,
              borderColor:
                "rgba(22,101,52,0.10)",
            }}
          />

          <Box
            sx={{
              p: 1.7,

              mb: 2.5,

              borderRadius: 2.5,

              background:
                "linear-gradient(135deg, #ecfdf5, #f0fdf4)",

              border:
                "1px solid #bbf7d0",

              display: "flex",
              alignItems: "center",

              gap: 1.2,
            }}
          >
            <CheckCircle
              sx={{
                color: "#16a34a",
                fontSize: 21,
              }}
            />

            <Typography
              sx={{
                color: "#15803d",
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              این مأموریت توسط شما پذیرفته شده است.
            </Typography>
          </Box>

          <Typography
            sx={{
              mb: 1,

              color: "#14532d",

              fontSize: 15,

              fontWeight: 900,
            }}
          >
            گزارش مأموریت
          </Typography>

          <Typography
            sx={{
              mb: 1.5,

              color: "#94a3b8",

              fontSize: 11.5,

              lineHeight: 1.8,
            }}
          >
            اقدامات انجام‌شده و نتیجه مأموریت را با دقت وارد کنید.
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={5}
            maxRows={10}
            value={report}
            onChange={(e) =>
              setReport(e.target.value)
            }
            placeholder="شرح انجام مأموریت، اقدامات انجام‌شده و نتیجه کار را بنویسید..."
            inputProps={{
              maxLength: 2000,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,

                background: "#ffffff",

                fontSize: 13.5,

                lineHeight: 1.9,

                transition:
                  "all 0.2s ease",

                "& fieldset": {
                  borderColor: "#e2e8f0",
                },

                "&:hover fieldset": {
                  borderColor: "#86efac",
                },

                "&.Mui-focused": {
                  boxShadow:
                    "0 0 0 3px rgba(34,197,94,0.08)",
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#16a34a",
                  },
              },
            }}
          />

          <Typography
            variant="caption"
            sx={{
              display: "block",

              mt: 0.8,

              color: "#94a3b8",

              fontSize: 10.5,
            }}
          >
            حداقل ۱۰ و حداکثر ۲۰۰۰ کاراکتر
          </Typography>

          {/* ERROR */}

          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 2,
                borderRadius: 2.5,

                fontSize: 12,

                "& .MuiAlert-message": {
                  width: "100%",
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* SUCCESS */}

          {success && (
            <Alert
              severity="success"
              sx={{
                mt: 2,

                borderRadius: 2.5,

                bgcolor: "#ecfdf5",
                color: "#15803d",

                border:
                  "1px solid #bbf7d0",

                fontSize: 12,

                "& .MuiAlert-icon": {
                  color: "#16a34a",
                },
              }}
            >
              {success}
            </Alert>
          )}

          {/* SUBMIT */}

          <Button
            fullWidth
            variant="contained"
            startIcon={
              !loading && <Send />
            }
            onClick={submitReport}
            disabled={
              loading ||
              report.trim().length < 10
            }
            sx={{
              mt: 2.2,

              height: 48,

              borderRadius: 2.5,

              fontWeight: 900,

              fontSize: 13.5,

              background:
                "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",

              boxShadow:
                "0 8px 20px rgba(21,128,61,0.22)",

              transition:
                "all 0.2s ease",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #15803d 0%, #14532d 100%)",

                transform:
                  "translateY(-1px)",

                boxShadow:
                  "0 10px 24px rgba(21,128,61,0.28)",
              },

              "&.Mui-disabled": {
                background: "#e2e8f0",
                color: "#94a3b8",
                boxShadow: "none",
              },
            }}
          >
            {loading
              ? "در حال ارسال..."
              : "ارسال گزارش"}
          </Button>
        </Box>
      )}

      {/* ========================================= */}
      {/* COMPLETED */}
      {/* ========================================= */}

      {mission.status === "completed" && (
        <Box
          sx={{
            mt: 3,
          }}
        >
          <Divider
            sx={{
              mb: 2,
              borderColor:
                "rgba(22,101,52,0.10)",
            }}
          />

          <Alert
            severity="success"
            icon={<CheckCircle />}
            sx={{
              borderRadius: 2.5,

              bgcolor: "#ecfdf5",

              color: "#15803d",

              border:
                "1px solid #bbf7d0",

              fontSize: 12.5,

              fontWeight: 700,

              "& .MuiAlert-icon": {
                color: "#16a34a",
              },
            }}
          >
            مأموریت با موفقیت تکمیل و گزارش شما تأیید شده است. ✅
          </Alert>
        </Box>
      )}
    </Paper>
  );
}