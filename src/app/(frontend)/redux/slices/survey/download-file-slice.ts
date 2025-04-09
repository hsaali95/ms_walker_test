import { Toaster } from "@/app/(frontend)/components/snackbar";
import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
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

// Create an async thunk to download the file
export const downloadFile = createAsyncThunk(
  "download/filecsv",
  async (
    payload: {
      ids?: number[];
      startDate?: any; // Adjust type as per your requirements
      endDate?: any; // Adjust type as per your requirements
      searchQuery?: any;
    } = {},
    { dispatch, rejectWithValue }
  ) => {
    // Call the API to download the file with the POST method and optional payload
    const response = await apiClient.request({
      config: {
        url: `survey/get-survey-file`,
        method: "post",
        responseType: "blob",
        data: payload || {}, // Send the payload if provided, otherwise send an empty object
        onUploadProgress: (progressEvent: any) => {
          const progress = Math.round(
            (progressEvent?.loaded * 100) / progressEvent?.total
          );
          dispatch(setCsvProgress(progress)); // Dispatch action to update progress
        },
      },
    });

    // Process the response using the response handler
    // const data = responseHandler(response);
    // return data;
    const data = response.data;

    if (!data.size) {
      Toaster("error", "Records not found!");
      return rejectWithValue("Records not found!");
    }
    return data;
  }
);

// Create the slice for handling the file download state
export const downloadFileSlice = createSlice({
  name: "download/filecsv",
  initialState,
  reducers: {
    setCsvProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    setCsvIdle: (state) => {
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(downloadFile.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(downloadFile.fulfilled, (state, action) => {
        state.data = action.payload; // Store the file (Blob)
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});
export const { setCsvProgress, setCsvIdle } = downloadFileSlice.actions;

export default downloadFileSlice.reducer;
