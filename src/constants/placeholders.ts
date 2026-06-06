export enum authButtonLabel {
  BACK = "Back",
  NEXT = "Next",
  SENT = "Sent",
  SKIP = "Skip",
  LOGIN = "Login",
  VERIFY = "Verify",
  ENABLE = "Enable",
  SIGN_UP = "Sign up",
  NOT_NOW = "Not now",
  SENDING = "Sending...",
  SEND_LINK = "Send link",
  UPDATING = "Updating...",
  CHECKING = "Checking...",
  ENABLING = "Enabling...",
  VERIFYING = "Verifying...",
  RESEND_LINK = "Resend link",
  LOGGING_IN = "Logging in...",
  SIGNING_UP = "Signing up...",
  DEMO_ACCOUNT = "Demo Account",
  UPDATE_PASSWORD = "Update password",
}

export enum authLabel {
  EMAIL = "Email",
  GENDER = "gender",
  PASSWORD = "Password",
  FULL_NAME = "Full name",
  DATE_OF_BIRTH = "Date of Birth",
  RECOVERY_KEY = "Recovery key",
  NEW_PASSWORD = "New password",
  CONFIRM_PASSWORD = "Confirm Password",
}

export enum authPlaceholder {
  PASSWORD = "Pass@123",
  FULL_NAME = "John Doe",
  EMAIL = "your@mail.com",
  DATE_OF_BIRTH = "DD-MM-YYYY",
  SELECT_GENDER = "Select gender",
  RECOVERY_KEY = "XXXX-XXXX-XXXX-...",
}

export enum authAria {
  EMAIL = "Email",
  PASSWORD = "Password",
  FULL_NAME = "Full name",
  KITAAB_LOGO = "Kitaab logo",
  NEW_PASSWORD = "New password",
  RECOVERY_KEY = "Recovery key",
  DATE_OF_BIRTH = "Date of birth",
  SELECT_GENDER = "Select gender",
  CONFIRM_PASSWORD = "Confirm password",
  DOWNLOAD_RECOVERY_KEY = "Download recovery key"
}

export enum authHeading {
  CHECK_EMAIL = "Check your email",
  VERIFY_ITS_YOU = "Verify it's you",
  ACCOUNT_CREATED = "Account created",
  VERIFY_YOUR_EMAIL = "Verify your email",
  RESET_PASSWORD = "Reset your password",
  RECORD_EXISTS = "We already have your record",
  ENABLE_TWO_FACTOR = "Enable two-factor authentication",
  SENDING_VERIFICATION_CODE = "Sending verification code",
  ENABLE_TWO_FACTOR_QUESTION = "Enable two-factor authentication?",
}

export enum authDescription {
  OTP_CODE_SUFFIX = ".",
  RESEND_CODE_PROMPT = "Didn't get the code?",
  OTP_SENDING = "Hang on while we email your code...",
  FORGOT_LINK_SENT_SUFFIX = ". You may close this tab.",
  OTP_CODE_PREFIX = "Enter the 4-digit code we sent to ",
  FORGOT_LINK_SENT_PREFIX = "A reset link has been sent to ",
  OTP_REDIRECTING = "Redirecting you to verify your email...",
  RECOVERY_KEY_NOT_SHOWN_AGAIN = "This key will not be shown again",
  DOWNLOAD_RECOVERY_KEY_TO_CONTINUE = "Download the recovery key file to continue",
  FORGOT_PASSWORD = "Enter your full name and email. We'll send a reset link to your inbox.",
  RESET_PASSWORD = "Enter the recovery key you saved during signup and choose a new password.",
  SIGNUP_TWO_FACTOR = "Add an extra layer of security to your account by requiring a code at sign-in.",
  RECOVERY_KEY_SAVE = "Save this key. If you forget your password and don't have it, all your data will be permanently lost.",
  LOGIN_TWO_FACTOR = "Add an extra layer of security to your account. You'll be asked for a code sent to your email each time you login."
}

export enum authLink {
  RETURN_HOME = "Return to Home",
  FORGOT_PASSWORD = "Forgot password?"
}

export enum authMisc {
  OR = "OR",
  NO_ACCOUNT = "Don't have an account?",
  HAS_ACCOUNT = "Already have an account?"
}

export enum authToast {
  AUTH_FAILED = "Authentication failed",
  RESET_FAILED = "Password reset failed"
}

export enum authValidation {
  DOB_FORMAT = "Use DD-MM-YYYY",
  GENDER_SELECT = "Select a gender",
  EMAIL_REQUIRED = "Email is required",
  GENDER_REQUIRED = "gender is required",
  DOB_REQUIRED = "Date of birth is required",
  CONFIRM_PASSWORD = "Confirm your password",
  PASSWORD_REQUIRED = "Password is required",
  FULL_NAME_REQUIRED = "Full name is required",
  PASSWORDS_MUST_MATCH = "Passwords must match",
  PASSWORD_NUMBER = "Please enter at least a number",
  RECOVERY_KEY_REQUIRED = "Recovery key is required",
  EMAIL_INVALID = "Please enter a valid email address",
  RECOVERY_KEY_INVALID = "Invalid recovery key format",
  EMAIL_EXISTS = "User with this email already exists",
  FULL_NAME_INVALID = "Please enter a valid full name",
  PASSWORD_MIN_8 = "Please enter at least 8 characters",
  PASSWORD_SPECIAL = "Please enter a special character",
  FULL_NAME_MIN_2 = "Please enter at least 2 characters",
  FULL_NAME_MIN_3 = "Please enter at least 3 characters",
  FULL_NAME_MAX_60 = "Please enter at most 60 characters",
  DOB_NOT_FUTURE = "Date of birth cannot be in the future",
  PASSWORD_LOWERCASE = "Please enter at least a lowercase",
  PASSWORD_UPPERCASE = "Please enter at least an uppercase"
}

export enum accountLabel {
  EMAIL = "Email",
  GENDER = "Gender",
  FULL_NAME = "Full name",
  DATE_OF_BIRTH = "Date of birth",
  TWO_FACTOR_AUTH = "Two-factor auth"
}

export enum accountButtonLabel {
  LOG_OUT = "Log out"
}

export enum accountStatus {
  ENABLED = "Enabled",
  DISABLED = "Disabled"
}

export const authAriaDigit = (index: number): string => `Digit ${index + 1}`;