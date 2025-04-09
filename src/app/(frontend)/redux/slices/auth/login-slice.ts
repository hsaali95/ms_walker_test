import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { getUserData } from "@/utils/helper";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ILogin {
  email: string;
  password: string;
}

interface IPostLogin {
  data: any | null;
  error: any;
  status: API_STATUS;
  userDetails: any;
}

const initialState: IPostLogin = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
  userDetails: "",
};

// Async action to fetch user data
export const fetchUserData = createAsyncThunk("user/fetchData", async () => {
  const userData = await getUserData();
  return userData?.user || "";
});

export const postLogin = createAsyncThunk(
  "login/post",
  async (loginPayload: ILogin) => {
    const payload = {
      email: loginPayload.email,
      password: loginPayload.password,
    };
    const response = await apiClient.request({
      config: {
        url: `/auth/login`,
        method: "post",
        data: payload,
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

export const loginSlice = createSlice({
  name: "user/login",
  initialState,
  reducers: {
    setLoginIdle: (state) => {
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postLogin.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(postLogin.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(postLogin.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userDetails = action.payload;
      });
  },
});
export const { setLoginIdle } = loginSlice.actions;

export default loginSlice.reducer;
