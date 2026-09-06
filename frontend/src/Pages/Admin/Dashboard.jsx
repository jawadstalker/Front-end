import React, {
  useEffect,
  useState
} from "react";


import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button
} from "@mui/material";


import {
  People,
  Warning,
  Assignment
} from "@mui/icons-material";


import {
  useNavigate
} from "react-router-dom";


import api from "../../api/axios";

import toast from "react-hot-toast";


import StatsCard from "../../Components/StatsCard";



export default function Dashboard(){


const navigate = useNavigate();



const [stats,setStats]=useState({

  users:0,

  disasters:0,

  missions:0

});


const [loading,setLoading]=useState(true);





useEffect(()=>{

  loadData();

},[]);






const loadData=async()=>{


try{


const token =
localStorage.getItem("token");



const response =
await api.get(

"/admin/stats",

{
headers:{
Authorization:`Bearer ${token}`
}
}

);



setStats(response.data);



}
catch(error){


console.log(error);


toast.error(
"خطا در دریافت اطلاعات ادمین"
);


}
finally{

setLoading(false);

}


};






if(loading){

return(

<Box

sx={{
height:"100vh",
display:"flex",
alignItems:"center",
justifyContent:"center"
}}

>

<CircularProgress/>

</Box>

)

}







return(


<Box

sx={{

minHeight:"100vh",

background:"#f8fafc",

direction:"rtl",

p:4

}}

>




<Typography

variant="h4"

fontWeight="bold"

mb={4}

>

داشبورد مدیریت 👨‍💼

</Typography>






<Grid

container

spacing={3}

>



<Grid

item

xs={12}

md={4}

>


<StatsCard

title="تعداد داوطلبان"

value={stats.users}

icon={
<People color="primary"/>
}

/>


</Grid>








<Grid

item

xs={12}

md={4}

>


<StatsCard

title="تعداد بحران‌ها"

value={stats.disasters}

icon={
<Warning color="error"/>
}

/>


</Grid>







<Grid

item

xs={12}

md={4}

>


<StatsCard

title="ماموریت‌ها"

value={stats.missions}

icon={
<Assignment color="success"/>
}

/>


</Grid>




</Grid>









{/* Admin Actions */}



<Box

sx={{

mt:5,

display:"flex",

gap:2,

flexWrap:"wrap"

}}

>


<Button

variant="contained"

size="large"

onClick={()=>navigate("/admin/disasters")}

>

🌊 مدیریت بحران‌ها

</Button>




<Button

variant="outlined"

size="large"

disabled

>

👥 مدیریت داوطلبان

</Button>




<Button

variant="outlined"

size="large"

disabled

>

📋 مدیریت ماموریت‌ها

</Button>



</Box>






</Box>


);


}