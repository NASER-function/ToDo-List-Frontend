import React, { useContext, useEffect, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
// Theme
import { ThemeContext } from "./ConText/ThemeConText";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import IconButton from "@mui/material/IconButton";


// PlaySound function


const CustomProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 10,
  border: "5px solid green ",
}));

export default function TopSaid({ arrayCount, isDone }) {
  // Theme
  const { handleToggle, mode } = useContext(ThemeContext);

  // Progress Bar
  const count = isDone;
  const total = arrayCount;
  const progress = total === 0 ? 0 : (count / total) * 100;

 
  // Time
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000); // Update time every minute

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  // 12-hour format
  let hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, "0");
  hours = hours % 12; // Convert 13+ hours to 1-12
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  return (
    <Grid container spacing={1} className="ConGrid">
      <Grid display={{ sm: "none", md: "block", xs: "none" }} size={1}>
        <Box className="time">
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {`${hours}:${minutes}`}
          </div>
        </Box>
      </Grid>
      {/* ============== Time ========== */}
      {/* Progress Bar */}
      <Grid sx={{}} size={{ lg: 10, md: 10, sm: 11, xs: 11 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "100%", position: "relative" }}>
            <CustomProgress
              sx={{
                backgroundColor: "theme.palette.text.primary",
                border: "5px solid white",
                height: "35px",
                marginTop: "11px",
              }}
              variant="determinate"
              value={progress}
            />
            <Typography
              variant="body2"
              color="white"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontWeight: "bold",
                marginTop: "6px",
                fontSize: "25px",
              }}
            >
              {`${count}/${total}`}
            </Typography>
          </Box>
        </Box>
      </Grid>
      {/* ======= Progress Bar ======= */}
      <Grid
        variant="contained"
        sx={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: "9px",
          display: "flex",
        }}
        size={1}
      >
        <IconButton onClick={handleToggle} color="inherit">
          {mode === "dark" ? (
            <LightModeIcon sx={{ fontSize: "30px" }} />
          ) : (
            <DarkModeIcon sx={{ fontSize: "30px" }} />
          )}
        </IconButton>
      </Grid>
    </Grid>
  );
}
