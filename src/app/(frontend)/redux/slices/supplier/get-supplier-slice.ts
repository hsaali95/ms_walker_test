import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ISupplier {
  supplier_name: string;
  id: number;
}

interface IGetSupplier {
  data: ISupplier[] | null;
  error: any;
  status: API_STATUS;
}

const initialState: IGetSupplier = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

export const getSupplier = createAsyncThunk("get/supplier", async () => {
  const response = await apiClient.request({
    config: {
      url: `supplier/get-supplier`,
      method: "get",
    },
  });
  const data = responseHandler(response);
  return data;
});

export const getSupplierSlice = createSlice({
  name: "get/supplier",
  initialState,
  reducers: {
    clearSupplier: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSupplier.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(getSupplier.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getSupplier.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});
export const { clearSupplier } = getSupplierSlice.actions;

export default getSupplierSlice.reducer;
