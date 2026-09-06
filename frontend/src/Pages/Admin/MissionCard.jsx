import React from "react";

import {
  Paper,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";

import {
  Person,
  Warning,
  LocationOn,
  Delete,
  Edit,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

export default function MissionCard({
  mission,
  onDelete,
}) {
  const navigate = useNavigate();

  const status = mission.status;

  const statusConfig = {
    active: {
      label: "آزاد",
      color: "success",
    },

    accepted: {
      label: "پذیرفته شده",
      color: "info",
    },

    completed: {
      label: "تکمیل شده",
      color: "primary",
    },

    cancelled: {
      label: "لغو شده",
      color: "error",
    },
  };

  const currentStatus =
    statusConfig[status] || {
      label: status,
      color: "default",
    };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 4,
        direction: "rtl",
        height: "100%",
        transition: "0.3s",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 8,
        },
      }}
    >
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
        >
          {mission.title ||
            `مأموریت #${mission.id}`}
        </Typography>

        <Chip
          label={currentStatus.label}
          color={currentStatus.color}
        />
      </Box>

      {/* Description */}

      {mission.description && (
        <Typography
          sx={{
            mb: 2,
            color: "#555",
          }}
        >
          {mission.description}
        </Typography>
      )}

      {/* Volunteer */}

      {mission.user ? (
        <>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <Person color="primary" />

            <strong>
              داوطلب:
            </strong>

            {mission.user.full_name}
          </Typography>

          <Typography sx={{ mb: 2 }}>
            📞 {mission.user.phone}
          </Typography>
        </>
      ) : (
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#f0fdf4",
          }}
        >
          <Typography
            color="success.main"
            fontWeight="bold"
          >
            👤 این مأموریت هنوز توسط
            داوطلبی پذیرفته نشده است.
          </Typography>
        </Box>
      )}

      {/* Disaster */}

      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <Warning color="error" />

        <strong>
          بحران:
        </strong>

        {mission.disaster?.title ||
          "-"}
      </Typography>

      {/* Location */}

      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <LocationOn color="primary" />

        {mission.location ||
          mission.disaster?.location ||
          "-"}

        {mission.disaster?.city && (
          <>
            {" - "}
            {mission.disaster.city}
          </>
        )}
      </Typography>

      {/* Priority */}

      <Typography sx={{ mb: 2 }}>
        <strong>اولویت:</strong>{" "}
        {mission.priority === "high"
          ? "زیاد"
          : mission.priority === "low"
          ? "کم"
          : "متوسط"}
      </Typography>

      {/* Volunteers */}

      <Typography sx={{ mb: 2 }}>
        <strong>
          تعداد داوطلب موردنیاز:
        </strong>{" "}
        {mission.required_volunteers ||
          1}
      </Typography>

      {/* Assigned Time */}

      {mission.assigned_at && (
        <Typography
          sx={{
            color: "#666",
            fontSize: 14,
            mb: 3,
          }}
        >
          زمان پذیرش:{" "}
          {new Date(
            mission.assigned_at
          ).toLocaleString("fa-IR")}
        </Typography>
      )}

      {/* Actions */}

      <Box
        sx={{
          mt: 3,
          display: "flex",
          gap: 1,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          color="warning"
          startIcon={<Edit />}
          onClick={() =>
            navigate(
              `/admin/missions/edit/${mission.id}`
            )
          }
        >
          ویرایش
        </Button>

        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<Delete />}
          onClick={() =>
            onDelete(mission.id)
          }
        >
          حذف
        </Button>
      </Box>
    </Paper>
  );
}