import React from "react";

import { Paper, Typography, Box, Button } from "@mui/material";
import { Person, Warning, LocationOn, Delete, Edit, GroupsRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { colors } from "../../theme/colors";

const STATUS_CONFIG = {
  active: { label: "آزاد", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  accepted: { label: "پذیرفته شده", color: colors.primary, bg: "#EFF6FF", border: "#DBEAFE" },
  completed: { label: "تکمیل شده", color: colors.purple, bg: "#F5F3FF", border: "#DDD6FE" },
  cancelled: { label: "لغو شده", color: colors.danger, bg: colors.dangerBg, border: "#FECACA" },
};

const PRIORITY_LABEL = { high: "زیاد", low: "کم", medium: "متوسط", critical: "بحرانی" };

export default function MissionCard({ mission, onDelete }) {
  const navigate = useNavigate();

  const status = STATUS_CONFIG[mission.status] || {
    label: mission.status,
    color: colors.muted,
    bg: colors.bg,
    border: colors.border,
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        direction: "rtl",
        height: "100%",
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 12px 30px rgba(23,32,51,.06)",
        transition: "all .25s ease",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 18px 40px rgba(23,32,51,.1)" },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 2.5 }}>
        <Typography sx={{ color: colors.text, fontWeight: 800, fontSize: 16, lineHeight: 1.4 }}>
          {mission.title || `مأموریت #${mission.id}`}
        </Typography>

        <Box
          sx={{
            flexShrink: 0,
            px: 1.4,
            py: 0.4,
            borderRadius: 10,
            fontSize: 11,
            fontWeight: 800,
            color: status.color,
            background: status.bg,
            border: `1px solid ${status.border}`,
            whiteSpace: "nowrap",
          }}
        >
          {status.label}
        </Box>
      </Box>

      {mission.description && (
        <Typography sx={{ mb: 2, color: colors.muted, fontSize: 13, lineHeight: 1.9 }}>
          {mission.description}
        </Typography>
      )}

      {/* Volunteer */}
      {mission.user ? (
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 13.5, color: colors.text, mb: 0.6 }}>
            <Person sx={{ fontSize: 18, color: colors.primary }} />
            <strong>داوطلب:</strong> {mission.user.full_name}
          </Typography>
          <Typography sx={{ fontSize: 13, color: colors.muted, pr: 3.2 }}>📞 {mission.user.phone}</Typography>
        </Box>
      ) : (
        <Box sx={{ mb: 2, p: 1.6, borderRadius: 2.5, background: "#ECFDF5", border: "1px solid #A7F3D0" }}>
          <Typography sx={{ color: "#059669", fontWeight: 700, fontSize: 12.5 }}>
            👤 این مأموریت هنوز توسط داوطلبی پذیرفته نشده است.
          </Typography>
        </Box>
      )}

      {/* Disaster */}
      <Typography sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.4, fontSize: 13.5, color: colors.text }}>
        <Warning sx={{ fontSize: 18, color: colors.danger }} />
        <strong>بحران:</strong> {mission.disaster?.title || "-"}
      </Typography>

      {/* Location */}
      <Typography sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.4, fontSize: 13.5, color: colors.text }}>
        <LocationOn sx={{ fontSize: 18, color: colors.primary }} />
        {mission.location || mission.disaster?.location || "-"}
        {mission.disaster?.city && <>{" - "}{mission.disaster.city}</>}
      </Typography>

      {/* Priority */}
      <Typography sx={{ mb: 1.4, fontSize: 13.5, color: colors.text }}>
        <strong>اولویت:</strong> {PRIORITY_LABEL[mission.priority] || "متوسط"}
      </Typography>

      {/* Volunteers needed */}
      <Typography sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, fontSize: 13.5, color: colors.text }}>
        <GroupsRounded sx={{ fontSize: 18, color: colors.cyan }} />
        <strong>تعداد داوطلب موردنیاز:</strong> {mission.required_volunteers || 1}
      </Typography>

      {mission.assigned_at && (
        <Typography sx={{ color: colors.muted, fontSize: 11.5, mb: 2 }}>
          زمان پذیرش: {new Date(mission.assigned_at).toLocaleString("fa-IR")}
        </Typography>
      )}

      {/* Actions */}
      <Box sx={{ mt: 2.5, display: "flex", gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Edit sx={{ fontSize: 17 }} />}
          onClick={() => navigate(`/admin/missions/edit/${mission.id}`)}
          sx={{
            height: 42,
            borderRadius: 2.2,
            fontWeight: 700,
            fontSize: 12.5,
            textTransform: "none",
            color: colors.primary,
            borderColor: "#DBEAFE",
            background: "#EFF6FF",
            "&:hover": { borderColor: "#BFDBFE", background: "#DBEAFE" },
          }}
        >
          ویرایش
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Delete sx={{ fontSize: 17 }} />}
          onClick={() => onDelete(mission.id)}
          sx={{
            height: 42,
            borderRadius: 2.2,
            fontWeight: 700,
            fontSize: 12.5,
            textTransform: "none",
            color: colors.danger,
            borderColor: "#FECACA",
            background: colors.dangerBg,
            "&:hover": { borderColor: "#FCA5A5", background: "#FEE2E2" },
          }}
        >
          حذف
        </Button>
      </Box>
    </Paper>
  );
}