export const POSTGRESQL_CONNECTION_STRING =
  process.env.POSTGRESQL_CONNECTION_STRING;
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
export const saltRounds = 10;

export const BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_BASE_URL;
export const IMAGES_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const PDF_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const CSV_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const SURVEY_IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_IMAGES_URL;
export const USER_PROFILE_BASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_IMAGES_URL;

export const ACCESS_TOKEN_TIME = process.env.NEXT_PUBLIC_ACCESS_TOKEN_TIME;
export const REFRESH_TOKEN_TIME = process.env.NEXT_PUBLIC_REFRESH_TOKEN_TIME;
export const Survey_Column = [
  "Display Type",
  "Supplier Name",
  "Other Supplier",
  "Item Name",
  "Other item",
  "Number of Cases",
  "Display Cost",
  "Image",
  "Action",
];
export const Survey_Table_Column = [
  "Supplier",
  "Item",
  "Account Name",
  "Account Number",
  "City",
  "Display Type",
  "Display Cost",
  "Other Supplier",
  "Other Item",
  "No of Cases",
  "Notes",
  "Status",
  "Image",
  "Action",
];
export const Survey_Sort_Keys: any = {
  Supplier: "supplier.vendorFullInfo",
  Item: "item.ItemFullInfo",
  "Account Name": "account.CUSTOMER NAME",
  "Account Number": "account.CUST NO",
  City: "account.CITY",
  "Display Type": "display.display_type",
  "Display Cost": "display_coast",
  "Other Supplier": "other_supplier",
  "Other Item": "other_item",
  "No of Cases": "number_of_cases",
  Notes: "notes",
  Status: "survey_status.status",
};

export const USER_TABLE_COLUMNS = ["Name", "Email", "Role", "Action"];
export const GROUP_TABLE_COLUMN = [
  "Group Name",
  "Access Type",
  "Member Count",
  "Is Active",
];
export const TEAM_TABLE_COLUMN = [
  "Team Name",
  "Managers",
  "Member Count",
  "Is Active",
];

export const BULK_OPERATION = [
  { id: 1, name: "Proceed" },
  { id: 2, name: "Approve" },
  { id: 3, name: "Complete" },
  { id: 4, name: "Reject" },
  { id: 5, name: "Delete" },
];
export const EXPORT_OPTIONS = [
  { id: 1, file_name: "Csv" },
  { id: 2, file_name: "Pdf" },
];
export const ACTIVITY_EXPORT_OPTIONS = [{ id: 1, file_name: "Csv" }];

export const ACTIVITY_TABLE_COLUMN = [
  "ID",
  "Merch Ref Id",
  "Date",
  "Start Time",
  "End Time",
  "Account Name",
  "City",
  "Activity Log",
  "Complete",
  "Notes",
  "Number of Cases",
];
export const SURVEY_SORT_KEYS: any = {
  ID: "id",
  "Merch Ref Id": "merch_rep_id",
  Date: "created_at",
  "Start Time": "start_time",
  "End Time": "end_time",
  "Account Name": "activity_account.CUSTOMER NAME",
  City: "activity_account.CITY",
  "Activity Log": "activity_log",
  Complete: "is_complete",
  Notes: "notes",
  "Number of Cases": "",
};
