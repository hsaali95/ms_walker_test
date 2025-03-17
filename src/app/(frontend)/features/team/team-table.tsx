import {
  useAppDispatch,
  useAppSelector,
} from "@/app/(frontend)/hooks/redux-hook";

import { TEAM_TABLE_COLUMN } from "@/utils/constant";
import { TableRow } from "@mui/material";
import React, { useEffect } from "react";

import {
  getPaginatedTeams,
  setTeamPage,
  setTeamRowsPerPage,
} from "../../redux/slices/team/get-paginated-team-slice";
import TeamDataRaw from "./team-data-row";
import { API_STATUS } from "@/utils/enums";
import MediumTable from "../../components/tables/medium-table/medium-table";

const TeamTable = () => {
  const {
    teamPaginationInfo,
    data: TEAM_DATA,
    status: TEAM_STATUS,
  } = useAppSelector((state) => state.getTeam);
  const { status: CREATED_TEAM_STATUS } = useAppSelector(
    (state) => state.createTeam
  );
  const { page, pageSize } = teamPaginationInfo;
  const { status: EDIT_TEAM_STATUS } = useAppSelector(
    (state) => state.geteditTeamSlice
  );
  const { status: DELETE_TEAM_STATUS } = useAppSelector(
    (state) => state.getDeleteTeam
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    getTeamData();
  }, [page, pageSize]);

  const getTeamData = () => {
    dispatch(
      getPaginatedTeams({
        page: page + 1,
        recordsPerPage: pageSize,
      })
    );
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(setTeamPage(newPage));
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setTeamRowsPerPage(parseInt(event.target.value, 10)));
    dispatch(setTeamPage(0));
  };
  useEffect(() => {
    if (
      CREATED_TEAM_STATUS === API_STATUS.SUCCEEDED ||
      EDIT_TEAM_STATUS === API_STATUS.SUCCEEDED ||
      DELETE_TEAM_STATUS === API_STATUS.SUCCEEDED
    ) {
      getTeamData();
    }
  }, [CREATED_TEAM_STATUS, EDIT_TEAM_STATUS, DELETE_TEAM_STATUS]);

  return (
    <>
      <MediumTable
        tableLoading={TEAM_STATUS === API_STATUS.PENDING}
        tableColumns={TEAM_TABLE_COLUMN}
        isPagination
        count={TEAM_DATA?.count || 0}
        page={page}
        rowsPerPage={pageSize}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        tableBody={TEAM_DATA?.rows?.map((data: any, index: number) => (
          <TableRow key={index}>
            <TeamDataRaw data={data} />
          </TableRow>
        ))}
      />
    </>
  );
};

export default TeamTable;
