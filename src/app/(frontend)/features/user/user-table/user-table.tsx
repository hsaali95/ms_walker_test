import {
  useAppDispatch,
  useAppSelector,
} from "@/app/(frontend)/hooks/redux-hook";
import {
  getPaginatedUsers,
  setUserPage,
  setUserRowsPerPage,
} from "@/app/(frontend)/redux/slices/register-user/get-all-user-slice";
import { USER_TABLE_COLUMNS } from "@/utils/constant";
import { TableRow } from "@mui/material";
import React, { useEffect } from "react";
import UserDataRaw from "./user-data-raw";
import { API_STATUS } from "@/utils/enums";
import TableHeading from "@/app/(frontend)/components/table-heading";
import MediumTable from "@/app/(frontend)/components/tables/medium-table/medium-table";

const UserTable = () => {
  const {
    userPaginationInfo,
    data: USER_DATA,
    status: USER_STATUS,
  } = useAppSelector((state) => state.getPaginatedUsers);
  const { status: REGISTER_USER_STATUS } = useAppSelector(
    (state) => state.registerUser
  );
  const { status: DELETE_USER_STATUS } = useAppSelector(
    (state) => state.deleteUser
  );
  const { page, pageSize } = userPaginationInfo;

  const dispatch = useAppDispatch();

  useEffect(() => {
    getUserData();
  }, [page, pageSize]);

  const getUserData = () => {
    dispatch(
      getPaginatedUsers({
        page: page + 1,
        recordsPerPage: pageSize,
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
  useEffect(() => {
    if (
      REGISTER_USER_STATUS === API_STATUS.SUCCEEDED ||
      DELETE_USER_STATUS === API_STATUS.SUCCEEDED
    ) {
      getUserData();
    }
  }, [REGISTER_USER_STATUS, DELETE_USER_STATUS]);
  return (
    <>
      <TableHeading title="User Table" />
      <MediumTable
        tableLoading={USER_STATUS === API_STATUS.PENDING}
        tableColumns={USER_TABLE_COLUMNS}
        isPagination
        count={USER_DATA?.count || 0}
        page={page}
        rowsPerPage={pageSize}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        tableBody={USER_DATA?.rows?.map((data: any, index: number) => (
          <TableRow key={index}>
            <UserDataRaw data={data} />
          </TableRow>
        ))}
      />
    </>
  );
};

export default UserTable;
