import { apiClient } from "@/services/http/http-clients";
import { API_STATUS } from "@/utils/enums";
import { responseHandler } from "@/utils/response-handler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayjs, { Dayjs } from "dayjs";

interface ISurvey {
  survey_name: string;
  id: number;
}
interface ISurveyResponse {
  rows: ISurvey[];
  total: number;
  count: number;
}

interface IsurveyPaginationInfo {
  page: number;
  pageSize: number;
}
interface IGetSurvey {
  data: ISurveyResponse | null;
  error: any;
  status: API_STATUS;
  query: string | undefined;
  surveyPaginationInfo: IsurveyPaginationInfo;
  surveySortingInfo: { sortColumn: string; sortOrder: "asc" | "desc" };
  surveyDateInfo: {
    startDate: Dayjs | null | undefined;
    endDate: Dayjs | null | undefined;
  };
}

const initialState: IGetSurvey = {
  data: null,
  error: null,
  status: API_STATUS.IDLE,
  query: "",
  surveyPaginationInfo: {
    page: 0,
    pageSize: 10,
  },
  surveySortingInfo: {
    sortColumn: "",
    sortOrder: "asc",
  },
  surveyDateInfo: {
    startDate: null,
    endDate: null,
  },
};

export const getSurvey = createAsyncThunk(
  "get/survey",
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
        // url: `survey/get-survey`,//for future use for query optamization
        url: `survey/get-survey-by-manager-id`,
        method: "get",
        params: {
          ...otherParams,
          startDate: startDate ? dayjs.utc(startDate).toISOString() : undefined,
          endDate: endDate ? dayjs.utc(endDate)?.toISOString() : undefined,
        },
      },
    });
    const data = responseHandler(response);
    return data;
  }
);

export const getSurveySlice = createSlice({
  name: "get/survey",
  initialState,
  reducers: {
    setSurveyPage: (state, action) => {
      state.surveyPaginationInfo.page = action.payload;
    },
    setSurveyRowsPerPage: (state, action) => {
      state.surveyPaginationInfo.pageSize = action.payload;
    },
    setSurveySortColumn: (state, action) => {
      state.surveySortingInfo.sortColumn = action.payload;
    },
    setSurveySortOrder: (state, action) => {
      state.surveySortingInfo.sortOrder = action.payload;
    },
    setSurveyQuery: (state, action) => {
      state.query = action.payload;
    },
    setSurveyStartDate: (state, action) => {
      state.surveyDateInfo.startDate = action.payload;
    },
    setSurveyEndDate: (state, action) => {
      state.surveyDateInfo.endDate = action.payload;
    },
    clearAllSurveyFields: (state) => {
      state.surveyDateInfo.endDate = null;
      state.surveyDateInfo.startDate = null;
      state.query = "";
    },
    clearSurveyTableData: (state) => {
      state.data = null;
      state.error = null;
      state.status = API_STATUS.IDLE;
    },
    clearSurveySearchField: (state) => {
      state.query = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSurvey.pending, (state) => {
        state.status = API_STATUS.PENDING;
      })
      .addCase(getSurvey.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = API_STATUS.SUCCEEDED;
      })
      .addCase(getSurvey.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = API_STATUS.REJECTED;
      });
  },
});
export const {
  setSurveyPage,
  setSurveyRowsPerPage,
  setSurveySortColumn,
  setSurveySortOrder,
  setSurveyQuery,
  setSurveyStartDate,
  setSurveyEndDate,
  clearAllSurveyFields,
  clearSurveyTableData,
  clearSurveySearchField,
} = getSurveySlice.actions;
export default getSurveySlice.reducer;
