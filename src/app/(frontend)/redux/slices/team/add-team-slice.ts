import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IAddTeamState {
  data: null | any;
  error: any;
  status: API_STATUS;
}

const initialState: IAddTeamState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

// Thunk to add a team
export const addTeam = createAsyncThunk(
  "team/add-team",
  async (payload: {
    name: string;
    is_active: boolean;
    users_list: any;
    manager_id: any;
  }) => {
    const response = await apiClient.request({
      config: {
        url: `team/add-team`,
        method: "post",
        data: payload,
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

// Slice for adding a team
export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTeam.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(addTeam.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(addTeam.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export default teamSlice.reducer;
