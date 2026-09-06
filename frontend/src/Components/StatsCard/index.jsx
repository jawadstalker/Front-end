import React from "react";

import {
  Paper,
  Typography,
  Box
} from "@mui/material";


export default function StatsCard({
  title,
  value,
  icon
}) {

  return (

    <Paper

      elevation={4}

      sx={{
        p:3,
        borderRadius:4,
        minHeight:130,
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        gap:1
      }}

    >

      <Box
        sx={{
          fontSize:35
        }}
      >
        {icon}
      </Box>


      <Typography
        color="text.secondary"
      >
        {title}
      </Typography>


      <Typography
        variant="h4"
        fontWeight="bold"
      >
        {value}
      </Typography>


    </Paper>

  );

}