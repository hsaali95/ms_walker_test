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

interface IUserDataRaw {
  data: any;
}

const UserDataRaw: React.FC<IUserDataRaw> = ({ data }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const { status: RESET_PASSWORD_STATUS } = useAppSelector(
    (state) => state.resetPassword
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
  return (
    <>
      <TableCellWithText text={data?.name} />
      <TableCellWithText text={data?.email} />
      <TableCellWithText text={data?.role?.name} />
      <TableCellWithText
        isEditButton
        onEdit={() => {
          setOpenModal(true);
          setUserId(data?.id);
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
    </>
  );
};

export default UserDataRaw;
