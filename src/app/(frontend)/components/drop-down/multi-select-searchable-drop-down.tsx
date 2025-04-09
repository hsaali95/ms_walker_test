import React from "react";
import { Autocomplete, Box, TextField, FormHelperText } from "@mui/material";
import {
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

interface ISearchDropDown {
  label?: string;
  dropDownStyles?: any;
  errorMessage?: string;
  size?: "small" | "medium";
  setValue?: UseFormSetValue<FieldValues>;
  getValues?: UseFormGetValues<FieldValues>;
  register?: UseFormRegister<FieldValues>;
  name: string;
  options?: { id: string | number; [key: string]: any }[] | any;
  onChange?: (value: any) => void | any; // Allow array of values for multi-select
  value?: any; // Allow array of values for multi-select
  displayKey: string; // Specify the key to display
  multiple?: boolean; // Add a flag to enable multi-select
}

const MultiSelectDropDown = (props: ISearchDropDown) => {
  const selectedValue = props.getValues
    ? props.getValues(props.name) || (props.multiple ? [] : "")
    : props.value || (props.multiple ? [] : "");

  return (
    <Box
      sx={{
        "& .dropDownLabel": {
          display: "block",
          mb: 1,
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#2F0911",
        },
        ...props.dropDownStyles,
      }}
    >
      {props.label && <label className="dropDownLabel">{props.label}</label>}
      <Autocomplete
        sx={{
          "& .MuiOutlinedInput-root": {
            py: 0,
          },
          "& .MuiInputBase-root": {
            borderRadius: "30px",
          },
        }}
        fullWidth
        multiple={props.multiple} // Enable multi-select
        options={props.options || []}
        getOptionLabel={(option) => {
          if (option.hasOwnProperty(props?.displayKey)) {
            return option[props?.displayKey];
          }
          return option;
        }}
        value={selectedValue}
        isOptionEqualToValue={(option, value) =>
          props.multiple
            ? option[props.displayKey] === value[props.displayKey]
            : +option === +value
        }
        onChange={(_, newValue) => {
          if (props.onChange) {
            props.onChange(newValue || {});
          } else if (props.setValue) {
            props.setValue(props.name, newValue || {}, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            error={!!props.errorMessage}
            size={props.size || "small"}
          />
        )}
      />
      <FormHelperText sx={{ color: props.errorMessage ? "#E27878" : "" }}>
        {props.errorMessage}
      </FormHelperText>
    </Box>
  );
};

export default MultiSelectDropDown;
