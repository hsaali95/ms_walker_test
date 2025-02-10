import AdvanceTable from "@/app/(frontend)/components/tables/advance-table/advance-table";
import {
  useAppDispatch,
  useAppSelector,
} from "@/app/(frontend)/hooks/redux-hook";

import { GROUP_TABLE_COLUMN } from "@/utils/constant";
import { TableCell, TableRow } from "@mui/material";
import React, { useEffect } from "react";
import GroupDataRaw from "./group-data-row";
import {
  getPaginatedGroups,
  setGroupPage,
  setGroupRowsPerPage,
} from "../../redux/slices/group/get-paginated-group-slice";
import { API_STATUS } from "@/utils/enums";
import CustomCheckbox from "../../components/check-box";

const GroupTable = () => {
  const {
    groupPaginationInfo,
    data: GROUP_DATA,
    status: GROUP_STATUS,
  } = useAppSelector((state) => state.getGroupPaginatedData);
  const { status: CREATE_GROUP_STATUS } = useAppSelector(
    (state) => state.createGroup
  );
  const { page, pageSize } = groupPaginationInfo;

  const dispatch = useAppDispatch();

  useEffect(() => {
    getGroupData();
  }, [page, pageSize]);

  const getGroupData = () => {
    dispatch(
      getPaginatedGroups({
        page: page + 1,
        recordsPerPage: pageSize,
      })
    );
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(setGroupPage(newPage));
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setGroupRowsPerPage(parseInt(event.target.value, 10)));
    dispatch(setGroupPage(0));
  };
  useEffect(() => {
    if (CREATE_GROUP_STATUS === API_STATUS.SUCCEEDED) {
      getGroupData();
    }
  }, [CREATE_GROUP_STATUS]);

  return (
    <>
      <AdvanceTable
        tableLoading={GROUP_STATUS === API_STATUS.PENDING}
        tableColumns={GROUP_TABLE_COLUMN}
        isPagination
        count={GROUP_DATA?.count || 0}
        page={page}
        rowsPerPage={pageSize}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        tableBody={GROUP_DATA?.rows?.map((data: any, index: number) => (
          <TableRow key={index}>
            <TableCell padding="checkbox">
              <CustomCheckbox />
            </TableCell>
            <GroupDataRaw data={data} />
          </TableRow>
        ))}
      />
    </>
  );
};

export default GroupTable;
