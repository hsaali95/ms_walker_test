import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IGroup {
  id: number;
  name: string;
  description: string;
}

interface IGroupResponse {
  rows: IGroup[];
  total: number;
  count: number;
}

interface IGroupPaginationInfo {
  page: number;
  pageSize: number;
}

interface IGetGroups {
  data: IGroupResponse | null;
  error: any;
  status: API_STATUS;
  query: string | undefined;
  groupPaginationInfo: IGroupPaginationInfo;
  groupSortingInfo: { sortColumn: string; sortOrder: "asc" | "desc" };
}

const initialState: IGetGroups = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
  query: "",
  groupPaginationInfo: {
    page: 0,
    pageSize: 10,
  },
  groupSortingInfo: {
    sortColumn: "",
    sortOrder: "asc",
  },
};

export const getPaginatedGroups = createAsyncThunk(
  "get/groups",
  async (params: {
    page: number;
    recordsPerPage: number;
    searchQuery?: string;
    sortColumn?: string;
    sortOrder?: string;
  }) => {
    const response = await apiClient.request({
      config: {
        url: `group/get-group-paginated`,
        method: "get",
        params,
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

export const getGroupsSlice = createSlice({
  name: "get/groups",
  initialState,
  reducers: {
    setGroupPage: (state, action) => {
      state.groupPaginationInfo.page = action.payload;
    },
    setGroupRowsPerPage: (state, action) => {
      state.groupPaginationInfo.pageSize = action.payload;
    },
    setGroupSortColumn: (state, action) => {
      state.groupSortingInfo.sortColumn = action.payload;
    },
    setGroupSortOrder: (state, action) => {
      state.groupSortingInfo.sortOrder = action.payload;
    },
    setGroupQuery: (state, action) => {
      state.query = action.payload;
    },
    clearAllGroupFields: (state) => {
      state.query = "";
    },
    clearGroupsTableData: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPaginatedGroups.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(getPaginatedGroups.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getPaginatedGroups.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export const {
  setGroupPage,
  setGroupRowsPerPage,
  setGroupSortColumn,
  setGroupSortOrder,
  setGroupQuery,
  clearAllGroupFields,
  clearGroupsTableData,
} = getGroupsSlice.actions;

export default getGroupsSlice.reducer;
