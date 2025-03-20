"use client";
import React, { useEffect } from "react";
import AddTeamModal from "../../features/team/add-team-form";
import TeamTable from "../../features/team/team-table";
import { useAppDispatch } from "../../hooks/redux-hook";
import { clearUsers } from "../../redux/slices/register-user/get-user-slice";
import { clearManager } from "../../redux/slices/managers/get-manager-slice";
import {
  clearTeamTableData,
  setTeamPage,
  setTeamRowsPerPage,
} from "../../redux/slices/team/get-paginated-team-slice";

const Team = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(clearUsers());
      dispatch(clearManager());
      dispatch(clearTeamTableData());
      dispatch(setTeamPage(0));
      dispatch(setTeamRowsPerPage(10));
    };
  }, [dispatch]);
  return (
    <>
      <AddTeamModal />
      <TeamTable />
    </>
  );
};

export default Team;
