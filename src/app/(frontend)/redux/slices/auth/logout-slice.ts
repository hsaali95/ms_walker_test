import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IPostLogout {
  status: API_STATUS;
  error: any;
}

const initialState: IPostLogout = {
  status: API_STATUS.IDLE,
  error: null,
};

export const postLogout = createAsyncThunk("logout/post", async () => {
  const response = await apiClient.request({
    config: {
      url: `logout`, // API endpoint for logging out
      method: "post",
    },
  });

  const data = responseHandler(response);
  return data;
});

export const logoutSlice = createSlice({
  name: "user/logout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postLogout.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(postLogout.fulfilled, (state) => {
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(postLogout.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export default logoutSlice.reducer;
