import {
  useAppDispatch,
  useAppSelector,
} from "@/app/(frontend)/hooks/redux-hook";

import { GROUP_TABLE_COLUMN } from "@/utils/constant";
import { TableRow } from "@mui/material";
import React, { useEffect } from "react";
import GroupDataRaw from "./group-data-row";
import {
  getPaginatedGroups,
  setGroupPage,
  setGroupRowsPerPage,
} from "../../redux/slices/group/get-paginated-group-slice";
import { API_STATUS } from "@/utils/enums";
import MediumTable from "../../components/tables/medium-table/medium-table";

const GroupTable = () => {
  const {
    groupPaginationInfo,
    data: GROUP_DATA,
    status: GROUP_STATUS,
  } = useAppSelector((state) => state.getGroupPaginatedData);
  const { status: DELETE_GROUP_STATUS } = useAppSelector(
    (state) => state.deleteGroup
  );
  const { status: EDIT_GROUP_STATUS } = useAppSelector(
    (state) => state.getEditGroup
  );

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
    if (
      CREATE_GROUP_STATUS === API_STATUS.SUCCEEDED ||
      DELETE_GROUP_STATUS === API_STATUS.SUCCEEDED ||
      EDIT_GROUP_STATUS === API_STATUS.SUCCEEDED
    ) {
      getGroupData();
    }
  }, [CREATE_GROUP_STATUS, DELETE_GROUP_STATUS, EDIT_GROUP_STATUS]);

  return (
    <>
      <MediumTable
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
            <GroupDataRaw data={data} />
          </TableRow>
        ))}
      />
    </>
  );
};

export default GroupTable;
