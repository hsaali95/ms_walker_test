import React from "react";
import { Box, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface ICustomCheckbox {
  label?: string;
  name?: string;
  errorMessage?: string;
  register?: UseFormRegister<FieldValues>;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  checked?: boolean;
  disabled?: boolean;
  size?: "small" | "medium";
  labelPlacement?: "end" | "start" | "top" | "bottom";
  checkStyles?: any;
}

const CustomCheckbox = (props: ICustomCheckbox) => {
  const {
    name,
    register,
    checked,
    onChange,
    disabled,
    size,
    label,
    labelPlacement,
    checkStyles,
    errorMessage,
  } = props;

  return (
    <Box
      sx={{
        "& .checkboxLabel": {},
        ...checkStyles,
      }}
    >
      <FormControlLabel
        sx={{
          "& .MuiTypography-body1": {
            fontWeight: "600 !important",
            color: "#9A9FA5 !important",
          },
          "& .MuiSvgIcon-root": {
            fill: "#4F131F",
          },
        }}
        control={
          <Checkbox
            disabled={disabled}
            {...(register && register(name || ""))}
            checked={checked} // Optional: If externally controlled
            onChange={onChange} // Optional: If externally controlled
            size={size || "medium"}
          />
        }
        label={label}
        labelPlacement={labelPlacement || "end"}
        className="checkboxLabel"
      />
      {errorMessage && (
        <FormHelperText sx={{ color: "#E27878" }}>
          {errorMessage}
        </FormHelperText>
      )}
    </Box>
  );
};

export default CustomCheckbox;
