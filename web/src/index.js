import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/courier-prime/400.css";
import "@fontsource/courier-prime/700.css";
import "@fontsource/special-elite/400.css";
import "./assets/css/index.css";


const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#305cde" },
    secondary: { main: "#1976d2" },
    background: { default: "#f9f9f7", paper: "#ffffff" },
  },
  typography: {
    fontFamily: ['"Courier Prime", monospace'],
    h1: { fontFamily: '"Special Elite", monospace' },
    h2: { fontFamily: '"Special Elite", monospace' },
    h3: { fontFamily: '"Special Elite", monospace' },
    h5: { fontFamily: '"Special Elite", monospace' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        a: {
          color: theme.palette.primary.main,
          textDecoration: 'none',
        },
        button: {
          '&:hover:not(:disabled)': {
            opacity: 0.8,
          },
        }
      }),
    },
  },
});


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
