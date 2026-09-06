import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import toast from "react-hot-toast";



export default function CreateDisaster(){


const navigate = useNavigate();



const [form,setForm] = useState({

title:"",
description:"",
type:"",
city:"",
region:"",
location:""

});



const [loading,setLoading] = useState(false);




const handleChange = (e)=>{

setForm({

...form,

[e.target.name]: e.target.value

});

};






const handleSubmit = async()=>{


if(
!form.title ||
!form.type
){

toast.error(
"عنوان و نوع بحران الزامی است"
);

return;

}



try{


setLoading(true);



const token =
localStorage.getItem("token");



await api.post(

"/disasters/",

form,

{

headers:{

Authorization:`Bearer ${token}`

}

}

);



toast.success(
"بحران با موفقیت ثبت شد"
);



navigate(
"/admin/disasters"
);



}
catch(error){


console.log(
"STATUS:",
error.response?.status
);


console.log(
"DATA:",
error.response?.data
);



toast.error(

error.response?.data?.detail ||

"خطا در ثبت بحران"

);


}
finally{

setLoading(false);

}


};







return(


<Box

sx={{

direction:"rtl",

minHeight:"100vh",

background:"#f8fafc",

p:4

}}

>


<Paper

sx={{

maxWidth:600,

mx:"auto",

p:4,

borderRadius:4

}}

>



<Typography

variant="h5"

fontWeight="bold"

mb={3}

>

ثبت بحران جدید 🌊

</Typography>





<TextField

fullWidth

label="عنوان بحران"

name="title"

value={form.title}

onChange={handleChange}

margin="normal"

/>





<TextField

fullWidth

label="نوع بحران"

name="type"

placeholder="مثلا flood"

value={form.type}

onChange={handleChange}

margin="normal"

/>





<TextField

fullWidth

label="شهر"

name="city"

value={form.city}

onChange={handleChange}

margin="normal"

/>





<TextField

fullWidth

label="منطقه"

name="region"

value={form.region}

onChange={handleChange}

margin="normal"

/>





<TextField

fullWidth

label="مکان دقیق"

name="location"

value={form.location}

onChange={handleChange}

margin="normal"

/>





<TextField

fullWidth

label="توضیحات"

name="description"

value={form.description}

onChange={handleChange}

margin="normal"

multiline

rows={4}

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

onClick={handleSubmit}

>


{

loading

?

"در حال ثبت..."

:

"ثبت بحران"

}


</Button>



</Paper>


</Box>


);


}