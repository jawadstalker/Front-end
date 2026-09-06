import React, { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";

import toast from "react-hot-toast";



export default function EditDisaster() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({

    title: "",

    description: "",

    type: "",

    city: "",

    region: "",

    location: ""

  });




  useEffect(() => {

    loadDisaster();

  }, []);





  const loadDisaster = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await api.get(

        `/disasters/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );

      setForm(response.data);

    }

    catch (error) {

      console.log(error);

      toast.error("خطا در دریافت اطلاعات بحران");

    }

    finally {

      setLoading(false);

    }

  };






  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };






  const handleSubmit = async () => {

    try {

      setSaving(true);

      const token = localStorage.getItem("token");

      await api.put(

        `/disasters/${id}`,

        {

          title: form.title,

          description: form.description,

          type: form.type,

          city: form.city,

          region: form.region,

          location: form.location

        },

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );

      toast.success("بحران با موفقیت ویرایش شد");

      navigate("/admin/disasters");

    }

    catch (error) {

      console.log(error);

      toast.error("خطا در ویرایش بحران");

    }

    finally {

      setSaving(false);

    }

  };






  if (loading) {

    return (

      <Box

        sx={{

          display: "flex",

          justifyContent: "center",

          mt: 10

        }}

      >

        <CircularProgress />

      </Box>

    );

  }






  return (

    <Box

      sx={{

        direction: "rtl",

        minHeight: "100vh",

        background: "#f8fafc",

        p: 4

      }}

    >

      <Paper

        sx={{

          maxWidth: 600,

          mx: "auto",

          p: 4,

          borderRadius: 4

        }}

      >

        <Typography

          variant="h5"

          fontWeight="bold"

          mb={3}

        >

          ویرایش بحران ✏️

        </Typography>



        <TextField

          fullWidth

          margin="normal"

          label="عنوان"

          name="title"

          value={form.title}

          onChange={handleChange}

        />



        <TextField

          fullWidth

          margin="normal"

          label="نوع بحران"

          name="type"

          value={form.type}

          onChange={handleChange}

        />



        <TextField

          fullWidth

          margin="normal"

          label="شهر"

          name="city"

          value={form.city}

          onChange={handleChange}

        />



        <TextField

          fullWidth

          margin="normal"

          label="منطقه"

          name="region"

          value={form.region}

          onChange={handleChange}

        />



        <TextField

          fullWidth

          margin="normal"

          label="موقعیت"

          name="location"

          value={form.location}

          onChange={handleChange}

        />



        <TextField

          fullWidth

          margin="normal"

          multiline

          rows={4}

          label="توضیحات"

          name="description"

          value={form.description}

          onChange={handleChange}

        />



        <Button

          fullWidth

          variant="contained"

          sx={{

            mt: 3,

            height: 50

          }}

          disabled={saving}

          onClick={handleSubmit}

        >

          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}

        </Button>

      </Paper>

    </Box>

  );

}