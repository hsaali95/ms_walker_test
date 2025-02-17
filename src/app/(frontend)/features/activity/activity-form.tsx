import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "../../components/input";
import CustomButton from "../../components/button";
import CustomDateTimePicker from "../../components/custome-date-time-picker";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hook";
import SearchDropDown from "../../components/drop-down/SearchableDropDown";
import { getAllAccounts } from "../../redux/slices/account/get-account-slice";
import { getAccountById } from "../../redux/slices/account/get-account-by-id-slice";
import { API_STATUS } from "@/utils/enums";
import { activitySchema } from "../../schemas/forms";
import { createActivity } from "../../redux/slices/activity/add-activity-slice";
import CustomCheckbox from "../../components/check-box";
import Grid from "@mui/material/Grid2";
import BackdropLoader from "../../components/backdrop-loader";
import { fetchUserData } from "../../redux/slices/auth/login-slice";
import dayjs from "dayjs";

const ActivityForm = () => {
  const [accountId, setId] = useState<any>();
  const dispatch = useAppDispatch();

  const { data: All_ACCOUNT_DATA, status: ACCOUNT_STATUS } = useAppSelector(
    (state) => state.getAccount
  );
  const { data: ACCOUNT_INFO, status: ACCOUNT_INFO_STATUS } = useAppSelector(
    (state) => state.accountById
  );
  const { status: ACTIVITY_STATUS } = useAppSelector(
    (state) => state.createActivity
  );
  const { userDetails } = useAppSelector((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm({
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: zodResolver(activitySchema),
    defaultValues: {
      city: "",
      start_time: null,
      end_time: null,
    } as FieldValues,
  });

  const onSubmit = async (data: FieldValues) => {
    dispatch(
      createActivity({
        ...data,
        account_id: data?.account_name?.id,
        merch_rep_id: userDetails?.email,
      })
    );
  };

  useEffect(() => {
    dispatch(getAllAccounts());
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    const selectedAccountId = getValues("account_name");
    if (selectedAccountId) {
      setId(selectedAccountId);
    }
  }, [getValues("account_name")]);

  useEffect(() => {
    if (accountId?.id && accountId) {
      dispatch(getAccountById(accountId.id));
    }
  }, [accountId, dispatch]);

  useEffect(() => {
    if (ACCOUNT_INFO?.city) {
      setValue("city", ACCOUNT_INFO.city, {
        shouldValidate: true,
      });
    }
  }, [ACCOUNT_INFO, setValue]);
  useEffect(() => {
    if (userDetails?.email) {
      setValue("merch_rep_id", userDetails.email);
    }
  }, [userDetails, setValue]);

  useEffect(() => {
    if (ACTIVITY_STATUS === API_STATUS.SUCCEEDED) {
      reset();
      dispatch(fetchUserData());
    }
  }, [ACTIVITY_STATUS]);

  if (ACCOUNT_STATUS === API_STATUS.PENDING) {
    return <BackdropLoader />;
  }

  return (
    <>
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
            <CustomDateTimePicker
              setValue={setValue}
              getValues={getValues}
              label="Start Time"
              name="start_time"
              maxDateTime={
                dayjs(getValues("end_time"))
                  ? dayjs(getValues("end_time"))
                  : undefined
              }
              errorMessage={errors.start_time?.message as string}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6,
            }}
          >
            <CustomDateTimePicker
              setValue={setValue}
              getValues={getValues}
              label="End Time"
              name="end_time"
              errorMessage={errors.end_time?.message as string}
              minDateTime={
                getValues("start_time")
                  ? dayjs(getValues("start_time")).add(5, "minute")
                  : undefined
              }
              disabled={getValues("start_time") ? false : true}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6,
            }}
          >
            <SearchDropDown
              label="Account"
              name="account_name"
              options={All_ACCOUNT_DATA}
              errorMessage={errors.account_name?.message as string}
              setValue={setValue}
              getValues={getValues}
              size="medium"
              displayKey={"fullCustomerInfo"}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6,
            }}
          >
            <CustomInput
              label="City"
              placeholder="city"
              name="city"
              register={register}
              errorMessage={errors?.city?.message as string}
              disabled={true}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6,
            }}
          >
            <CustomInput
              label="Activity Log"
              placeholder="Activity log"
              name="activity_log"
              register={register}
              errorMessage={errors?.activity_log?.message as string}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6,
            }}
          >
            <CustomInput
              label="Notes"
              placeholder="notes"
              name="notes"
              register={register}
              errorMessage={errors?.notes?.message as string}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6,
            }}
          >
            <CustomInput
              label="Merch Rep Id"
              placeholder="Merch Rep Id"
              name="merch_rep_id"
              register={register}
              errorMessage={errors?.merch_rep_id?.message as string}
              disabled
            />
          </Grid>
        </Grid>

        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{ mt: 1 }}
        >
          <CustomCheckbox
            name="is_complete"
            label="Complete"
            register={register}
            errorMessage={errors?.is_complete?.message as string}
          />
          <CustomButton
            disabled={ACCOUNT_INFO_STATUS === API_STATUS.PENDING}
            loading={ACTIVITY_STATUS === API_STATUS.PENDING}
            type="submit"
            title="Add "
            fullWidth={false}
          />
        </Box>
      </Box>
    </>
  );
};

export default ActivityForm;
