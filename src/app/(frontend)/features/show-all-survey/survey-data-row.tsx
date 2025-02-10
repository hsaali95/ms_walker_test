import React, { useState } from "react";
import { Box, MenuItem } from "@mui/material";
import TableCellWithText from "../../components/tables/basic-table/table-cell-with-text";
import ActionMenu from "../../components/action-menu";
import { patchSurveyStatus } from "../../redux/slices/survey/update-survey-status-slic";
import { deleteSurvey } from "../../redux/slices/survey/delete-survey-slice";
import { SURVEY_STATUS_ID } from "@/utils/enums";
import Image from "next/image";
import { SURVEY_IMAGE_BASE_URL } from "@/utils/constant";
import { useAppDispatch } from "../../hooks/redux-hook";
import BasicModal from "../../components/modal/basic-modal";
import CustomCarousel from "../../components/custom-slider";

interface SurveyDataRowProps {
  data: any;
}

const SurveyDataRow: React.FC<SurveyDataRowProps> = ({ data }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [surveyFiles, setSurveyFiles] = useState<any>([]);
  const dispatch = useAppDispatch();
  return (
    <>
      <TableCellWithText text={data?.supplier?.vendorFullInfo} />
      <TableCellWithText text={data?.item?.ItemFullInfo} />
      <TableCellWithText text={data?.account?.customerName} />
      <TableCellWithText text={data?.account?.custNumber} />
      <TableCellWithText text={data?.account?.city} />
      <TableCellWithText text={data?.display?.display_type} />
      <TableCellWithText text={data?.display_coast} />
      <TableCellWithText text={data?.other_supplier} />
      <TableCellWithText text={data?.other_item} />
      <TableCellWithText text={data?.number_of_cases} />
      <TableCellWithText text={data?.notes} />
      <TableCellWithText text={data?.survey_status?.status} />
      <TableCellWithText
        isViewButton
        onView={() => {
          setOpenModal(true);
          setSurveyFiles(data?.survey_file);
        }}
      />
      <TableCellWithText
        text={
          <ActionMenu>
            <MenuItem
              sx={{
                "&:hover": {
                  backgroundColor: "#4F131F",
                  color: "#fff",
                  fontWeight: 700,
                },
              }}
              onClick={() =>
                dispatch(
                  patchSurveyStatus({
                    ids: [data.id],
                    survey_status_id: SURVEY_STATUS_ID.APPROVED,
                  })
                )
              }
            >
              Approve
            </MenuItem>
            <MenuItem
              sx={{
                "&:hover": {
                  backgroundColor: "#4F131F",
                  color: "#fff",
                  fontWeight: 700,
                },
              }}
              onClick={() =>
                dispatch(
                  patchSurveyStatus({
                    ids: [data.id],
                    survey_status_id: SURVEY_STATUS_ID.REJECTED,
                  })
                )
              }
            >
              Reject
            </MenuItem>
            <MenuItem
              sx={{
                "&:hover": {
                  backgroundColor: "#4F131F",
                  color: "#fff",
                  fontWeight: 700,
                },
              }}
              onClick={() =>
                dispatch(
                  patchSurveyStatus({
                    ids: [data.id],
                    survey_status_id: SURVEY_STATUS_ID.COMPLETED,
                  })
                )
              }
            >
              Complete
            </MenuItem>
            <MenuItem
              sx={{
                "&:hover": {
                  backgroundColor: "#4F131F",
                  color: "#fff",
                  fontWeight: 700,
                },
              }}
              onClick={() =>
                dispatch(
                  patchSurveyStatus({
                    ids: [data.id],
                    survey_status_id: SURVEY_STATUS_ID.PROCEEDED,
                  })
                )
              }
            >
              Proceed
            </MenuItem>
            <MenuItem
              sx={{
                "&:hover": {
                  backgroundColor: "#4F131F",
                  color: "#fff",
                  fontWeight: 700,
                },
              }}
              onClick={() =>
                dispatch(
                  deleteSurvey({
                    id: [data.id],
                  })
                )
              }
            >
              Delete
            </MenuItem>
          </ActionMenu>
        }
      />
      <BasicModal
        open={openModal}
        title="Survey Images"
        closeModal={() => setOpenModal(false)}
      >
        <CustomCarousel>
          {surveyFiles?.map((data: any, i: number) => (
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
                src={`${SURVEY_IMAGE_BASE_URL}${data?.file?.path}` || ""}
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
      </BasicModal>
    </>
  );
};

export default SurveyDataRow;
