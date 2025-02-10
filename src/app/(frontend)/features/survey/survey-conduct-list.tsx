import { Survey_Column } from "@/utils/constant";
import { Box, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hook";
import CustomButton from "../../components/button";
import { postSurvey } from "../../redux/slices/survey/add-survey-slice";
import { API_STATUS } from "@/utils/enums";
import {
  deleteAllSurvey,
  removeSurveyByTempId,
} from "../../redux/slices/agent/get-survey-slice";
import BasicTable from "../../components/tables/basic-table/basic-table";
import TableCellWithText from "../../components/tables/basic-table/table-cell-with-text";
import BasicModal from "../../components/modal/basic-modal";
import Image from "next/image";
import CustomCarousel from "../../components/custom-slider";

const SurveyConductList = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [imageData, setImageData] = useState<any>([]);
  const { surveyData } = useAppSelector((state) => state.survey);
  const { status: surveyStatus } = useAppSelector((state) => state.addSurvey);
  const { fileIds } = useAppSelector((state) => state.fileUploadSurvey);
  const dispatch = useAppDispatch();

  const submitSurvey = () => {
    dispatch(postSurvey({ surveyData: surveyData, file_id: fileIds }));
  };

  useEffect(() => {
    if (surveyStatus === API_STATUS.SUCCEEDED) {
      dispatch(deleteAllSurvey());
    }
  }, [surveyStatus]);

  const renderData = (data: any) => (
    <>
      <TableCellWithText text={data?.display_type_show_name} />
      <TableCellWithText text={data?.supplier_show_name} />
      <TableCellWithText text={data?.other_supplier} />
      <TableCellWithText text={data?.item_show_name} />
      <TableCellWithText text={data?.other_item} />
      <TableCellWithText text={data?.number_of_cases} />
      <TableCellWithText text={data?.display_coast} />
      <TableCellWithText
        forBasic="center"
        isViewButton
        onView={() => {
          setOpenModal(true);
          console.log("data.show_image", data.show_image);
          setImageData(data.show_image);
        }}
      />
      <TableCellWithText
        forBasic="center"
        isDeleteButton={true}
        onDelete={() => dispatch(removeSurveyByTempId(data?.temp_Id))}
      />
    </>
  );

  return (
    <>
      <BasicTable
        tableColumns={Survey_Column}
        tableBody={surveyData?.map((data, index) => (
          <TableRow key={index}>{renderData(data)}</TableRow>
        ))}
      />
      {surveyData.length ? (
        <Box sx={{ maxWidth: "150px", mt: 1.5 }}>
          <CustomButton
            loading={surveyStatus === API_STATUS.PENDING}
            title="Submit"
            onClick={submitSurvey}
          />
        </Box>
      ) : null}
      <BasicModal
        open={openModal}
        title="Survey Images"
        closeModal={() => setOpenModal(false)}
      >
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          }}
        >
          <CustomCarousel>
            {imageData?.map((imageLink: any, i: number) => (
              <Box
                key={i}
                style={{
                  position: "relative",
                  width: "100%", // Full width
                  paddingTop: "100%", // Maintain a 1:1 aspect ratio
                  borderRadius: "8px",
                  overflow: "hidden", // Prevent image overflow
                }}
              >
                <Image
                  src={imageLink || ""}
                  alt={`Survey Image ${i + 1}`}
                  fill
                  style={{
                    objectFit: "cover", // Ensures the image fills the container
                  }}
                  sizes="(max-width: 600px) 100vw, 600px"
                />
              </Box>
            ))}
          </CustomCarousel>
        </Box>
      </BasicModal>
    </>
  );
};

export default SurveyConductList;
