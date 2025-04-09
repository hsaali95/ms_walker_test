import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IDeleteGroupState {
  data: null | any;
  error: any;
  status: API_STATUS;
}

const initialState: IDeleteGroupState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

// Thunk to delete a group
export const deleteGroup = createAsyncThunk(
  "group/delete-group",
  async (payload: { id: number }) => {
    const response = await apiClient.request({
      config: {
        url: `group/delete-group`, // Updated endpoint
        method: "delete",
        data: payload,
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

// Slice for group deletion
export const deleteGroupSlice = createSlice({
  name: "groupDelete",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteGroup.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export default deleteGroupSlice.reducer;
