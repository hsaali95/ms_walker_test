import { Box, FormHelperText, MenuItem, Select } from "@mui/material";
import React from "react";
import {
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

interface ICustomDropDown {
  label?: string;
  dropDownStyles?: any;
  errorMessage?: string;
  size?: "small" | "medium";
  setValue?: UseFormSetValue<FieldValues>;
  getValues?: UseFormGetValues<FieldValues>;
  register?: UseFormRegister<FieldValues>;
  name: string;
  options?: any;
  onChange?: any;
  value?: string;
}

const CustomDropDown = (props: ICustomDropDown) => {
  return (
    <Box
      sx={{
        "& .dropDownLabel": {
          display: "block",
          mb: 1,
          fontSize: "0.8rem",
          color: "#2F0911",
          fontWeight: 600,
        },
        ...props.dropDownStyles,
      }}
    >
      <label className="dropDownLabel">{props.label}</label>
      <Select
        fullWidth
        name={props.name}
        error={props.errorMessage ? true : false}
        value={
          props.getValues ? props.getValues(props.name) || "" : props.value
        }
        size={props.size || "small"}
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: "30px",
          },
        }}
        onChange={(val) => {
          if (props.onChange) {
            props.onChange(val.target.value || "");
          } else if (props.setValue) {
            props.setValue(props.name, val.target.value || "", {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
        }}
      >
        {props?.options?.map((optionItem: any, index: number) => (
          <MenuItem value={`${optionItem.id}`} key={index}>
            {optionItem[props.name]}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText sx={{ color: props.errorMessage ? "#E27878" : "" }}>
        {props.errorMessage}
      </FormHelperText>
    </Box>
  );
};

export default CustomDropDown;
