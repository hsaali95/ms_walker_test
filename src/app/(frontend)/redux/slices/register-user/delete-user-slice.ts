import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IDeleteUserState {
  data: null | any;
  error: any;
  status: API_STATUS;
}

const initialState: IDeleteUserState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

// Thunk to delete a user
export const deleteUser = createAsyncThunk(
  "user/delete-user",
  async (payload: { userId: number | null }) => {
    const response = await apiClient.request({
      config: {
        url: `user/delete-user`, // Updated endpoint
        method: "delete",
        data: payload,
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

// Slice for user deletion
export const deleteUserSlice = createSlice({
  name: "userDelete",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteUser.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export default deleteUserSlice.reducer;
