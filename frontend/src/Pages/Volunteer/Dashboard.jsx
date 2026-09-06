import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
  Button,
  Chip
} from "@mui/material";

import {
  Assignment,
  LocationCity,
  CheckCircle
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import toast from "react-hot-toast";

import StatsCard from "../../Components/StatsCard";


export default function Dashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [missions, setMissions] = useState([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    loadData();

  }, []);


  const loadData = async () => {

    try {

      const token = localStorage.getItem("token");


      const userRes = await api.get(
        "/users/me",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      const missionRes = await api.get(
        "/missions/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      setUser(userRes.data);

      setMissions(missionRes.data);


    }
    catch (error) {

      console.log(error);

      toast.error(
        "خطا در دریافت اطلاعات"
      );

    }
    finally {

      setLoading(false);

    }

  };


  if (loading) {

    return (

      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >

        <CircularProgress sx={{ color: "#16a34a" }} />

      </Box>

    );

  }


  const lastMission = missions[0];


  return (

    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f0faf3 0%, #dff3e5 100%)",
        direction: "rtl",
        p: 4
      }}
    >


      {/* Top bar */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          py: 2,
          px: 3,
          mb: 4,
          borderRadius: 3,
          background: "#ffffff",
          border: "1px solid rgba(22,101,52,0.15)",
          boxShadow: "-8px 0 24px rgba(20,83,45,0.06)"
        }}
      >

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>

          <Assignment sx={{ color: "#16a34a" }} />

          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ color: "#14532d" }}
          >

            داشبورد داوطلب

          </Typography>

        </Box>


        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>

          <Box sx={{ textAlign: "right" }}>

            <Typography
              fontWeight={700}
              sx={{ color: "#14532d", fontSize: 14.5 }}
            >

              سلام {user?.full_name} 👋

            </Typography>

            <Typography
              color="text.secondary"
              sx={{ fontSize: 12.5 }}
            >

              داوطلب امدادی

            </Typography>

          </Box>

          {/* Profile Image */}

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
              width: 44,
              height: 44,
              fontSize: 17,
              background: "linear-gradient(135deg, #16a34a, #4ade80)",
              boxShadow: "0 4px 10px rgba(22,163,74,0.3)"
            }}
          >

            {!user?.profile_image &&
              user?.full_name?.charAt(0)}

          </Avatar>

        </Box>

      </Box>


      {/* Stats */}

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
            title="ماموریت‌ها"
            value={missions.length}
            icon={
              <Assignment sx={{ color: "#16a34a" }} />
            }
          />

        </Grid>


        <Grid
          item
          xs={12}
          md={4}
        >

          <StatsCard
            title="وضعیت فعالیت"
            value={
              user?.availability_status || "-"
            }
            icon={
              <CheckCircle sx={{ color: "#16a34a" }} />
            }
          />

        </Grid>


        <Grid
          item
          xs={12}
          md={4}
        >

          <StatsCard
            title="شهر فعالیت"
            value={
              user?.city || "-"
            }
            icon={
              <LocationCity sx={{ color: "#15803d" }} />
            }
          />

        </Grid>


      </Grid>


      {/* Last Mission */}

      <Box mt={5}>


        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3
          }}
        >

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: "#14532d" }}
          >

            آخرین ماموریت

          </Typography>


          <Button
            variant="outlined"
            onClick={() =>
              navigate("/volunteer/missions")
            }
            sx={{
              borderColor: "#16a34a",
              color: "#16a34a",
              "&:hover": {
                borderColor: "#15803d",
                background: "rgba(22,163,74,0.08)"
              }
            }}
          >

            مشاهده همه

          </Button>


        </Box>


        {

          !lastMission

            ?

            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: "center",
                border: "1px solid rgba(22,101,52,0.15)"
              }}
            >

              <Typography>

                ماموریتی برای شما ثبت نشده است

              </Typography>

            </Paper>


            :


            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid rgba(22,101,52,0.15)",
                boxShadow: "-8px 0 24px rgba(20,83,45,0.08)"
              }}
            >

              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#14532d" }}
              >

                {lastMission.disaster.title}

              </Typography>


              <Box mt={2}>

                <Chip
                  label={lastMission.status}
                  sx={{
                    fontWeight: 600,
                    bgcolor: lastMission.status === "accepted" ? "#dcfce7" : "#fef3c7",
                    color: lastMission.status === "accepted" ? "#15803d" : "#b45309"
                  }}
                />

              </Box>


              <Typography mt={2}>

                📍 {lastMission.disaster.city}

              </Typography>


              <Typography>

                منطقه: {lastMission.disaster.location}

              </Typography>


            </Paper>

        }


      </Box>


    </Box>

  );

}
