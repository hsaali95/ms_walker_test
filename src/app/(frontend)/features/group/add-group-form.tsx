import React, { useEffect, useState } from "react";
import CustomButton from "../../components/button";
import BasicModal from "../../components/modal/basic-modal";
import { Box, Typography } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import CustomInput from "../../components/input";
import SearchDropDown from "../../components/drop-down/SearchableDropDown";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hook";
import { getAccessType } from "../../redux/slices/group/access-type-slice";
import { getusers } from "../../redux/slices/register-user/get-user-slice";
import CustomCheckbox from "../../components/check-box";
import { zodResolver } from "@hookform/resolvers/zod";
import { addGroupSchema } from "../../schemas/forms";
import { createGroup } from "../../redux/slices/group/add-group-slice";
import { API_STATUS } from "@/utils/enums";
import ActionButton from "../../components/action-buttons";
import ClearIcon from "@mui/icons-material/Clear";
import PagesHeader from "../../components/shared/pages-header";
import { Toaster } from "../../components/snackbar";
const AddGroupModal = () => {
  const [openModal, setOpenModal] = useState(false);
  const [usersList, setList] = useState([]);
  const { data: ACCESS_TYPE_DATA } = useAppSelector(
    (state) => state.getAccessType
  );
  const { data: USER_DATA } = useAppSelector((state) => state.getUsers);
  const { status: GROUP_STATUS } = useAppSelector((state) => state.createGroup);
  const dispatch = useAppDispatch();
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
    resolver: zodResolver(addGroupSchema),
  });
  const handleOpenModal = () => setOpenModal(true);
  const onSubmit = async (data: FieldValues) => {
    console.log("data", data);
    dispatch(
      createGroup({
        access_type_id: data.access_type.id,
        name: data.name,
        is_active: data.is_active,
        users_list: usersList,
      })
    );
  };
  useEffect(() => {
    dispatch(getAccessType());
    dispatch(getusers());
  }, [dispatch]);

  const addUsers = () => {
    const email = getValues("email");
    if (email) {
      setList((prev: any) => {
        const emailExists = prev.find(
          (item: any) => Number(item.id) === Number(email.id)
        );
        if (!emailExists) {
          return [...prev, email];
        }
        Toaster("error", "User already exists in list");
        return prev;
      });
    }
  };
  useEffect(() => {
    if (GROUP_STATUS === API_STATUS.SUCCEEDED) {
      reset();
      setList([]);
      setOpenModal(false);
    }
  }, [GROUP_STATUS]);
  const onDelete = (id: number) => {
    setList((prev: any) => prev.filter((user: any) => user.id !== id));
  };
  const closeModal = () => {
    reset();
    setOpenModal(false);
  };

  return (
    <>
      <PagesHeader
        title="Groups"
        buttonTitle="Add"
        buttonFullWidth={false}
        onButtonClick={handleOpenModal}
      />

      <div>
        <BasicModal open={openModal} title="Add Group" closeModal={closeModal}>
          <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
            <CustomInput
              label="Name"
              placeholder="Name"
              name="name"
              register={register}
              errorMessage={errors?.name?.message as string}
            />
            <SearchDropDown
              label="Access type"
              name="access_type"
              options={ACCESS_TYPE_DATA?.accessTypes}
              errorMessage={errors.access_type?.message as string}
              setValue={setValue}
              getValues={getValues}
              size="medium"
              displayKey={"name"}
            />

            <SearchDropDown
              label="Users"
              name="email"
              options={USER_DATA}
              errorMessage={errors.email?.message as string}
              setValue={setValue}
              getValues={getValues}
              size="medium"
              displayKey={"fullNameWithEmail"}
            />
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              alignContent={"center"}
              sx={{ mt: 1 }}
            >
              <CustomCheckbox
                name="is_active"
                label="Active"
                register={register}
                errorMessage={errors?.is_active?.message as string}
              />

              <CustomButton
                fullWidth={false}
                onClick={addUsers}
                title="Add"
                type="button"
                buttonStyles={{
                  width: "fit-content",
                  py: 0.5,
                }}
              />
            </Box>
            <Typography
              component={"h6"}
              variant="h6"
              sx={{ fontSize: "0.8rem", fontWeight: 600, mb: 1 }}
            >
              Users List
            </Typography>
            <Box
              sx={{
                maxHeight: "100px",
                overflowY: "auto",
                overflowX: "hidden",
                mb: 1,
              }}
            >
              {usersList?.map((data: any, i: number) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.9,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#4F131F",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    <Box component={"span"}>{data.name}</Box>
                    <Box component={"span"} sx={{ ml: 1 }}>
                      {`(${data.email})`}
                    </Box>
                  </Typography>
                  <ActionButton
                    onClick={() => onDelete(data.id)}
                    icon={<ClearIcon />}
                    isIconButton
                    sx={{
                      color: "#4F131F",
                      "& .MuiSvgIcon-root": {
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>

            <CustomButton
              loading={GROUP_STATUS === API_STATUS.PENDING}
              type="submit"
              title="Submit "
            />
          </Box>
        </BasicModal>
      </div>
    </>
  );
};

export default AddGroupModal;
