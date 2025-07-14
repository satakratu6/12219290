import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import ShortenerPage from "./pages/ShortenerPage";
import RedirectPage from "./pages/RedirectPage";
import StatsPage from "./pages/StatsPage";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzYXRha3JhdHUubWFkaHVAZ21haWwuY29tIiwiZXhwIjoxNzUyNDcwMzM3LCJpYXQiOjE3NTI0Njk0MzcsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIyZjNlMzFiYi1iMDM2LTRmMTktODIyOS01MzY2OTE5ZTg5MWQiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJzYXRha3JhdHUgY2hha3JhYm9ydHkiLCJzdWIiOiI2NjdiMzFlMi0wZWU2LTRjNDctYmFhNC03MWYxNGU4MTM1YWEifSwiZW1haWwiOiJzYXRha3JhdHUubWFkaHVAZ21haWwuY29tIiwibmFtZSI6InNhdGFrcmF0dSBjaGFrcmFib3J0eSIsInJvbGxObyI6IjEyMjE5MjkwIiwiYWNjZXNzQ29kZSI6IkNaeXBRSyIsImNsaWVudElEIjoiNjY3YjMxZTItMGVlNi00YzQ3LWJhYTQtNzFmMTRlODEzNWFhIiwiY2xpZW50U2VjcmV0IjoiQ1dUWGJ0TWd0dFZUU1lQeSJ9.ng1zpVRi883Y8_qmIvP4hddcGyevW6eh3XWywpEEeGg";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#00bcd4",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
});

function Navigation() {
  const location = useLocation();
  return (
    <AppBar position="sticky" color="primary" elevation={3}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Afford URL Shortener
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/"
          sx={{
            fontWeight: location.pathname === "/" ? 700 : 400,
            borderBottom: location.pathname === "/" ? "2px solid #fff" : "none",
          }}
        >
          Shorten
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/stats"
          sx={{
            fontWeight: location.pathname === "/stats" ? 700 : 400,
            borderBottom:
              location.pathname === "/stats" ? "2px solid #fff" : "none",
          }}
        >
          Stats
        </Button>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: 'background.default' }}>
        <Router>
          <Navigation />
          <Container maxWidth={false} disableGutters sx={{ py: { xs: 1, md: 4 }, width: '100%' }}>
            <Routes>
            <Route path="/" element={<ShortenerPage token={token} />} />
            <Route path="/stats" element={<StatsPage token={token} />} />
            <Route path="/:code" element={<RedirectPage token={token} />} />
          </Routes>
        </Container>
      </Router>
    </Box>
    </ThemeProvider>
  );
}

export default App;
