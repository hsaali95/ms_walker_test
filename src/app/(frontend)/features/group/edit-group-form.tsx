import React, { useEffect, useState } from "react";
import CustomButton from "../../components/button";
import BasicModal from "../../components/modal/basic-modal";
import { Box } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import CustomInput from "../../components/input";
import SearchDropDown from "../../components/drop-down/SearchableDropDown";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hook";
import CustomCheckbox from "../../components/check-box";
import { zodResolver } from "@hookform/resolvers/zod";
import { addGroupSchema } from "../../schemas/forms";
import { API_STATUS } from "@/utils/enums";
import { Toaster } from "../../components/snackbar";
import UsersList from "../../components/shared/selected-user-list";
import { editGroup } from "../../redux/slices/group/edit-group-slice";
const EditGroupModal = ({ openModal, setOpenModal, groupData }: any) => {
  const [usersList, setList] = useState([]);
  const { data: ACCESS_TYPE_DATA } = useAppSelector(
    (state) => state.getAccessType
  );
  const { data: USER_DATA } = useAppSelector((state) => state.getUsers);
  const { status: GROUP_STATUS } = useAppSelector(
    (state) => state.getEditGroup
  );
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
  const onSubmit = async (data: FieldValues) => {
    dispatch(
      editGroup({
        access_type_id: data.access_type?.id,
        name: data?.name,
        is_active: data?.is_active,
        users_list: usersList,
        id: groupData?.id, // it is group id
      })
    );
  };

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
    if (groupData) {
      reset({
        name: groupData?.name || "",
        access_type: groupData?.access_type || "",
        is_active: groupData?.is_active || false,
      });
      setList(
        groupData?.group_members?.map((data: any) => data?.users_group) || []
      );
    }
  }, [groupData, reset]);

  useEffect(() => {
    if (GROUP_STATUS === API_STATUS.SUCCEEDED) {
      reset();
      setList([]);
      setOpenModal(false);
    }
  }, [GROUP_STATUS]);
  const onDelete = (id: number | string) => {
    setList((prev: any) => prev.filter((user: any) => user.id !== id));
  };
  const closeModal = () => {
    reset();
    setOpenModal(false);
  };

  return (
    <>
      <div>
        <BasicModal open={openModal} title="Edit Group" closeModal={closeModal}>
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
                checked={getValues("is_active")} // Ensuring it's controlled
                onChange={(e) =>
                  setValue("is_active", e.target.checked, {
                    shouldValidate: true,
                  })
                }
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
            <UsersList users={usersList} onDelete={onDelete} />
            <CustomButton
              loading={GROUP_STATUS === API_STATUS.PENDING}
              type="submit"
              title="Edit"
            />
          </Box>
        </BasicModal>
      </div>
    </>
  );
};

export default EditGroupModal;
