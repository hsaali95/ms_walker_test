import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { helper } from "@/utils/helper";
import { Box, FormHelperText } from "@mui/material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface IFileUpload {
  onChange: any;
  errorMessage: any;
  acceptType?: string; // Add the acceptType prop
  title?: string;
  fileStyles?: any;
  fullWidth?: boolean; // Add fullWidth prop
}

const FileUpload = ({
  onChange,
  errorMessage,
  acceptType = "*",
  title,
  fileStyles,
  fullWidth = false, // Default value is false
}: IFileUpload) => {

  const handleFileUpload = async (event: any) => {
    // Get the selected file from the event
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Convert the file to base64
        const base64 = await helper.convertFileToBase64(file);
        onChange(base64, file.name);
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    } else {
      console.error("No file selected");
    }
  };
  return (
    <Box
      sx={{
        "& .MuiButtonBase-root": {
          background: "#4F131F",
          fontWeight: 600,
          borderRadius: "30px",
          fontSize: { xs: "0.6rem", sm: "0.875rem" },
          py: { xs: 2, sm: 1 },
          px: { md: 2, lg: 4 },
        },
        ...fileStyles,
      }}
    >
      <Button
        component="label"
        variant="contained"
        fullWidth={fullWidth} // Set fullWidth dynamically
        startIcon={
          <CloudUploadIcon
            sx={{ fontSize: { xs: "0.6rem", sm: "0.875rem" } }}
          />
        }
      >
        {title || "Upload files"}
        <VisuallyHiddenInput
          type="file"
          onChange={handleFileUpload}
          accept={acceptType}
        />
      </Button>
      <FormHelperText sx={{ color: errorMessage ? "#E27878" : "" }}>
        {errorMessage}
      </FormHelperText>
    </Box>
  );
};
export default FileUpload;
