"use client";

import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export type ThemeMode = PaletteMode;

export function createAppTheme(mode: ThemeMode = "light") {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      background: {
        default: isDark ? "#020617" : "#fafafa",
        paper: isDark ? "#020617" : "#ffffff",
      },
      primary: {
        main: "#4c6ef5",
      },
      text: {
        primary: isDark ? "#e5e7eb" : "#111827",
        secondary: isDark ? "#9ca3af" : "#6b7280",
      },
      divider: isDark ? "rgba(148, 163, 184, 0.35)" : "rgba(15, 23, 42, 0.08)",
    },
    typography: {
      fontFamily: "'Inter', 'Roboto', sans-serif",
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 6,
          },
        },
      },
    },
  });
}

