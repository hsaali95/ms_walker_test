import React, { useEffect, useState } from "react";
import CustomInput from "../../components/input";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hook";
import { getAllAccounts } from "../../redux/slices/account/get-account-slice";
import {
  clearAccountByIdData,
  getAccountById,
} from "../../redux/slices/account/get-account-by-id-slice";
import { helper } from "@/utils/helper";
import SearchDropDown from "../../components/drop-down/SearchableDropDown";
import { API_STATUS } from "@/utils/enums";
import Grid from "@mui/material/Grid2";
import BackdropLoader from "../../components/backdrop-loader";

const SurveyAccountForm = () => {
  const [accountId, setId] = useState<any>();
  const dispatch = useAppDispatch();
  const { data: All_Accounts, status: ACCOUNT_STATUS } = useAppSelector(
    (state) => state.getAccount
  );
  const { data: Account_Info } = useAppSelector((state) => state.accountById);
  const { surveyData } = useAppSelector((state) => state.survey);
  useEffect(() => {
    dispatch(getAllAccounts());
  }, [dispatch]);
  useEffect(() => {
    if (accountId?.id && accountId) {
      dispatch(getAccountById(accountId.id));
    }
  }, [accountId]);

  if (ACCOUNT_STATUS !== API_STATUS.SUCCEEDED) {
    return (
      <>
        <BackdropLoader />
      </>
    );
  }

  return (
    <>
      <Grid
        container
        columnSpacing={{ xs: 0, sm: 2 }}
        rowSpacing={{ xs: 1, sm: 2 }}
      >
        <Grid size={{ xs: 12, lg: 6 }}>
          <SearchDropDown
            label="Account Name"
            name="account_name"
            options={All_Accounts}
            value={accountId}
            onChange={(e) => setId(e)}
            size="medium"
            displayKey={"fullCustomerInfo"}
            disabled={surveyData.length ? true : false}
            isOnClear
            onClear={() => dispatch(clearAccountByIdData())}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <CustomInput
            label="Account Number"
            placeholder="Account Number"
            inputStyles={{ mb: 0 }}
            value={(Account_Info && Account_Info?.custNumber) || ""}
            disabled
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <CustomInput
            label="City"
            placeholder="City"
            inputStyles={{ mb: 0 }}
            value={(Account_Info && Account_Info?.city) || ""}
            disabled
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <CustomInput
            label="Date and Time"
            inputStyles={{ mb: 2 }}
            value={helper.getFormattedTime()}
            disabled
          />
        </Grid>
      </Grid>
    </>
  );
};

export default SurveyAccountForm;
