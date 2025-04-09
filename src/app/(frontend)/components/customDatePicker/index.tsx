import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, FormHelperText } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import {
  FieldValues,
  UseFormSetValue,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";

interface ICustomDatePicker {
  label?: string;
  name: string;
  value?: Dayjs | null;
  disabled?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  errorMessage?: string;
  setValue?: UseFormSetValue<FieldValues>;
  getValues?: UseFormGetValues<FieldValues>;
  register?: UseFormRegister<FieldValues>;
  onChange?: (value: Dayjs | null) => void;
  buttonStyles?: any;
  format?: string;
}

const CustomDatePicker = (props: ICustomDatePicker) => {
  const {
    label,
    name,
    value,
    disabled,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
    onChange,
    errorMessage,
    setValue,
    getValues,
    format,
  } = props;

  const selectedValue = getValues ? getValues(name) || null : value || null;

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      const formattedValue: any = newValue?.format("DD/MM/YYYY");
      console.log("formattedValue", formattedValue);
      if (onChange) {
        onChange(formattedValue);
      } else if (setValue) {
        setValue(name, formattedValue, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    } else {
      if (onChange) {
        onChange(null);
      } else if (setValue) {
        setValue(name, null, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
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
        <DatePicker
          value={selectedValue ? dayjs(selectedValue, "DD/MM/YYYY") : null}
          disabled={disabled}
          disableFuture={disableFuture}
          disablePast={disablePast}
          minDate={minDate}
          maxDate={maxDate}
          onChange={handleDateChange}
          format={format ? format : "DD-MM-YYYY"}
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

export default CustomDatePicker;
