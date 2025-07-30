import React, { createContext, useContext, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ColorModeContext = createContext();

export function useColorMode() {
  return useContext(ColorModeContext);
}

// Tema Değiştirme Butonu
export function ThemeToggleButton() {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <Tooltip title={mode === "dark" ? "Açık Tema" : "Koyu Tema"}>
      <IconButton onClick={toggleColorMode} color="inherit">
        {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
}

export default function CustomThemeProvider({ children }) {
  const [mode, setMode] = useState(
    localStorage.getItem("colorMode") || "light"
  );

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const next = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("colorMode", next);
          return next;
        });
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(() => {
    const baseTheme = createTheme({
      palette: {
        mode,
        ...(mode === "dark"
          ? {
              background: {
                default: "#151e14ff",
                paper: "#485fabc3",
              },
              primary: { main: "#640e93ff" },
              secondary: { main: "#1fb07eff" },
              text: { primary: "#ffffffff", secondary: "#000000ff" },
            }
          : {
              background: {
                default: "#a4adafff", // Daha yumuşak açık tema
                paper: "#272626ff",
              },
              primary: { main: "#8fbbe3ff" },
              secondary: { main: "#6baee8" },
              text: { primary: "#ffffffff", secondary: "#418acb" },
            }),
      },
    });

    // custom alanları dışarıdan ekliyoruz
    baseTheme.custom = {
      sidebar: mode === "dark" ? "#03071eff" : "#912a2ad0",
      tablerRow: mode === "dark" ? "#ff0059ff" : "#834fcdff",
      tableRowHover: mode === "dark" ? "#2acb1eff" : "#cde0f7",
      tableHeader: mode === "dark" ? "#3944bcff" : "#a6c6e7",
      buttonSucces: mode === "dark" ? "#1a753153" : "#1976d2",
      buttonSuccesHover: mode === "dark" ? "#19a656ff" : "#1565c0", // ← yeni eklendi
      buttonAlert: mode === "dark" ? "#8a2449ff" : "#81c784",
      ButtonAlertHover: mode === "dark" ? "#b51e50ff" : "#e57373",
      cardBackground: mode === "dark" ? "#9c546cff" : "#e57373",
      textMuted: mode === "dark" ? "#ffffffff" : "#ffffffff",
    };

    return baseTheme;
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
