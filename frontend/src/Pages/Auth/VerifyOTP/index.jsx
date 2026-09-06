import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import api from "../../../api/axios";
import toast from "react-hot-toast";


export default function VerifyOTP(){

  const [code,setCode] = useState("");
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();



  const handleVerify = async()=>{


    if(!code){

      toast.error(
        "کد را وارد کنید"
      );

      return;

    }



    try{


      setLoading(true);



      const phone =
        localStorage.getItem(
          "otp_phone"
        );



      const response = await api.post(
        "/auth/verify-otp",
        {
          phone,
          code
        }
      );



      localStorage.setItem(
        "token",
        response.data.access_token
      );



      toast.success(
        "ورود موفق بود ✅"
      );



      navigate(
        "/dashboard"
      );



    }catch(error){


      console.log(
        error.response?.data
      );


      toast.error(
        "کد وارد شده اشتباه است"
      );


    }finally{

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
        background:"#f1f5f9"
      }}

    >


      <Paper

        sx={{
          width:350,
          p:4,
          borderRadius:4,
          textAlign:"center"
        }}

      >


        <Typography

          variant="h5"

          fontWeight="bold"

          mb={3}

        >

          تایید کد پیامکی

        </Typography>




        <TextField

          fullWidth

          label="کد یکبار مصرف"

          value={code}

          onChange={
            e=>setCode(e.target.value)
          }

        />



        <Button

          fullWidth

          variant="contained"

          sx={{
            mt:3,
            height:50
          }}

          disabled={loading}

          onClick={handleVerify}

        >

        {
          loading
          ?
          "در حال بررسی..."
          :
          "تایید کد"
        }


        </Button>



      </Paper>


    </Box>

  );

}