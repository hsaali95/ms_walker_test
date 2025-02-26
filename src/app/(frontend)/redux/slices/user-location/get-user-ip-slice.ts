import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_STATUS } from "@/utils/enums";
import { USER_IP_ADDRESS } from "@/utils/constant";

interface IUserIP {
  data: string | null;
  error: any;
  status: API_STATUS;
}

const initialState: IUserIP = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

// Thunk to fetch user IP address
export const getUserIp = createAsyncThunk("get/userIp", async () => {
  const response = await axios.get(USER_IP_ADDRESS);
  return response.data.ip;
});

// Slice for user IP
export const getUserIpSlice = createSlice({
  name: "get/userIp",
  initialState,
  reducers: {
    clearUserIp: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserIp.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(getUserIp.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getUserIp.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export const { clearUserIp } = getUserIpSlice.actions;

export default getUserIpSlice.reducer;
