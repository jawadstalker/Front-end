import React, { useState } from "react";

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";

import SmsIcon from "@mui/icons-material/Sms";

import { useNavigate } from "react-router-dom";

import api from "../../../api/axios";
import toast from "react-hot-toast";


export default function OTPLogin() {


  const [phone,setPhone] = useState("");

  const [loading,setLoading] = useState(false);


  const navigate = useNavigate();



  const sendOTP = async()=>{


    if(!phone){

      toast.error(
        "شماره موبایل را وارد کنید"
      );

      return;

    }



    try{


      setLoading(true);


      await api.post(
        "/auth/send-otp",
        {
          phone
        }
      );



      localStorage.setItem(
        "otp_phone",
        phone
      );



      toast.success(
        "کد ارسال شد"
      );



      navigate(
        "/verify-otp"
      );



    }catch(error){


      console.log(error);


      toast.error(
        "خطا در ارسال کد"
      );


    }finally{

      setLoading(false);

    }


  };





return(

<Box

sx={{
minHeight:"100vh",
display:"flex",
alignItems:"center",
justifyContent:"center",
direction:"rtl",
background:"linear-gradient(135deg,#166534,#22c55e)"
}}

>


<Paper

sx={{
width:380,
p:4,
borderRadius:4,
textAlign:"center"
}}

elevation={8}

>


<Avatar

sx={{
mx:"auto",
bgcolor:"success.main"
}}

>

<SmsIcon/>

</Avatar>



<Typography

variant="h5"

fontWeight="bold"

mt={2}

>

ورود با کد یکبار مصرف

</Typography>




<TextField

fullWidth

label="شماره موبایل"

margin="normal"

value={phone}

onChange={
(e)=>setPhone(e.target.value)
}

/>



<Button

fullWidth

variant="contained"

size="large"

sx={{
mt:3,
height:50
}}

disabled={loading}

onClick={sendOTP}

>


{
loading
?
"در حال ارسال..."
:
"ارسال کد"
}


</Button>



</Paper>
</Box>
)

}