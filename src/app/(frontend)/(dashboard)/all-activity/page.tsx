"use client";
import React, { useEffect } from "react";
import ActivityTable from "../../features/show-all-activity/activity-table";
import { useAppDispatch } from "../../hooks/redux-hook";
import { setActivityCsvIdle } from "../../redux/slices/activity/download-activity-csv-file";

const AllActivity = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(setActivityCsvIdle());
    };
  }, []);
  return (
    <>
      <ActivityTable />
    </>
  );
};

export default AllActivity;
