"use client";
import { useEffect } from "react";
import AddGroupModal from "../../features/group/add-group-form";
import GroupTable from "../../features/group/group-table";
import { useAppDispatch } from "../../hooks/redux-hook";
import { clearAccessType } from "../../redux/slices/group/access-type-slice";
import { clearUsers } from "../../redux/slices/register-user/get-user-slice";
import {
  clearGroupsTableData,
  setGroupPage,
  setGroupRowsPerPage,
} from "../../redux/slices/group/get-paginated-group-slice";

const Group = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(clearAccessType());
      dispatch(clearUsers());
      dispatch(clearGroupsTableData());
      dispatch(setGroupPage(0));
      dispatch(setGroupRowsPerPage(10));
    };
  }, [dispatch]);
  return (
    <>
      <AddGroupModal />
      <GroupTable />
    </>
  );
};

export default Group;
