"use client";
import React, { useEffect } from "react";
import SurveyTable from "../../features/show-all-survey/survey-table";
import { useAppDispatch } from "../../hooks/redux-hook";
import {
  clearAllSurveyFields,
  clearSurveyTableData,
  setSurveyPage,
  setSurveyRowsPerPage,
} from "../../redux/slices/survey/get-survey-slice";
import { setCsvIdle } from "../../redux/slices/survey/download-file-slice";
import { setPdfIdle } from "../../redux/slices/survey/download-file-pdf-slice";

const AllSurvey = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(clearSurveyTableData());
      dispatch(clearAllSurveyFields());
      dispatch(setCsvIdle());
      dispatch(setPdfIdle());
      dispatch(setSurveyPage(0));
      dispatch(setSurveyRowsPerPage(10));
    };
  }, [dispatch]);
  return (
    <>
      <SurveyTable />
    </>
  );
};

export default AllSurvey;
