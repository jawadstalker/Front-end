import React from "react";
import axios from "../../api/axios";

import {
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  MenuItem,
  Select,
  Avatar,
} from "@mui/material";


export default function UserCard({
  user,
  refresh,
}) {


  const changeRole = async (role) => {

    await axios.patch(
      `/users/${user.id}/role`,
      { role }
    );

    refresh();

  };


  const toggleStatus = async () => {

    await axios.patch(
      `/users/${user.id}/status`,
      {
        is_active: !user.is_active,
      }
    );

    refresh();

  };


  const deleteUser = async () => {

    if (
      !window.confirm(
        "حذف شود؟"
      )
    )
      return;


    await axios.delete(
      `/users/${user.id}`
    );

    refresh();

  };


  return (

    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >


      {/* پروفایل */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >

        <Avatar
          src={
            user?.profile_image
              ? `http://127.0.0.1:8000${user.profile_image}`
              : undefined
          }
          alt={
            user?.full_name ||
            "پروفایل"
          }
          sx={{
            width: 65,
            height: 65,
            bgcolor: "#166534",
            fontSize: 27,
          }}
        >

          {!user?.profile_image &&
            user?.full_name?.charAt(0)}

        </Avatar>


        <Box>

          <Typography
            variant="h6"
            fontWeight="bold"
          >
            {user.full_name}
          </Typography>


          <Typography>
            {user.phone}
          </Typography>

        </Box>

      </Box>


      <Box mt={2}>

        <Chip
          label={
            user.is_active
              ? "فعال"
              : "غیرفعال"
          }
          color={
            user.is_active
              ? "success"
              : "error"
          }
        />

      </Box>


      <Box mt={2}>

        <Select
          fullWidth
          value={user.role}
          onChange={(e) =>
            changeRole(
              e.target.value
            )
          }
        >

          <MenuItem value="admin">
            ادمین
          </MenuItem>

          <MenuItem value="coordinator">
            هماهنگ‌کننده
          </MenuItem>

          <MenuItem value="volunteer">
            داوطلب
          </MenuItem>

        </Select>

      </Box>


      <Button
        fullWidth
        sx={{ mt: 2 }}
        variant="contained"
        color={
          user.is_active
            ? "warning"
            : "success"
        }
        onClick={toggleStatus}
      >

        {user.is_active
          ? "غیرفعال کردن"
          : "فعال کردن"}

      </Button>


      <Button
        fullWidth
        sx={{ mt: 1 }}
        variant="contained"
        color="error"
        onClick={deleteUser}
      >
        حذف کاربر
      </Button>


    </Paper>

  );
}