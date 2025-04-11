import React, { useEffect, useState } from "react";
import CustomButton from "../../components/button";
import BasicModal from "../../components/modal/basic-modal";
import { Box } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import CustomInput from "../../components/input";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hook";
import CustomCheckbox from "../../components/check-box";
import { zodResolver } from "@hookform/resolvers/zod";
import { editTeamSchema } from "../../schemas/forms";
import { API_STATUS } from "@/utils/enums";
import { Toaster } from "../../components/snackbar";
import SearchDropDown from "../../components/drop-down/SearchableDropDown";
import UsersList from "../../components/shared/selected-user-list";
import { editTeam } from "../../redux/slices/team/edit-team-slice";

const EditTeamModal = ({ openModal, setOpenModal, teamData }: any) => {
  const [usersList, setList] = useState([]);
  const { data: MANAGER_DATA } = useAppSelector((state) => state.getManager);

  const { status: TEAM_STATUS } = useAppSelector(
    (state) => state.geteditTeamSlice
  );
  const { data: USER_DATA } = useAppSelector((state) => state.getUsers);
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
    resolver: zodResolver(editTeamSchema),
  });
  const onSubmit = async (data: FieldValues) => {
    if (!usersList.length) {
      Toaster("info", "One user at least must be in the user list",1);
      return;
    }
    dispatch(
      editTeam({
        id: teamData.id,
        name: data.name,
        is_active: data.is_active,
        users_list: usersList,
        manager_id: data.manager.id,
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
  console.log("teamData", teamData);
  useEffect(() => {
    if (TEAM_STATUS === API_STATUS.SUCCEEDED) {
      reset();
      setList([]);
      setOpenModal(false);
    }
  }, [TEAM_STATUS]);
  useEffect(() => {
    if (teamData) {
      reset({
        name: teamData?.name || "",
        is_active: teamData?.is_active || false,
        manager: teamData?.team_managers?.length
          ? teamData?.team_managers[0]?.user
          : null,
      });
      setList(
        teamData?.team_members?.map((data: any) => data?.teams_group) || []
      );
    }
  }, [teamData, reset]);
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
        <BasicModal open={openModal} title="Edit Team" closeModal={closeModal}>
          <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
            <CustomInput
              label="Name"
              placeholder="Name"
              name="name"
              register={register}
              errorMessage={errors?.name?.message as string}
            />

            <SearchDropDown
              label="Manager"
              name="manager"
              options={MANAGER_DATA}
              errorMessage={errors.manager?.message as string}
              setValue={setValue}
              getValues={getValues}
              size="medium"
              displayKey={"email"}
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
              loading={TEAM_STATUS === API_STATUS.PENDING}
              type="submit"
              title="Edit"
            />
          </Box>
        </BasicModal>
      </div>
    </>
  );
};

export default EditTeamModal;
