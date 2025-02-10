import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Define the interface for individual item data
interface IItem {
  name: string;
  id: number;
}

// Define the slice state interface
interface IGetUserState {
  data: IItem[] | null;
  error: string | null;
  status: API_STATUS;
}

// Initial state for the slice
const initialState: IGetUserState = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

// Async thunk to fetch items
export const getusers = createAsyncThunk(
  "get/item",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.request({
        config: {
          url: `user/get-user`,
          method: "GET",
        },
      });

      // Process and return the data
      const data = responseHandler(response);
      return data;
    } catch (error: any) {
      // Return a rejected value in case of an error
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice
const getUserSlice = createSlice({
  name: "get/user",
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getusers.pending, (state) => {
        state.status = API_STATUS.PENDING;
        state.error = null; // Clear previous error
      })
      .addCase(getusers.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getusers.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = API_STATUS.REJECTED;
      });
  },
});
export const { clearUsers } = getUserSlice.actions;

export default getUserSlice.reducer;
