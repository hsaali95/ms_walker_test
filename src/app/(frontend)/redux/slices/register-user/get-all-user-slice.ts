import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IUser {
  id: number;
  name: string;
  email: string;
}

interface IUserResponse {
  rows: IUser[];
  total: number;
  count: number;
}

interface IUserPaginationInfo {
  page: number;
  pageSize: number;
}

interface IGetUsers {
  data: IUserResponse | null;
  error: any;
  status: API_STATUS;
  query: string | undefined;
  userPaginationInfo: IUserPaginationInfo;
  userSortingInfo: { sortColumn: string; sortOrder: "asc" | "desc" };
}

const initialState: IGetUsers = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
  query: "",
  userPaginationInfo: {
    page: 0,
    pageSize: 10,
  },
  userSortingInfo: {
    sortColumn: "",
    sortOrder: "asc",
  },
};

export const getPaginatedUsers = createAsyncThunk(
  "get/users",
  async (params: {
    page: number;
    recordsPerPage: number;
    searchQuery?: string;
    sortColumn?: string;
    sortOrder?: string;
  }) => {
    const response = await apiClient.request({
      config: {
        url: `user/get-paginated-user`,
        method: "get",
        params,
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

export const getUsersSlice = createSlice({
  name: "get/users",
  initialState,
  reducers: {
    setUserPage: (state, action) => {
      state.userPaginationInfo.page = action.payload;
    },
    setUserRowsPerPage: (state, action) => {
      state.userPaginationInfo.pageSize = action.payload;
    },
    setUserSortColumn: (state, action) => {
      state.userSortingInfo.sortColumn = action.payload;
    },
    setUserSortOrder: (state, action) => {
      state.userSortingInfo.sortOrder = action.payload;
    },
    setUserQuery: (state, action) => {
      state.query = action.payload;
    },
    clearAllUserFields: (state) => {
      state.query = "";
    },
    clearUserTableData: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPaginatedUsers.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(getPaginatedUsers.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getPaginatedUsers.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export const {
  setUserPage,
  setUserRowsPerPage,
  setUserSortColumn,
  setUserSortOrder,
  setUserQuery,
  clearAllUserFields,
  clearUserTableData,
} = getUsersSlice.actions;

export default getUsersSlice.reducer;
