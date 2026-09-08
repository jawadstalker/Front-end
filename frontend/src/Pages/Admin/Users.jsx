import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

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
  CircularProgress,
  Button,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Menu,
  Divider,
  Avatar,
} from "@mui/material";

import toast from "react-hot-toast";
import { colors, gradient, fieldSx } from "../../theme/colors";

const ROLE_STYLE = {
  admin: { label: "ادمین", color: colors.purple, bg: "#F5F3FF", border: "#DDD6FE" },
  coordinator: { label: "هماهنگ‌کننده", color: colors.primary, bg: "#EFF6FF", border: "#DBEAFE" },
  volunteer: { label: "داوطلب", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
};

const AVAILABILITY_STYLE = {
  available: { label: "آماده", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  busy: { label: "مشغول", color: "#B45309", bg: "#FFFBEB", border: "#FDE68A" },
  unavailable: { label: "در دسترس نیست", color: colors.muted, bg: colors.bg, border: colors.border },
};

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

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changingId, setChangingId] = useState(null);

  const [role, setRole] = useState("all");

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  // =========================================================
  // منوی مهارت‌ها
  // =========================================================

  const [skillsMenuAnchor, setSkillsMenuAnchor] = useState(null);
  const [skillsMenuUser, setSkillsMenuUser] = useState(null);

  const skillsMenuOpen = Boolean(skillsMenuAnchor);

  const openSkillsMenu = (event, user) => {
    setSkillsMenuAnchor(event.currentTarget);
    setSkillsMenuUser(user);
  };

  const closeSkillsMenu = () => {
    setSkillsMenuAnchor(null);
    setSkillsMenuUser(null);
  };

  // =========================================================
  // دریافت کاربران
  // =========================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      let url = "/users";

      if (role !== "all") {
        url = `/users/role/${role}`;
      }

      const response = await axios.get(url);
      setUsers(response.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.detail || "خطا در دریافت کاربران");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  // =========================================================
  // تبدیل مهارت‌ها به آرایه
  // =========================================================

  const getSkills = (skills) => {
    if (!skills) return [];

    if (Array.isArray(skills)) {
      return skills.map((skill) => String(skill).trim()).filter(Boolean);
    }

    if (typeof skills === "string") {
      try {
        const parsed = JSON.parse(skills);
        if (Array.isArray(parsed)) {
          return parsed.map((skill) => String(skill).trim()).filter(Boolean);
        }
        return [];
      } catch (error) {
        return skills.split(",").map((skill) => skill.trim()).filter(Boolean);
      }
    }

    return [];
  };

  // =========================================================
  // تغییر وضعیت فعال بودن
  // =========================================================

  const toggleStatus = async (user) => {
    try {
      setChangingId(user.id);

      const response = await axios.patch(`/users/${user.id}/status`, {
        is_active: !user.is_active,
      });

      setUsers((prev) => prev.map((item) => (item.id === user.id ? response.data : item)));

      toast.success(response.data.is_active ? "کاربر فعال شد ✅" : "کاربر غیرفعال شد");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.detail || "خطا در تغییر وضعیت کاربر");
    } finally {
      setChangingId(null);
    }
  };

  // =========================================================
  // تغییر نقش
  // =========================================================

  const changeRole = async (user, newRole) => {
    try {
      setChangingId(user.id);

      const response = await axios.patch(`/users/${user.id}/role`, { role: newRole });

      if (role !== "all" && newRole !== role) {
        setUsers((prev) => prev.filter((item) => item.id !== user.id));
      } else {
        setUsers((prev) => prev.map((item) => (item.id === user.id ? response.data : item)));
      }

      toast.success("نقش کاربر تغییر کرد ✅");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.detail || "خطا در تغییر نقش کاربر");
    } finally {
      setChangingId(null);
    }
  };

  // =========================================================
  // حذف کاربر
  // =========================================================

  const deleteUser = async (user) => {
    const confirmed = window.confirm(`آیا از حذف کاربر «${user.full_name}» مطمئن هستید؟`);
    if (!confirmed) return;

    try {
      setChangingId(user.id);
      await axios.delete(`/users/${user.id}`);
      setUsers((prev) => prev.filter((item) => item.id !== user.id));
      toast.success("کاربر با موفقیت حذف شد");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.detail || "خطا در حذف کاربر");
    } finally {
      setChangingId(null);
    }
  };

  // =========================================================
  // فیلتر کاربران
  // =========================================================

  const filteredUsers = users.filter((user) => {
    const searchText = search.trim().toLowerCase();

    const fullName = user.full_name?.toLowerCase() || "";
    const phone = user.phone?.toLowerCase() || "";
    const city = user.city?.toLowerCase() || "";
    const region = user.region?.toLowerCase() || "";

    const userSkills = getSkills(user.skills);
    const skillsText = userSkills.join(" ").toLowerCase();

    const matchesSearch =
      !searchText ||
      fullName.includes(searchText) ||
      phone.includes(searchText) ||
      city.includes(searchText) ||
      region.includes(searchText) ||
      skillsText.includes(searchText);

    const matchesActive =
      activeFilter === "all" ||
      (activeFilter === "active" && user.is_active === true) ||
      (activeFilter === "inactive" && user.is_active === false);

    const matchesAvailability = availabilityFilter === "all" || user.availability_status === availabilityFilter;

    return matchesSearch && matchesActive && matchesAvailability;
  });

  const getRoleStyle = (userRole) => ROLE_STYLE[userRole] || { label: userRole || "-", color: colors.muted, bg: colors.bg, border: colors.border };
  const getAvailabilityStyle = (status) =>
    AVAILABILITY_STYLE[status] || { label: status || "-", color: colors.muted, bg: colors.bg, border: colors.border };

  // =========================================================
  // Loading
  // =========================================================

  if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl" }}>
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <Box dir="rtl">
      <Typography sx={{ color: colors.text, fontSize: { xs: 22, sm: 26 }, fontWeight: 900, mb: 3 }}>
        مدیریت کاربران
      </Typography>

      {/* Tabs */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3.5,
          mb: 3,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={role}
          onChange={(event, value) => setRole(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 1,
            "& .MuiTab-root": { fontWeight: 700, fontSize: 13.5, color: colors.muted, textTransform: "none" },
            "& .Mui-selected": { color: `${colors.primary} !important` },
            "& .MuiTabs-indicator": { background: gradient, height: 3, borderRadius: 2 },
          }}
        >
          <Tab value="all" label="همه کاربران" />
          <Tab value="volunteer" label="داوطلبان" />
          <Tab value="coordinator" label="هماهنگ‌کنندگان" />
          <Tab value="admin" label="ادمین‌ها" />
        </Tabs>
      </Paper>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3.5,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: "0 12px 30px rgba(23,32,51,.05)",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            label="جستجوی کاربر"
            placeholder="نام، تلفن، شهر، منطقه یا مهارت"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ minWidth: 280, flex: 1, ...fieldSx }}
          />

          <FormControl sx={{ minWidth: 180, ...fieldSx }}>
            <InputLabel>وضعیت حساب</InputLabel>
            <Select value={activeFilter} label="وضعیت حساب" onChange={(event) => setActiveFilter(event.target.value)}>
              <MenuItem value="all">همه</MenuItem>
              <MenuItem value="active">فعال</MenuItem>
              <MenuItem value="inactive">غیرفعال</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180, ...fieldSx }}>
            <InputLabel>وضعیت دسترسی</InputLabel>
            <Select
              value={availabilityFilter}
              label="وضعیت دسترسی"
              onChange={(event) => setAvailabilityFilter(event.target.value)}
            >
              <MenuItem value="all">همه</MenuItem>
              <MenuItem value="available">آماده</MenuItem>
              <MenuItem value="busy">مشغول</MenuItem>
              <MenuItem value="unavailable">در دسترس نیست</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => {
              setSearch("");
              setActiveFilter("all");
              setAvailabilityFilter("all");
            }}
            sx={{
              height: 44,
              borderRadius: 2.3,
              fontWeight: 700,
              textTransform: "none",
              color: colors.primary,
              borderColor: "#DBEAFE",
              background: "#EFF6FF",
              "&:hover": { borderColor: "#BFDBFE", background: "#DBEAFE" },
            }}
          >
            پاک کردن فیلترها
          </Button>
        </Box>
      </Paper>

      <Typography sx={{ color: colors.muted, fontSize: 13, mb: 2 }}>
        تعداد کاربران: <strong style={{ color: colors.text }}>{filteredUsers.length}</strong>
      </Typography>

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 3.5,
          overflowX: "auto",
          border: `1px solid ${colors.border}`,
          boxShadow: "0 12px 30px rgba(23,32,51,.05)",
        }}
      >
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow sx={{ "& th": { background: colors.bg, color: colors.muted, fontWeight: 800, fontSize: 12.5, borderBottom: `1px solid ${colors.border}` } }}>
              <TableCell align="right">پروفایل</TableCell>
              <TableCell align="right">نام</TableCell>
              <TableCell align="right">شماره تلفن</TableCell>
              <TableCell align="right">نقش</TableCell>
              <TableCell align="right">شهر</TableCell>
              <TableCell align="right">منطقه</TableCell>
              <TableCell align="right">مهارت‌ها</TableCell>
              <TableCell align="right">وضعیت دسترسی</TableCell>
              <TableCell align="right">وضعیت حساب</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 6, color: colors.muted }}>
                  کاربری با این مشخصات پیدا نشد
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const userSkills = getSkills(user.skills);
                const roleStyle = getRoleStyle(user.role);
                const availabilityStyle = getAvailabilityStyle(user.availability_status);
                const accountStyle = user.is_active
                  ? { label: "فعال", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" }
                  : { label: "غیرفعال", color: colors.danger, bg: colors.dangerBg, border: "#FECACA" };

                return (
                  <TableRow key={user.id} hover sx={{ "& td": { borderBottom: `1px solid ${colors.border}` } }}>
                    <TableCell align="right">
                      <Avatar
                        src={user.profile_image ? `http://127.0.0.1:8000${user.profile_image}` : undefined}
                        alt={user.full_name || "پروفایل"}
                        sx={{ width: 50, height: 50, fontSize: 20, fontWeight: 700, background: gradient, border: `2px solid ${colors.border}` }}
                      >
                        {!user.profile_image && user.full_name?.charAt(0)}
                      </Avatar>
                    </TableCell>

                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 700, color: colors.text }} noWrap>
                        {user.full_name}
                      </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ color: colors.text }}>
                      {user.phone}
                    </TableCell>

                    <TableCell align="right">
                      <Pill {...roleStyle} />
                    </TableCell>

                    <TableCell align="right" sx={{ color: colors.text }}>
                      {user.city || "-"}
                    </TableCell>

                    <TableCell align="right" sx={{ color: colors.text }}>
                      {user.region || "-"}
                    </TableCell>

                    <TableCell align="right" sx={{ width: 150, whiteSpace: "nowrap" }}>
                      {userSkills.length === 0 ? (
                        <Typography sx={{ color: colors.muted, fontSize: 12.5 }}>بدون مهارت</Typography>
                      ) : (
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={(event) => openSkillsMenu(event, user)}
                            sx={{
                              minWidth: 125,
                              borderRadius: 2,
                              fontSize: 12,
                              textTransform: "none",
                              fontWeight: 700,
                              color: colors.primary,
                              borderColor: "#DBEAFE",
                              background: "#EFF6FF",
                              "&:hover": { borderColor: "#BFDBFE", background: "#DBEAFE" },
                            }}
                          >
                            مشاهده مهارت‌ها ({userSkills.length})
                          </Button>

                          <Menu
                            anchorEl={skillsMenuOpen ? skillsMenuAnchor : null}
                            open={skillsMenuOpen && skillsMenuUser?.id === user.id}
                            onClose={closeSkillsMenu}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            PaperProps={{
                              sx: { mt: 1, minWidth: 230, maxWidth: 320, borderRadius: 3, p: 1, direction: "rtl", border: `1px solid ${colors.border}` },
                            }}
                          >
                            <Box sx={{ px: 1, py: 0.5 }}>
                              <Typography sx={{ fontWeight: 800, fontSize: 13, color: colors.text }}>
                                مهارت‌های {user.full_name}
                              </Typography>
                            </Box>

                            <Divider sx={{ my: 1, borderColor: colors.border }} />

                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.7, maxHeight: 250, overflowY: "auto", p: 0.5 }}>
                              {userSkills.map((skill, index) => (
                                <Pill key={`${skill}-${index}`} label={skill} color={colors.primary} bg="#EFF6FF" border="#DBEAFE" />
                              ))}
                            </Box>
                          </Menu>
                        </>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Pill {...availabilityStyle} />
                    </TableCell>

                    <TableCell align="right">
                      <Pill {...accountStyle} />
                    </TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap", alignItems: "center" }}>
                        <Select
                          size="small"
                          value={user.role}
                          disabled={changingId === user.id}
                          onChange={(event) => changeRole(user, event.target.value)}
                          sx={{
                            minWidth: 135,
                            borderRadius: 2,
                            fontSize: 12.5,
                            background: colors.bg,
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.border },
                          }}
                        >
                          <MenuItem value="volunteer">داوطلب</MenuItem>
                          <MenuItem value="coordinator">هماهنگ‌کننده</MenuItem>
                          <MenuItem value="admin">ادمین</MenuItem>
                        </Select>

                        <Button
                          variant="outlined"
                          size="small"
                          disabled={changingId === user.id}
                          onClick={() => toggleStatus(user)}
                          sx={{
                            whiteSpace: "nowrap",
                            borderRadius: 2,
                            fontWeight: 700,
                            textTransform: "none",
                            color: user.is_active ? colors.danger : "#059669",
                            borderColor: user.is_active ? "#FECACA" : "#A7F3D0",
                            background: user.is_active ? colors.dangerBg : "#ECFDF5",
                            "&:hover": { filter: "brightness(0.97)" },
                          }}
                        >
                          {changingId === user.id ? "در حال تغییر..." : user.is_active ? "غیرفعال کردن" : "فعال کردن"}
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          disabled={changingId === user.id}
                          onClick={() => deleteUser(user)}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            textTransform: "none",
                            color: colors.danger,
                            borderColor: "#FECACA",
                            background: colors.dangerBg,
                            "&:hover": { borderColor: "#FCA5A5", background: "#FEE2E2" },
                          }}
                        >
                          حذف
                        </Button>
                      </Box>
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