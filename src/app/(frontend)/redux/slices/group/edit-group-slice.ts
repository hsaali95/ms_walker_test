import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IEditGroupState {
  data: null | any;
  error: any;
  status: API_STATUS;
}

const initialState: IEditGroupState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

// Thunk to edit a group
export const editGroup = createAsyncThunk(
  "group/edit-group",
  async (payload: {
    id: number;
    name: string;
    access_type_id: number;
    is_active: boolean;
    users_list: any;
  }) => {
    const response = await apiClient.request({
      config: {
        url: `group/update-group`, // Updated endpoint
        method: "put",
        data: {
          ...payload,
          users_list: payload.users_list.map((data: any) => data.id),
        },
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

// Slice for group editing
export const editGroupSlice = createSlice({
  name: "editGroup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(editGroup.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(editGroup.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(editGroup.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export default editGroupSlice.reducer;
