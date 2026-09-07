import React from "react";

import { Paper, Typography, Box, Button, Chip, Divider } from "@mui/material";
import { CheckCircle, Cancel, Pending, PinDrop, WarningAmber } from "@mui/icons-material";
import { colors } from "../../theme/colors";

const fontFamily = '"Vazirmatn", "Segoe UI", sans-serif';

function getStatus(status) {
  switch (status) {
    case "active":
      return { label: "فعال", color: "#059669", bg: "#ECFDF5", icon: <CheckCircle sx={{ fontSize: 14 }} />, barColor: colors.primary };
    case "resolved":
    case "completed":
      return { label: "برطرف شده", color: colors.purple, bg: "#F5F3FF", icon: <CheckCircle sx={{ fontSize: 14 }} />, barColor: colors.purple };
    case "closed":
      return { label: "بسته شده", color: colors.muted, bg: colors.bg, icon: <Cancel sx={{ fontSize: 14 }} />, barColor: "#98A2B3" };
    case "cancelled":
      return { label: "لغو شده", color: colors.danger, bg: colors.dangerBg, icon: <Cancel sx={{ fontSize: 14 }} />, barColor: colors.danger };
    default:
      return { label: status || "در انتظار", color: "#B45309", bg: "#FFFBEB", icon: <Pending sx={{ fontSize: 14 }} />, barColor: "#F59E0B" };
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
      fontWeight: 700,
      fontSize: "0.75rem",
      height: 28,
      borderRadius: "8px",
      "& .MuiChip-icon": { color: status.color, fontSize: 16 },
      "& .MuiChip-label": { px: 1, fontWeight: 700 },
    }}
  />
);

export default function DisasterCard({ disaster, onDelete, onEdit }) {
  const status = getStatus(disaster.status);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        direction: "rtl",
        fontFamily,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.surface,
        boxShadow: "0 12px 30px rgba(23,32,51,.06)",
        transition: "all .25s ease",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          borderColor: "#BFDBFE",
          boxShadow: "0 18px 40px rgba(23,32,51,.1)",
          transform: "translateY(-3px)",
        },
        "& *": { fontFamily },
      }}
    >
      <Box sx={{ height: 4, bgcolor: status.barColor, width: "100%", position: "absolute", top: 0, left: 0, right: 0 }} />

      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2.5, gap: 2 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 17, color: colors.text, lineHeight: 1.4, flex: 1 }}>
            {disaster.title}
          </Typography>
          <StatusBadge status={status} />
        </Box>

        {/* City & Location */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1.5,
            mb: 2.5,
            p: 1.5,
            borderRadius: 2.5,
            bgcolor: colors.bg,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <PinDrop sx={{ color: colors.primary, fontSize: 18 }} />
            <Typography sx={{ fontSize: 13.5, color: colors.text, fontWeight: 600 }}>{disaster.city}</Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ borderColor: colors.border }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography component="span" sx={{ fontSize: 13.5, color: colors.muted }}>
              منطقه:
            </Typography>
            <Typography sx={{ fontSize: 13.5, color: colors.text, fontWeight: 600 }}>{disaster.location}</Typography>
          </Box>
        </Box>

        {/* Description */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            mb: 3,
            p: 2,
            borderRadius: 2.5,
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.bg,
          }}
        >
          <WarningAmber sx={{ color: status.color, fontSize: 20, flexShrink: 0, mt: 0.2 }} />
          <Typography sx={{ fontSize: 13.5, color: colors.muted, lineHeight: 1.9 }}>{disaster.description}</Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 1.25 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => onEdit(disaster.id)}
            sx={{
              borderRadius: 2.2,
              fontWeight: 700,
              fontSize: 13.5,
              textTransform: "none",
              color: colors.primary,
              borderColor: "#DBEAFE",
              background: "#EFF6FF",
              py: 1,
              "&:hover": { borderColor: "#BFDBFE", background: "#DBEAFE" },
            }}
          >
            ویرایش
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => onDelete(disaster.id)}
            sx={{
              borderRadius: 2.2,
              fontWeight: 700,
              fontSize: 13.5,
              textTransform: "none",
              color: colors.danger,
              borderColor: "#FECACA",
              background: colors.dangerBg,
              py: 1,
              "&:hover": { borderColor: "#FCA5A5", background: "#FEE2E2" },
            }}
          >
            حذف
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}