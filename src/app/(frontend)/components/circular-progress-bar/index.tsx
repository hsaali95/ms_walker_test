import * as React from "react";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// Define a reusable component for CircularProgress with a dynamic label
interface CircularProgressWithLabelProps extends CircularProgressProps {
  value: number;
  label?: string | number; // Optional label property for custom text or number
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = ({
  value,
  label = `${Math.round(value)}%`,
  ...props
}) => {
  return (
    <Box
      className="paren"
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
        backdropFilter: "blur(10px)", // Blur effect
        display: "flex", // Flexbox for centering child elements
        alignItems: "center",
        justifyContent: "center", // Center content vertically and horizontally
        zIndex: 1000, // Ensure it's above other elements
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "inline-flex",

            "& .MuiCircularProgress-root": {
              color: "#4F131F",
            },
          }}
        >
          <CircularProgress
            variant="determinate"
            value={value}
            color="info"
            size={"80px"}
            {...props}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              sx={{ color: "#ffff", fontWeight: 700, fontSize: "1rem" }}
            >
              {label}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CircularProgressWithLabel;
