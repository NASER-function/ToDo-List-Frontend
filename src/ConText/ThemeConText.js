import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { createContext, useState } from "react";

export const ThemeContext = createContext();

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3e4ce1" },
    secondary: { main: "#E5D9F2" },
    sec: { main: "#B3FFAE" },
    Text: { main: "#090040" },
    Botton: { main: "#3e4ce1" },
    warning: { main: "#f70707" },
    // third: { main: "" },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#3c6f99" },
    secondary: { main: "#f48fb1" },
    sec: { main: "#347433" },
    Text: { main: "#FBF8EF" },
    Botton: { main: "#1c2477" },
    warning: { main: "#a50a0a" },

    // third: { main: "" },
  },
});

export const ThemeContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ darkMode, handleToggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
