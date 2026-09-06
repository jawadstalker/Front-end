import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  Alert,
} from "@mui/material";

import {
  People,
  Visibility,
  Refresh,
} from "@mui/icons-material";

import axios from "../../api/axios";

import toast from "react-hot-toast";


export default function Users() {

  // =========================================================
  // STATE
  // =========================================================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [role, setRole] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [activeFilter, setActiveFilter] =
    useState("all");

  const [availabilityFilter, setAvailabilityFilter] =
    useState("all");


  // =========================================================
  // SKILLS MENU
  // =========================================================

  const [skillsMenuAnchor, setSkillsMenuAnchor] =
    useState(null);

  const [skillsMenuUser, setSkillsMenuUser] =
    useState(null);


  const skillsMenuOpen =
    Boolean(skillsMenuAnchor);


  // =========================================================
  // GET TOKEN
  // =========================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };


  // =========================================================
  // GET USERS
  // =========================================================

  const fetchUsers = async () => {

    try {

      setLoading(true);

      const token = getToken();

      let url =
        "/users/coordinator-view";


      /*
       * اگر role انتخاب شده باشد،
       * فعلاً از همان لیست دریافت‌شده
       * در Frontend فیلتر می‌کنیم.
       *
       * دلیل:
       * /users/role/{role}
       * مخصوص Admin است.
       */

      const response =
        await axios.get(
          url,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      console.log(
        "Coordinator users response:",
        response.data
      );


      if (
        Array.isArray(
          response.data
        )
      ) {

        setUsers(
          response.data
        );

      } else {

        console.error(
          "Unexpected users response:",
          response.data
        );

        setUsers([]);

        toast.error(
          "فرمت پاسخ کاربران صحیح نیست"
        );
      }

    } catch (error) {

      console.error(
        "Coordinator Users Error:",
        error
      );


      console.error(
        "Response:",
        error.response?.data
      );


      console.error(
        "Status:",
        error.response?.status
      );


      if (
        error.response?.status === 401
      ) {

        toast.error(
          "نشست شما منقضی شده است"
        );

      } else if (
        error.response?.status === 403
      ) {

        toast.error(
          "شما اجازه مشاهده کاربران را ندارید"
        );

      } else {

        toast.error(
          error.response?.data?.detail ||
          "خطا در دریافت کاربران"
        );
      }


      setUsers([]);

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    fetchUsers();

  }, []);


  // =========================================================
  // GET SKILLS
  // =========================================================

  const getSkills = (skills) => {

    if (!skills) {
      return [];
    }


    // Backend array

    if (
      Array.isArray(skills)
    ) {

      return skills
        .map((skill) =>
          String(skill).trim()
        )
        .filter(Boolean);
    }


    // String

    if (
      typeof skills === "string"
    ) {

      try {

        const parsed =
          JSON.parse(skills);


        if (
          Array.isArray(parsed)
        ) {

          return parsed
            .map((skill) =>
              String(skill).trim()
            )
            .filter(Boolean);
        }


        return [];

      } catch (error) {

        return skills
          .split(",")
          .map((skill) =>
            skill.trim()
          )
          .filter(Boolean);
      }
    }


    return [];
  };


  // =========================================================
  // SKILLS MENU
  // =========================================================

  const openSkillsMenu = (
    event,
    user
  ) => {

    setSkillsMenuAnchor(
      event.currentTarget
    );

    setSkillsMenuUser(user);
  };


  const closeSkillsMenu = () => {

    setSkillsMenuAnchor(null);

    setSkillsMenuUser(null);
  };


  // =========================================================
  // ROLE LABEL
  // =========================================================

  const getRoleLabel = (
    userRole
  ) => {

    switch (userRole) {

      case "admin":
        return "ادمین";

      case "coordinator":
        return "هماهنگ‌کننده";

      case "volunteer":
        return "داوطلب";

      default:
        return userRole || "-";
    }
  };


  // =========================================================
  // ROLE COLOR
  // =========================================================

  const getRoleColor = (
    userRole
  ) => {

    switch (userRole) {

      case "admin":
        return "error";

      case "coordinator":
        return "info";

      case "volunteer":
        return "success";

      default:
        return "default";
    }
  };


  // =========================================================
  // AVAILABILITY LABEL
  // =========================================================

  const getAvailabilityLabel = (
    status
  ) => {

    switch (status) {

      case "available":
        return "آماده";

      case "busy":
        return "مشغول";

      case "unavailable":
        return "در دسترس نیست";

      default:
        return status || "-";
    }
  };


  // =========================================================
  // AVAILABILITY COLOR
  // =========================================================

  const getAvailabilityColor = (
    status
  ) => {

    switch (status) {

      case "available":
        return "success";

      case "busy":
        return "warning";

      case "unavailable":
        return "default";

      default:
        return "default";
    }
  };


  // =========================================================
  // FILTER USERS
  // =========================================================

  const filteredUsers =
    useMemo(() => {

      const searchText =
        search
          .trim()
          .toLowerCase();


      return users.filter(
        (user) => {

          // -------------------------------------------------
          // Role
          // -------------------------------------------------

          const matchesRole =
            role === "all" ||
            user.role === role;


          // -------------------------------------------------
          // Name
          // -------------------------------------------------

          const fullName =
            user.full_name
              ?.toLowerCase() ||
            "";


          // -------------------------------------------------
          // Phone
          // -------------------------------------------------

          const phone =
            user.phone
              ?.toLowerCase() ||
            "";


          // -------------------------------------------------
          // City
          // -------------------------------------------------

          const city =
            user.city
              ?.toLowerCase() ||
            "";


          // -------------------------------------------------
          // Region
          // -------------------------------------------------

          const region =
            user.region
              ?.toLowerCase() ||
            "";


          // -------------------------------------------------
          // Skills
          // -------------------------------------------------

          const userSkills =
            getSkills(
              user.skills
            );


          const skillsText =
            userSkills
              .join(" ")
              .toLowerCase();


          // -------------------------------------------------
          // Search
          // -------------------------------------------------

          const matchesSearch =
            !searchText ||
            fullName.includes(
              searchText
            ) ||
            phone.includes(
              searchText
            ) ||
            city.includes(
              searchText
            ) ||
            region.includes(
              searchText
            ) ||
            skillsText.includes(
              searchText
            );


          // -------------------------------------------------
          // Active
          // -------------------------------------------------

          const matchesActive =
            activeFilter === "all" ||
            (
              activeFilter === "active" &&
              user.is_active === true
            ) ||
            (
              activeFilter === "inactive" &&
              user.is_active === false
            );


          // -------------------------------------------------
          // Availability
          // -------------------------------------------------

          const matchesAvailability =
            availabilityFilter ===
              "all" ||
            user.availability_status ===
              availabilityFilter;


          return (
            matchesRole &&
            matchesSearch &&
            matchesActive &&
            matchesAvailability
          );
        }
      );

    }, [
      users,
      role,
      search,
      activeFilter,
      availabilityFilter,
    ]);


  // =========================================================
  // RESET
  // =========================================================

  const resetFilters = () => {

    setSearch("");

    setRole("all");

    setActiveFilter("all");

    setAvailabilityFilter("all");
  };


  // =========================================================
  // LOADING
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
        p: {
          xs: 1,
          sm: 2,
          md: 3,
        },
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >

        <People
          color="primary"
          sx={{
            fontSize: 42,
          }}
        />

        <Box>

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            مشاهده کاربران
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            مشاهده اطلاعات کاربران سامانه
          </Typography>

        </Box>

      </Box>


      {/* =====================================================
          ROLE TABS
      ===================================================== */}

      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          mb: 3,
          overflow: "hidden",
        }}
      >

        <Tabs
          value={role}
          onChange={(
            event,
            value
          ) =>
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


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <Paper
        elevation={2}
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

          {/* SEARCH */}

          <TextField
            label="جستجوی کاربر"
            placeholder="نام، تلفن، شهر، منطقه یا مهارت"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            sx={{
              minWidth: {
                xs: "100%",
                sm: 280,
              },
              flex: 1,
            }}
          />


          {/* ACTIVE */}

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


          {/* AVAILABILITY */}

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


          {/* RESET */}

          <Button
            variant="outlined"
            onClick={resetFilters}
            sx={{
              height: 56,
            }}
          >
            پاک کردن فیلترها
          </Button>

        </Box>

      </Paper>


      {/* =====================================================
          COUNT
      ===================================================== */}

      <Typography
        color="text.secondary"
        sx={{
          mb: 2,
        }}
      >

        تعداد کاربران:

        {" "}

        <strong>
          {filteredUsers.length}
        </strong>

      </Typography>


      {/* =====================================================
          TABLE
      ===================================================== */}

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
            minWidth: 1050,
          }}
        >

          <TableHead>

            <TableRow>

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

            </TableRow>

          </TableHead>


          <TableBody>

            {filteredUsers.length === 0 ? (

              <TableRow>

                <TableCell
                  colSpan={9}
                  align="center"
                  sx={{
                    py: 6,
                  }}
                >

                  <Typography
                    color="text.secondary"
                  >
                    کاربری با این مشخصات پیدا نشد.
                  </Typography>

                </TableCell>

              </TableRow>

            ) : (

              filteredUsers.map(
                (user) => {

                  const userSkills =
                    getSkills(
                      user.skills
                    );


                  return (

                    <TableRow
                      key={user.id}
                      hover
                    >

                      {/* NAME */}

                      <TableCell align="right">

                        <Typography
                          fontWeight="bold"
                        >
                          {user.full_name ||
                            "-"}
                        </Typography>

                      </TableCell>


                      {/* PHONE */}

                      <TableCell align="right">
                        {user.phone || "-"}
                      </TableCell>


                      {/* ROLE */}

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


                      {/* CITY */}

                      <TableCell align="right">
                        {user.city || "-"}
                      </TableCell>


                      {/* REGION */}

                      <TableCell align="right">
                        {user.region || "-"}
                      </TableCell>


                      {/* SKILLS */}

                      <TableCell
                        align="right"
                        sx={{
                          minWidth: 160,
                        }}
                      >

                        {userSkills.length ===
                        0 ? (

                          <Typography
                            variant="body2"
                            color="text.secondary"
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
                                borderRadius: 2,
                                whiteSpace:
                                  "nowrap",
                              }}
                            >

                              مشاهده مهارت‌ها (
                              {
                                userSkills.length
                              }
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
                                vertical:
                                  "bottom",
                                horizontal:
                                  "right",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal:
                                  "right",
                              }}
                              PaperProps={{
                                sx: {
                                  mt: 1,
                                  minWidth: 230,
                                  maxWidth: 320,
                                  borderRadius: 2,
                                  p: 1,
                                  direction:
                                    "rtl",
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
                                  {
                                    user.full_name
                                  }
                                </Typography>

                              </Box>


                              <Divider
                                sx={{
                                  my: 1,
                                }}
                              />


                              <Box
                                sx={{
                                  display:
                                    "flex",
                                  flexWrap:
                                    "wrap",
                                  gap: 0.7,
                                  maxHeight: 250,
                                  overflowY:
                                    "auto",
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
                                      label={
                                        skill
                                      }
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


                      {/* AVAILABILITY */}

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


                      {/* ACCOUNT STATUS */}

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

                    </TableRow>

                  );
                }
              )

            )}

          </TableBody>

        </Table>

      </TableContainer>

    </Box>
  );
}