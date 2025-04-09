import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IDeleteSurveyPayload {
  id: number[];
}

interface ISurveyState {
  data: any | null;
  error: any;
  status: API_STATUS;
}

const initialState: ISurveyState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

export const deleteSurvey = createAsyncThunk(
  "survey/delete",
  async (payload: IDeleteSurveyPayload) => {
    const response = await apiClient.request({
      config: {
        url: `survey/delete-survey`,
        method: "delete",
        data: payload,
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

export const deleteSurveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteSurvey.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(deleteSurvey.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(deleteSurvey.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export default deleteSurveySlice.reducer;
