"use client";
import React, { useEffect } from "react";
import PagesHeader from "../../components/shared/pages-header";
import SurveyAccountForm from "../../features/survey/survey-account-form";
import SurveyDetailsHeader from "../../features/survey/survey-details-header";
import SurveyConductList from "../../features/survey/survey-conduct-list";
import { useAppDispatch } from "../../hooks/redux-hook";
import { deleteAllSurvey } from "../../redux/slices/agent/get-survey-slice";
import { clearAccounts } from "../../redux/slices/account/get-account-slice";
import { clearAccountByIdData } from "../../redux/slices/account/get-account-by-id-slice";
import { clearSupplier } from "../../redux/slices/supplier/get-supplier-slice";
import { clearDisplayType } from "../../redux/slices/display/get-display-type-slice";
import { clearItem } from "../../redux/slices/item/get-item-slice";

const Survey = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(clearAccounts());
      dispatch(clearAccountByIdData());
      dispatch(deleteAllSurvey());
      dispatch(clearSupplier());
      dispatch(clearDisplayType());
      dispatch(clearItem());
    };
  }, [dispatch]);
  return (
    <>
      <PagesHeader title="Survey" />
      <SurveyAccountForm />
      <SurveyDetailsHeader />
      <SurveyConductList />
    </>
  );
};

export default Survey;
