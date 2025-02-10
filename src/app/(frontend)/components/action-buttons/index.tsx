import React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { SxProps } from "@mui/system";

interface CustomButtonProps {
  onClick: () => void; // Standard onClick handler
  icon?: React.ReactNode; // For IconButton usage
  label?: string; // For Button usage
  sx?: SxProps; // Optional custom styles
  variant?: "text" | "outlined" | "contained"; // Button variant
  isIconButton?: boolean; // Determines if it should be an IconButton
}

const ActionButton: React.FC<CustomButtonProps> = ({
  onClick,
  icon,
  label,
  sx,
  variant = "contained",
  isIconButton = false,
}) => {
  if (isIconButton) {
    return (
      <IconButton sx={{ py: 0, ...sx }} onClick={onClick}>
        {icon}
      </IconButton>
    );
  }

  return (
    <Button variant={variant} sx={sx} onClick={onClick} startIcon={icon}>
      {label}
    </Button>
  );
};

export default ActionButton;
