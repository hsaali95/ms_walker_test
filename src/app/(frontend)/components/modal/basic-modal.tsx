import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CustomButton from "../button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
interface ReusableModalProps {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
  closeModal?: any;
  cancelModal?: any;
  onDelete?: any;
  modalMessage?: any;
  isDialogActions?: any;
  deleteLoading?: any;
}

const BasicModal: React.FC<ReusableModalProps> = ({
  open,
  title,
  children,
  closeModal,
  cancelModal,
  onDelete,
  modalMessage,
  isDialogActions,
  deleteLoading,
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
      {closeModal && (
        <IconButton
          sx={{ position: "absolute", right: 6, top: 12 }}
          onClick={closeModal}
        >
          <ClearIcon sx={{ fontSize: "1.3rem" }} />
        </IconButton>
      )}
      {title && (
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
      )}
      {children && (
        <DialogContent
          sx={{
            p: 0,
            px: 3,
            pb: 4,
          }}
        >
          {children}
        </DialogContent>
      )}

      {modalMessage && (
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <IconButton
            sx={{
              fill: "#e99797",
              shadowRadius: 10,
              fontSize: "40px",
              padding: "0px",
              mb: 2,
            }}
          >
            <HighlightOffIcon
              sx={{
                fill: "#e99797",
                shadowRadius: 10,

                fontSize: { xs: "50px", sm: "70px" },
              }}
            />
          </IconButton>
          {modalMessage ? (
            <Typography sx={{ textAlign: "center" }}>{modalMessage}</Typography>
          ) : null}
        </DialogContent>
      )}
      {isDialogActions && (
        <DialogActions sx={{ px: 2, mb: 1 }}>
          <CustomButton
            title="Delete"
            onClick={onDelete}
            loading={deleteLoading}
          />
          <CustomButton title="Cancel" onClick={cancelModal} />
        </DialogActions>
      )}
    </Dialog>
  );
};

export default BasicModal;
