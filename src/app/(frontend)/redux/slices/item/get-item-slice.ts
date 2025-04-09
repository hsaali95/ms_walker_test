import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IItem {
  supplier_name: string;
  id: number;
}

interface IGetItem {
  data: IItem[] | null;
  error: any;
  status: API_STATUS;
}

const initialState: IGetItem = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

export const getItem = createAsyncThunk(
  "get/item",
  async (supplierId: number) => {
    const response = await apiClient.request({
      config: {
        url: `item/get-item`,
        method: "get",
        params: {
          supplier_id: supplierId,
        },
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

export const getItemSlice = createSlice({
  name: "get/item",
  initialState,
  reducers: {
    clearItem: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getItem.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(getItem.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getItem.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});
export const { clearItem } = getItemSlice.actions;

export default getItemSlice.reducer;
