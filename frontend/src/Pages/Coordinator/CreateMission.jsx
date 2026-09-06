import React, { useEffect, useState } from "react";

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
} from "@mui/material";

import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateMission() {
  const [disasters, setDisasters] = useState([]);

  const [disasterId, setDisasterId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("medium");
  const [requiredVolunteers, setRequiredVolunteers] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    loadDisasters();
  }, []);

  const loadDisasters = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/disasters/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDisasters(response.data);
    } catch (error) {
      toast.error("خطا در دریافت بحران‌ها");
    }
  };

  const createMission = async () => {
    if (!disasterId || !title) {
      toast.error("عنوان و بحران الزامی هستند");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/missions/",
        {
          disaster_id: disasterId,
          title,
          description,
          location,
          priority,
          required_volunteers: Number(requiredVolunteers),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("ماموریت با موفقیت ایجاد شد");

      navigate("/coordinator/missions");
    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.detail ||
          "خطا در ایجاد ماموریت"
      );
    }
  };

  return (
    <Box sx={{ direction: "rtl", p: 3 }}>
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
          ایجاد مأموریت جدید
        </Typography>

        <TextField
          fullWidth
          label="عنوان مأموریت"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          label="توضیحات مأموریت"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="محل مأموریت"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>بحران</InputLabel>

          <Select
            value={disasterId}
            label="بحران"
            onChange={(e) =>
              setDisasterId(e.target.value)
            }
          >
            {disasters.map((item) => (
              <MenuItem
                key={item.id}
                value={item.id}
              >
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>اولویت</InputLabel>

          <Select
            value={priority}
            label="اولویت"
            onChange={(e) =>
              setPriority(e.target.value)
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
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="number"
          label="تعداد داوطلب مورد نیاز"
          value={requiredVolunteers}
          onChange={(e) =>
            setRequiredVolunteers(e.target.value)
          }
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={createMission}
        >
          ثبت مأموریت
        </Button>
      </Paper>
    </Box>
  );
}