"use client";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomInput from "../../components/input";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userResetPasswordSchema } from "../../schemas/forms";
import CustomButton from "../../components/button";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hook";
import { API_STATUS } from "@/utils/enums";
import { useRouter } from "next/navigation";
import Ms_walker from "../../../../../public/assets/svg/ms_walker_black.svg";
import Image from "next/image";
import { getUserData } from "@/utils/helper";
import { resetUserPassword } from "../../redux/slices/auth/login-user-reset-password-slice";
const ResetPassword = () => {
  const [userData, setUserData] = useState<any>();

  const dispatch = useAppDispatch();
  const { status, data: LOGIN_USER_DATA } = useAppSelector(
    (state) => state.resetLoginUserPassword
  );
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: zodResolver(userResetPasswordSchema),
  });
  const onSubmit = async (data: FieldValues) => {
    console.log("resetdata", data);
    const { password } = data;
    dispatch(
      resetUserPassword({
        userId: userData?.id,
        newPassword: password,
      })
    );
  };

  useEffect(() => {
    if (status === API_STATUS.SUCCEEDED) {
      router.push("/login");
    }
  }, [status, router, LOGIN_USER_DATA]);
  useEffect(() => {
    getUserData()
      .then((res) => {
        // const role = res?.user?.role_id;
        setUserData(res?.user);
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, []);
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={{ height: "100vh" }}
    >
      <Box>
        <Image
          objectFit="cover"
          src={Ms_walker}
          alt={"Ms_walker"}
          style={{ width: "100%" }}
        />
      </Box>
      <Box
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: { xs: "100%", sm: "100%" },
          maxWidth: "400px",
          px: { xs: 3, sm: 0 },
        }}
      >
        <CustomInput
          label="Password"
          placeholder="Password"
          name="password"
          isPasswordField
          type="text"
          register={register}
          errorMessage={errors?.password?.message as string}
          inputStyles={{ mb: 2 }}
        />
        <CustomInput
          label="Confirm Password"
          placeholder="Confirm Password"
          name="confirmPassword"
          isPasswordField
          type="text"
          register={register}
          inputStyles={{ mb: 2 }}
          errorMessage={errors?.confirmPassword?.message as string}
        />

        <CustomButton
          type="submit"
          title="Reset"
          loading={status === API_STATUS.PENDING}
        />
      </Box>
    </Box>
  );
};

export default ResetPassword;
