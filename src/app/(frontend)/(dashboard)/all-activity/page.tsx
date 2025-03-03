"use client";
import React, { useEffect } from "react";
import ActivityTable from "../../features/show-all-activity/activity-table";
import { useAppDispatch } from "../../hooks/redux-hook";
import { setActivityCsvIdle } from "../../redux/slices/activity/download-activity-csv-file";
import {
  clearActivityTableData,
  clearAllActivityFields,
  setActivityPage,
} from "../../redux/slices/activity/get-activity-slice";

const AllActivity = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(setActivityCsvIdle());
      dispatch(clearAllActivityFields());
      dispatch(clearActivityTableData());
      dispatch(setActivityPage(0));
    };
  }, []);
  return (
    <>
      <ActivityTable />
    </>
  );
};

export default AllActivity;
