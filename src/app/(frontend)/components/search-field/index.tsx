import {
  Box,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { HTMLInputTypeAttribute } from "react";
import { Clear as ClearIcon } from "@mui/icons-material"; // Importing example icons
interface ISearchField {
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  size?: "small" | "medium";
  name?: string;
  inputStyles?: any;
  value?: unknown;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClear?: () => void;
}
const SearchField = (props: ISearchField) => {
  return (
    <Box
      sx={{
        "& .inputLabel": {
          display: "block",
          mb: 1,
          fontSize: "0.8rem",
          color: "#2F0911",
        },
        ...props.inputStyles,
      }}
    >
      <label className="inputLabel">{props.label}</label>
      <TextField
        placeholder={props.placeholder}
        type={props.type}
        disabled={props.disabled}
        value={props.value}
        onChange={props.onChange}
        error={props.errorMessage ? true : false}
        size={props.size || "small"}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "30px", // Custom border radius
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4F131F !important", // Add `!important` for higher specificity
            },
          },
          "& .MuiInputLabel-root": {
            "&.Mui-focused": {
              color: "#4F131F !important", // Optional: Label color on focus
            },
          },
        }}
        name={props.name}
        slotProps={{
          input: {
            startAdornment: props.icon ? (
              <InputAdornment position="start">{props.icon}</InputAdornment>
            ) : null,
            endAdornment:
              props.value && props.onClear ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={props.onClear}
                    edge="end"
                    sx={{ p: 0, pr: 1.3 }}
                    aria-label="clear"
                  >
                    <ClearIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
          },
        }}
      />
      <FormHelperText sx={{ color: props.errorMessage ? "#E27878" : "" }}>
        {props.errorMessage}
      </FormHelperText>
    </Box>
  );
};

export default SearchField;
