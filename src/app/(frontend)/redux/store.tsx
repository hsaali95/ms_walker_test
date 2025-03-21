import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./slices/auth/login-slice";
import surveySlice from "./slices/agent/get-survey-slice";
import accountsSlice from "./slices/account/get-account-slice";
import accountByIdSlice from "./slices/account/get-account-by-id-slice";
import displaySlice from "./slices/display/get-display-type-slice";
import getItemSlice from "./slices/item/get-item-slice";
import getSupplierSlice from "./slices/supplier/get-supplier-slice";
import addSurveySlice from "./slices/survey/add-survey-slice";
import fileUploadSlice from "./slices/survey/file-upload-slice";
import getSurveySlice from "./slices/survey/get-survey-slice";
import updateSurveyStatusSlice from "./slices/survey/update-survey-status-slic";
import deleteSurveySlice from "./slices/survey/delete-survey-slice";
import downloadFileSlice from "./slices/survey/download-file-slice";
import downloadFileSlicePdf from "./slices/survey/download-file-pdf-slice";
import getRolesSlice from "./slices/roles/get-role-slice";
import registerUserSlice from "./slices/register-user/register-user-slice";
import getUsersSlice from "./slices/register-user/get-all-user-slice";
import userProfileSlice from "./slices/register-user/upload-user-profile-slice";
import accessTypeSlice from "./slices/group/access-type-slice";
import getUserSlice from "./slices/register-user/get-user-slice";
import groupSlice from "./slices/group/add-group-slice";
import getManagerSlice from "./slices/managers/get-manager-slice";
import teamSlice from "./slices/team/add-team-slice";
import getGroupsSlice from "./slices/group/get-paginated-group-slice";
import getTeamsSlice from "./slices/team/get-paginated-team-slice";
import activitySlice from "./slices/activity/add-activity-slice";
import logoutSlice from "./slices/auth/logout-slice";
import resetPasswordSlice from "./slices/register-user/user-reset-password-slice";
import getActivitySlice from "./slices/activity/get-activity-slice";
import downloadActivityCsvSlice from "./slices/activity/download-activity-csv-file";
import getUserIpSlice from "./slices/user-location/get-user-ip-slice";
import editGroupSlice from "./slices/group/edit-group-slice";
import deleteGroupSlice from "./slices/group/delete-group-slice";
import resetLoginPasswordSlice from "./slices/auth/login-user-reset-password-slice";
import deleteTeamSlice from "./slices/team/delete-team-slice";
import editTeamSlice from "./slices/team/edit-team-slice";
import deleteUserSlice from "./slices/register-user/delete-user-slice";
import downloadUserCsvSlice from "./slices/register-user/download-user-csv-slice";
export const store = configureStore({
  reducer: {
    login: loginSlice,
    survey: surveySlice,
    getAccount: accountsSlice,
    accountById: accountByIdSlice,
    getDisplay: displaySlice,
    getItem: getItemSlice,
    getSupplier: getSupplierSlice,
    addSurvey: addSurveySlice,
    fileUploadSurvey: fileUploadSlice,
    getSurvey: getSurveySlice,
    updateSurveyStatus: updateSurveyStatusSlice,
    deleteSurvey: deleteSurveySlice,
    surveyFileDownload: downloadFileSlice,
    downloadSurveyPdf: downloadFileSlicePdf,
    getUserRoles: getRolesSlice,
    registerUser: registerUserSlice,
    getPaginatedUsers: getUsersSlice,
    uploadUserProfile: userProfileSlice,
    getAccessType: accessTypeSlice,
    getUsers: getUserSlice,
    createGroup: groupSlice,
    getManager: getManagerSlice,
    createTeam: teamSlice,
    getGroupPaginatedData: getGroupsSlice,
    getTeam: getTeamsSlice,
    createActivity: activitySlice,
    logout: logoutSlice,
    resetPassword: resetPasswordSlice,
    getActivity: getActivitySlice,
    getActivityCsv: downloadActivityCsvSlice,
    getUserIp: getUserIpSlice,
    getEditGroup: editGroupSlice,
    deleteGroup: deleteGroupSlice,
    resetLoginUserPassword: resetLoginPasswordSlice,
    getDeleteTeam: deleteTeamSlice,
    geteditTeamSlice: editTeamSlice,
    deleteUser: deleteUserSlice,
    userCsv: downloadUserCsvSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
