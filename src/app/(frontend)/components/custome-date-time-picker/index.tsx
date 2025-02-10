import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, FormHelperText } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import {
  FieldValues,
  UseFormSetValue,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";

interface ICustomDateTimePicker {
  label?: string;
  name: string;
  value?: Dayjs | null;
  disabled?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  minDateTime?: Dayjs;
  maxDateTime?: Dayjs;
  errorMessage?: string;
  setValue?: UseFormSetValue<FieldValues>;
  getValues?: UseFormGetValues<FieldValues>;
  register?: UseFormRegister<FieldValues>;
  onChange?: (value: Dayjs | null) => void;
  buttonStyles?: any;
  format?: any;
}

const CustomDateTimePicker = (props: ICustomDateTimePicker) => {
  const {
    label,
    name,
    value,
    disabled,
    disableFuture,
    disablePast,
    minDateTime,
    maxDateTime,
    onChange,
    errorMessage,
    setValue,
    getValues,
    format,
  } = props;

  const selectedValue = getValues ? getValues(name) || null : value || null;

  const handleDateTimeChange = (newValue: Dayjs | null) => {
    if (newValue) {
      const formattedValue: any = newValue.format("YYYY-MM-DDTHH:mm:ss");
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
        <DateTimePicker
          format={format ? format : "YYYY-MM-DD HH:mm"}
          value={selectedValue ? dayjs(selectedValue) : null}
          disabled={disabled}
          disableFuture={disableFuture}
          disablePast={disablePast}
          minDateTime={minDateTime}
          maxDateTime={maxDateTime}
          onChange={handleDateTimeChange}
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

export default CustomDateTimePicker;
