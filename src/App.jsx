import { 
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useMemo, useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container
} from "@mui/material";

import Navbar from "./components/Navbar";
import Accueil from "./pages/Accueil";
import Evolution from "./pages/Evolution";
import Comparaison from "./pages/Comparaison";

function App() {
  const [mode, setMode] = useState("dark");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#90caf9"
          },
          background: {
            default: mode === "dark" ? "#121212" : "#f5f5f5",
            paper: mode === "dark" ? "#1e1e1e" : "#ffffff"
          }
        },
        typography: {
          fontFamily: "Roboto, Arial, sans-serif"
        }
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar mode={mode} setMode={setMode} />
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/evolution" element={<Evolution />} />
            <Route path="/comparaison" element={<Comparaison />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
