"use client";
import React, { useEffect, useState } from "react";
import AdvanceTable from "../../components/tables/advance-table/advance-table";
import {
  ACTIVITY_EXPORT_OPTIONS,
  ACTIVITY_TABLE_COLUMN,
  SURVEY_SORT_KEYS,
} from "@/utils/constant";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hook";

import { TableCell, TableRow } from "@mui/material";
import SearchField from "../../components/search-field";
import { useDebounce } from "../../hooks/use-debounce";
import CustomeDatePicker from "../../components/custom-date-picker/custome-date-picker";
import Grid from "@mui/material/Grid2";
import { API_STATUS } from "@/utils/enums";
import CustomCheckbox from "../../components/check-box";
import PagesHeader from "../../components/shared/pages-header";
import SearchDropDown from "../../components/drop-down/SearchableDropDown";
import CustomButton from "../../components/button";
import ActivityDataRow from "./activity-data-row";
import {
  clearActivitySearchField,
  clearAllActivityFields,
  getActivity,
  setActivityEndDate,
  setActivityPage,
  setActivityQuery,
  setActivityRowsPerPage,
  setActivitySortColumn,
  setActivitySortOrder,
  setActivityStartDate,
} from "../../redux/slices/activity/get-activity-slice";
import { downloadActivityCsv } from "../../redux/slices/activity/download-activity-csv-file";
import dayjs from "dayjs";
import { Toaster } from "../../components/snackbar";
import { helper } from "@/utils/helper";
import moment from "moment";
import BackdropSpinner from "../../components/backdrop-spinner";
const ActivityTable = () => {
  const [listIds, setListIds] = useState<any>([]);
  console.log("listIds", listIds);
  const [exportType, setExportType] = useState<any>("");
  const dispatch = useAppDispatch();
  const {
    data: FILE_LINK,
    status: FILE_STATUS,
    // uploadProgress: CSV_UPLOAD_PROGRESS,
  } = useAppSelector((state) => state.getActivityCsv);

  const {
    activityPaginationInfo,
    activitySortingInfo,
    data: ACTIVITY_DATA,
    query,
    activityDateInfo,
    status: Activity_TABLE_DATA_STATUS,
  } = useAppSelector((state) => state.getActivity);
  const searchQuery = useDebounce(query, 200);
  const { page, pageSize } = activityPaginationInfo;
  const { sortColumn, sortOrder } = activitySortingInfo;
  const { startDate, endDate } = activityDateInfo;
  useEffect(() => {
    getActivityTableData();
  }, [
    dispatch,
    page,
    pageSize,
    searchQuery,
    sortColumn,
    sortOrder,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    if (FILE_STATUS === API_STATUS.SUCCEEDED) {
      // const filePath = FILE_LINK?.filePath;
      // if (filePath) {
      //   // Open the file in a new tab for download
      //   const downloadLink = document.createElement("a");
      //   downloadLink.href = `${filePath}`;
      //   downloadLink.target = "_blank"; // Open in a new tab
      //   downloadLink.click();
      // }

      const csvBlob = new Blob([FILE_LINK], { type: "text/csv" });

      // Create a temporary URL for the blob
      const csvUrl = URL.createObjectURL(csvBlob);

      // Create a hidden <a> element to trigger the download
      const link = document.createElement("a");
      link.href = csvUrl;
      link.download = `export-activities-${moment().format("YYYY-MM-DD HH-mm-ss")}.csv`; // Set filename
      document.body.appendChild(link);
      link.click(); // Start the download
      document.body.removeChild(link); // Clean up

      // Free memory
      URL.revokeObjectURL(csvUrl);
    }
  }, [FILE_STATUS, FILE_LINK]);

  const getActivityTableData = () => {
    dispatch(
      getActivity({
        page: page + 1,
        recordsPerPage: pageSize,
        searchQuery: searchQuery || "",
        sortColumn,
        sortOrder,
        startDate,
        endDate,
      })
    );
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(setActivityPage(newPage));
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setActivityRowsPerPage(parseInt(event.target.value, 10)));
    dispatch(setActivityPage(0));
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setActivityPage(0));
    dispatch(setActivityQuery(e.target.value));
  };
  const handleSortChange = (column: string, order: "asc" | "desc") => {
    dispatch(setActivitySortColumn(SURVEY_SORT_KEYS[column]));
    dispatch(setActivitySortOrder(order));
  };
  const sendStartDate = (e: any) => {
    dispatch(setActivityStartDate(`${e}`));
  };
  const sendEndDate = (e: any) => {
    dispatch(setActivityEndDate(`${e}`));
  };
  const clearAll = () => {
    dispatch(clearAllActivityFields());
  };
  const selectAll = () => {
    setListIds((prev: any) => {
      if (Array.isArray(prev) && prev.length > 1) {
        return []; // Reset if it's an array with more than 1 element
      } else {
        return ACTIVITY_DATA?.rows?.map((data: any) => data.id); // Otherwise, map the data
      }
    });
  };

  const onSelectSingleClick = (value: any) => {
    setListIds((prev: any) => {
      if (Array.isArray(prev)) {
        // Check if the value exists in the array
        if (prev.includes(value)) {
          // Remove the value if it exists
          return prev.filter((id: any) => id !== value);
        } else {
          // Add the value if it doesn't exist
          return [...prev, value];
        }
      } else {
        // Handle the case where prev is not an array
        return [value];
      }
    });
  };
  const exportAs = (e: any) => {
    setExportType(e);
  };
  const download = () => {
    if (exportType) {
      if (exportType.file_name === "Csv") {
        downloadCsv();
      }
    } else {
      Toaster("info", "Please select file type");
    }
  };
  const downloadCsv = () => {
    dispatch(
      downloadActivityCsv(
        listIds.length
          ? {
              ids: listIds,
              startDate: helper.dateSendToDb(startDate),
              endDate: helper.dateSendToDb(endDate),
              searchQuery,
            }
          : {
              startDate: helper.dateSendToDb(startDate),
              endDate: helper.dateSendToDb(endDate),
              searchQuery,
            }
      )
    );
  };
  return (
    <>
      <PagesHeader
        title="All Activity"
        buttonTitle="Clear All"
        onButtonClick={clearAll}
      />

      <Grid
        container
        rowSpacing={{ xs: 1 }}
        columnSpacing={{ xs: 1 }}
        sx={{
          mb: 1,
        }}
      >
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          {/* ***********************SearchField*************************** */}
          <SearchField
            placeholder="Search by all"
            onChange={handleSearch}
            value={query}
            label={"Search"}
            onClear={() => dispatch(clearActivitySearchField())}
            inputStyles={{
              "& .inputLabel": {
                mb: 0.3,
                fontSize: "0.8rem",
              },
            }}
          />
        </Grid>
        {/* ***********************CustomeDatePicker*************************** */}
        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
          <CustomeDatePicker
            label={"Start Date"}
            value={startDate}
            onChange={sendStartDate}
            format={"DD/MM/YYYY"}
            maxDate={dayjs(endDate)}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
          <CustomeDatePicker
            label={"End Date"}
            value={endDate}
            onChange={sendEndDate}
            format={"DD/MM/YYYY"}
            disabled={!startDate}
            minDate={dayjs(startDate)}
          />
        </Grid>
      </Grid>

      <Grid
        container
        rowSpacing={{ xs: 1 }}
        columnSpacing={{ xs: 1 }}
        sx={{ mb: { xs: 1, xl: 3 } }}
      >
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <SearchDropDown
            options={ACTIVITY_EXPORT_OPTIONS}
            name={"file_name"}
            displayKey={"file_name"}
            label="Export As"
            onChange={exportAs}
            value={exportType}
            isOnClear
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 3 }} alignContent={"flex-end"}>
          <CustomButton
            title="Download"
            onClick={download}
            fullWidth
            buttonStyles={{
              mb: 0.4,
            }}
          />
        </Grid>
      </Grid>

      {/* ***********************AdvanceTable*************************** */}

      <AdvanceTable
        tableLoading={Activity_TABLE_DATA_STATUS === API_STATUS.PENDING}
        tableColumns={ACTIVITY_TABLE_COLUMN}
        checkedData={listIds}
        tableBody={ACTIVITY_DATA?.rows?.map((data: any, index: number) => (
          <TableRow key={index}>
            <TableCell padding="checkbox">
              <CustomCheckbox
                checked={listIds?.some((value: any) => +value === data.id)}
                onChange={() => onSelectSingleClick(data.id)}
              />
            </TableCell>
            <ActivityDataRow data={data} />
          </TableRow>
        ))}
        isPagination
        count={ACTIVITY_DATA?.count || 0}
        page={page}
        rowsPerPage={pageSize}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleSortChange={handleSortChange}
        onSelectAllClick={selectAll}
      />
      {FILE_STATUS === API_STATUS.PENDING && <BackdropSpinner />}
    </>
  );
};

export default ActivityTable;
