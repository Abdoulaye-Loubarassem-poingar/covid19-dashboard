import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Switch,
  Box
} from "@mui/material";

import ShowChartIcon from "@mui/icons-material/ShowChart";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const Navbar = ({ mode, setMode }) => {
  const location = useLocation();

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" elevation={3}>
      <Toolbar>
        <Button
        component={RouterLink}
        to="/"
        startIcon={<HomeIcon />}
        color={location.pathname === "/" ? "secondary" : "inherit"}
        >
        Accueil
        </Button> 
      
        {/* Titre */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          COVID-19 Dashboard
        </Typography>

        {/* Liens */}
        <Button
          component={RouterLink}
          to="/evolution"
          color={isActive("/evolution") ? "secondary" : "inherit"}
          startIcon={<ShowChartIcon />}
        >
          Évolution
        </Button>

        <Button
          component={RouterLink}
          to="/comparaison"
          color={isActive("/comparaison") ? "secondary" : "inherit"}
          startIcon={<CompareArrowsIcon />}
          sx={{ ml: 1 }}
        >
          Comparaison
        </Button>

        {/* Switch thème */}
        <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
          {mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
          <Switch
            checked={mode === "dark"}
            onChange={toggleTheme}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
