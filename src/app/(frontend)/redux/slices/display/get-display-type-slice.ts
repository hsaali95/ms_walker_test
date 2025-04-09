import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IDisplay {
  display_type: string;
  id: number;
}

interface IGetDisplay {
  data: IDisplay[] | null;
  error: any;
  status: API_STATUS;
}

const initialState: IGetDisplay = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

export const getDisplayType = createAsyncThunk("get/get-display", async () => {
  const response = await apiClient.request({
    config: {
      url: `display/get-display`,
      method: "get",
    },
  });
  const data = responseHandler(response);
  return data;
});

export const displaySlice = createSlice({
  name: "display",
  initialState,
  reducers: {
    clearDisplayType: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDisplayType.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(getDisplayType.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getDisplayType.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});
export const { clearDisplayType } = displaySlice.actions;
export default displaySlice.reducer;
