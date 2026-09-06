import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";

import api from "../../api/axios";
import toast from "react-hot-toast";

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changingId, setChangingId] = useState(null);

  useEffect(() => {
    loadVolunteers();
  }, []);

  const loadVolunteers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/users/volunteers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVolunteers(response.data);
    } catch (error) {
      console.log(error);

      toast.error("خطا در دریافت داوطلب‌ها");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (userId) => {
    try {
      setChangingId(userId);

      const token = localStorage.getItem("token");

      const response = await api.patch(
        `/users/volunteers/${userId}/toggle-active`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVolunteers((prev) =>
        prev.map((volunteer) =>
          volunteer.id === userId
            ? response.data
            : volunteer
        )
      );

      toast.success(
        response.data.is_active
          ? "داوطلب فعال شد ✅"
          : "داوطلب غیرفعال شد"
      );
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.detail ||
          "خطا در تغییر وضعیت داوطلب"
      );
    } finally {
      setChangingId(null);
    }
  };

  // =====================================================
  // تبدیل skills از VARCHAR/JSON به آرایه
  // =====================================================

  const getSkills = (skills) => {
    if (!skills) {
      return [];
    }

    // اگر بک‌اند مستقیماً آرایه داد
    if (Array.isArray(skills)) {
      return skills;
    }

    // اگر VARCHAR شامل JSON بود
    if (typeof skills === "string") {
      try {
        const parsed = JSON.parse(skills);

        if (Array.isArray(parsed)) {
          return parsed;
        }

        return [skills];
      } catch (error) {
        // برای داده‌های قدیمی مثل:
        // کمک‌های اولیه, پزشکی, رانندگی

        return skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }
    }

    return [];
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 10,
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
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 4,
        }}
      >
        مدیریت داوطلب‌ها
      </Typography>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          borderRadius: 3,
        }}
      >
        <Table>

          <TableHead>
            <TableRow>

              <TableCell align="right">
                نام
              </TableCell>

              <TableCell align="right">
                شماره تلفن
              </TableCell>

              <TableCell align="right">
                شهر
              </TableCell>

              <TableCell align="right">
                منطقه
              </TableCell>

              <TableCell align="right">
                مهارت‌ها
              </TableCell>

              <TableCell align="right">
                وضعیت دسترسی
              </TableCell>

              <TableCell align="right">
                وضعیت حساب
              </TableCell>

              <TableCell align="right">
                عملیات
              </TableCell>

            </TableRow>
          </TableHead>

          <TableBody>

            {volunteers.length === 0 ? (

              <TableRow>

                <TableCell
                  colSpan={8}
                  align="center"
                >
                  هیچ داوطلبی پیدا نشد
                </TableCell>

              </TableRow>

            ) : (

              volunteers.map((volunteer) => {

                const skills = getSkills(
                  volunteer.skills
                );

                return (
                  <TableRow
                    key={volunteer.id}
                    hover
                  >

                    {/* نام */}

                    <TableCell align="right">
                      {volunteer.full_name}
                    </TableCell>


                    {/* تلفن */}

                    <TableCell align="right">
                      {volunteer.phone}
                    </TableCell>


                    {/* شهر */}

                    <TableCell align="right">
                      {volunteer.city || "-"}
                    </TableCell>


                    {/* منطقه */}

                    <TableCell align="right">
                      {volunteer.region || "-"}
                    </TableCell>


                    {/* =================================================
                        مهارت‌ها
                    ================================================= */}

                    <TableCell align="right">

                      {skills.length === 0 ? (

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          بدون مهارت ثبت‌شده
                        </Typography>

                      ) : (

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.7,
                            maxWidth: 350,
                          }}
                        >

                          {skills.map((skill, index) => (

                            <Chip
                              key={`${skill}-${index}`}
                              label={skill}
                              color="primary"
                              variant="outlined"
                              size="small"
                            />

                          ))}

                        </Box>

                      )}

                    </TableCell>


                    {/* وضعیت دسترسی */}

                    <TableCell align="right">

                      <Chip
                        label={
                          volunteer.availability_status ===
                          "available"
                            ? "آماده"
                            : "مشغول"
                        }
                        color={
                          volunteer.availability_status ===
                          "available"
                            ? "success"
                            : "warning"
                        }
                        size="small"
                      />

                    </TableCell>


                    {/* وضعیت حساب */}

                    <TableCell align="right">

                      <Chip
                        label={
                          volunteer.is_active
                            ? "فعال"
                            : "غیرفعال"
                        }
                        color={
                          volunteer.is_active
                            ? "success"
                            : "error"
                        }
                        size="small"
                      />

                    </TableCell>


                    {/* عملیات */}

                    <TableCell align="right">

                      <Button
                        variant={
                          volunteer.is_active
                            ? "outlined"
                            : "contained"
                        }
                        color={
                          volunteer.is_active
                            ? "error"
                            : "success"
                        }
                        size="small"
                        disabled={
                          changingId === volunteer.id
                        }
                        onClick={() =>
                          toggleActive(
                            volunteer.id
                          )
                        }
                      >

                        {changingId === volunteer.id
                          ? "در حال تغییر..."
                          : volunteer.is_active
                          ? "غیرفعال کردن"
                          : "فعال کردن"}

                      </Button>

                    </TableCell>

                  </TableRow>
                );
              })
            )}

          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
}