import {
  useAppDispatch,
  useAppSelector,
} from "@/app/(frontend)/hooks/redux-hook";
import {
  getPaginatedUsers,
  setUserPage,
  setUserRowsPerPage,
  setUserSortColumn,
  setUserSortOrder,
} from "@/app/(frontend)/redux/slices/register-user/get-all-user-slice";
import {
  USER_EXPORT_OPTIONS,
  USER_SORT_KEYS,
  USER_TABLE_COLUMNS,
} from "@/utils/constant";
import { TableCell, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import UserDataRaw from "./user-data-raw";
import { API_STATUS } from "@/utils/enums";
import TableHeading from "@/app/(frontend)/components/table-heading";
import AdvanceTable from "@/app/(frontend)/components/tables/advance-table/advance-table";
import CustomCheckbox from "@/app/(frontend)/components/check-box";
import Grid from "@mui/material/Grid2";
import SearchDropDown from "@/app/(frontend)/components/drop-down/SearchableDropDown";
import CustomButton from "@/app/(frontend)/components/button";
import { Toaster } from "@/app/(frontend)/components/snackbar";
import { downloadUserCsv } from "@/app/(frontend)/redux/slices/register-user/download-user-csv-slice";
import BackdropSpinner from "@/app/(frontend)/components/backdrop-spinner";
import moment from "moment";

const UserTable = () => {
  const [listIds, setListIds] = useState<any>([]);
  const [exportType, setExportType] = useState<any>("");
  const {
    userPaginationInfo,
    userSortingInfo,
    data: USER_DATA,
    status: USER_STATUS,
  } = useAppSelector((state) => state.getPaginatedUsers);
  const { status: REGISTER_USER_STATUS } = useAppSelector(
    (state) => state.registerUser
  );
  const { status: DELETE_USER_STATUS } = useAppSelector(
    (state) => state.deleteUser
  );
  const {
    data: FILE_LINK,
    status: FILE_STATUS,
    // uploadProgress: CSV_UPLOAD_PROGRESS,
  } = useAppSelector((state) => state.userCsv);
  const { page, pageSize } = userPaginationInfo;
  const { sortColumn, sortOrder } = userSortingInfo;

  const dispatch = useAppDispatch();

  useEffect(() => {
    getUserData();
  }, [page, pageSize, sortColumn, sortOrder]);

  const getUserData = () => {
    dispatch(
      getPaginatedUsers({
        page: page + 1,
        recordsPerPage: pageSize,
        sortColumn,
        sortOrder,
      })
    );
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(setUserPage(newPage));
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setUserRowsPerPage(parseInt(event.target.value, 10)));
    dispatch(setUserPage(0));
  };
  const handleSortChange = (column: string, order: "asc" | "desc") => {
    dispatch(setUserSortColumn(USER_SORT_KEYS[column]));
    dispatch(setUserSortOrder(order));
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
      downloadUserCsv(
        listIds.length
          ? {
              ids: listIds,
            }
          : {}
      )
    );
  };
  const selectAll = () => {
    setListIds((prev: any) => {
      if (Array.isArray(prev) && prev.length > 1) {
        return []; // Reset if it's an array with more than 1 element
      } else {
        return USER_DATA?.rows?.map((data: any) => data.id); // Otherwise, map the data
      }
    });
  };
  useEffect(() => {
    if (
      REGISTER_USER_STATUS === API_STATUS.SUCCEEDED ||
      DELETE_USER_STATUS === API_STATUS.SUCCEEDED
    ) {
      getUserData();
    }
  }, [REGISTER_USER_STATUS, DELETE_USER_STATUS]);
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
            link.download = `export-users-${moment().format("YYYY-MM-DD HH-mm-ss")}.csv`; // Set filename
            document.body.appendChild(link);
            link.click(); // Start the download
            document.body.removeChild(link); // Clean up
      
            // Free memory
            URL.revokeObjectURL(csvUrl);
    }
  }, [FILE_STATUS, FILE_LINK]);
  return (
    <>
      <TableHeading title="User Table" />
      <Grid
        container
        rowSpacing={{ xs: 1 }}
        columnSpacing={{ xs: 1 }}
        sx={{ mb: { xs: 1, xl: 3 } }}
      >
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <SearchDropDown
            options={USER_EXPORT_OPTIONS}
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
      <AdvanceTable
        tableLoading={USER_STATUS === API_STATUS.PENDING}
        tableColumns={USER_TABLE_COLUMNS}
        checkedData={listIds}
        isPagination
        count={USER_DATA?.count || 0}
        page={page}
        rowsPerPage={pageSize}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleSortChange={handleSortChange}
        onSelectAllClick={selectAll}
        tableBody={USER_DATA?.rows?.map((data: any, index: number) => (
          <TableRow key={index}>
            <TableCell padding="checkbox">
              <CustomCheckbox
                checked={listIds?.some((value: any) => +value === data.id)}
                onChange={() => onSelectSingleClick(data.id)}
              />
            </TableCell>
            <UserDataRaw data={data} />
          </TableRow>
        ))}
      />
      {FILE_STATUS === API_STATUS.PENDING && <BackdropSpinner />}
    </>
  );
};

export default UserTable;
