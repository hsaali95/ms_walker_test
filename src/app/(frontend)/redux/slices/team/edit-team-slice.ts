import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IEditTeamState {
  data: null | any;
  error: any;
  status: API_STATUS;
}

const initialState: IEditTeamState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

// Thunk to edit a team
export const editTeam = createAsyncThunk(
  "team/edit-team",
  async (payload: {
    id: number;
    name: string;
    is_active: boolean;
    manager_id: number;
    users_list: number[];
  }) => {
    const response = await apiClient.request({
      config: {
        url: `team/update-team`, // Updated endpoint
        method: "put",
        data: {
          ...payload,
          users_list: payload.users_list.map((data: any) => data?.id),
        },
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

// Slice for team editing
export const editTeamSlice = createSlice({
  name: "editTeam",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(editTeam.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(editTeam.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(editTeam.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export default editTeamSlice.reducer;
