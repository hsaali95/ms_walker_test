import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IAccount {
  city: IAccount | null;
  account_number: IAccount | null;
  display_type?: string;
  supplier_name?: string;
  other_supplier?: string;
  item_name?: string;
  other_item?: string;
  number_of_cases?: string;
  display_coast?: string;
  id: string;
  custNumber?:string
}

interface IGetAccountById {
  data: IAccount | null;
  error: any;
  status: API_STATUS;
}

const initialState: IGetAccountById = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

// Async thunk to fetch account by ID
export const getAccountById = createAsyncThunk(
  "accounts/getAccountById",
  async (accountId: string) => {
    const response = await apiClient.request({
      config: {
        url: `account/get-account-by-id/${accountId}`,
        method: "get",
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

export const accountByIdSlice = createSlice({
  name: "accountById",
  initialState,
  reducers: {
    clearAccountByIdData: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAccountById.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(getAccountById.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getAccountById.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});
export const { clearAccountByIdData } = accountByIdSlice.actions;
export default accountByIdSlice.reducer;
