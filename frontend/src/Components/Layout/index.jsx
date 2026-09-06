import React from "react";

import {
  Box
} from "@mui/material";


import Sidebar from "../Sidebar/index";
import Navbar from "../Navbar/index";



export default function Layout({children}){


return(

<Box>


<Sidebar/>

<Navbar/>




<Box

component="main"

sx={{

mr:"260px",

pt:10,

p:3

}}

>


{children}


</Box>



</Box>


);


}