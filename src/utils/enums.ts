export enum API_STATUS {
  IDLE = "idle",
  PENDING = "pending",
  SUCCEEDED = "succeeded",
  REJECTED = "rejected",
  ERROR = "error",
}

export enum SURVEY_STATUS_ID {
  CREATED = 5,
  PROCEEDED = 4,
  COMPLETED = 3,
  APPROVED = 2,
  REJECTED = 1,
}
export enum ROLE {
  ADMIN = 1,
  AGENT = 2,
  MANAGER = 3,
  MOBILE_ONLY = 7,
}
