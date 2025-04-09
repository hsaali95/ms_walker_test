import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IFileUploadPayload {
  base64: string; // Base64 encoded file data
  file_name: string;
}

interface IFileUploadState {
  data: any | null;
  error: any;
  status: API_STATUS;
  fileIds?: any[] | any;
  uploadProgress: number; // Upload progress percentage
}

const initialState: IFileUploadState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
  fileIds: [],
  uploadProgress: 0,
};

// Async thunk for uploading a file
export const postUploadFile = createAsyncThunk(
  "file/upload",
  async (filePayload: IFileUploadPayload, { dispatch }) => {
    const response = await apiClient.request({
      config: {
        url: `survey/upload-file`,
        method: "post",
        data: filePayload,
        onUploadProgress: (progressEvent: any) => {
          const progress = Math.round(
            (progressEvent?.loaded * 100) / progressEvent?.total
          );
          dispatch(surveyProgress(progress)); // Dispatch action to update progress
        },
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

// File upload slice
export const fileUploadSlice = createSlice({
  name: "fileUpload",
  initialState,
  reducers: {
    setFileIds: (state, action) => {
      state.fileIds.push(action.payload);
    },
    removeFileIds: (state) => {
      state.fileIds = [];
    },
    surveyProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    setSurveyFileStatus: (state) => {
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postUploadFile.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(postUploadFile.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(postUploadFile.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});
export const {
  setFileIds,
  removeFileIds,
  surveyProgress,
  setSurveyFileStatus,
} = fileUploadSlice.actions;

export default fileUploadSlice.reducer;
