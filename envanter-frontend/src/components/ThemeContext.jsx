import React, { createContext, useContext, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { GlobalStyles } from "@mui/material";

const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true); // Varsayılan dark

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      ...(darkMode
        ? {
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
            text: {
              primary: "#ffffff",
              secondary: "#b3b3b3",
            },
          }
        : {
            background: {
              default: "#f5f5f5",
              paper: "#ffffff",
            },
            text: {
              primary: "#000000",
              secondary: "#333333",
            },
          }),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: (theme) => ({
          html: {
            height: "100%",
            transition: "background-color 0.6s ease, color 0.6s ease",
          },
          body: {
            minHeight: "100%",
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.default,
            transition: "background-color 0.6s ease, color 0.6s ease",
          },
          "#root": {
            height: "100%",
            transition: "background-color 0.6s ease, color 0.6s ease",
          },
          ".MuiGrid-root, .MuiPaper-root, .MuiCard-root, .MuiBox-root": {
            transition: "background-color 0.6s ease, color 0.6s ease",
          },
        }),
      },
      MuiGrid: {
        styleOverrides: {
          root: {
            transition: "background-color 0.6s ease, color 0.6s ease",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: "background-color 0.6s ease, color 0.6s ease",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            transition: "background-color 0.6s ease, color 0.6s ease",
          },
        },
      },
      MuiBox: {
        styleOverrides: {
          root: {
            transition: "background-color 0.6s ease, color 0.6s ease",
          },
        },
      },
    },
  });

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            ":root": {
              colorScheme: darkMode ? "light dark" : "light",
            },
            // DataGrid başlık, iç satır ve hücreler için animasyon
            ".MuiDataGrid-columnHeaders, .MuiDataGrid-footerContainer, .MuiTableHead-root, .MuiTableRow-root, .MuiDataGrid-columnHeadersInner, .MuiDataGrid-columnHeader, .MuiDataGrid-cell, .MuiTableCell-root":
              {
                transition: "background-color 0.6s ease, color 0.6s ease",
              },
          }}
        />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
