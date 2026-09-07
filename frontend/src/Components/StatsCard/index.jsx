import React from "react";

import { Paper, Typography, Box } from "@mui/material";
import { colors } from "../../theme/colors";

export default function StatsCard({ title, value, icon, accent }) {
  const tint = accent || colors.primary;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        minHeight: 130,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 1,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 12px 30px rgba(23,32,51,.06)",
        transition: "transform .2s ease, box-shadow .2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 16px 36px rgba(23,32,51,.1)",
        },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2.5,
          color: tint,
          background: `${tint}1A`,
        }}
      >
        {icon}
      </Box>

      <Typography sx={{ color: colors.muted, fontSize: 13, fontWeight: 600 }}>{title}</Typography>

      <Typography sx={{ color: colors.text, fontSize: 30, fontWeight: 900 }}>{value}</Typography>
    </Paper>
  );
}