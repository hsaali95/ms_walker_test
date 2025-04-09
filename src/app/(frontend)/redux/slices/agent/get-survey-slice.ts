import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define your survey data structure type
export interface ISurveyData {
  display_type?: any | string | number;
  display_type_show_name?: any | string | number;
  supplier_name?: any | string | number;
  supplier_show_name?: any | string | number;
  other_supplier?: any | string;
  item_name?: any | string | number;
  other_item?: any | string;
  number_of_cases?: any | string;
  display_coast?: any | string;
  notes?: any | string;
  image?: any | string;
  display_id?: any | string;
  display_name?: any | string;
  supplier_id?: any | string;
  item_id?: any | string;
  item_show_name?: any | string;
  account_id?: any;
  show_image?: any | string;
  file_id?: any[];
  temp_Id?: any;
}

// Define the state type for the slice
interface ISurveySlice {
  surveyData: ISurveyData[]; // Array of survey data objects
}

const initialState: ISurveySlice = {
  surveyData: [], // Initialize with an empty array
};

// Create the slice
export const surveySlice = createSlice({
  name: "surveySlice",
  initialState,
  reducers: {
    // Action to save the survey data array
    saveSurvey: (state, action: PayloadAction<ISurveyData[]>) => {
      state.surveyData = action.payload; // Replace the entire surveyData array
    },
    // Action to add a new survey object to the array
    addSurvey: (state, action: PayloadAction<ISurveyData>) => {
      console.log("action.payload", action.payload);
      state.surveyData.push(action.payload); // Add a new survey object to the array
    },
    // Action to clear the survey data array
    deleteAllSurvey: (state) => {
      state.surveyData = [];
    },
    // Action to remove a single record based on temp_Id
    removeSurveyByTempId: (state, action: PayloadAction<any>) => {
      state.surveyData = state.surveyData.filter(
        (survey) => survey.temp_Id !== action.payload
      ); // Remove the survey object with the matching temp_Id
    },
  },
});

// Export the actions
export const { saveSurvey, addSurvey, deleteAllSurvey, removeSurveyByTempId } =
  surveySlice.actions;

// Export the reducer to be used in the store
export default surveySlice.reducer;
