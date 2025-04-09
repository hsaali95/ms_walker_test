"use client";
import React, { useEffect } from "react";
import ActivityForm from "../../features/activity/activity-form";
import PagesHeader from "../../components/shared/pages-header";
import { useAppDispatch } from "../../hooks/redux-hook";
import { clearAccounts } from "../../redux/slices/account/get-account-slice";
import { clearAccountByIdData } from "../../redux/slices/account/get-account-by-id-slice";

const Activity = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(clearAccounts());
      dispatch(clearAccountByIdData());
    };
  }, [dispatch]);
  return (
    <>
      <PagesHeader title="Activity" />
      <ActivityForm />
    </>
  );
};

export default Activity;
