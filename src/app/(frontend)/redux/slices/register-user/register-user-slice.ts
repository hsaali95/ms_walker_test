import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IRegister {
  name: string;
  email: string;
  password: string;
  role_id: number;
  image: string | any;
  last_name: string;
}

interface IPostRegister {
  data: any | null;
  error: any;
  status: API_STATUS;
}

const initialState: IPostRegister = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

export const registerUser = createAsyncThunk(
  "register/post",
  async (registerPayload: IRegister) => {
    const payload = {
      name: registerPayload.name,
      email: registerPayload.email,
      password: registerPayload.password,
      role_id: registerPayload.role_id,
      image: registerPayload.image,
      last_name: registerPayload.last_name,
    };
    const response = await apiClient.request({
      config: {
        url: `/user/add-user`,
        method: "post",
        data: payload,
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

export const registerUserSlice = createSlice({
  name: "user/register",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export default registerUserSlice.reducer;
