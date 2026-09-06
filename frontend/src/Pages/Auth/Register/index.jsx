import React, { useState } from "react";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { useNavigate } from "react-router-dom";

import api from "../../../api/axios";
import toast from "react-hot-toast";


export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    password: "",
    confirm_password: "",
  });


  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };



  const handleRegister = async () => {


    if (
      !form.full_name ||
      !form.phone ||
      !form.password
    ) {

      toast.error(
        "همه فیلدها را پر کنید"
      );

      return;
    }



    if (
      form.password !== form.confirm_password
    ) {

      toast.error(
        "رمز عبور یکسان نیست"
      );

      return;
    }



    try {

      setLoading(true);


      await api.post(
        "/users/register",
        {
          full_name: form.full_name,
          phone: form.phone,
          password: form.password,
        }
      );


      toast.success(
        "ثبت نام موفق بود"
      );


      navigate("/login");


    } catch(error) {


      toast.error(
        error.response?.data?.detail ||
        "خطا در ثبت نام"
      );


    } finally {

      setLoading(false);

    }

  };



  return (

    <Box
      sx={{
        minHeight:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        direction:"rtl",
        background:
          "linear-gradient(135deg,#1565c0,#64b5f6)"
      }}
    >


      <Paper
        elevation={8}
        sx={{
          width:380,
          p:4,
          borderRadius:4,
          textAlign:"center"
        }}
      >


        <Avatar
          sx={{
            mx:"auto",
            bgcolor:"primary.main",
            width:60,
            height:60
          }}
        >

          <PersonAddIcon />

        </Avatar>



        <Typography
          variant="h5"
          sx={{
            mt:2,
            mb:3,
            fontWeight:"bold"
          }}
        >
          ثبت نام داوطلب
        </Typography>




        <TextField
          fullWidth
          label="نام و نام خانوادگی"
          name="full_name"
          margin="normal"
          value={form.full_name}
          onChange={handleChange}
        />



        <TextField
          fullWidth
          label="شماره موبایل"
          name="phone"
          margin="normal"
          value={form.phone}
          onChange={handleChange}
        />



        <TextField
          fullWidth
          label="رمز عبور"
          type="password"
          name="password"
          margin="normal"
          value={form.password}
          onChange={handleChange}
        />



        <TextField
          fullWidth
          label="تکرار رمز عبور"
          type="password"
          name="confirm_password"
          margin="normal"
          value={form.confirm_password}
          onChange={handleChange}
        />



        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            mt:3,
            height:50,
            borderRadius:3
          }}
          onClick={handleRegister}
        >

          {
            loading
            ? "در حال ثبت نام..."
            : "ثبت نام"
          }

        </Button>


      </Paper>


    </Box>

  );

}