import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Define an interface for the file download
interface IDownloadFile {
  data: any | null; // Blob to handle file download
  error: any;
  status: API_STATUS;
  uploadProgress: number; // Upload progress percentage
}

const initialState: IDownloadFile = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
  uploadProgress: 0,
};
interface DownloadFilePdfPayload {
  ids?: number[];
  startDate?: any; // Adjust type as per your requirements
  endDate?: any; // Adjust type as per your requirements
}
// Create an async thunk to download the file
export const downloadFilePdf = createAsyncThunk(
  "download/filepdf",
  async (payload: DownloadFilePdfPayload = {}, { dispatch }) => {
    // Call the API to download the file with the POST method and optional payload
    const response = await apiClient.request({
      config: {
        url: `survey/get-survey-pdf`,
        method: "post",
        data: payload || {}, // Send the payload if provided, otherwise send an empty object
        onUploadProgress: (progressEvent: any) => {
          const progress = Math.round(
            (progressEvent?.loaded * 100) / progressEvent?.total
          );
          dispatch(setpdfProgress(progress)); // Dispatch action to update progress
        },
      },
    });

    // Process the response using the response handler
    const data = responseHandler(response);
    return data;
  }
);

// Create the slice for handling the file download state
export const downloadFileSlicePdf = createSlice({
  name: "download/download/filepdf",
  initialState,
  reducers: {
    setpdfProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    setPdfIdle: (state) => {
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(downloadFilePdf.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(downloadFilePdf.fulfilled, (state, action) => {
        state.data = action.payload; // Store the file (Blob)
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(downloadFilePdf.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});
export const { setpdfProgress, setPdfIdle } = downloadFileSlicePdf.actions;

export default downloadFileSlicePdf.reducer;
