// import { apiClient } from "@/services/http/http-clients";
// import { API_STATUS } from "@/utils/enums";
// import { responseHandler } from "@/utils/response-handler";
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// interface IUpdateSurveyStatusPayload {
//   id: number;
//   survey_status_id: number;
// }

// interface IUpdateSurveyStatusState {
//   data: any | null;
//   error: any;
//   status: API_STATUS;
// }

// const initialState: IUpdateSurveyStatusState = {
//   data: null,
//   error: null,
//   status: API_STATUS.IDLE,
// };

// export const patchSurveyStatus = createAsyncThunk(
//   "survey/update-status",
//   async (statusPayload: IUpdateSurveyStatusPayload) => {
//     // Accepts the payload with id and survey_status_id
//     const response = await apiClient.request({
//       config: {
//         url: `survey/update-survey-status`,
//         method: "patch",
//         data: statusPayload,
//       },
//     });
//     const data = responseHandler(response);
//     return data;
//   }
// );

// export const updateSurveyStatusSlice = createSlice({
//   name: "patchSurveyStatus",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(patchSurveyStatus.pending, (state) => {
//         state.status = API_STATUS.PENDING;
//       })
//       .addCase(patchSurveyStatus.fulfilled, (state, action) => {
//         state.data = action.payload;
//         state.status = API_STATUS.SUCCEEDED;
//       })
//       .addCase(patchSurveyStatus.rejected, (state, action) => {
//         state.error = action.error.message;
//         state.status = API_STATUS.REJECTED;
//       });
//   },
// });

// export default updateSurveyStatusSlice.reducer;
import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IUpdateSurveyStatusPayload {
  ids: number[];  // Changed to an array of IDs
  survey_status_id: number;
}

interface IUpdateSurveyStatusState {
  data: any | null;
  error: any;
  status: API_STATUS;
}

const initialState: IUpdateSurveyStatusState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

export const patchSurveyStatus = createAsyncThunk(
  "survey/update-status",
  async (statusPayload: IUpdateSurveyStatusPayload) => {
    // Accepts the payload with an array of ids and survey_status_id
    const response = await apiClient.request({
      config: {
        url: `survey/update-survey-status`,  // Ensure the API supports this batch operation
        method: "patch",
        data: statusPayload,
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

export const updateSurveyStatusSlice = createSlice({
  name: "patchSurveyStatus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(patchSurveyStatus.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(patchSurveyStatus.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(patchSurveyStatus.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export default updateSurveyStatusSlice.reducer;

