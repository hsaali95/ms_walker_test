import { Button, CircularProgress } from "@mui/material";
import React from "react";

type CustomButtonProps = {
  // buttonStyles?: React.CSSProperties;
  buttonStyles?: any;
  title?: string;
  fullWidth?: boolean;
  onClick?: (e: React.SyntheticEvent) => void;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  startIcon?: React.ReactNode;
  disabled?: boolean;
  variant?: "text" | "outlined" | "contained";
};

const CustomButton: React.FC<CustomButtonProps> = ({
  buttonStyles,
  title,
  fullWidth = true,
  onClick,
  type = "submit",
  loading,
  startIcon,
  disabled,
  variant = "contained",
}) => {
  return (
    <Button
      startIcon={startIcon}
      variant={variant}
      type={type}
      fullWidth={fullWidth}
      disabled={loading || disabled}
      className="customButton"
      sx={{
        borderRadius: "30px",
        boxShadow: "none",
        textTransform: "none",
        minWidth: "100px",
        fontWeight: 600,
        "&:hover": {
          boxShadow: "none", // Fixed hover selector
        },
        px: { xs: 2, sm: 2, lg: 4 },
        py: { xs: 1.5, sm: 1 },
        position: "unset",
        background: variant === "outlined" ? "" : "#4F131F",
        borderColor: variant === "outlined" ? "#4F131F" : "",
        color: variant === "outlined" ? "#4F131F" : "#fff",
        ...buttonStyles,
        "& .MuiTouchRipple-root": {
          display: "none",
        },
      }}
      onClick={onClick}
    >
      {loading ? (
        <CircularProgress size={20} sx={{ color: "#235E39" }} />
      ) : (
        title
      )}
    </Button>
  );
};

export default CustomButton;
