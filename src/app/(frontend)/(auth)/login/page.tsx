"use client";
import { Box } from "@mui/material";
import React, { useEffect } from "react";
import CustomInput from "../../components/input";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/forms";
import CustomButton from "../../components/button";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hook";
import { postLogin, setLoginIdle } from "../../redux/slices/auth/login-slice";
import { API_STATUS, ROLE } from "@/utils/enums";
import { useRouter } from "next/navigation";
import Ms_walker from "../../../../../public/assets/svg/ms_walker_black.svg";
import Image from "next/image";
const Login = () => {
  const dispatch = useAppDispatch();
  const { status, data: LOGIN_USER_DATA } = useAppSelector(
    (state) => state.login
  );
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data: FieldValues) => {
    const { email, password } = data;
    dispatch(
      postLogin({
        email,
        password,
      })
    );
  };

  useEffect(() => {
    if (status === API_STATUS.SUCCEEDED) {
      console.log("LOGIN_USER_DATA", LOGIN_USER_DATA.is_new);
      if (LOGIN_USER_DATA.is_new) {
        router.push("/reset-password");
      } else {
        if (LOGIN_USER_DATA?.role_id === ROLE.ADMIN) {
          router.push("/all-survey");
        } else if (LOGIN_USER_DATA?.role_id === ROLE.AGENT) {
          router.push("/survey");
        } else if (LOGIN_USER_DATA?.role_id === ROLE.MANAGER) {
          router.push("/survey");
        }
      }
    }
  }, [status, router, LOGIN_USER_DATA]);

  useEffect(() => {
    return () => {
      dispatch(setLoginIdle());
    };
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
          label="Email"
          placeholder="Email"
          name="email"
          register={register}
          errorMessage={errors?.email?.message as string}
          inputStyles={{ mb: 2 }}
        />
        <CustomInput
          label="Password"
          placeholder="Password"
          name="password"
          type="text"
          register={register}
          errorMessage={errors?.password?.message as string}
          isPasswordField
          inputStyles={{ mb: 2 }}
        />

        <CustomButton
          type="submit"
          title="Login"
          loading={status === API_STATUS.PENDING}
        />
      </Box>
    </Box>
  );
};

export default Login;
