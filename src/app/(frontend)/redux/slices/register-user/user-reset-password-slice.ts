import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IResetPassword {
  userId: number;
  newPassword: string;
}

interface IPostResetPassword {
  data: any | null;
  error: any;
  status: API_STATUS;
}

const initialState: IPostResetPassword = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

export const resetPassword = createAsyncThunk(
  "resetPassword/post",
  async (resetPayload: IResetPassword) => {
    const payload = {
      userId: resetPayload.userId,
      newPassword: resetPayload.newPassword,
    };
    const response = await apiClient.request({
      config: {
        url: `user/reset-passowrd`,
        method: "post",
        data: payload,
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

export const resetPasswordSlice = createSlice({
  name: "user/resetPassword",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export default resetPasswordSlice.reducer;
