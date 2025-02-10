import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ICreateGroupState {
  data: null | any;
  error: any;
  status: API_STATUS;
}

const initialState: ICreateGroupState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

// Thunk to create a group
export const createGroup = createAsyncThunk(
  "group/create-group",
  async (payload: {
    name: string;
    access_type_id: number;
    is_active: boolean;
    users_list: any;
  }) => {
    const response = await apiClient.request({
      config: {
        url: `group/add-group`, // Updated endpoint
        method: "post",
        data: payload,
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

// Slice for group creation
export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGroup.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export default groupSlice.reducer;
