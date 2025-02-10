import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IManager {
  name: string;
  id: number;
}

interface IGetManagerState {
  data: IManager[] | null;
  error: any;
  status: API_STATUS;
}

const initialState: IGetManagerState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

// Async thunk for fetching managers
export const getManager = createAsyncThunk("get/manager", async () => {
  const response = await apiClient.request({
    config: {
      url: `user/get-manager`, // Update with the correct API endpoint
      method: "get",
    },
  });
  const data = responseHandler(response);
  return data;
});

// Slice for managing manager data
export const getManagerSlice = createSlice({
  name: "get/manager",
  initialState,
  reducers: {
    clearManager: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getManager.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(getManager.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getManager.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});
export const { clearManager } = getManagerSlice.actions;

export default getManagerSlice.reducer;
