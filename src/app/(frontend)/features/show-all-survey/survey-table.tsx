"use client";
import React, { useEffect, useState } from "react";
import AdvanceTable from "../../components/tables/advance-table/advance-table";
import {
  BULK_OPERATION,
  EXPORT_OPTIONS,
  Survey_Sort_Keys,
  Survey_Table_Column,
} from "@/utils/constant";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hook";
import {
  clearAllSurveyFields,
  clearSurveySearchField,
  getSurvey,
  setSurveyEndDate,
  setSurveyPage,
  setSurveyQuery,
  setSurveyRowsPerPage,
  setSurveySortColumn,
  setSurveySortOrder,
  setSurveyStartDate,
} from "../../redux/slices/survey/get-survey-slice";
import { TableCell, TableRow } from "@mui/material";
import SearchField from "../../components/search-field";
import { useDebounce } from "../../hooks/use-debounce";
import CustomeDatePicker from "../../components/custom-date-picker/custome-date-picker";
import SurveyDataRow from "./survey-data-row";
import Grid from "@mui/material/Grid2";
import { deleteSurvey } from "../../redux/slices/survey/delete-survey-slice";
import { Toaster } from "../../components/snackbar";
import { API_STATUS, SURVEY_STATUS_ID } from "@/utils/enums";
import { patchSurveyStatus } from "../../redux/slices/survey/update-survey-status-slic";
import { downloadFile } from "../../redux/slices/survey/download-file-slice";
import { downloadFilePdf } from "../../redux/slices/survey/download-file-pdf-slice";
import CustomCheckbox from "../../components/check-box";
import PagesHeader from "../../components/shared/pages-header";
import SearchDropDown from "../../components/drop-down/SearchableDropDown";
import CircularProgressWithLabel from "../../components/circular-progress-bar";
import CustomButton from "../../components/button";
import dayjs from "dayjs";
const SurveyTable = () => {
  const [listIds, setListIds] = useState<any>([]);
  const [exportType, setExportType] = useState<any>("");
  const [bulkOptions, setBulkOptions] = useState<any>("");
  const dispatch = useAppDispatch();
  const {
    data: FILE_LINK,
    status: FILE_STATUS,
    uploadProgress: CSV_UPLOAD_PROGRESS,
  } = useAppSelector((state) => state.surveyFileDownload);
  const {
    data: PDF_FILE_LINK,
    status: FILE_PDF_STATUS,
    uploadProgress: PDF_UPLOAD_PROGRESS,
  } = useAppSelector((state) => state.downloadSurveyPdf);
  const { status: DELETE_STATUS } = useAppSelector(
    (state) => state.deleteSurvey
  );
  const { status: SURVEY_STATUS } = useAppSelector(
    (state) => state.updateSurveyStatus
  );
  const {
    surveyPaginationInfo,
    surveySortingInfo,
    data: SURVEY_DATA,
    query,
    surveyDateInfo,
    status: SURVEY_TABLE_DATA_STATUS,
  } = useAppSelector((state) => state.getSurvey);
  const searchQuery = useDebounce(query, 200);
  const { page, pageSize } = surveyPaginationInfo;
  const { sortColumn, sortOrder } = surveySortingInfo;
  const { startDate, endDate } = surveyDateInfo;
  useEffect(() => {
    getSurveyTableData();
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
    if (
      DELETE_STATUS === API_STATUS.SUCCEEDED ||
      SURVEY_STATUS === API_STATUS.SUCCEEDED
    ) {
      getSurveyTableData();
    }
  }, [DELETE_STATUS, SURVEY_STATUS]);
  useEffect(() => {
    if (FILE_STATUS === API_STATUS.SUCCEEDED) {
      const filePath = FILE_LINK?.filePath;
      if (filePath) {
        // Open the file in a new tab for download
        const downloadLink = document.createElement("a");
        downloadLink.href = `${filePath}`;
        downloadLink.target = "_blank"; // Open in a new tab
        downloadLink.click();
      }
    }
  }, [FILE_STATUS, FILE_LINK]);
  useEffect(() => {
    if (FILE_PDF_STATUS === API_STATUS.SUCCEEDED) {
      const filePath = PDF_FILE_LINK?.filePath;
      if (filePath) {
        // Open the file in a new tab for download
        const downloadLink = document.createElement("a");
        downloadLink.href = `${filePath}`;
        downloadLink.target = "_blank"; // Open in a new tab
        downloadLink.click();
      }
    }
  }, [PDF_FILE_LINK, FILE_PDF_STATUS]);
  const getSurveyTableData = () => {
    dispatch(
      getSurvey({
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
    dispatch(setSurveyPage(newPage));
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setSurveyRowsPerPage(parseInt(event.target.value, 10)));
    dispatch(setSurveyPage(0));
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSurveyPage(0));
    dispatch(setSurveyQuery(e.target.value));
  };
  const handleSortChange = (column: string, order: "asc" | "desc") => {
    dispatch(setSurveySortColumn(Survey_Sort_Keys[column]));
    dispatch(setSurveySortOrder(order));
  };
  const sendStartDate = (e: any) => {
    dispatch(setSurveyStartDate(`${e}`));
  };
  const sendEndDate = (e: any) => {
    dispatch(setSurveyEndDate(`${e}`));
  };
  const clearAll = () => {
    dispatch(clearAllSurveyFields());
  };
  const selectAll = () => {
    setListIds((prev: any) => {
      if (Array.isArray(prev) && prev.length > 1) {
        return []; // Reset if it's an array with more than 1 element
      } else {
        return SURVEY_DATA?.rows?.map((data: any) => data.id); // Otherwise, map the data
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
  const showUnSelectToaster = () => {
    Toaster("info", "Please select row");
  };
  const bulkDelete = () => {
    if (!listIds.length) {
      showUnSelectToaster();
    } else {
      dispatch(
        deleteSurvey({
          id: listIds,
        })
      );
    }
  };
  const updateBulkStatuses = (statusId: number) => {
    if (!listIds.length) {
      showUnSelectToaster();
    } else {
      dispatch(
        patchSurveyStatus({
          ids: listIds,
          survey_status_id: statusId,
        })
      );
    }
  };
  const downloadCsv = () => {
    dispatch(downloadFile(listIds.length ? { ids: listIds } : {}));
  };
  const downloadPdf = () => {
    dispatch(
      downloadFilePdf(
        listIds.length
          ? { ids: listIds, startDate: startDate, endDate: endDate }
          : { startDate: startDate, endDate: endDate }
      )
    );
  };
  const bulkOperations = (e: any) => {
    setBulkOptions(e);
    const operationName = e?.name;
    if (operationName === "Proceed") {
      updateBulkStatuses(SURVEY_STATUS_ID.PROCEEDED);
    } else if (operationName === "Approve") {
      updateBulkStatuses(SURVEY_STATUS_ID.APPROVED);
    } else if (operationName === "Complete") {
      updateBulkStatuses(SURVEY_STATUS_ID.COMPLETED);
    } else if (operationName === "Reject") {
      updateBulkStatuses(SURVEY_STATUS_ID.REJECTED);
    } else if (operationName === "Delete") {
      bulkDelete();
    }
  };
  const exportAs = (e: any) => {
    setExportType(e);
  };
  const download = () => {
    if (exportType) {
      if (exportType.file_name === "Csv") {
        downloadCsv();
      } else if (exportType.file_name === "Pdf") {
        downloadPdf();
      }
    } else {
      Toaster("info", "Please select file type");
    }
  };

  return (
    <>
      <PagesHeader
        title="All Survey"
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
            onClear={() => dispatch(clearSurveySearchField())}
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

      {/* ***********************Bulk Operations*************************** */}
      <Grid
        container
        rowSpacing={{ xs: 1 }}
        columnSpacing={{ xs: 1 }}
        sx={{ mb: { xs: 1, xl: 3 } }}
      >
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <SearchDropDown
            options={BULK_OPERATION}
            name={"name"}
            displayKey={"name"}
            onChange={bulkOperations}
            label="Bulk Opeations"
            value={bulkOptions}
            isOnClear
            disabled={listIds.length ? false : true}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <SearchDropDown
            options={EXPORT_OPTIONS}
            name={"file_name"}
            displayKey={"file_name"}
            label="Export As"
            onChange={exportAs}
            value={exportType}
            isOnClear
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }} alignContent={"flex-end"}>
          <CustomButton
            title="Download"
            onClick={download}
            fullWidth={false}
            buttonStyles={{
              mb: 0.4,
            }}
          />
        </Grid>
      </Grid>

      {/* ***********************AdvanceTable*************************** */}

      <AdvanceTable
        tableLoading={SURVEY_TABLE_DATA_STATUS === API_STATUS.PENDING}
        tableColumns={Survey_Table_Column}
        checkedData={listIds}
        tableBody={SURVEY_DATA?.rows?.map((data: any, index: number) => (
          <TableRow key={index}>
            <TableCell padding="checkbox">
              <CustomCheckbox
                checked={listIds?.some((value: any) => +value === data.id)}
                onChange={() => onSelectSingleClick(data.id)}
              />
            </TableCell>
            <SurveyDataRow data={data} />
          </TableRow>
        ))}
        isPagination
        count={SURVEY_DATA?.count || 0}
        page={page}
        rowsPerPage={pageSize}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleSortChange={handleSortChange}
        onSelectAllClick={selectAll}
      />
      {FILE_STATUS === API_STATUS.PENDING && (
        <CircularProgressWithLabel value={CSV_UPLOAD_PROGRESS} />
      )}
      {FILE_PDF_STATUS === API_STATUS.PENDING && (
        <CircularProgressWithLabel value={PDF_UPLOAD_PROGRESS} />
      )}
    </>
  );
};

export default SurveyTable;
