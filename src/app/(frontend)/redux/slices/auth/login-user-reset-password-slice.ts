import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IResetPasswordPayload {
  userId: number;
  newPassword: string;
}

interface IResetPasswordState {
  data: any | null;
  error: any;
  status: API_STATUS;
}

const initialState: IResetPasswordState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

export const resetUserPassword = createAsyncThunk(
  "user/reset-login-user-password",
  async (payload: IResetPasswordPayload) => {
    const response = await apiClient.request({
      config: {
        url: `/auth/reset-login-user-password`,
        method: "post",
        data: payload,
      },
    });
    return responseHandler(response);
  }
);

export const resetLoginPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {
    setUserResetIdle: (state) => {
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetUserPassword.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});
export const { setUserResetIdle } = resetLoginPasswordSlice.actions;

export default resetLoginPasswordSlice.reducer;
