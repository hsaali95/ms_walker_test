import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IRole {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface IGetRoles {
  data: IRole[] | null;
  error: any;
  status: API_STATUS;
}

const initialState: IGetRoles = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
};

// Thunk to fetch roles
export const getRoles = createAsyncThunk("get/roles", async () => {
  const response = await apiClient.request({
    config: {
      url: `role/get-role`,
      method: "get",
    },
  });
  const data = responseHandler(response);
  return data.roles; // Extract roles from the API response
});

// Slice for roles
export const getRolesSlice = createSlice({
  name: "get/roles",
  initialState,
  reducers: {
    clearRoles: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoles.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});
export const { clearRoles } = getRolesSlice.actions;

export default getRolesSlice.reducer;
