import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_STATUS } from "@/utils/enums";
import { LOCATION_TOKEN } from "@/utils/constant";

interface IUserLocation {
  data: any | null;
  error: any;
  status: API_STATUS;
}

const initialState: IUserLocation = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

// Thunk to fetch user location based on IP address
type GetUserLocationArgs = { ip: string | null };
export const getUserLocation = createAsyncThunk(
  "get/userLocation",
  async ({ ip }: GetUserLocationArgs) => {
    const response = await axios.get(
      `https://ipinfo.io/${ip}?token=${LOCATION_TOKEN}`
    );
    return response.data;
  }
);

// Slice for user location
export const getUserLocationSlice = createSlice({
  name: "get/userLocation",
  initialState,
  reducers: {
    clearUserLocation: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserLocation.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(getUserLocation.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getUserLocation.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export const { clearUserLocation } = getUserLocationSlice.actions;

export default getUserLocationSlice.reducer;
