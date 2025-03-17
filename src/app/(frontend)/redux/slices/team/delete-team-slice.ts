import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IDeleteTeamState {
  data: null | any;
  error: any;
  status: API_STATUS;
}

const initialState: IDeleteTeamState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

// Thunk to delete a team
export const deleteTeam = createAsyncThunk(
  "team/delete-team",
  async (payload: { id: number }) => {
    const response = await apiClient.request({
      config: {
        url: `team/delete-team`, // Updated endpoint
        method: "delete",
        data: payload,
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

// Slice for team deletion
export const deleteTeamSlice = createSlice({
  name: "teamDelete",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteTeam.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export default deleteTeamSlice.reducer;
