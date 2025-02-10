import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Define an interface for the CSV download
interface IDownloadActivityCSV {
  data: any | null; // Blob to handle CSV download
  error: any;
  status: API_STATUS;
  uploadProgress: number; // Upload progress percentage
}

const initialState: IDownloadActivityCSV = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
  uploadProgress: 0,
};

interface DownloadActivityCsvPayload {
  ids?: number[];
  startDate?: any; // Adjust type as per your requirements
  endDate?: any; // Adjust type as per your requirements
}

// Create an async thunk to download the CSV file
export const downloadActivityCsv = createAsyncThunk(
  "download/activitycsv",
  async (payload: DownloadActivityCsvPayload = {}, { dispatch }) => {
    // Call the API to download the CSV file with the POST method and optional payload
    const response = await apiClient.request({
      config: {
        url: `activity/download-csv`,
        method: "post",
        data: payload || {}, // Send the payload if provided, otherwise send an empty object
        onUploadProgress: (progressEvent: any) => {
          const progress = Math.round(
            (progressEvent?.loaded * 100) / progressEvent?.total
          );
          dispatch(setActivityCsvProgress(progress)); // Dispatch action to update progress
        },
      },
    });

    // Process the response using the response handler
    const data = responseHandler(response);
    return data;
  }
);

// Create the slice for handling the CSV download state
export const downloadActivityCsvSlice = createSlice({
  name: "download/activitycsv",
  initialState,
  reducers: {
    setActivityCsvProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    setActivityCsvIdle: (state) => {
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(downloadActivityCsv.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(downloadActivityCsv.fulfilled, (state, action) => {
        state.data = action.payload; // Store the file (Blob)
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(downloadActivityCsv.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export const { setActivityCsvProgress, setActivityCsvIdle } =
  downloadActivityCsvSlice.actions;

export default downloadActivityCsvSlice.reducer;
