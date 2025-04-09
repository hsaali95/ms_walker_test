import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, FormHelperText } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

interface ICustomeDatePicker {
  label?: string;
  value?: Dayjs | null;
  disabled?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  errorMessage?: string;
  onChange?: (value: Dayjs | null) => void;
  buttonStyles?: any;
  format?: any;
}

const CustomeDatePicker = (props: ICustomeDatePicker) => {
  const {
    label,
    value,
    disabled,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
    onChange,
    errorMessage,
    format,
  } = props;

  const handleDateChange = (newValue: Dayjs | null) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Box
      sx={{
        "& .inputLabel": {
          display: "block",
          mb: 0.3,
          fontSize: "0.8rem",
        },
        ...props.buttonStyles,
      }}
    >
      {label && <label className="inputLabel">{label}</label>}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          format={format ? format : "YYYY-MM-DD"}
          value={value ? dayjs(value) : null}
          disabled={disabled}
          disableFuture={disableFuture}
          disablePast={disablePast}
          minDate={minDate}
          maxDate={maxDate}
          slotProps={{
            textField: {
              fullWidth: true,
              InputProps: {
                readOnly: true, // Correctly set readOnly here
              },
            },
          }}
          onChange={handleDateChange}
          sx={{
            "& .MuiInputBase-input": {
              padding: "8.6px 14px ",
            },
            "& .MuiInputBase-root": {
              borderRadius: "30px",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4F131F", // Focus border color
              },
            },
            "& .MuiInputLabel-root": {
              "&.Mui-focused": {
                color: "#4F131F", // Label color on focus
              },
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

export default CustomeDatePicker;
