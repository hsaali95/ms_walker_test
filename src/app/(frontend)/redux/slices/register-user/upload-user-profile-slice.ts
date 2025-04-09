import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IUserProfilePayload {
  base64: string; // Base64 encoded profile picture
  file_name: string; // Profile picture file name
}

interface IUserProfileState {
  data: any | null; // Data returned from the API
  error: any; // Error object or message
  status: API_STATUS; // Current API status (idle, pending, succeeded, rejected)
  uploadProgress: number; // Upload progress percentage
}

const initialState: IUserProfileState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
  uploadProgress: 0,
};

// Async thunk for uploading a user profile picture
// Async thunk for uploading a user profile picture
export const postUploadUserProfile = createAsyncThunk(
  "userProfile/upload",
  async ({ base64, file_name }: IUserProfilePayload, { dispatch }) => {
    const response = await apiClient.request({
      config: {
        url: `user/upload-user-profile`, // Updated endpoint for user profile upload
        method: "post",
        data: { base64, file_name },
        onUploadProgress: (progressEvent: any) => {
          const progress = Math.round(
            (progressEvent?.loaded * 100) / progressEvent?.total
          );
          dispatch(userProfileProgress(progress)); // Dispatch action to update progress
        },
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

// User profile upload slice
export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    userProfileProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postUploadUserProfile.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(postUploadUserProfile.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(postUploadUserProfile.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});
export const { userProfileProgress } = userProfileSlice.actions;
export default userProfileSlice.reducer;
