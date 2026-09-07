// src/theme/colors.s
export const colors = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  cyan: "#06B6D4",
  purple: "#7C3AED",
  text: "#172033",
  muted: "#667085",
  border: "#E5E7EB",
  surface: "#FFFFFF",
  bg: "#F8FAFC",
  danger: "#DC2626",
  dangerBg: "#FEF2F2",
};

export const gradient = `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`;

export const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    backgroundColor: "#F8FAFC",
    transition: "all .2s ease",
    "& fieldset": { borderColor: colors.border },
    "&:hover": { backgroundColor: "#F1F5F9" },
    "&:hover fieldset": { borderColor: "#BFDBFE" },
    "&.Mui-focused": { backgroundColor: "#FFFFFF", boxShadow: "0 0 0 3px rgba(37,99,235,.08)" },
    "&.Mui-focused fieldset": { borderColor: colors.primary, borderWidth: 1.5 },
  },
  "& .MuiInputLabel-root": {
    right: 14,
    left: "auto",
    color: colors.muted,
    transformOrigin: "top right",
    "&.Mui-focused": { color: colors.primary },
  },
  "& .MuiInputLabel-shrink": { transformOrigin: "top right" },
  "& .MuiInputBase-input": { textAlign: "right", color: colors.text },
  "& .MuiFormHelperText-root": { textAlign: "right", marginRight: 0, color: colors.muted },
};