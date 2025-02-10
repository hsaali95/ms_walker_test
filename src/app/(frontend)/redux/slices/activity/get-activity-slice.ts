import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayjs, { Dayjs } from "dayjs";

interface IActivity {
  activity_name: string;
  id: number;
}

interface IActivityResponse {
  rows: IActivity[];
  total: number;
  count: number;
}

interface IActivityPaginationInfo {
  page: number;
  pageSize: number;
}

interface IGetActivity {
  data: IActivityResponse | null;
  error: any;
  status: API_STATUS;
  query: string | undefined;
  activityPaginationInfo: IActivityPaginationInfo;
  activitySortingInfo: { sortColumn: string; sortOrder: "asc" | "desc" };
  activityDateInfo: {
    startDate: Dayjs | null | undefined;
    endDate: Dayjs | null | undefined;
  };
}

const initialState: IGetActivity = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
  query: "",
  activityPaginationInfo: {
    page: 0,
    pageSize: 10,
  },
  activitySortingInfo: {
    sortColumn: "",
    sortOrder: "asc",
  },
  activityDateInfo: {
    startDate: null,
    endDate: null,
  },
};

export const getActivity = createAsyncThunk(
  "get/activity",
  async (params: {
    page: number;
    recordsPerPage: number;
    searchQuery?: string;
    sortColumn?: string;
    sortOrder?: string;
    startDate?: any;
    endDate?: any;
  }) => {
    const { startDate, endDate, ...otherParams } = params;
    const response = await apiClient.request({
      config: {
        url: `activity/get-paginated-activity`,
        method: "get",
        params: {
          ...otherParams,
          startDate: startDate ? dayjs(startDate).toISOString() : undefined,
          endDate: endDate ? dayjs(endDate).toISOString() : undefined,
        },
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

export const getActivitySlice = createSlice({
  name: "get/activity",
  initialState,
  reducers: {
    setActivityPage: (state, action) => {
      state.activityPaginationInfo.page = action.payload;
    },
    setActivityRowsPerPage: (state, action) => {
      state.activityPaginationInfo.pageSize = action.payload;
    },
    setActivitySortColumn: (state, action) => {
      state.activitySortingInfo.sortColumn = action.payload;
    },
    setActivitySortOrder: (state, action) => {
      state.activitySortingInfo.sortOrder = action.payload;
    },
    setActivityQuery: (state, action) => {
      state.query = action.payload;
    },
    setActivityStartDate: (state, action) => {
      state.activityDateInfo.startDate = action.payload;
    },
    setActivityEndDate: (state, action) => {
      state.activityDateInfo.endDate = action.payload;
    },
    clearAllActivityFields: (state) => {
      state.activityDateInfo.endDate = null;
      state.activityDateInfo.startDate = null;
      state.query = "";
    },
    clearActivityTableData: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
    clearActivitySearchField: (state) => {
      state.query = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActivity.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(getActivity.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getActivity.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export const {
  setActivityPage,
  setActivityRowsPerPage,
  setActivitySortColumn,
  setActivitySortOrder,
  setActivityQuery,
  setActivityStartDate,
  setActivityEndDate,
  clearAllActivityFields,
  clearActivityTableData,
  clearActivitySearchField,
} = getActivitySlice.actions;

export default getActivitySlice.reducer;
