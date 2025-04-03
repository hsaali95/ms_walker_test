import React, { useEffect, useMemo, useState } from "react";
import BasicModal from "../../components/modal/basic-modal";
import CustomInput from "../../components/input";
import { Box, Typography } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addSurveySchema } from "../../schemas/forms";
import CustomButton from "../../components/button";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hook";
import { addSurvey } from "../../redux/slices/agent/get-survey-slice";
import { getItem } from "../../redux/slices/item/get-item-slice";
import { getDisplayType } from "../../redux/slices/display/get-display-type-slice";
import { getSupplier } from "../../redux/slices/supplier/get-supplier-slice";
import {
  postUploadFile,
  removeFileIds,
  setFileIds,
} from "../../redux/slices/survey/file-upload-slice";
import FileUpload from "../../components/file-upload";
import { API_STATUS } from "@/utils/enums";
import SearchDropDown from "../../components/drop-down/SearchableDropDown";
import CircularProgressWithLabel from "../../components/circular-progress-bar";
import CustomCarousel from "../../components/custom-slider";
import Image from "next/image";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ActionButton from "../../components/action-buttons";
interface IModalForm {
  openModal: any;
  setOpenModal: any;
}

const SurveyModalForm = ({ openModal, setOpenModal }: IModalForm) => {
  const [filePathArray, setPaths] = useState<any>([]);
  const [selectedDisplayType, setSelectedDisplayType] = useState<any>([]);
  const [showSlider, setShowSlider] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: zodResolver(
      selectedDisplayType
        ? addSurveySchema.omit({
            supplier_name: selectedDisplayType?.supplier_name
              ? undefined
              : true,
            item_name: selectedDisplayType?.item_name ? undefined : true,
            number_of_cases: selectedDisplayType?.no_of_cases
              ? undefined
              : true,
            display_coast: selectedDisplayType?.display_cost ? undefined : true,
            notes: selectedDisplayType?.notes ? undefined : true,
            image: selectedDisplayType?.images ? undefined : true,
          })
        : addSurveySchema
    ),

    shouldUnregister: true,
  });
  const { data: Display_Data } = useAppSelector((state) => state.getDisplay);
  const { data: Item_Data } = useAppSelector((state) => state.getItem);
  const { data: Supplier_Data } = useAppSelector((state) => state.getSupplier);
  const { data: Account_Info } = useAppSelector((state) => state.accountById);
  const {
    status: fileUploadStatus,
    data: file_Data,
    fileIds,
    uploadProgress,
  } = useAppSelector((state) => state.fileUploadSurvey);
  const dispatch = useAppDispatch();
  const onSubmit = async (data: FieldValues) => {
    dispatch(
      addSurvey({
        display_coast: data.display_coast,
        image: data.image,
        notes: data.notes,
        number_of_cases: data.number_of_cases,
        other_item: data.other_item,
        display_id: data.display_type?.id,
        supplier_id: data.supplier_name?.id,
        item_id: data.item_name?.id,
        account_id: Account_Info?.id, //it is last selected account id
        show_image: filePathArray,
        display_type_show_name: data.display_type?.display_type,
        supplier_show_name: data.supplier_name?.vendorFullInfo,
        item_show_name: data.item_name?.ItemFullInfo,
        other_supplier: data?.other_supplier,
        file_id: fileIds,
        temp_Id: Date.now(), // Correct way to get the current timestamp
      })
    );
    setOpenModal(false);
    reset(); // Reset the form fields after submission
    setPaths([]);
    dispatch(removeFileIds());
    setSelectedDisplayType(null);
  };
  useEffect(() => {
    dispatch(getDisplayType());
    dispatch(getSupplier());
  }, [dispatch]);

  const handleFileUpload = async (event: any, filename: string) => {
    dispatch(
      postUploadFile({
        base64: event.split(",")[1],
        file_name: filename,
      })
    );
  };
  useEffect(() => {
    if (fileUploadStatus === API_STATUS.SUCCEEDED) {
      setValue("image", `${file_Data?.filePath}`, { shouldValidate: true });
      dispatch(setFileIds(Number(file_Data?.id)));
      setPaths((prev: any) => {
        return [...prev, `${file_Data?.publicUrlData}`];
      });
    }
  }, [fileUploadStatus]);

  useEffect(() => {
    const supplierId = getValues("supplier_name")?.id;
    if (supplierId) {
      dispatch(getItem(supplierId));
    }
  }, [getValues("supplier_name")]);

  return (
    <div>
      <BasicModal
        open={openModal}
        title="Add Survey"
        closeModal={() => {
          setOpenModal(false);
          setPaths([]);
          setShowSlider(false);
          setSelectedDisplayType(null);
          reset();
        }}
      >
        {showSlider ? (
          <Box>
            <ActionButton
              isIconButton
              icon={<KeyboardBackspaceIcon />}
              sx={{ color: "#4F131F" }}
              onClick={() => setShowSlider(false)}
            />
            <CustomCarousel>
              {filePathArray?.map((imageLink: any, i: number) => (
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
        ) : (
          <Box
            component={"form"}
            onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
          >
            <SearchDropDown
              label="Display Type"
              name="display_type"
              options={Display_Data}
              errorMessage={errors.display_type?.message as string}
              setValue={setValue}
              getValues={getValues}
              size="medium"
              displayKey={"display_type"}
              onChange={(value) => setSelectedDisplayType(value)}
            />

            <SearchDropDown
              label="Supplier Name"
              name="supplier_name"
              options={Supplier_Data}
              errorMessage={errors.supplier_name?.message as string}
              setValue={setValue}
              getValues={getValues}
              isVisible={selectedDisplayType?.supplier_name}
              size="medium"
              displayKey={"vendorFullInfo"}
            />

            <SearchDropDown
              label="Item Name"
              name="item_name"
              options={Item_Data}
              errorMessage={errors.item_name?.message as string}
              setValue={setValue}
              getValues={getValues}
              size="medium"
              displayKey={"ItemFullInfo"}
              isVisible={selectedDisplayType?.item_name}
              disabled={!getValues("supplier_name")}
            />
            {/* <CustomInput
              label="Other Supplier"
              placeholder="Other Supplier"
              name="other_supplier"
              register={register}
              errorMessage={errors?.other_supplier?.message as string}
              inputStyles={{ mb: 0 }}
            /> */}

            {/* <CustomInput
              label="Other Item"
              placeholder="Other Item"
              name="other_item"
              register={register}
              errorMessage={errors?.other_item?.message as string}
              inputStyles={{ mb: 0 }}
            /> */}
            <CustomInput
              label="Number of Cases"
              placeholder="Number of Cases"
              name="number_of_cases"
              register={register}
              errorMessage={errors?.number_of_cases?.message as string}
              inputStyles={{ mb: 0 }}
              isVisible={selectedDisplayType?.no_of_cases}
              type="number"
            />
            <CustomInput
              label={
                selectedDisplayType?.rename_display_cost
                  ? selectedDisplayType?.rename_display_cost
                  : "Display Cost"
              }
              placeholder={
                selectedDisplayType?.rename_display_cost
                  ? selectedDisplayType?.rename_display_cost
                  : "Display Cost"
              }
              name="display_coast"
              register={register}
              errorMessage={errors?.display_coast?.message as string}
              inputStyles={{ mb: 0 }}
              isVisible={selectedDisplayType?.display_cost}
              type="number"
            />

            <CustomInput
              label="Notes"
              placeholder="Notes"
              name="notes"
              register={register}
              errorMessage={errors?.notes?.message as string}
              isVisible={selectedDisplayType?.notes}
              inputStyles={{ mb: 1 }}
            />

            {selectedDisplayType?.images ? (
              <>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#2F0911",
                    textAlign: "right",
                  }}
                >{` Upload Images Count:${filePathArray.length}`}</Typography>
                {filePathArray.length ? (
                  <CustomButton
                    variant="outlined"
                    title="View Images"
                    onClick={() => setShowSlider(!showSlider)}
                  />
                ) : null}

                <FileUpload
                  fullWidth={true}
                  onChange={handleFileUpload}
                  errorMessage={errors?.image?.message as string}
                  fileStyles={{ mb: 1.5, mt: 1.5 }}
                  acceptType="image/png, image/jpeg"
                />
                {fileUploadStatus === API_STATUS.PENDING && (
                  <CircularProgressWithLabel value={uploadProgress} />
                )}
              </>
            ) : (
              ""
            )}

            <CustomButton
              loading={fileUploadStatus === API_STATUS.PENDING}
              type="submit"
              title="Add"
              // onClick={() => console.log(errors)}
            />
          </Box>
        )}
      </BasicModal>
    </div>
  );
};

export default SurveyModalForm;
