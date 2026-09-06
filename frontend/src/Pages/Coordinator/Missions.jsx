import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Button,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";

import {
  Assignment,
  Person,
  Warning,
  LocationOn,
  Add,
  Description,
  CheckCircle,
  Cancel,
  ExpandMore,
  Edit,
  Delete,
  Group,
  Phone,
  AccessTime,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import toast from "react-hot-toast";

// =============================================================
// DESIGN TOKENS — white / blue, restrained
// =============================================================

const palette = {
  paper: "#F3F6FA",
  surface: "#FFFFFF",
  ink: "#16212E",
  inkMuted: "#64748B",
  border: "#E1E7EF",

  primary: "#0B5CAD",
  primaryDark: "#084785",
  primarySoft: "#EAF2FB",

  approve: "#1F7A54",
  approveBg: "#E7F5EE",

  pending: "#B4791E",
  pendingBg: "#FBF1E0",

  accepted: "#2E6FA8",
  acceptedBg: "#E9F1FA",

  cancelled: "#9A3B3B",
  cancelledBg: "#F6EAEA",
};

const fontFamily = '"Vazirmatn", "Segoe UI", sans-serif';

function useVazirmatn() {
  useEffect(() => {
    if (document.getElementById("vazirmatn-font-link")) return;

    const link = document.createElement("link");
    link.id = "vazirmatn-font-link";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap";

    document.head.appendChild(link);
  }, []);
}

export default function Missions() {
  useVazirmatn();

  const [missions, setMissions] = useState([]);
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] =
    useState(true);

  const [reviewing, setReviewing] = useState(null);
  const [deletingMission, setDeletingMission] =
    useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  // =========================================================
  // AUTH
  // =========================================================

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // =========================================================
  // LOAD DATA
  // =========================================================

  const loadData = async () => {
    setLoading(true);

    try {
      await Promise.all([
        loadMissions(),
        loadPendingReports(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD MISSIONS
  // =========================================================

  const loadMissions = async () => {
    try {
      const response = await api.get(
        "/missions/",
        getAuthConfig()
      );

      setMissions(response.data || []);
    } catch (error) {
      console.error(
        "Coordinator Missions Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.detail ||
          "خطا در دریافت مأموریت‌ها"
      );
    }
  };

  // =========================================================
  // LOAD PENDING REPORTS
  // =========================================================

  const loadPendingReports = async () => {
    try {
      setReportsLoading(true);

      const response = await api.get(
        "/missions/reports/pending",
        getAuthConfig()
      );

      setReports(response.data || []);
    } catch (error) {
      console.error(
        "Pending Reports Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.detail ||
          "خطا در دریافت گزارش‌ها"
      );
    } finally {
      setReportsLoading(false);
    }
  };

  // =========================================================
  // EDIT MISSION
  // =========================================================

  const editMission = (missionId) => {
    navigate(
      `/coordinator/missions/edit/${missionId}`
    );
  };

  // =========================================================
  // DELETE MISSION
  // =========================================================

  const deleteMission = async (missionId) => {
    const confirmed = window.confirm(
      "آیا از حذف این مأموریت مطمئن هستید؟"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingMission(missionId);

      await api.delete(
        `/missions/${missionId}`,
        getAuthConfig()
      );

      toast.success(
        "مأموریت با موفقیت حذف شد"
      );

      setMissions((prev) =>
        prev.filter(
          (mission) =>
            mission.id !== missionId
        )
      );

      await loadPendingReports();
    } catch (error) {
      console.error(
        "Delete Mission Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.detail ||
          "خطا در حذف مأموریت"
      );
    } finally {
      setDeletingMission(null);
    }
  };

  // =========================================================
  // GROUP REPORTS BY MISSION
  // =========================================================

  const groupedReports = useMemo(() => {
    const groups = {};

    reports.forEach((report) => {
      const missionId = report.mission_id;

      if (!groups[missionId]) {
        groups[missionId] = {
          mission_id: missionId,
          mission_title:
            report.mission_title ||
            `مأموریت #${missionId}`,
          reports: [],
        };
      }

      groups[missionId].reports.push(report);
    });

    return Object.values(groups);
  }, [reports]);

  // =========================================================
  // REVIEW REPORT
  // =========================================================

  const reviewReport = async (
    missionId,
    userId,
    approved
  ) => {
    try {
      const reviewKey =
        `${missionId}-${userId}`;

      setReviewing(reviewKey);

      await api.patch(
        `/missions/${missionId}/report/review`,
        null,
        {
          params: {
            user_id: userId,
            approved,
          },
          ...getAuthConfig(),
        }
      );

      if (approved) {
        toast.success(
          "گزارش با موفقیت تأیید شد"
        );
      } else {
        toast.success(
          "گزارش رد شد."
        );
      }

      await Promise.all([
        loadMissions(),
        loadPendingReports(),
      ]);
    } catch (error) {
      console.error(
        "Review Report Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.detail ||
          "خطا در بررسی گزارش"
      );
    } finally {
      setReviewing(null);
    }
  };

  // =========================================================
  // STATUS
  // =========================================================

  const getStatus = (status) => {
    switch (status) {
      case "active":
        return {
          label: "آزاد",
          color: palette.approve,
          bg: palette.approveBg,
        };

      case "accepted":
        return {
          label: "پذیرفته شده",
          color: palette.accepted,
          bg: palette.acceptedBg,
        };

      case "completed":
        return {
          label: "تکمیل شده",
          color: palette.approve,
          bg: palette.approveBg,
        };

      case "cancelled":
        return {
          label: "لغو شده",
          color: palette.cancelled,
          bg: palette.cancelledBg,
        };

      default:
        return {
          label: status || "-",
          color: palette.pending,
          bg: palette.pendingBg,
        };
    }
  };

  // =========================================================
  // SMALL PRESENTATIONAL HELPER
  // =========================================================

  const StatusBadge = ({ status }) => (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.5,
        py: 0.5,
        borderRadius: "6px",
        backgroundColor: status.bg,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: status.color,
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: status.color,
          whiteSpace: "nowrap",
        }}
      >
        {status.label}
      </Typography>
    </Box>
  );

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <Box
        sx={{
          direction: "rtl",
          fontFamily,
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: palette.paper,
        }}
      >
        <CircularProgress sx={{ color: palette.primary }} />
        <Typography sx={{ mt: 2, color: palette.inkMuted, fontWeight: 500 }}>
          در حال بارگذاری...
        </Typography>
      </Box>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Box
      sx={{
        direction: "rtl",
        fontFamily,
        p: { xs: 2, md: 4 },
        minHeight: "100vh",
        backgroundColor: palette.paper,
        color: palette.ink,
        "& *": { fontFamily },
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: "12px",
          mb: 4,
          backgroundColor: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRight: `4px solid ${palette.primary}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "10px",
              backgroundColor: palette.primarySoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Assignment sx={{ color: palette.primary, fontSize: 28 }} />
          </Box>

          <Box>
            <Typography
              sx={{ fontSize: { xs: 22, md: 25 }, fontWeight: 700, lineHeight: 1.3 }}
            >
              مدیریت مأموریت‌ها
            </Typography>
            <Typography sx={{ fontSize: 14, color: palette.inkMuted }}>
              {missions.length} مأموریت ثبت‌شده در سامانه
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          disableElevation
          startIcon={<Add />}
          onClick={() =>
            navigate(
              "/coordinator/create-mission"
            )
          }
          sx={{
            height: 46,
            borderRadius: "8px",
            px: 3,
            fontWeight: 600,
            fontSize: 14,
            textTransform: "none",
            backgroundColor: palette.primary,
            "&:hover": { backgroundColor: palette.primaryDark },
          }}
        >
          ایجاد مأموریت
        </Button>
      </Box>

      {/* =====================================================
          PENDING REPORTS
      ===================================================== */}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Description sx={{ color: palette.pending, fontSize: 26 }} />

        <Typography sx={{ fontSize: 19, fontWeight: 700 }}>
          گزارش‌های در انتظار بررسی
        </Typography>

        {reports.length > 0 && (
          <Box
            sx={{
              px: 1.25,
              py: 0.25,
              borderRadius: "6px",
              backgroundColor: palette.pendingBg,
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: palette.pending }}>
              {reports.length}
            </Typography>
          </Box>
        )}
      </Box>

      {reportsLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress size={28} sx={{ color: palette.primary }} />
        </Box>
      ) : groupedReports.length === 0 ? (
        <Alert
          severity="info"
          sx={{
            mb: 5,
            borderRadius: "10px",
            backgroundColor: palette.acceptedBg,
            color: palette.accepted,
            "& .MuiAlert-icon": { color: palette.accepted },
          }}
        >
          در حال حاضر گزارشی برای بررسی وجود ندارد.
        </Alert>
      ) : (
        <Box sx={{ mb: 6 }}>
          {groupedReports.map(
            (missionGroup) => (
              <Accordion
                key={missionGroup.mission_id}
                defaultExpanded={false}
                disableGutters
                elevation={0}
                sx={{
                  mb: 1.5,
                  borderRadius: "10px !important",
                  overflow: "hidden",
                  border: `1px solid ${palette.border}`,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    px: 2.5,
                    py: 0.5,
                    backgroundColor: palette.surface,
                    borderRight: `4px solid ${palette.pending}`,
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                        {missionGroup.mission_title}
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: palette.inkMuted }}>
                        مأموریت #{missionGroup.mission_id}
                      </Typography>
                    </Box>

                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: palette.pending }}>
                      {missionGroup.reports.length} گزارش
                    </Typography>
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 2.5, backgroundColor: palette.paper }}>
                  <Grid container spacing={2.5}>
                    {missionGroup.reports.map(
                      (report) => {
                        const reviewKey =
                          `${report.mission_id}-${report.user_id}`;

                        const isReviewing =
                          reviewing === reviewKey;

                        return (
                          <Grid item xs={12} md={6} lg={4} key={reviewKey}>
                            <Card
                              elevation={0}
                              sx={{
                                borderRadius: "10px",
                                border: `1px solid ${palette.border}`,
                                borderRight: `4px solid ${palette.pending}`,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor: palette.surface,
                              }}
                            >
                              <CardContent
                                sx={{
                                  p: 2.5,
                                  flex: 1,
                                  display: "flex",
                                  flexDirection: "column",
                                  "&:last-child": { pb: 2.5 },
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                  <Person sx={{ color: palette.inkMuted, fontSize: 20 }} />
                                  <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                                    {report.user_full_name}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 2 }}>
                                  <Phone sx={{ fontSize: 15, color: palette.inkMuted }} />
                                  <Typography sx={{ fontSize: 13, color: palette.inkMuted }}>
                                    {report.user_phone}
                                  </Typography>
                                </Box>

                                <Divider sx={{ mb: 2, borderColor: palette.border }} />

                                <Box sx={{ mb: 1.5 }}>
                                  <StatusBadge
                                    status={{
                                      label: "در انتظار بررسی",
                                      color: palette.pending,
                                      bg: palette.pendingBg,
                                    }}
                                  />
                                </Box>

                                <Typography sx={{ fontWeight: 700, fontSize: 13.5, mb: 1 }}>
                                  متن گزارش:
                                </Typography>

                                <Box
                                  sx={{
                                    p: 2,
                                    mb: 2,
                                    borderRadius: "8px",
                                    border: `1px solid ${palette.border}`,
                                    backgroundColor: palette.paper,
                                    minHeight: 100,
                                    flex: 1,
                                  }}
                                >
                                  <Typography
                                    sx={{ whiteSpace: "pre-wrap", lineHeight: 1.9, fontSize: 14 }}
                                  >
                                    {report.report}
                                  </Typography>
                                </Box>

                                {report.report_submitted_at && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                      mb: 2,
                                    }}
                                  >
                                    <AccessTime sx={{ fontSize: 14, color: palette.inkMuted }} />
                                    <Typography sx={{ color: palette.inkMuted, fontSize: 12 }}>
                                      زمان ارسال:{" "}
                                      {new Date(
                                        report.report_submitted_at
                                      ).toLocaleString("fa-IR")}
                                    </Typography>
                                  </Box>
                                )}

                                <Box sx={{ display: "flex", gap: 1.25, mt: "auto" }}>
                                  <Button
                                    fullWidth
                                    disableElevation
                                    variant="contained"
                                    startIcon={<CheckCircle />}
                                    disabled={isReviewing}
                                    onClick={() =>
                                      reviewReport(
                                        report.mission_id,
                                        report.user_id,
                                        true
                                      )
                                    }
                                    sx={{
                                      borderRadius: "8px",
                                      fontWeight: 600,
                                      fontSize: 13.5,
                                      textTransform: "none",
                                      backgroundColor: palette.approve,
                                      "&:hover": { backgroundColor: "#175E42" },
                                    }}
                                  >
                                    {isReviewing ? "در حال بررسی..." : "تأیید گزارش"}
                                  </Button>

                                  <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<Cancel />}
                                    disabled={isReviewing}
                                    onClick={() =>
                                      reviewReport(
                                        report.mission_id,
                                        report.user_id,
                                        false
                                      )
                                    }
                                    sx={{
                                      borderRadius: "8px",
                                      fontWeight: 600,
                                      fontSize: 13.5,
                                      textTransform: "none",
                                      color: palette.cancelled,
                                      borderColor: palette.cancelled,
                                      "&:hover": {
                                        borderColor: palette.cancelled,
                                        backgroundColor: palette.cancelledBg,
                                      },
                                    }}
                                  >
                                    رد گزارش
                                  </Button>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      }
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )
          )}
        </Box>
      )}

      {/* =====================================================
          MISSIONS
      ===================================================== */}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Assignment sx={{ color: palette.primary, fontSize: 26 }} />

        <Typography sx={{ fontSize: 19, fontWeight: 700 }}>
          مأموریت‌ها
        </Typography>

        {missions.length > 0 && (
          <Box
            sx={{
              px: 1.25,
              py: 0.25,
              borderRadius: "6px",
              backgroundColor: palette.primarySoft,
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: palette.primary }}>
              {missions.length}
            </Typography>
          </Box>
        )}
      </Box>

      {missions.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: "10px",
            border: `1px dashed ${palette.border}`,
            backgroundColor: palette.surface,
          }}
        >
          <Assignment sx={{ fontSize: 48, color: palette.border, mb: 2 }} />
          <Typography sx={{ color: palette.inkMuted, fontSize: 16, mb: 2.5 }}>
            هنوز مأموریتی ثبت نشده است.
          </Typography>
          <Button
            variant="contained"
            disableElevation
            startIcon={<Add />}
            onClick={() => navigate("/coordinator/create-mission")}
            sx={{
              borderRadius: "8px",
              px: 3,
              fontWeight: 600,
              textTransform: "none",
              backgroundColor: palette.primary,
              "&:hover": { backgroundColor: palette.primaryDark },
            }}
          >
            اولین مأموریت را ایجاد کنید
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {missions.map((mission) => {
            const status = getStatus(mission.status);

            const required = mission.required_volunteers || 1;
            const current = mission.volunteer_count || 0;
            const fillPct = Math.min(100, Math.round((current / required) * 100));
            const isDeleting = deletingMission === mission.id;

            return (
              <Grid item xs={12} md={6} lg={4} key={mission.id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "10px",
                    border: `1px solid ${palette.border}`,
                    borderRight: `4px solid ${status.color}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: palette.surface,
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      "&:last-child": { pb: 3 },
                    }}
                  >
                    {/* Header */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1.5,
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: 12.5, color: palette.inkMuted }}>
                          مأموریت #{mission.id}
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: 16, mt: 0.25 }}>
                          {mission.title || mission.disaster?.title || "مأموریت امدادی"}
                        </Typography>
                      </Box>

                      <StatusBadge status={status} />
                    </Box>

                    {/* Description */}
                    {mission.description && (
                      <Typography
                        sx={{
                          fontSize: 13.5,
                          color: palette.inkMuted,
                          mb: 2,
                          lineHeight: 1.8,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {mission.description}
                      </Typography>
                    )}

                    {/* Disaster */}
                    <Box sx={{ display: "flex", gap: 1, mb: 1.25, alignItems: "flex-start" }}>
                      <Warning sx={{ color: palette.cancelled, fontSize: 19, mt: 0.2 }} />
                      <Typography sx={{ fontSize: 14 }}>
                        <Box component="span" sx={{ fontWeight: 700 }}>
                          بحران:{" "}
                        </Box>
                        {mission.disaster?.title || "-"}
                      </Typography>
                    </Box>

                    {/* Location */}
                    <Box sx={{ display: "flex", gap: 1, mb: 2, alignItems: "flex-start" }}>
                      <LocationOn sx={{ color: palette.primary, fontSize: 19, mt: 0.2 }} />
                      <Typography sx={{ fontSize: 14 }}>
                        {mission.disaster?.city || "-"}
                        {" - "}
                        {mission.disaster?.location || "-"}
                      </Typography>
                    </Box>

                    {/* Volunteers */}
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 0.75,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Group sx={{ color: palette.inkMuted, fontSize: 19 }} />
                          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                            داوطلب‌ها
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: 13.5, color: palette.inkMuted }}>
                          {current} / {required} نفر
                        </Typography>
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={fillPct}
                        sx={{
                          height: 6,
                          borderRadius: "4px",
                          backgroundColor: palette.border,
                          "& .MuiLinearProgress-bar": {
                            backgroundColor:
                              fillPct >= 100 ? palette.approve : palette.primary,
                            borderRadius: "4px",
                          },
                        }}
                      />
                    </Box>

                    {/* Required Skills */}
                    {mission.required_skills && (
                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: 13.5, fontWeight: 700, mb: 0.5 }}>
                          مهارت‌های موردنیاز:
                        </Typography>
                        <Typography sx={{ fontSize: 13.5, color: palette.inkMuted }}>
                          {mission.required_skills}
                        </Typography>
                      </Box>
                    )}

                    {/* Volunteers list */}
                    {mission.volunteers && mission.volunteers.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: 13.5, fontWeight: 700, mb: 1 }}>
                          اعضای مأموریت:
                        </Typography>
                        {mission.volunteers.map((volunteer) => (
                          <Typography
                            key={volunteer.id}
                            sx={{ fontSize: 13.5, color: palette.inkMuted, mb: 0.5 }}
                          >
                            • {volunteer.full_name}
                          </Typography>
                        ))}
                      </Box>
                    )}

                    {/* Assigned */}
                    {mission.assigned_at && (
                      <Typography sx={{ color: palette.inkMuted, fontSize: 12.5, mb: 2 }}>
                        زمان تخصیص: {new Date(mission.assigned_at).toLocaleString("fa-IR")}
                      </Typography>
                    )}

                    {/* Edit / Delete */}
                    <Box sx={{ display: "flex", gap: 1.25, mt: "auto" }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Edit />}
                        disabled={isDeleting}
                        onClick={() => editMission(mission.id)}
                        sx={{
                          borderRadius: "8px",
                          fontWeight: 600,
                          fontSize: 13.5,
                          textTransform: "none",
                          color: palette.primary,
                          borderColor: palette.border,
                          "&:hover": {
                            borderColor: palette.primary,
                            backgroundColor: palette.primarySoft,
                          },
                        }}
                      >
                        ویرایش
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Delete />}
                        disabled={isDeleting}
                        onClick={() => deleteMission(mission.id)}
                        sx={{
                          borderRadius: "8px",
                          fontWeight: 600,
                          fontSize: 13.5,
                          textTransform: "none",
                          color: palette.cancelled,
                          borderColor: palette.border,
                          "&:hover": {
                            borderColor: palette.cancelled,
                            backgroundColor: palette.cancelledBg,
                          },
                        }}
                      >
                        {isDeleting ? "در حال حذف..." : "حذف"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
