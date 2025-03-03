import { Box, TableCell, Typography, IconButton } from "@mui/material";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
interface ITableCellWithText {
  text?: string | null | undefined | any; // `text` can be string, null, or undefined
  sx?: object; // `sx` for custom styles (optional)
  onClick?: () => void; // `onClick` is an optional function for click events
  isImage?: boolean;
  forChildImage?: any;
  children?: any;
  isDeleteButton?: boolean; // Prop for displaying the delete button
  onDelete?: () => void; // Function to handle delete button click
  isViewButton?: boolean; // Prop for displaying the view button
  onView?: () => void; // Function to handle view button click
  forBasic?: "inherit" | "left" | "center" | "right" | "justify";
  onEdit?: () => void; // Function to handle edit button click
  isEditButton?: boolean; // New prop for edit button
}

const TableCellWithText = ({
  text,
  sx,
  onClick,
  isImage,
  forChildImage,
  children,
  isDeleteButton,
  onDelete,
  isViewButton,
  onView,
  forBasic,
  onEdit,
  isEditButton,
}: ITableCellWithText) => {
  return (
    <TableCell
      variant="body"
      align={forBasic || "left"}
      sx={{
        px: 2,
        py: 1,
        ...sx,
      }}
      padding={"none"}
    >
      {isDeleteButton && isEditButton ? (
        <Box display="flex" gap={1}>
          <IconButton onClick={onEdit} sx={{ p: 0 }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={onDelete} sx={{ p: 0 }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ) : isDeleteButton ? (
        <IconButton onClick={onDelete} sx={{ p: 0 }}>
          <DeleteIcon />
        </IconButton>
      ) : isViewButton ? (
        <IconButton onClick={onView} sx={{ p: 0 }}>
          <VisibilityIcon />
        </IconButton>
      ) : isEditButton ? (
        <IconButton onClick={onEdit} sx={{ p: 0 }}>
          <EditIcon />
        </IconButton>
      ) : isImage ? (
        <Box>
          {text?.map((imageLink: string, i: number) => (
            <Image
              key={i}
              src={imageLink || ""}
              alt={text || "no_image"}
              width={20}
              height={20}
              style={{
                marginLeft: i > 0 ? "5px" : "0px",
              }}
            />
          ))}
        </Box>
      ) : forChildImage ? (
        <Box display={"flex"}>{children}</Box>
      ) : (
        <Typography
          onClick={onClick}
          sx={{
            textWrap: "nowrap",
            color: "#4F131F",
            fontSize: "0.8rem",
            fontWeight: 500,
          }}
        >
          {text !== null && text !== undefined && text !== "" ? text : "-"}
        </Typography>
      )}
    </TableCell>
  );
};

export default TableCellWithText;
