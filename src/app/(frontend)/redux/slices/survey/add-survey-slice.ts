import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ISurveyPayload {
  other_supplier?: string;
  other_item?: string;
  number_of_cases?: string;
  display_coast?: string;
  image?: string;
  notes?: string;
  account_id?: any;
  display_id?: any;
  supplier_id?: any;
  item_id?: any;
  file_id?: any[];
}

interface ISurveyState {
  data: any | null;
  error: any;
  status: API_STATUS;
}
interface ImypostSurvey {
  surveyData: ISurveyPayload[];
  file_id?: any;
}
const initialState: ISurveyState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

export const postSurvey = createAsyncThunk(
  "survey/post",
  async (surveyPayload: ImypostSurvey) => {
    // Accepts an array of objects
    const response = await apiClient.request({
      config: {
        url: `survey/add-survey`,
        method: "post",
        data: surveyPayload,
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

export const addSurveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postSurvey.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(postSurvey.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(postSurvey.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export default addSurveySlice.reducer;
