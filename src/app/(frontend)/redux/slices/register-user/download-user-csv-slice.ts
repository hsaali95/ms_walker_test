import { Toaster } from "@/app/(frontend)/components/snackbar";
import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Define an interface for the CSV download
interface IDownloadUserCSV {
  data: any | null; // Blob to handle CSV download
  error: any;
  status: API_STATUS;
  uploadProgress: number; // Upload progress percentage
}

const initialState: IDownloadUserCSV = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
  uploadProgress: 0,
};

interface DownloadUserCsvPayload {
  ids?: number[];
  startDate?: any; // Adjust type as needed
  endDate?: any; // Adjust type as needed
  searchQuery?: any;
}

// Async thunk to download user CSV file
export const downloadUserCsv = createAsyncThunk(
  "download/usercsv",
  async (
    payload: DownloadUserCsvPayload = {},
    { dispatch, rejectWithValue }
  ) => {
    const response = await apiClient.request({
      config: {
        url: `user/download-user-csv`,
        method: "post",
        responseType: "blob",
        data: payload || {},
        onUploadProgress: (progressEvent: any) => {
          const progress = Math.round(
            (progressEvent?.loaded * 100) / progressEvent?.total
          );
          dispatch(setUserCsvProgress(progress));
        },
      },
    });

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

// Slice for handling the user CSV download state
export const downloadUserCsvSlice = createSlice({
  name: "download/usercsv",
  initialState,
  reducers: {
    setUserCsvProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    setUserCsvIdle: (state) => {
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(downloadUserCsv.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(downloadUserCsv.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(downloadUserCsv.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export const { setUserCsvProgress, setUserCsvIdle } =
  downloadUserCsvSlice.actions;

export default downloadUserCsvSlice.reducer;
