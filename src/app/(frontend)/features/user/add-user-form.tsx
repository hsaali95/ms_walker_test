import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hook";
import { getRoles } from "../../redux/slices/roles/get-role-slice";
import { Box } from "@mui/material";
import CustomInput from "../../components/input";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema } from "../../schemas/forms";
import SearchDropDown from "../../components/drop-down/SearchableDropDown";
import CustomButton from "../../components/button";
import { registerUser } from "../../redux/slices/register-user/register-user-slice";
import { API_STATUS } from "@/utils/enums";
import FileUpload from "../../components/file-upload";
import { postUploadUserProfile } from "../../redux/slices/register-user/upload-user-profile-slice";
import PagesHeader from "../../components/shared/pages-header";
import Grid from "@mui/material/Grid2";
import BackdropLoader from "../../components/backdrop-loader";
import CircularProgressWithLabel from "../../components/circular-progress-bar";

const AddUserForm = () => {
  const { data: ROLES_DATA, status: ROLES_STATUS } = useAppSelector(
    (state) => state.getUserRoles
  );
  const { status: ADD_USER_STATUS } = useAppSelector(
    (state) => state.registerUser
  );
  const {
    data: USER_PROFILE_IMAGE_DATA,
    status: PROFILE_STATUS,
    uploadProgress,
  } = useAppSelector((state) => state.uploadUserProfile);
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
    resolver: zodResolver(registerUserSchema),
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);
  useEffect(() => {
    if (PROFILE_STATUS === API_STATUS.SUCCEEDED) {
      setValue("image", `${USER_PROFILE_IMAGE_DATA?.filePath}`, {
        shouldValidate: true,
      });
    }
  }, [PROFILE_STATUS]);
  const onSubmit = async (data: FieldValues) => {
    console.log("data", data);
    dispatch(
      registerUser({
        name: data.username,
        email: data.email,
        password: data.password,
        role_id: data?.name?.id,
        image: `${USER_PROFILE_IMAGE_DATA?.filePath}`,
        last_name: data.lastname,
      })
    );
  };
  useEffect(() => {
    if (ADD_USER_STATUS === API_STATUS.SUCCEEDED) {
      reset();
    }
  }, [ADD_USER_STATUS]);
  const handleFileUpload = async (event: any, filename: string) => {
    dispatch(
      postUploadUserProfile({
        base64: event,
        file_name: filename,
      })
    );
  };
  console.log("errors", errors);
  if (ROLES_STATUS === API_STATUS.PENDING) {
    return <BackdropLoader />;
  }
  return (
    <>
      <PagesHeader title="Register User" />
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          columnSpacing={{ xs: 0, sm: 2 }}
          rowSpacing={{ xs: 1, sm: 1 }}
        >
          <Grid
            size={{
              xs: 12,
              lg: 6,
            }}
          >
            <CustomInput
              label="First Name"
              placeholder="First Name"
              name="username"
              register={register}
              errorMessage={errors?.username?.message as string}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6,
            }}
          >
            <CustomInput
              label="Last Name"
              placeholder="Last Name"
              name="lastname"
              register={register}
              errorMessage={errors?.lastname?.message as string}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6,
            }}
          >
            <CustomInput
              label="Email"
              placeholder="Email"
              name="email"
              register={register}
              errorMessage={errors?.email?.message as string}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6,
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
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6,
            }}
          >
            <CustomInput
              label="Confirm Password"
              placeholder="Confirm Password"
              name="confirmPassword"
              isPasswordField
              type="text"
              register={register}
              errorMessage={errors?.confirmPassword?.message as string}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6,
            }}
          >
            <SearchDropDown
              label="Roles"
              name="name"
              options={ROLES_DATA}
              errorMessage={errors.name?.message as string}
              setValue={setValue}
              getValues={getValues}
              size="medium"
              displayKey={"name"}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: { xs: 1, md: 2, xl: 3 },
            mt: { xs: 1, md: 2, xl: 3 },
          }}
        >
          <FileUpload
            title="Profile image"
            onChange={handleFileUpload}
            errorMessage={errors?.image?.message as string}
            fileStyles={{ fontSize: "0.8rem", mt: 0.5 }}
            acceptType="image/png, image/jpeg"
          />
          {PROFILE_STATUS === API_STATUS.PENDING && (
            <CircularProgressWithLabel value={uploadProgress} />
          )}

          <CustomButton
            loading={ADD_USER_STATUS === API_STATUS.PENDING}
            type="submit"
            title="Add"
            disabled={PROFILE_STATUS === API_STATUS.PENDING}
            fullWidth={false}
          />
        </Box>
      </Box>
    </>
  );
};

export default AddUserForm;
