import { Box } from "@mui/material";
import React from "react";
import { PuffLoader } from "react-spinners";

interface ApiLoaderProps {
  height?: string | number;
  marginTop?: string | number;
}

const ApiLoader: React.FC<ApiLoaderProps> = ({ height, marginTop }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: marginTop || "2rem",
        height: height,
      }}
    >
      <PuffLoader
        color="#4F131F"
        cssOverride={{}}
        loading
        size={60}
        speedMultiplier={2}
      />
    </Box>
  );
};

export default ApiLoader;
