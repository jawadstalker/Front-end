import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./index.css";
import App from "./App.jsx";

const theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    background: {
      default: "#F7FAF9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
      disabled: "#94A3B8",
    },
    divider: "#E2E8F0",
    primary: {
      main: "#0E9384",
      light: "#3CB5A6",
      dark: "#0A6F64",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F59E0B",
      light: "#FBBF24",
      dark: "#D97706",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#10B981",
      light: "#D1FAE5",
      dark: "#059669",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#F59E0B",
      light: "#FEF3C7",
      dark: "#D97706",
      contrastText: "#1F2937",
    },
    error: {
      main: "#EF4444",
      light: "#FEE2E2",
      dark: "#DC2626",
      contrastText: "#FFFFFF",
    },
    info: {
      main: "#3B82F6",
      light: "#DBEAFE",
      dark: "#2563EB",
      contrastText: "#FFFFFF",
    },
    grey: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Vazirmatn", "Estedad", "Segoe UI", sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600 },
    overline: { fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F7FAF9",
          fontFamily: '"Vazirmatn", "Estedad", "Segoe UI", sans-serif',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderColor: "#E2E8F0",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10,
        },
        containedPrimary: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(14, 147, 132, 0.25)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1E293B",
          borderRadius: 8,
          fontSize: 12,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          border: "1px solid #E2E8F0",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);