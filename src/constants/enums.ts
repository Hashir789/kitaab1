export enum localStorageKeys {
  CLICKS = "clicks",
  NAVIGATIONS = "navigations",
  ANONYMOUS_ID = "anonymous_id",
  MASTER_KEY_STORAGE_KEY = "master_key",
  ACCESS_TOKEN_STORAGE_KEY = "access_token",
  USER_SESSION_STORAGE_KEY = "user_session"
}

export enum sessionStorageKeys {
  VISITOR_TRACKED = "visitor_tracked",
  PENDING_PASSWORD = "pending_password",
  DEED_CREATE_SUCCESS = "deed_create_success",
  PENDING_SCALE_DEED = "pending_scale_deed"
}

export enum step {
  OTP = "otp",
  LOGIN = "login",
  ASK_2FA = "ask_2fa",
  FORGOT_PASSWORD = "forgot_password",
  FORGOT_PASSWORD_SENT = "forgot_password_sent"
}

export enum phase {
  OTP = "otp",
  FORM = "form",
  TWO_FACTOR = "two_factor",
  RECOVERY_KEY = "recovery_key"
}

export enum authMode {
  LOGIN = "login",
  SIGNUP = "signup"
}

export enum emailVerifyState {
  IDLE = "idle",
  EXISTS = "exists",
  AVAILABLE = "available",
  UNVERIFIED = "unverified"
}

export enum gender {
  MALE = "male",
  OTHER = "other",
  FEMALE = "female"
}

export enum signupFormStep {
  DETAILS = 0,
  PROFILE = 2,
  PASSWORD = 1
}

export enum iconState {
  ERROR = "error",
  SUCCESS = "success"
}

export enum toastType {
  ERROR = "error",
  SUCCESS = "success"
}

export enum sessionStorageValues {
  TRACKED = "1"
}

export enum deedType {
  HASANAAT = "hasanaat",
  SAIYYIAAT = "saiyyiaat"
}

export enum deedVisibility {
  BOTH = "none",
  GRAPHS_ONLY = "hide_from_graphs",
  RECORDS_ONLY = "hide_from_all"
}

export enum deedMeasurementType {
  SCALE = "scale",
  COUNT = "count"
}

export enum deedFormLevel {
  ROOT = 0,
  SUB = 1,
  SUB_SUB = 2
}

export enum deviceType {
  TABLET = "tablet",
  MOBILE = "mobile",
  DESKTOP = "desktop"
}

export enum resetPasswordField {
  RECOVERY_KEY = "recovery_key",
  NEW_PASSWORD = "new_password"
}

export enum loginField {
  EMAIL = "email",
  PASSWORD = "password"
}

export enum forgotPasswordField {
  EMAIL = "email",
  FULL_NAME = "full_name"
}

export enum signupField {
  DOB = "dob",
  EMAIL = "email",
  GENDER = "gender",
  PASSWORD = "password",
  FULL_NAME = "fullName",
  CONFIRM_PASSWORD = "confirmPassword"
}