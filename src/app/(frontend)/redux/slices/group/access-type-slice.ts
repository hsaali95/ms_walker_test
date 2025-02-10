import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IGetAccessType {
  data: null | any;
  error: any;
  status: API_STATUS;
}

const initialState: IGetAccessType = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

// Thunk to fetch access types
export const getAccessType = createAsyncThunk(
  "access/get-access-type",
  async () => {
    const response = await apiClient.request({
      config: {
        url: `get-access-type`, // Updated endpoint
        method: "get",
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

// Slice for access types
export const accessTypeSlice = createSlice({
  name: "accessType",
  initialState,
  reducers: {
    clearAccessType: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAccessType.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(getAccessType.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getAccessType.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});
export const { clearAccessType } = accessTypeSlice.actions;

export default accessTypeSlice.reducer;
