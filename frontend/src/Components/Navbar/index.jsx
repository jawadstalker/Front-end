import React from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";


import {
  Notifications,
} from "@mui/icons-material";


export default function Navbar({ user }) {


return (

<AppBar

position="static"

sx={{

background:"#ffffff",

color:"#14532d",

boxShadow:"0 2px 10px rgba(0,0,0,0.08)",

direction:"rtl"

}}

>


<Toolbar>


<Box

sx={{

display:"flex",

alignItems:"center",

justifyContent:"space-between",

width:"100%"

}}

>


<Box>


<Typography

variant="h6"

fontWeight="bold"

>

پنل داوطلب امداد

</Typography>


<Typography

variant="caption"

color="gray"

>

مدیریت ماموریت‌ها و عملیات بحران

</Typography>


</Box>





<Box

sx={{

display:"flex",

alignItems:"center",

gap:2

}}

>


<IconButton

color="inherit"

>

<Notifications/>

</IconButton>


<Box

sx={{

display:"flex",

alignItems:"center",

gap:1.2

}}

>


<Typography

sx={{

fontWeight:600,

fontSize:14,

color:"#14532d"

}}

>

{user?.full_name || "داوطلب"}

</Typography>


<Avatar

src={

user?.profile_image

? `http://127.0.0.1:8000${user.profile_image}`

: undefined

}

alt={

user?.full_name || "پروفایل"

}

sx={{

width:38,

height:38,

fontSize:15,

background:"linear-gradient(135deg, #16a34a, #4ade80)",

boxShadow:"0 4px 10px rgba(22,163,74,0.3)"

}}

>

{!user?.profile_image &&

(user?.full_name?.charAt(0) || "د")}

</Avatar>


</Box>



</Box>



</Box>


</Toolbar>


</AppBar>


);


}
