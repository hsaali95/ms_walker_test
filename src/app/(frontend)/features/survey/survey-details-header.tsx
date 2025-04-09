import React, { useState } from "react";
import { useAppSelector } from "../../hooks/redux-hook";
import { API_STATUS } from "@/utils/enums";
import PagesHeader from "../../components/shared/pages-header";
import SurveyModalForm from "./survey-modal-form";
const SurveyDetailsHeader = () => {
  const [openModal, setOpenModal] = useState(false);
  const { status } = useAppSelector((state) => state.accountById);

  const handleOpenModal = () => setOpenModal(true);

  return (
    <>
      <PagesHeader
        title="Survey Details"
        buttonTitle="Add"
        onButtonClick={handleOpenModal}
        buttonDisable={status === API_STATUS.IDLE}
      />
      <SurveyModalForm openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
};

export default SurveyDetailsHeader;
