import React, { useEffect, useState } from "react";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button } from "@mui/material";

import api from "../../api/axios";
import toast from "react-hot-toast";
import { colors, gradient } from "../../theme/colors";

function Pill({ label, color, bg, border }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1.3,
        py: 0.35,
        borderRadius: 10,
        fontSize: 11.5,
        fontWeight: 800,
        color,
        background: bg,
        border: `1px solid ${border}`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Box>
  );
}

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
        headers: { Authorization: `Bearer ${token}` },
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVolunteers((prev) => prev.map((volunteer) => (volunteer.id === userId ? response.data : volunteer)));

      toast.success(response.data.is_active ? "داوطلب فعال شد ✅" : "داوطلب غیرفعال شد");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.detail || "خطا در تغییر وضعیت داوطلب");
    } finally {
      setChangingId(null);
    }
  };

  const getSkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;

    if (typeof skills === "string") {
      try {
        const parsed = JSON.parse(skills);
        if (Array.isArray(parsed)) return parsed;
        return [skills];
      } catch (error) {
        return skills.split(",").map((skill) => skill.trim()).filter(Boolean);
      }
    }

    return [];
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  return (
    <Box dir="rtl">
      <Typography sx={{ color: colors.text, fontSize: { xs: 22, sm: 26 }, fontWeight: 900, mb: 4 }}>
        مدیریت داوطلب‌ها
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: 3.5, border: `1px solid ${colors.border}`, boxShadow: "0 12px 30px rgba(23,32,51,.05)" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ "& th": { background: colors.bg, color: colors.muted, fontWeight: 800, fontSize: 12.5, borderBottom: `1px solid ${colors.border}` } }}>
              <TableCell align="right">نام</TableCell>
              <TableCell align="right">شماره تلفن</TableCell>
              <TableCell align="right">شهر</TableCell>
              <TableCell align="right">منطقه</TableCell>
              <TableCell align="right">مهارت‌ها</TableCell>
              <TableCell align="right">وضعیت دسترسی</TableCell>
              <TableCell align="right">وضعیت حساب</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {volunteers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, color: colors.muted }}>
                  هیچ داوطلبی پیدا نشد
                </TableCell>
              </TableRow>
            ) : (
              volunteers.map((volunteer) => {
                const skills = getSkills(volunteer.skills);
                const available = volunteer.availability_status === "available";

                return (
                  <TableRow key={volunteer.id} hover sx={{ "& td": { borderBottom: `1px solid ${colors.border}` } }}>
                    <TableCell align="right" sx={{ color: colors.text, fontWeight: 600 }}>
                      {volunteer.full_name}
                    </TableCell>

                    <TableCell align="right" sx={{ color: colors.text }}>
                      {volunteer.phone}
                    </TableCell>

                    <TableCell align="right" sx={{ color: colors.text }}>
                      {volunteer.city || "-"}
                    </TableCell>

                    <TableCell align="right" sx={{ color: colors.text }}>
                      {volunteer.region || "-"}
                    </TableCell>

                    <TableCell align="right">
                      {skills.length === 0 ? (
                        <Typography sx={{ color: colors.muted, fontSize: 12.5 }}>بدون مهارت ثبت‌شده</Typography>
                      ) : (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.7, maxWidth: 350 }}>
                          {skills.map((skill, index) => (
                            <Pill key={`${skill}-${index}`} label={skill} color={colors.primary} bg="#EFF6FF" border="#DBEAFE" />
                          ))}
                        </Box>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Pill
                        label={available ? "آماده" : "مشغول"}
                        color={available ? "#059669" : "#B45309"}
                        bg={available ? "#ECFDF5" : "#FFFBEB"}
                        border={available ? "#A7F3D0" : "#FDE68A"}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Pill
                        label={volunteer.is_active ? "فعال" : "غیرفعال"}
                        color={volunteer.is_active ? "#059669" : colors.danger}
                        bg={volunteer.is_active ? "#ECFDF5" : colors.dangerBg}
                        border={volunteer.is_active ? "#A7F3D0" : "#FECACA"}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={changingId === volunteer.id}
                        onClick={() => toggleActive(volunteer.id)}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 700,
                          textTransform: "none",
                          color: volunteer.is_active ? colors.danger : "#059669",
                          borderColor: volunteer.is_active ? "#FECACA" : "#A7F3D0",
                          background: volunteer.is_active ? colors.dangerBg : "#ECFDF5",
                          "&:hover": { filter: "brightness(0.97)" },
                        }}
                      >
                        {changingId === volunteer.id ? "در حال تغییر..." : volunteer.is_active ? "غیرفعال کردن" : "فعال کردن"}
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