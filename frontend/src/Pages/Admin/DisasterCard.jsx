import React from "react";

import {
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
} from "@mui/material";

import {
  LocationOn,
  WarningAmber,
  CheckCircle,
  Cancel,
  Pending,
  PinDrop,
} from "@mui/icons-material";

// =============================================================
// DESIGN TOKENS — Professional Emergency Management
// =============================================================

const palette = {
  // Base
  bgPrimary: "#F8FAFC",
  surface: "#FFFFFF",
  border: "#E2E8F0",
  borderHover: "#CBD5E1",
  
  // Text
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  
  // Status Colors (maintaining compatibility)
  approve: "#10B981",
  approveBg: "#ECFDF5",
  
  pending: "#F59E0B",
  pendingBg: "#FFFBEB",
  
  cancelled: "#EF4444",
  cancelledBg: "#FEF2F2",
  
  primary: "#0F172A",
  primarySoft: "#F1F5F9",
  primaryHover: "#1E293B",

  // Bar Colors
  barActive: "#3B82F6",      // آبی
  barResolved: "#10B981",    // سبز
  barClosed: "#94A3B8",      // خاکستری
  barPending: "#F59E0B",     // نارنجی
  barCancelled: "#EF4444",   // قرمز
};

const fontFamily = '"Vazirmatn", "Segoe UI", sans-serif';

function getStatus(status) {
  switch (status) {
    case "active":
      return {
        label: "فعال",
        color: palette.approve,
        bg: palette.approveBg,
        icon: <CheckCircle sx={{ fontSize: 14 }} />,
        barColor: palette.barActive,
      };
    case "resolved":
    case "completed":
      return {
        label: "برطرف شده",
        color: palette.approve,
        bg: palette.approveBg,
        icon: <CheckCircle sx={{ fontSize: 14 }} />,
        barColor: palette.barResolved,
      };
    case "closed":
      return {
        label: "بسته شده",
        color: palette.cancelled,
        bg: palette.cancelledBg,
        icon: <Cancel sx={{ fontSize: 14 }} />,
        barColor: palette.barClosed,
      };
    case "cancelled":
      return {
        label: "لغو شده",
        color: palette.cancelled,
        bg: palette.cancelledBg,
        icon: <Cancel sx={{ fontSize: 14 }} />,
        barColor: palette.barCancelled,
      };
    default:
      return {
        label: status || "در انتظار",
        color: palette.pending,
        bg: palette.pendingBg,
        icon: <Pending sx={{ fontSize: 14 }} />,
        barColor: palette.barPending,
      };
  }
}

const StatusBadge = ({ status }) => (
  <Chip
    icon={status.icon}
    label={status.label}
    size="small"
    sx={{
      bgcolor: status.bg,
      color: status.color,
      fontWeight: 600,
      fontSize: "0.75rem",
      height: 28,
      borderRadius: "6px",
      "& .MuiChip-icon": {
        color: status.color,
        fontSize: 16,
      },
      "& .MuiChip-label": {
        px: 1,
        fontWeight: 600,
      },
    }}
  />
);

export default function DisasterCard({
  disaster,
  onDelete,
  onEdit,
}) {
  const status = getStatus(disaster.status);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "12px",
        direction: "rtl",
        fontFamily,
        border: `1px solid ${palette.border}`,
        backgroundColor: palette.surface,
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          borderColor: palette.borderHover,
          boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
          transform: "translateY(-3px)",
        },
        "& *": { fontFamily },
      }}
    >
      {/* Status Bar - Top */}
      <Box
        sx={{
          height: 4,
          bgcolor: status.barColor,
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
      />

      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2.5,
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 17,
              color: palette.textPrimary,
              lineHeight: 1.4,
              flex: 1,
            }}
          >
            {disaster.title}
          </Typography>

          <StatusBadge status={status} />
        </Box>

        {/* City & Location - Combined */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1.5,
            mb: 2.5,
            p: 1.5,
            borderRadius: "8px",
            bgcolor: palette.bgPrimary,
            border: `1px solid ${palette.border}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <PinDrop sx={{ color: palette.textSecondary, fontSize: 18 }} />
            <Typography
              sx={{
                fontSize: 14,
                color: palette.textSecondary,
                fontWeight: 500,
              }}
            >
              {disaster.city}
            </Typography>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: palette.border }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: 14,
                color: palette.textMuted,
              }}
            >
              منطقه:
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: palette.textSecondary,
                fontWeight: 500,
              }}
            >
              {disaster.location}
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            mb: 3,
            p: 2,
            borderRadius: "8px",
            border: `1px solid ${palette.border}`,
            backgroundColor: palette.bgPrimary,
          }}
        >
          <WarningAmber
            sx={{
              color: status.color,
              fontSize: 20,
              flexShrink: 0,
              mt: 0.2,
            }}
          />
          <Typography
            sx={{
              fontSize: 13.5,
              color: palette.textSecondary,
              lineHeight: 1.8,
            }}
          >
            {disaster.description}
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 1.25 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => onEdit(disaster.id)}
            sx={{
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: 13.5,
              textTransform: "none",
              color: palette.textPrimary,
              borderColor: palette.border,
              py: 1,
              "&:hover": {
                borderColor: palette.textPrimary,
                backgroundColor: palette.primarySoft,
              },
            }}
          >
            ویرایش
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => onDelete(disaster.id)}
            sx={{
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: 13.5,
              textTransform: "none",
              color: palette.textMuted,
              borderColor: palette.border,
              py: 1,
              "&:hover": {
                borderColor: palette.cancelled,
                color: palette.cancelled,
                backgroundColor: palette.cancelledBg,
              },
            }}
          >
            حذف
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}