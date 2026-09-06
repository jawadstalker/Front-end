import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Button,
  Chip,
  LinearProgress,
  Divider,
} from "@mui/material";

import {
  Assignment,
  Explore,
  Star,
} from "@mui/icons-material";

import api from "../../api/axios";
import MissionCard from "./MissionCard";
import toast from "react-hot-toast";

export default function Missions() {
  const [availableMissions, setAvailableMissions] = useState([]);
  const [myMissions, setMyMissions] = useState([]);
  const [mySkills, setMySkills] = useState("");
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  useEffect(() => {
    loadMissions();
  }, []);

  // =====================================================
  // LOAD MISSIONS
  // =====================================================

  const loadMissions = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("لطفاً ابتدا وارد حساب کاربری شوید.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // =================================================
      // CURRENT USER
      // =================================================

      const userResponse = await api.get(
        "/users/me",
        config
      );

      const user = userResponse.data || {};

      const userSkills = user.skills || "";

      setMySkills(userSkills);

      console.log(
        "========== CURRENT USER =========="
      );

      console.log("USER:", user);
      console.log("USER ID:", user.id);
      console.log("USER SKILLS:", userSkills);

      console.log(
        "=================================="
      );

      // =================================================
      // MISSIONS
      // =================================================

      const [
        availableResponse,
        myResponse,
      ] = await Promise.all([
        api.get(
          "/missions/available",
          config
        ),

        api.get(
          "/missions/my",
          config
        ),
      ]);

      const missions =
        availableResponse.data || [];

      const myMissionList =
        myResponse.data || [];

      // =================================================
      // DEBUG
      // =================================================

      console.log(
        "========== MISSIONS =========="
      );

      missions.forEach((mission) => {
        const frontendMatch =
          calculateFrontendSkillMatch(
            userSkills,
            mission.required_skills
          );

        console.log({
          id: mission.id,
          title: mission.title,
          userSkills,
          requiredSkills:
            mission.required_skills,
          backendMatch:
            mission.skill_match_count,
          backendMatched:
            mission.skill_matched,
          frontendMatch,
          volunteerCount:
            mission.volunteer_count,
          requiredVolunteers:
            mission.required_volunteers,
        });
      });

      console.log(
        "=============================="
      );

      // =================================================
      // SORT
      // =================================================

      missions.sort((a, b) => {
        const matchA =
          calculateFrontendSkillMatch(
            userSkills,
            a.required_skills
          );

        const matchB =
          calculateFrontendSkillMatch(
            userSkills,
            b.required_skills
          );

        // 1. SKILL MATCH

        if (matchA !== matchB) {
          return matchB - matchA;
        }

        // 2. PRIORITY

        const priorityOrder = {
          critical: 4,
          high: 3,
          medium: 2,
          low: 1,
        };

        const priorityA =
          priorityOrder[
            String(
              a.priority || ""
            ).toLowerCase()
          ] || 0;

        const priorityB =
          priorityOrder[
            String(
              b.priority || ""
            ).toLowerCase()
          ] || 0;

        if (priorityA !== priorityB) {
          return priorityB - priorityA;
        }

        // 3. NEWEST

        return (
          Number(b.id || 0) -
          Number(a.id || 0)
        );
      });

      setAvailableMissions(
        missions
      );

      setMyMissions(
        myMissionList
      );
    } catch (error) {
      console.error(
        "Missions Error:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.detail ||
          "خطا در دریافت مأموریت‌ها"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ACCEPT MISSION
  // =====================================================

  const acceptMission = async (
    missionId
  ) => {
    try {
      setAcceptingId(
        missionId
      );

      const token =
        localStorage.getItem(
          "token"
        );

      await api.patch(
        `/missions/${missionId}/accept`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "مأموریت با موفقیت پذیرفته شد ✅"
      );

      await loadMissions();
    } catch (error) {
      console.error(
        "Accept Mission Error:",
        error
      );

      toast.error(
        error.response?.data?.detail ||
          "خطا در قبول مأموریت"
      );
    } finally {
      setAcceptingId(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Box
      sx={{
        direction: "rtl",
        p: 2,
      }}
    >
      {/* =================================================
          AVAILABLE TITLE
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Explore
          color="success"
          sx={{
            fontSize: 40,
          }}
        />

        <Typography
          variant="h4"
          fontWeight="bold"
        >
          مأموریت‌های مناسب شما
        </Typography>
      </Box>

      {/* =================================================
          INFO
      ================================================= */}

      {availableMissions.length > 0 && (
        <AlertBox />
      )}

      {/* =================================================
          AVAILABLE MISSIONS
      ================================================= */}

      {availableMissions.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            mb: 6,
            textAlign: "center",
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
          >
            در حال حاضر مأموریت آزادی وجود ندارد.
          </Typography>
        </Paper>
      ) : (
        <Grid
          container
          spacing={3}
          sx={{
            mb: 6,
          }}
        >
          {availableMissions.map(
            (mission) => {
              const required =
                Number(
                  mission.required_volunteers ||
                    1
                );

              const current =
                Number(
                  mission.volunteer_count ||
                    0
                );

              const progress =
                Math.min(
                  (current /
                    required) *
                    100,
                  100
                );

              const matchCount =
                calculateFrontendSkillMatch(
                  mySkills,
                  mission.required_skills
                );

              const matched =
                matchCount > 0;

              return (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  key={mission.id}
                >
                  <Paper
                    elevation={
                      matched ? 7 : 3
                    }
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      height: "100%",
                      display: "flex",
                      flexDirection:
                        "column",
                      gap: 2,

                      border: matched
                        ? "2px solid #16a34a"
                        : "1px solid #e5e7eb",

                      backgroundColor:
                        matched
                          ? "#f0fdf4"
                          : "#ffffff",
                    }}
                  >
                    {/* MATCH */}

                    {matched ? (
                      <Chip
                        icon={
                          <Star
                            sx={{
                              color:
                                "#f59e0b !important",
                            }}
                          />
                        }
                        label={`${matchCount} مهارت مشترک`}
                        color="success"
                        size="small"
                        sx={{
                          alignSelf:
                            "flex-start",
                          fontWeight:
                            "bold",
                        }}
                      />
                    ) : (
                      <Chip
                        label="تطابق مهارتی ندارد"
                        color="default"
                        size="small"
                        sx={{
                          alignSelf:
                            "flex-start",
                        }}
                      />
                    )}

                    {/* TITLE */}

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                    >
                      {mission.title ||
                        mission.disaster
                          ?.title ||
                        "مأموریت امدادی"}
                    </Typography>

                    {/* DESCRIPTION */}

                    {mission.description && (
                      <Typography
                        color="text.secondary"
                      >
                        {
                          mission.description
                        }
                      </Typography>
                    )}

                    {/* REQUIRED SKILLS */}

                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{
                          mb: 0.5,
                        }}
                      >
                        مهارت‌های موردنیاز:
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {mission.required_skills ||
                          "بدون مهارت خاص"}
                      </Typography>
                    </Box>

                    {/* MATCH MESSAGE */}

                    {matched && (
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            "success.main",
                          fontWeight:
                            "bold",
                        }}
                      >
                        ✓ این مأموریت با مهارت‌های شما مطابقت دارد.
                      </Typography>
                    )}

                    {/* PRIORITY */}

                    {mission.priority && (
                      <Chip
                        label={`اولویت: ${mission.priority}`}
                        size="small"
                        color={getPriorityColor(
                          mission.priority
                        )}
                        sx={{
                          alignSelf:
                            "flex-start",
                        }}
                      />
                    )}

                    {/* DISASTER */}

                    <Typography
                      color="text.secondary"
                    >
                      بحران:{" "}
                      {mission.disaster
                        ?.title || "-"}
                    </Typography>

                    {/* CITY */}

                    <Typography
                      color="text.secondary"
                    >
                      شهر:{" "}
                      {mission.disaster
                        ?.city || "-"}
                    </Typography>

                    {/* REGION */}

                    <Typography
                      color="text.secondary"
                    >
                      منطقه:{" "}
                      {mission.disaster
                        ?.region || "-"}
                    </Typography>

                    {/* LOCATION */}

                    <Typography
                      color="text.secondary"
                    >
                      موقعیت:{" "}
                      {mission.location ||
                        mission.disaster
                          ?.location ||
                        "-"}
                    </Typography>

                    <Divider />

                    {/* CAPACITY */}

                    <Box>
                      <Box
                        sx={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                        >
                          ظرفیت مأموریت
                        </Typography>

                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="success.main"
                        >
                          {current} /{" "}
                          {required} نفر
                        </Typography>
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={
                          progress
                        }
                        color="success"
                        sx={{
                          height: 8,
                          borderRadius: 5,
                        }}
                      />
                    </Box>

                    {/* STATUS */}

                    <Chip
                      label={
                        current === 0
                          ? "آماده پذیرش"
                          : `${current} نفر پذیرفته‌اند`
                      }
                      color="success"
                      size="small"
                      sx={{
                        alignSelf:
                          "flex-start",
                      }}
                    />

                    {/* ACCEPT */}

                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      sx={{
                        mt: "auto",
                        height: 45,
                        borderRadius: 2,
                        fontWeight:
                          "bold",
                      }}
                      disabled={
                        acceptingId ===
                        mission.id
                      }
                      onClick={() =>
                        acceptMission(
                          mission.id
                        )
                      }
                    >
                      {acceptingId ===
                      mission.id
                        ? "در حال پذیرش..."
                        : "پذیرش مأموریت"}
                    </Button>
                  </Paper>
                </Grid>
              );
            }
          )}
        </Grid>
      )}

      {/* =================================================
          MY MISSIONS
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Assignment
          color="primary"
          sx={{
            fontSize: 40,
          }}
        />

        <Typography
          variant="h4"
          fontWeight="bold"
        >
          مأموریت‌های من
        </Typography>
      </Box>

      {myMissions.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
          >
            هنوز مأموریتی را قبول نکرده‌اید.
          </Typography>
        </Paper>
      ) : (
        <Grid
          container
          spacing={3}
        >
          {myMissions.map(
            (mission) => {
              const required =
                Number(
                  mission.required_volunteers ||
                    1
                );

              const current =
                Number(
                  mission.volunteer_count ||
                    0
                );

              const matchCount =
                calculateFrontendSkillMatch(
                  mySkills,
                  mission.required_skills
                );

              return (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  key={mission.id}
                >
                  <Box>
                    <MissionCard
                      mission={mission}
                      onReportSubmitted={
                        loadMissions
                      }
                    />

                    <Paper
                      variant="outlined"
                      sx={{
                        mt: 1,
                        p: 1.5,
                        borderRadius: 2,
                        textAlign:
                          "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                      >
                        اعضای مأموریت:{" "}
                        {current} /{" "}
                        {required} نفر
                      </Typography>
                    </Paper>

                    {matchCount > 0 && (
                      <Chip
                        icon={<Star />}
                        label={`${matchCount} مهارت مشترک`}
                        color="success"
                        sx={{
                          mt: 1,
                          width: "100%",
                        }}
                      />
                    )}

                    {mission.status ===
                      "completed" && (
                      <Chip
                        label="تکمیل شده"
                        color="success"
                        sx={{
                          mt: 1,
                          width: "100%",
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              );
            }
          )}
        </Grid>
      )}
    </Box>
  );
}

// =====================================================
// FRONTEND SKILL MATCH
// =====================================================

function calculateFrontendSkillMatch(
  volunteerSkills,
  missionSkills
) {
  const volunteer =
    normalizeSkills(
      volunteerSkills
    );

  const mission =
    normalizeSkills(
      missionSkills
    );

  if (
    volunteer.length === 0 ||
    mission.length === 0
  ) {
    return 0;
  }

  let count = 0;

  volunteer.forEach(
    (volunteerSkill) => {
      mission.forEach(
        (missionSkill) => {
          if (
            skillsMatch(
              volunteerSkill,
              missionSkill
            )
          ) {
            count++;
          }
        }
      );
    }
  );

  return count;
}

// =====================================================
// SKILL MATCH
// =====================================================

function skillsMatch(
  volunteerSkill,
  missionSkill
) {
  const volunteer =
    normalizeSkill(
      volunteerSkill
    );

  const mission =
    normalizeSkill(
      missionSkill
    );

  if (
    !volunteer ||
    !mission
  ) {
    return false;
  }

  // EXACT MATCH

  if (
    volunteer === mission
  ) {
    return true;
  }

  // CONTAINS MATCH

  if (
    mission.includes(
      volunteer
    )
  ) {
    return true;
  }

  if (
    volunteer.includes(
      mission
    )
  ) {
    return true;
  }

  return false;
}

// =====================================================
// NORMALIZE SKILLS
// =====================================================

function normalizeSkills(
  skills
) {
  if (!skills) {
    return [];
  }

  return String(skills)
    .split(/[,،;؛|]+/)
    .map(
      (skill) =>
        normalizeSkill(
          skill
        )
    )
    .filter(Boolean);
}

// =====================================================
// NORMALIZE ONE SKILL
// =====================================================

function normalizeSkill(
  skill
) {
  return String(
    skill || ""
  )
    .trim()
    .toLowerCase()
    .replace(
      /ي/g,
      "ی"
    )
    .replace(
      /ى/g,
      "ی"
    )
    .replace(
      /ك/g,
      "ک"
    )
    .replace(
      /\u200c/g,
      " "
    )
    .replace(
      /[()[\]{}]/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}

// =====================================================
// PRIORITY
// =====================================================

function getPriorityColor(
  priority
) {
  const value =
    String(
      priority || ""
    ).toLowerCase();

  if (
    value === "critical"
  ) {
    return "error";
  }

  if (
    value === "high"
  ) {
    return "warning";
  }

  if (
    value === "medium"
  ) {
    return "info";
  }

  if (
    value === "low"
  ) {
    return "default";
  }

  return "default";
}

// =====================================================
// INFO BOX
// =====================================================

function AlertBox() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 3,
        backgroundColor:
          "#f0fdf4",
        border:
          "1px solid #bbf7d0",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color:
            "#166534",
          fontWeight:
            "bold",
        }}
      >
        ⭐ مأموریت‌ها بر اساس تطابق مهارت مرتب شده‌اند.
      </Typography>
    </Paper>
  );
}