import React, {
  useEffect,
  useState,
} from "react";

import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../api/axios";
import toast from "react-hot-toast";

export default function EditMission() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] =
    useState("medium");
  const [requiredVolunteers, setRequiredVolunteers] =
    useState(1);

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
  // LOAD MISSION
  // =========================================================

  useEffect(() => {
    if (!id) {
      toast.error(
        "شناسه مأموریت پیدا نشد"
      );

      navigate("/coordinator/missions");
      return;
    }

    loadMission();
  }, [id]);

  const loadMission = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/missions/${id}`,
        getAuthConfig()
      );

      const mission = response.data;

      setTitle(mission.title || "");

      setDescription(
        mission.description || ""
      );

      setLocation(
        mission.location || ""
      );

      setPriority(
        mission.priority || "medium"
      );

      setRequiredVolunteers(
        mission.required_volunteers || 1
      );
    } catch (error) {
      console.error(
        "Load Mission Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.detail ||
          "خطا در دریافت اطلاعات مأموریت"
      );

      navigate("/coordinator/missions");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UPDATE MISSION
  // =========================================================

  const updateMission = async () => {
    if (!title.trim()) {
      toast.error(
        "عنوان مأموریت الزامی است"
      );
      return;
    }

    if (
      !requiredVolunteers ||
      Number(requiredVolunteers) < 1
    ) {
      toast.error(
        "تعداد داوطلب باید حداقل ۱ نفر باشد"
      );
      return;
    }

    try {
      setSaving(true);

      await api.put(
        `/missions/${id}`,
        {
          title: title.trim(),

          description:
            description.trim(),

          location:
            location.trim(),

          priority,

          required_volunteers:
            Number(requiredVolunteers),
        },
        getAuthConfig()
      );

      toast.success(
        "مأموریت با موفقیت ویرایش شد"
      );

      navigate(
        "/coordinator/missions"
      );
    } catch (error) {
      console.error(
        "Update Mission Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.detail ||
          "خطا در ویرایش مأموریت"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <Box
        sx={{
          direction: "rtl",
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
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
        p: 3,
      }}
    >
      <Paper
        sx={{
          p: 4,
          maxWidth: 700,
          mx: "auto",
          borderRadius: 4,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
        >
          ویرایش مأموریت
        </Typography>

        <TextField
          fullWidth
          label="عنوان مأموریت"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          label="توضیحات مأموریت"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="محل مأموریت"
          value={location}
          onChange={(e) =>
            setLocation(
              e.target.value
            )
          }
          sx={{ mb: 2 }}
        />

        <FormControl
          fullWidth
          sx={{ mb: 2 }}
        >
          <InputLabel>
            اولویت
          </InputLabel>

          <Select
            value={priority}
            label="اولویت"
            onChange={(e) =>
              setPriority(
                e.target.value
              )
            }
          >
            <MenuItem value="low">
              کم
            </MenuItem>

            <MenuItem value="medium">
              متوسط
            </MenuItem>

            <MenuItem value="high">
              زیاد
            </MenuItem>

            <MenuItem value="critical">
              بحرانی
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="number"
          inputProps={{
            min: 1,
          }}
          label="تعداد داوطلب مورد نیاز"
          value={requiredVolunteers}
          onChange={(e) =>
            setRequiredVolunteers(
              e.target.value
            )
          }
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={updateMission}
          disabled={saving}
        >
          {saving
            ? "در حال ذخیره..."
            : "ذخیره تغییرات"}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 1 }}
          onClick={() =>
            navigate(
              "/coordinator/missions"
            )
          }
          disabled={saving}
        >
          انصراف
        </Button>
      </Paper>
    </Box>
  );
}