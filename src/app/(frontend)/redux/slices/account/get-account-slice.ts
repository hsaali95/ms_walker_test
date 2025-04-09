import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IAccount {
  display_type: string;
  supplier_name: string;
  other_supplier: string;
  item_name: string;
  other_item: string;
  number_of_cases: string;
  display_coast: string;
}

interface IGetAccounts {
  data: IAccount[] | null;
  error: any;
  status: API_STATUS;
}

const initialState: IGetAccounts = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

export const getAllAccounts = createAsyncThunk("accounts/getAll", async () => {
  const response = await apiClient.request({
    config: {
      url: `account/get-account`,
      method: "get",
    },
  });
  const data = responseHandler(response);
  return data;
});

export const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    clearAccounts: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAccounts.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(getAllAccounts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getAllAccounts.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});
export const { clearAccounts } = accountsSlice.actions;
export default accountsSlice.reducer;
