import { Box, FormHelperText, TextField, IconButton } from "@mui/material";
import React, { useState } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface ICustomInput {
  placeholder?: string;
  type?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  size?: "small" | "medium";
  register?: UseFormRegister<FieldValues>;
  name?: string;
  inputStyles?: any;
  value?: unknown;
  disabled?: boolean;
  slotProps?: {
    input?: {
      startAdornment?: React.ReactNode;
      endAdornment?: React.ReactNode;
    };
  };
  isPasswordField?: boolean;
}

const CustomInput = (props: ICustomInput) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const register = props.register && props.register(props?.name || "");
  const inputType =
    props.isPasswordField && !showPassword ? "password" : props.type || "text";

  return (
    <Box
      sx={{
        "& .inputLabel": {
          display: "block",
          mb: 1,
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#2F0911",
        },
        ...props.inputStyles,
      }}
    >
      <label className="inputLabel">{props.label}</label>
      <TextField
        placeholder={props.placeholder}
        type={inputType}
        disabled={props.disabled}
        value={props.value}
        onChange={props.onChange}
        error={props.errorMessage ? true : false}
        size={props.size || "small"}
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
        fullWidth
        slotProps={{
          input: {
            ...props.slotProps?.input,
            endAdornment: props.isPasswordField && (
              <IconButton
                onClick={togglePasswordVisibility}
                edge="end"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          },
        }}
        {...register}
      />
      <FormHelperText sx={{ color: props.errorMessage ? "#E27878" : "" }}>
        {props.errorMessage}
      </FormHelperText>
    </Box>
  );
};

export default CustomInput;
