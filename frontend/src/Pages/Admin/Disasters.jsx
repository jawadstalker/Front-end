import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import toast from "react-hot-toast";

import DisasterCard from "./DisasterCard";



export default function Disasters() {


  const navigate = useNavigate();


  const [disasters, setDisasters] = useState([]);

  const [loading, setLoading] = useState(true);





  useEffect(() => {

    loadDisasters();

  }, []);






  const loadDisasters = async () => {


    try {


      const token =
        localStorage.getItem("token");



      const response =
        await api.get(
          "/disasters/",
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );



      setDisasters(response.data);



    }
    catch(error){


      console.log(error);


      toast.error(
        "خطا در دریافت بحران‌ها"
      );


    }
    finally{

      setLoading(false);

    }


  };







  const handleDelete = async(id)=>{


    try{


      const token =
      localStorage.getItem("token");



      await api.delete(

        `/disasters/${id}`,

        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }

      );



      toast.success(
        "بحران حذف شد"
      );



      loadDisasters();



    }
    catch(error){


      console.log(error);


      toast.error(
        "خطا در حذف بحران"
      );


    }


  };








const handleEdit = (id) => {

  navigate(
    `/admin/disasters/edit/${id}`
  );



    // بعداً می‌بریم صفحه EditDisaster


  };









  if(loading){


    return(

      <Box

      sx={{
        display:"flex",
        justifyContent:"center",
        mt:10
      }}

      >

        <CircularProgress/>

      </Box>

    );


  }








  return(


    <Box

    sx={{
      direction:"rtl"
    }}

    >



      <Box

      sx={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        mb:4
      }}

      >



        <Typography

        variant="h4"

        fontWeight="bold"

        >

          مدیریت بحران‌ها

        </Typography>




        <Button

        variant="contained"

        startIcon={<AddIcon/>}

        onClick={()=>navigate(
          "/admin/disasters/create"
        )}

        >

          ثبت بحران جدید

        </Button>



      </Box>







      <Grid

      container

      spacing={3}

      >



      {
        disasters.map(

          disaster=>(


            <Grid

            item

            xs={12}

            md={6}

            lg={4}

            key={disaster.id}

            >


              <DisasterCard

              disaster={disaster}

              onDelete={handleDelete}

              onEdit={handleEdit}

              />


            </Grid>


          )

        )
      }




      </Grid>



    </Box>


  );


}