import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";

interface ICreateActivityPayload {
  start_time?: string | null;
  end_time?: string | null;
  is_complete?: boolean;
  account_id?: number;
  activity_log?: string;
  notes?: string;
  merch_rep_id?: string;
  date?: any;
}

interface ICreateActivityState {
  data: any | null;
  error: any | null;
  status: API_STATUS;
}

const initialState: ICreateActivityState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

export const createActivity = createAsyncThunk(
  "activity/create",
  async (activityPayload: ICreateActivityPayload) => {
    const payload = {
      start_time: moment(
        activityPayload.start_time,
        "YYYY-MM-DDTHH:mm:ss A"
      ).format("YYYY-MM-DDTHH:mm:ss"),
      end_time: moment(
        activityPayload.end_time,
        "YYYY-MM-DDTHH:mm:ss A"
      ).format("YYYY-MM-DDTHH:mm:ss"),
      is_complete: activityPayload.is_complete,
      account_id: activityPayload.account_id,
      activity_log: activityPayload.activity_log,
      notes: activityPayload.notes,
      merch_rep_id: activityPayload.merch_rep_id,
      date: moment(activityPayload.date, "DD/MM/YYYY").format("YYYY-MM-DD"),
    };

    const response = await apiClient.request({
      config: {
        url: `activity/add-activity`,
        method: "post",
        data: payload,
      },
    });

    const data = responseHandler(response);
    return data;
  }
);

export const activitySlice = createSlice({
  name: "activity/create",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createActivity.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export default activitySlice.reducer;
