import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
interface ReusableModalProps {
  open: boolean;
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
  closeModal: any;
}

const BasicModal: React.FC<ReusableModalProps> = ({
  open,
  title,
  children,
  closeModal,
}) => {
  return (
    <Dialog
      open={open}
      sx={{
        backdropFilter: "blur(5px)",
        "& .MuiPaper-root": {
          borderRadius: "30px",
          margin: { xs: "16px", sm: "32px" },
          width: { xs: "100%", sm: "480px" },
        },
      }}
    >
      <IconButton
        sx={{ position: "absolute", right: 6, top: 12 }}
        onClick={closeModal}
      >
        <ClearIcon sx={{ fontSize: "1.3rem" }} />
      </IconButton>
      <DialogTitle
        sx={{
          textAlign: "center",
          p: 0,
          mt: 3,
          color: "#1A1D1F",
          fontWeight: 600,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          p: 0,
          px: 3,
          pb: 4,
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default BasicModal;
