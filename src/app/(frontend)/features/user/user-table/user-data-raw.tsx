import React, { useEffect, useState } from "react";
import BasicModal from "@/app/(frontend)/components/modal/basic-modal";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/app/(frontend)/schemas/forms";
import {
  useAppDispatch,
  useAppSelector,
} from "@/app/(frontend)/hooks/redux-hook";
import { Box } from "@mui/material";
import CustomInput from "@/app/(frontend)/components/input";
import CustomButton from "@/app/(frontend)/components/button";
import { resetPassword } from "@/app/(frontend)/redux/slices/register-user/user-reset-password-slice";
import { API_STATUS } from "@/utils/enums";
import TableCellWithText from "@/app/(frontend)/components/tables/medium-table/table-cell-with-text";
import { deleteUser } from "@/app/(frontend)/redux/slices/register-user/delete-user-slice";

interface IUserDataRaw {
  data: any;
}

const UserDataRaw: React.FC<IUserDataRaw> = ({ data }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const { status: RESET_PASSWORD_STATUS } = useAppSelector(
    (state) => state.resetPassword
  );
  const { status: DELETE_USER_STATUS } = useAppSelector(
    (state) => state.deleteUser
  );
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: zodResolver(resetPasswordSchema),
  });
  const onSubmit = async (data: FieldValues) => {
    dispatch(
      resetPassword({
        userId: Number(userId),
        newPassword: data.password,
      })
    );
  };
  useEffect(() => {
    if (RESET_PASSWORD_STATUS === API_STATUS.SUCCEEDED) {
      reset();
      setOpenModal(false);
    }
  }, [RESET_PASSWORD_STATUS]);
  useEffect(() => {
    if (DELETE_USER_STATUS === API_STATUS.SUCCEEDED) {
      setDeleteModal(false);
    }
  }, [DELETE_USER_STATUS]);
  const closeDeleteModal = () => {
    setDeleteModal(false);
  };
  return (
    <>
      <TableCellWithText text={data?.name} />
      <TableCellWithText text={data?.last_name} />
      <TableCellWithText text={data?.email} />
      <TableCellWithText text={data?.role?.name} />
      <TableCellWithText
        text={
          data?.users_groups?.length
            ? data?.users_groups
                .map((group: any) => group?.group_memebrs_with_group?.name)
                .filter(Boolean)
                .join(" | ")
            : "-"
        }
      />
      <TableCellWithText
        text={
          data?.users_teams?.length || data?.users_team_manager
            ? [
                ...data.users_teams?.map(
                  (team: any) => team?.team_memebrs_with_team?.name
                ),
                ...data.users_team_manager?.map(
                  (team: any) => team.team_manager_with_team?.name
                ),
              ]
                .filter(Boolean) // Remove null/undefined values
                .filter((value, index, self) => self.indexOf(value) === index) // Deduplicate
                .join("|")
            : "-"
        }
      />
      <TableCellWithText
        isEditButton
        isDeleteButton
        onEdit={() => {
          setOpenModal(true);
          setUserId(data?.id);
        }}
        onDelete={() => {
          setDeleteModal(true);
          setUserId(data.id);
        }}
      />
      <BasicModal
        open={openModal}
        title="Reset Password"
        closeModal={() => {
          setOpenModal(false);
          reset();
        }}
      >
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
          <CustomInput
            label="Password"
            placeholder="Password"
            name="password"
            isPasswordField
            type="text"
            register={register}
            errorMessage={errors?.password?.message as string}
            inputStyles={{
              mb: 2,
            }}
          />
          <CustomInput
            label="Confirm Password"
            placeholder="Confirm Password"
            name="confirmPassword"
            isPasswordField
            type="text"
            register={register}
            errorMessage={errors?.confirmPassword?.message as string}
            inputStyles={{
              mb: 2,
            }}
          />
          <CustomButton
            loading={RESET_PASSWORD_STATUS === API_STATUS.PENDING}
            type="submit"
            title="Reset"
          />
        </Box>
      </BasicModal>
      <BasicModal
        open={deleteModal}
        cancelModal={closeDeleteModal}
        isDialogActions
        deleteLoading={API_STATUS.PENDING === DELETE_USER_STATUS}
        onDelete={() =>
          dispatch(
            deleteUser({
              userId: userId,
            })
          )
        }
        modalMessage={"Are you sure you want to delete this user?"}
      />
    </>
  );
};

export default UserDataRaw;
