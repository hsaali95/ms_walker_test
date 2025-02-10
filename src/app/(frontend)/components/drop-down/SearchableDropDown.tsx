import React, { useState, useEffect, useRef } from "react";
import { Autocomplete, Box, TextField, FormHelperText } from "@mui/material";
import {
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { ClearIcon } from "@mui/x-date-pickers/icons";

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
  onChange?: (value: string) => void;
  value?: string;
  displayKey: string;
  disabled?: boolean;
  onClear?: any;
  isOnClear?: boolean;
}

const ITEMS_PER_LOAD = 10; // Load 10 items at a time

const SearchDropDown = (props: ISearchDropDown) => {
  const [visibleOptions, setVisibleOptions] = useState(
    props.options?.slice(0, ITEMS_PER_LOAD) || []
  );
  const [hasMore, setHasMore] = useState(
    (props.options?.length || 0) > ITEMS_PER_LOAD
  );
  const listboxRef = useRef<HTMLUListElement | null>(null);
  const isValueRecieved = props.getValues
    ? props.getValues(props.name)
    : props.value;
  useEffect(() => {
    setVisibleOptions(props.options?.slice(0, ITEMS_PER_LOAD) || []);
    setHasMore((props.options?.length || 0) > ITEMS_PER_LOAD);
  }, [props.options]);

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore) {
      loadMoreItems();
    }
  };

  const loadMoreItems = () => {
    setVisibleOptions((prev: any) => {
      const nextItems =
        props.options?.slice(prev.length, prev.length + ITEMS_PER_LOAD) || [];
      if (nextItems.length === 0) setHasMore(false);
      return [...prev, ...nextItems];
    });
  };

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
          "& .MuiOutlinedInput-root": { py: 0 },
          "& .MuiInputBase-root": { borderRadius: "30px" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4F131F",
          },
        }}
        fullWidth
        loading={props?.options?.length === 0} // Show loading only when no options are available
        loadingText={"loading..."}
        options={props.options || []} // ✅ Use all options for searching
        filterOptions={(options, state) => {
          const filtered = options.filter((option) =>
            option[props.displayKey]
              ?.toLowerCase()
              .includes(state.inputValue.toLowerCase())
          );
          return filtered.slice(0, visibleOptions.length); // ✅ Show only loaded items
        }}
        getOptionLabel={(option) => option[props?.displayKey] || ""}
        value={
          props.getValues
            ? props.getValues(props.name) || ""
            : props.value || ""
        }
        disabled={props.disabled}
        isOptionEqualToValue={(option, value) => +option.id === +value.id}
        clearIcon={
          isValueRecieved && props.isOnClear ? (
            <ClearIcon fontSize="small" onClick={props.onClear} />
          ) : (
            false
          )
        }
        onChange={(_, newValue) => {
          console.log("newValue", newValue);
          props.onChange?.(newValue);
          props.setValue?.(props.name, newValue, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        ListboxProps={{
          ref: listboxRef,
          onScroll: handleScroll,
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

export default SearchDropDown;
