import React, { useState } from "react";
import { Box, Button, CircularProgress, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { ArrowBackRounded, BadgeRounded, CheckCircleRounded, LockRounded, PersonAddRounded, PersonRounded, PhoneIphoneRounded, SecurityRounded, VisibilityOffRounded, VisibilityRounded, VolunteerActivismRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { toast } from "react-hot-toast";

const colors = { primary: "#2563EB", primaryDark: "#1D4ED8", cyan: "#06B6D4", purple: "#7C3AED", text: "#172033", muted: "#667085", border: "#E5E7EB" };
const features = [
  { icon: <VolunteerActivismRounded />, title: "مدیریت داوطلبان", text: "مدیریت اطلاعات و فعالیت‌های داوطلبان" },
  { icon: <BadgeRounded />, title: "مدیریت مأموریت‌ها", text: "دسترسی سریع به مأموریت‌ها و عملیات" },
  { icon: <SecurityRounded />, title: "امنیت و دسترسی", text: "محیط امن برای اطلاعات و کاربران" },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", phone: "", password: "", confirm_password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  const handleRegister = async () => {
    if (!form.full_name.trim() || !form.phone.trim() || !form.password || !form.confirm_password) return toast.error("لطفاً همه فیلدها را کامل کنید");
    if (form.password !== form.confirm_password) return toast.error("رمز عبور و تکرار آن یکسان نیست");
    try {
      setLoading(true);
      await api.post("/users/register", { full_name: form.full_name, phone: form.phone, password: form.password });
      toast.success("ثبت نام با موفقیت انجام شد");
      navigate("/login");
    } catch (error) { toast.error(error.response?.data?.detail || "خطا در ثبت نام"); }
    finally { setLoading(false); }
  };
  const passwordMismatch = form.confirm_password.length > 0 && form.password !== form.confirm_password;
  const passwordMatched = form.confirm_password.length > 0 && form.password === form.confirm_password;
  const fieldSx = {
    mb: 1.6,
    "& .MuiOutlinedInput-root": { minHeight: 56, borderRadius: 3, backgroundColor: "#F8FAFC", color: colors.text, transition: "all .2s ease", "& fieldset": { borderColor: colors.border }, "&:hover": { backgroundColor: "#F1F5F9" }, "&:hover fieldset": { borderColor: "#BFDBFE" }, "&.Mui-focused": { backgroundColor: "#fff", boxShadow: "0 0 0 4px rgba(37,99,235,.08)" }, "&.Mui-focused fieldset": { borderColor: colors.primary, borderWidth: 1.5 } },
    "& .MuiInputLabel-root": { right: 14, left: "auto", color: "#667085", transformOrigin: "top right", "&.Mui-focused": { color: colors.primary } },
    "& .MuiInputBase-input": { padding: "0 8px", textAlign: "right", direction: "rtl", color: colors.text, "&::placeholder": { color: "#98A2B3", opacity: 1 } },
    "& .MuiInputAdornment-root": { color: colors.primary },
  };
  return (
    <Box dir="rtl" onKeyDown={(e) => e.key === "Enter" && !loading && handleRegister()} sx={{ minHeight: "100dvh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 1.5, sm: 3 }, overflow: "auto", position: "relative", background: "linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 48%, #ECFEFF 100%)" }}>
      <Box sx={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", top: -230, right: -130, background: "radial-gradient(circle, rgba(37,99,235,.16), transparent 68%)" }} />
      <Box sx={{ position: "absolute", width: 460, height: 460, borderRadius: "50%", bottom: -280, left: -170, background: "radial-gradient(circle, rgba(124,58,237,.13), transparent 68%)" }} />
      <Box sx={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1120, display: { xs: "block", md: "grid" }, gridTemplateColumns: "1fr 1fr", minHeight: { md: 680 }, overflow: "hidden", borderRadius: { xs: 4, md: 5 }, border: "1px solid rgba(255,255,255,.9)", background: "#fff", boxShadow: "0 30px 80px rgba(30,41,59,.14)" }}>
        <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", justifyContent: "space-between", p: { md: 5, lg: 6 }, background: "linear-gradient(145deg, #EFF6FF 0%, #EEF2FF 52%, #ECFEFF 100%)", borderLeft: "1px solid #E5E7EB" }}>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center"><Box sx={{ width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2.7, color: "#fff", background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`, boxShadow: "0 12px 25px rgba(37,99,235,.22)" }}><VolunteerActivismRounded sx={{ fontSize: 28 }} /></Box><Box><Typography sx={{ color: colors.text, fontSize: 19, fontWeight: 900 }}>سامانه امداد</Typography><Typography sx={{ color: "#64748B", fontSize: 8.5, fontWeight: 800, letterSpacing: 1.1, mt: .4 }}>VOLUNTEER MANAGEMENT PLATFORM</Typography></Box></Stack>
            <Box sx={{ mt: 7 }}><Box sx={{ display: "inline-flex", alignItems: "center", gap: .8, px: 1.4, py: .7, borderRadius: 10, color: colors.primary, background: "#DBEAFE", border: "1px solid #BFDBFE" }}><PersonAddRounded sx={{ fontSize: 17 }} /><Typography sx={{ fontSize: 11, fontWeight: 800 }}>شروع همکاری</Typography></Box><Typography sx={{ mt: 2.2, color: colors.text, fontSize: { md: 35, lg: 42 }, fontWeight: 900, lineHeight: 1.35 }}>به سامانه<br /><Box component="span" sx={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>امداد بپیوندید</Box></Typography><Typography sx={{ mt: 2.2, maxWidth: 410, color: colors.muted, fontSize: 13, lineHeight: 2 }}>حساب کاربری خود را ایجاد کنید و به مجموعه‌ای یکپارچه برای مدیریت داوطلبان، مأموریت‌ها و فعالیت‌های امدادی دسترسی داشته باشید.</Typography></Box>
            <Stack spacing={1.3} sx={{ mt: 4 }}>{features.map((item) => <Box key={item.title} sx={{ display: "flex", alignItems: "center", gap: 1.7, p: 1.4, borderRadius: 3, background: "rgba(255,255,255,.72)", border: "1px solid rgba(148,163,184,.18)", transition: "all .2s ease", "&:hover": { transform: "translateX(-3px)", boxShadow: "0 8px 24px rgba(37,99,235,.08)" } }}><Box sx={{ width: 40, height: 40, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2.2, background: "#DBEAFE", color: colors.primary }}>{React.cloneElement(item.icon, { sx: { fontSize: 20 } })}</Box><Box><Typography sx={{ color: colors.text, fontSize: 12, fontWeight: 800 }}>{item.title}</Typography><Typography sx={{ color: colors.muted, fontSize: 10, mt: .35 }}>{item.text}</Typography></Box></Box>)}</Stack>
          </Box><Typography sx={{ color: "#94A3B8", fontSize: 9.5 }}>سامانه مدیریت و هماهنگی نیروهای امدادی</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", px: { xs: 2.5, sm: 5, md: 6, lg: 7 }, py: { xs: 4, sm: 5 }, background: "#fff" }}>
          <Box sx={{ width: "100%", maxWidth: 430 }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.2} sx={{ display: { xs: "flex", md: "none" }, mb: 3 }}><Box sx={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2.3, color: "#fff", background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})` }}><VolunteerActivismRounded /></Box><Typography sx={{ color: colors.text, fontSize: 19, fontWeight: 900 }}>سامانه امداد</Typography></Stack>
            <Box sx={{ mb: 2.7 }}><Box sx={{ width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2.8, color: colors.primary, background: "#EFF6FF", border: "1px solid #DBEAFE", mb: 2 }}><PersonAddRounded sx={{ fontSize: 27 }} /></Box><Typography sx={{ color: colors.text, fontSize: { xs: 25, sm: 29 }, fontWeight: 900 }}>ایجاد حساب کاربری</Typography><Typography sx={{ color: colors.muted, fontSize: 12.5, lineHeight: 1.9, mt: .8 }}>اطلاعات خود را وارد کنید تا حساب شما در سامانه امداد ایجاد شود.</Typography></Box>
            <Stack spacing={0}>
              <TextField fullWidth label="نام و نام خانوادگی" name="full_name" value={form.full_name} onChange={handleChange} autoComplete="name" sx={fieldSx} InputProps={{ startAdornment: <InputAdornment position="start"><PersonRounded /></InputAdornment> }} />
              <TextField fullWidth label="شماره موبایل" name="phone" value={form.phone} onChange={handleChange} autoComplete="tel" inputMode="tel" sx={fieldSx} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIphoneRounded /></InputAdornment> }} />
              <TextField fullWidth label="رمز عبور" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} autoComplete="new-password" sx={fieldSx} InputProps={{ startAdornment: <InputAdornment position="start"><LockRounded /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword((v) => !v)} sx={{ color: "#98A2B3", "&:hover": { color: colors.primary, background: "#EFF6FF" } }}>{showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}</IconButton></InputAdornment> }} />
              <TextField fullWidth label="تکرار رمز عبور" name="confirm_password" type={showConfirmPassword ? "text" : "password"} value={form.confirm_password} onChange={handleChange} autoComplete="new-password" error={passwordMismatch} helperText={passwordMismatch ? "رمز عبور یکسان نیست" : " "} sx={{ ...fieldSx, "& .MuiFormHelperText-root": { textAlign: "right", color: passwordMismatch ? "#DC2626" : "transparent", marginRight: 1 } }} InputProps={{ startAdornment: <InputAdornment position="start"><CheckCircleRounded sx={{ color: passwordMatched ? "#16A34A" : colors.primary }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword((v) => !v)} sx={{ color: "#98A2B3", "&:hover": { color: colors.primary, background: "#EFF6FF" } }}>{showConfirmPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}</IconButton></InputAdornment> }} />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={.8} sx={{ mt: -.4, mb: 1.5 }}><SecurityRounded sx={{ fontSize: 15, color: "#64748B" }} /><Typography sx={{ color: "#667085", fontSize: 10.5 }}>برای امنیت بیشتر از رمز عبور قوی استفاده کنید.</Typography></Stack>
            <Button fullWidth variant="contained" disabled={loading} onClick={handleRegister} startIcon={loading ? <CircularProgress size={19} color="inherit" /> : <PersonAddRounded />} sx={{ height: 55, borderRadius: 2.7, fontSize: 13.5, fontWeight: 900, textTransform: "none", background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`, boxShadow: "0 12px 28px rgba(37,99,235,.20)", "&:hover": { background: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.cyan})`, transform: "translateY(-1px)" }, "&:disabled": { background: "#BFDBFE", color: "#fff" } }}>{loading ? "در حال ایجاد حساب..." : "ایجاد حساب کاربری"}</Button>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, my: 2.4 }}><Divider sx={{ flex: 1, borderColor: colors.border }} /><Typography sx={{ color: "#98A2B3", fontSize: 10.5, whiteSpace: "nowrap" }}>قبلاً حساب دارید؟</Typography><Divider sx={{ flex: 1, borderColor: colors.border }} /></Box>
            <Button fullWidth variant="outlined" onClick={() => navigate("/login")} endIcon={<ArrowBackRounded />} sx={{ height: 50, borderRadius: 2.7, color: colors.primary, borderColor: "#BFDBFE", background: "#fff", fontSize: 12.5, fontWeight: 800, textTransform: "none", "&:hover": { borderColor: colors.primary, background: "#EFF6FF" } }}>ورود به حساب کاربری</Button>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={.7} sx={{ mt: 2 }}><SecurityRounded sx={{ fontSize: 14, color: "#98A2B3" }} /><Typography sx={{ color: "#98A2B3", fontSize: 9.5 }}>اطلاعات شما در محیطی امن نگهداری می‌شود</Typography></Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
