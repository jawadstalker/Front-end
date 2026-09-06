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
  Chip,
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

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changingId, setChangingId] = useState(null);

  const [role, setRole] = useState("all");

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] =
    useState("all");

  // =========================================================
  // منوی مهارت‌ها
  // =========================================================

  const [skillsMenuAnchor, setSkillsMenuAnchor] =
    useState(null);

  const [skillsMenuUser, setSkillsMenuUser] =
    useState(null);

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

      toast.error(
        error.response?.data?.detail ||
          "خطا در دریافت کاربران"
      );
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
    if (!skills) {
      return [];
    }

    // اگر بک‌اند آرایه فرستاده باشد
    if (Array.isArray(skills)) {
      return skills
        .map((skill) => String(skill).trim())
        .filter(Boolean);
    }

    // اگر JSON string باشد
    if (typeof skills === "string") {
      try {
        const parsed = JSON.parse(skills);

        if (Array.isArray(parsed)) {
          return parsed
            .map((skill) => String(skill).trim())
            .filter(Boolean);
        }

        return [];
      } catch (error) {
        // پشتیبانی از داده‌های قدیمی:
        // "پزشکی, رانندگی, کمک‌های اولیه"

        return skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
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

      const response = await axios.patch(
        `/users/${user.id}/status`,
        {
          is_active: !user.is_active,
        }
      );

      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id
            ? response.data
            : item
        )
      );

      toast.success(
        response.data.is_active
          ? "کاربر فعال شد ✅"
          : "کاربر غیرفعال شد"
      );
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.detail ||
          "خطا در تغییر وضعیت کاربر"
      );
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

      const response = await axios.patch(
        `/users/${user.id}/role`,
        {
          role: newRole,
        }
      );

      if (
        role !== "all" &&
        newRole !== role
      ) {
        setUsers((prev) =>
          prev.filter(
            (item) => item.id !== user.id
          )
        );
      } else {
        setUsers((prev) =>
          prev.map((item) =>
            item.id === user.id
              ? response.data
              : item
          )
        );
      }

      toast.success(
        "نقش کاربر تغییر کرد ✅"
      );
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.detail ||
          "خطا در تغییر نقش کاربر"
      );
    } finally {
      setChangingId(null);
    }
  };

  // =========================================================
  // حذف کاربر
  // =========================================================

  const deleteUser = async (user) => {
    const confirmed = window.confirm(
      `آیا از حذف کاربر «${user.full_name}» مطمئن هستید؟`
    );

    if (!confirmed) {
      return;
    }

    try {
      setChangingId(user.id);

      await axios.delete(
        `/users/${user.id}`
      );

      setUsers((prev) =>
        prev.filter(
          (item) => item.id !== user.id
        )
      );

      toast.success(
        "کاربر با موفقیت حذف شد"
      );
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.detail ||
          "خطا در حذف کاربر"
      );
    } finally {
      setChangingId(null);
    }
  };

  // =========================================================
  // فیلتر کاربران
  // =========================================================

  const filteredUsers = users.filter((user) => {
    const searchText = search
      .trim()
      .toLowerCase();

    // -----------------------------
    // اطلاعات اصلی کاربر
    // -----------------------------

    const fullName =
      user.full_name
        ?.toLowerCase() || "";

    const phone =
      user.phone
        ?.toLowerCase() || "";

    const city =
      user.city
        ?.toLowerCase() || "";

    const region =
      user.region
        ?.toLowerCase() || "";

    // -----------------------------
    // مهارت‌های کاربر
    // -----------------------------

    const userSkills = getSkills(
      user.skills
    );

    const skillsText = userSkills
      .join(" ")
      .toLowerCase();

    // -----------------------------
    // جستجو
    // -----------------------------

    const matchesSearch =
      !searchText ||
      fullName.includes(searchText) ||
      phone.includes(searchText) ||
      city.includes(searchText) ||
      region.includes(searchText) ||
      skillsText.includes(searchText);

    // -----------------------------
    // وضعیت حساب
    // -----------------------------

    const matchesActive =
      activeFilter === "all" ||
      (activeFilter === "active" &&
        user.is_active === true) ||
      (activeFilter === "inactive" &&
        user.is_active === false);

    // -----------------------------
    // وضعیت دسترسی
    // -----------------------------

    const matchesAvailability =
      availabilityFilter === "all" ||
      user.availability_status ===
        availabilityFilter;

    return (
      matchesSearch &&
      matchesActive &&
      matchesAvailability
    );
  });

  // =========================================================
  // نمایش نقش
  // =========================================================

  const getRoleLabel = (userRole) => {
    if (userRole === "admin") {
      return "ادمین";
    }

    if (userRole === "coordinator") {
      return "هماهنگ‌کننده";
    }

    if (userRole === "volunteer") {
      return "داوطلب";
    }

    return userRole || "-";
  };

  const getRoleColor = (userRole) => {
    if (userRole === "admin") {
      return "error";
    }

    if (userRole === "coordinator") {
      return "info";
    }

    return "success";
  };

  // =========================================================
  // نمایش وضعیت دسترسی
  // =========================================================

  const getAvailabilityLabel = (status) => {
    if (status === "available") {
      return "آماده";
    }

    if (status === "busy") {
      return "مشغول";
    }

    if (status === "unavailable") {
      return "در دسترس نیست";
    }

    return status || "-";
  };

  const getAvailabilityColor = (status) => {
    if (status === "available") {
      return "success";
    }

    if (status === "busy") {
      return "warning";
    }

    return "default";
  };

  // =========================================================
  // Loading
  // =========================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          direction: "rtl",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <Box
      sx={{
        direction: "rtl",
        p: 2,
      }}
    >

      {/* =================================================
          عنوان
      ================================================= */}

      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 3,
        }}
      >
        مدیریت کاربران
      </Typography>


      {/* =================================================
          Tabs
      ================================================= */}

      <Paper
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >
        <Tabs
          value={role}
          onChange={(event, value) =>
            setRole(value)
          }
          variant="scrollable"
          scrollButtons="auto"
        >

          <Tab
            value="all"
            label="همه کاربران"
          />

          <Tab
            value="volunteer"
            label="داوطلبان"
          />

          <Tab
            value="coordinator"
            label="هماهنگ‌کنندگان"
          />

          <Tab
            value="admin"
            label="ادمین‌ها"
          />

        </Tabs>
      </Paper>


      {/* =================================================
          Filters
      ================================================= */}

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
        }}
      >

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >

          <TextField
            label="جستجوی کاربر"
            placeholder="نام، تلفن، شهر، منطقه یا مهارت"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            sx={{
              minWidth: 280,
              flex: 1,
            }}
          />


          <FormControl
            sx={{
              minWidth: 180,
            }}
          >

            <InputLabel>
              وضعیت حساب
            </InputLabel>

            <Select
              value={activeFilter}
              label="وضعیت حساب"
              onChange={(event) =>
                setActiveFilter(
                  event.target.value
                )
              }
            >

              <MenuItem value="all">
                همه
              </MenuItem>

              <MenuItem value="active">
                فعال
              </MenuItem>

              <MenuItem value="inactive">
                غیرفعال
              </MenuItem>

            </Select>

          </FormControl>


          <FormControl
            sx={{
              minWidth: 180,
            }}
          >

            <InputLabel>
              وضعیت دسترسی
            </InputLabel>

            <Select
              value={availabilityFilter}
              label="وضعیت دسترسی"
              onChange={(event) =>
                setAvailabilityFilter(
                  event.target.value
                )
              }
            >

              <MenuItem value="all">
                همه
              </MenuItem>

              <MenuItem value="available">
                آماده
              </MenuItem>

              <MenuItem value="busy">
                مشغول
              </MenuItem>

              <MenuItem value="unavailable">
                در دسترس نیست
              </MenuItem>

            </Select>

          </FormControl>


          <Button
            variant="outlined"
            onClick={() => {
              setSearch("");
              setActiveFilter("all");
              setAvailabilityFilter("all");
            }}
          >
            پاک کردن فیلترها
          </Button>

        </Box>

      </Paper>


      {/* =================================================
          تعداد نتایج
      ================================================= */}

      <Typography
        color="text.secondary"
        sx={{
          mb: 2,
        }}
      >
        تعداد کاربران:{" "}
        <strong>
          {filteredUsers.length}
        </strong>
      </Typography>


      {/* =================================================
          Table
      ================================================= */}

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          borderRadius: 3,
          overflowX: "auto",
        }}
      >

        <Table
          sx={{
            minWidth: 1200,
          }}
        >

          <TableHead>

            <TableRow>

              {/* پروفایل */}

              <TableCell align="right">
                پروفایل
              </TableCell>


              <TableCell align="right">
                نام
              </TableCell>


              <TableCell align="right">
                شماره تلفن
              </TableCell>


              <TableCell align="right">
                نقش
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

            {filteredUsers.length === 0 ? (

              <TableRow>

                <TableCell
                  colSpan={10}
                  align="center"
                  sx={{
                    py: 5,
                  }}
                >
                  کاربری با این مشخصات پیدا نشد
                </TableCell>

              </TableRow>

            ) : (

              filteredUsers.map((user) => {

                const userSkills =
                  getSkills(user.skills);

                return (

                  <TableRow
                    key={user.id}
                    hover
                  >

                    {/* =================================================
                        پروفایل کاربر
                    ================================================= */}

                    <TableCell align="right">

                      <Avatar
                        src={
                          user.profile_image
                            ? `http://127.0.0.1:8000${user.profile_image}`
                            : undefined
                        }
                        alt={
                          user.full_name ||
                          "پروفایل"
                        }
                        sx={{
                          width: 55,
                          height: 55,
                          bgcolor: "#166534",
                          fontSize: 24,
                          border: "2px solid #e5e7eb",
                        }}
                      >

                        {!user.profile_image &&
                          user.full_name?.charAt(0)}

                      </Avatar>

                    </TableCell>


                    {/* =================================================
                        نام
                    ================================================= */}

                    <TableCell align="right">

                      <Typography
                        fontWeight="bold"
                        noWrap
                      >
                        {user.full_name}
                      </Typography>

                    </TableCell>


                    {/* تلفن */}

                    <TableCell align="right">
                      {user.phone}
                    </TableCell>


                    {/* نقش */}

                    <TableCell align="right">

                      <Chip
                        label={getRoleLabel(
                          user.role
                        )}
                        color={getRoleColor(
                          user.role
                        )}
                        size="small"
                      />

                    </TableCell>


                    {/* شهر */}

                    <TableCell align="right">
                      {user.city || "-"}
                    </TableCell>


                    {/* منطقه */}

                    <TableCell align="right">
                      {user.region || "-"}
                    </TableCell>


                    {/* =================================================
                        مهارت‌ها
                    ================================================= */}

                    <TableCell
                      align="right"
                      sx={{
                        width: 150,
                        whiteSpace: "nowrap",
                      }}
                    >

                      {userSkills.length === 0 ? (

                        <Typography
                          color="text.secondary"
                          variant="body2"
                        >
                          بدون مهارت
                        </Typography>

                      ) : (

                        <>

                          <Button
                            size="small"
                            variant="outlined"
                            onClick={(event) =>
                              openSkillsMenu(
                                event,
                                user
                              )
                            }
                            sx={{
                              minWidth: 125,
                              borderRadius: 2,
                              fontSize: 12,
                            }}
                          >
                            مشاهده مهارت‌ها (
                            {userSkills.length}
                            )
                          </Button>


                          <Menu
                            anchorEl={
                              skillsMenuOpen
                                ? skillsMenuAnchor
                                : null
                            }
                            open={
                              skillsMenuOpen &&
                              skillsMenuUser?.id ===
                                user.id
                            }
                            onClose={
                              closeSkillsMenu
                            }
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            PaperProps={{
                              sx: {
                                mt: 1,
                                minWidth: 230,
                                maxWidth: 320,
                                borderRadius: 2,
                                p: 1,
                                direction: "rtl",
                              },
                            }}
                          >

                            <Box
                              sx={{
                                px: 1,
                                py: 0.5,
                              }}
                            >

                              <Typography
                                variant="subtitle2"
                                fontWeight="bold"
                              >
                                مهارت‌های{" "}
                                {user.full_name}
                              </Typography>

                            </Box>


                            <Divider
                              sx={{
                                my: 1,
                              }}
                            />


                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.7,
                                maxHeight: 250,
                                overflowY: "auto",
                                p: 0.5,
                              }}
                            >

                              {userSkills.map(
                                (
                                  skill,
                                  index
                                ) => (

                                  <Chip
                                    key={`${skill}-${index}`}
                                    label={skill}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />

                                )
                              )}

                            </Box>

                          </Menu>

                        </>

                      )}

                    </TableCell>


                    {/* وضعیت دسترسی */}

                    <TableCell align="right">

                      <Chip
                        label={getAvailabilityLabel(
                          user.availability_status
                        )}
                        color={getAvailabilityColor(
                          user.availability_status
                        )}
                        size="small"
                      />

                    </TableCell>


                    {/* وضعیت حساب */}

                    <TableCell align="right">

                      <Chip
                        label={
                          user.is_active
                            ? "فعال"
                            : "غیرفعال"
                        }
                        color={
                          user.is_active
                            ? "success"
                            : "error"
                        }
                        size="small"
                      />

                    </TableCell>


                    {/* =================================================
                        عملیات
                    ================================================= */}

                    <TableCell align="right">

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "nowrap",
                          alignItems: "center",
                        }}
                      >

                        <Select
                          size="small"
                          value={user.role}
                          disabled={
                            changingId ===
                            user.id
                          }
                          onChange={(event) =>
                            changeRole(
                              user,
                              event.target.value
                            )
                          }
                          sx={{
                            minWidth: 135,
                          }}
                        >

                          <MenuItem value="volunteer">
                            داوطلب
                          </MenuItem>

                          <MenuItem value="coordinator">
                            هماهنگ‌کننده
                          </MenuItem>

                          <MenuItem value="admin">
                            ادمین
                          </MenuItem>

                        </Select>


                        <Button
                          variant={
                            user.is_active
                              ? "outlined"
                              : "contained"
                          }
                          color={
                            user.is_active
                              ? "error"
                              : "success"
                          }
                          size="small"
                          disabled={
                            changingId ===
                            user.id
                          }
                          onClick={() =>
                            toggleStatus(user)
                          }
                          sx={{
                            whiteSpace:
                              "nowrap",
                          }}
                        >

                          {changingId ===
                          user.id
                            ? "در حال تغییر..."
                            : user.is_active
                            ? "غیرفعال کردن"
                            : "فعال کردن"}

                        </Button>


                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          disabled={
                            changingId ===
                            user.id
                          }
                          onClick={() =>
                            deleteUser(user)
                          }
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