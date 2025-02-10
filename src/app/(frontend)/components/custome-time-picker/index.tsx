import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, FormHelperText } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import {
  FieldValues,
  UseFormSetValue,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";

interface ICustomTimePicker {
  label?: string;
  name: string;
  value?: Dayjs | null;
  disabled?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  minTime?: Dayjs;
  maxTime?: Dayjs;
  errorMessage?: string;
  setValue?: UseFormSetValue<FieldValues>;
  getValues?: UseFormGetValues<FieldValues>;
  register?: UseFormRegister<FieldValues>;
  onChange?: (value: Dayjs | null) => void;
  buttonStyles?: any;
  format?: string;
}

const CustomTimePicker = (props: ICustomTimePicker) => {
  const {
    label,
    name,
    value,
    disabled,
    disableFuture,
    disablePast,
    minTime,
    maxTime,
    onChange,
    errorMessage,
    setValue,
    getValues,
    format,
  } = props;

  const selectedValue = getValues ? getValues(name) || null : value || null;

  const handleTimeChange = (newValue: Dayjs | null) => {
    if (onChange) {
      onChange(newValue);
    } else if (setValue) {
      setValue(name, newValue, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <Box
      sx={{
        "& .inputLabel": {
          display: "block",
          marginBottom: 0.3,
          fontSize: "0.8rem",
        },
        ...props.buttonStyles,
      }}
    >
      {label && <label className="inputLabel">{label}</label>}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          value={selectedValue ? dayjs(selectedValue) : null}
          disabled={disabled}
          disableFuture={disableFuture}
          disablePast={disablePast}
          minTime={minTime}
          maxTime={maxTime}
          onChange={handleTimeChange}
          format={format ? format : "HH:mm"}
          slotProps={{
            textField: {
              fullWidth: true,
              InputProps: {
                readOnly: true,
              },
            },
          }}
          sx={{
            "& .MuiInputBase-input": {
              padding: "8.6px 14px",
            },
          }}
        />
      </LocalizationProvider>
      {errorMessage && (
        <FormHelperText sx={{ color: "#E27878" }}>
          {errorMessage}
        </FormHelperText>
      )}
    </Box>
  );
};

export default CustomTimePicker;
