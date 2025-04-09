import { Box, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../../button";

interface PagesHeaderProps {
  title?: string;
  buttonTitle?: string | undefined;
  onButtonClick?: () => void;
  buttonFullWidth?: boolean;
  headerStyles?: any;
  buttonDisable?: boolean;
}

const PagesHeader: React.FC<PagesHeaderProps> = ({
  title,
  buttonTitle,
  onButtonClick,
  buttonFullWidth = false,
  headerStyles,
  buttonDisable,
}) => {
  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        mb: { xs: 1, md: 2, xl: 3 },
        ...headerStyles,
      }}
    >
      <Typography
        component="h4"
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#4F131F",
          fontSize: { xs: "1.5rem", sm: "2.125rem" },
        }}
      >
        {title}
      </Typography>
      {buttonTitle && (
        <CustomButton
          title={buttonTitle}
          fullWidth={buttonFullWidth}
          onClick={onButtonClick}
          disabled={buttonDisable}
        />
      )}
    </Box>
  );
};

export default PagesHeader;
