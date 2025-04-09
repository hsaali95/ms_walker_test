import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ITeam {
  id: number;
  name: string;
  description: string;
}

interface ITeamResponse {
  rows: ITeam[];
  total: number;
  count: number;
}

interface ITeamPaginationInfo {
  page: number;
  pageSize: number;
}

interface IGetTeams {
  data: ITeamResponse | null;
  error: any;
  status: API_STATUS;
  query: string | undefined;
  teamPaginationInfo: ITeamPaginationInfo;
  teamSortingInfo: { sortColumn: string; sortOrder: "asc" | "desc" };
}

const initialState: IGetTeams = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
  query: "",
  teamPaginationInfo: {
    page: 0,
    pageSize: 10,
  },
  teamSortingInfo: {
    sortColumn: "",
    sortOrder: "asc",
  },
};

export const getPaginatedTeams = createAsyncThunk(
  "get/teams",
  async (params: {
    page: number;
    recordsPerPage: number;
    searchQuery?: string;
    sortColumn?: string;
    sortOrder?: string;
  }) => {
    const response = await apiClient.request({
      config: {
        url: `team/get-team-paginated`,
        method: "get",
        params,
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

export const getTeamsSlice = createSlice({
  name: "get/teams",
  initialState,
  reducers: {
    setTeamPage: (state, action) => {
      state.teamPaginationInfo.page = action.payload;
    },
    setTeamRowsPerPage: (state, action) => {
      state.teamPaginationInfo.pageSize = action.payload;
    },
    setTeamSortColumn: (state, action) => {
      state.teamSortingInfo.sortColumn = action.payload;
    },
    setTeamSortOrder: (state, action) => {
      state.teamSortingInfo.sortOrder = action.payload;
    },
    setTeamQuery: (state, action) => {
      state.query = action.payload;
    },
    clearAllTeamFields: (state) => {
      state.query = "";
    },
    clearTeamTableData: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPaginatedTeams.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(getPaginatedTeams.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getPaginatedTeams.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});

export const {
  setTeamPage,
  setTeamRowsPerPage,
  setTeamSortColumn,
  setTeamSortOrder,
  setTeamQuery,
  clearAllTeamFields,
  clearTeamTableData
} = getTeamsSlice.actions;

export default getTeamsSlice.reducer;
