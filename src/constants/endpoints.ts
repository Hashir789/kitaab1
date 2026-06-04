export const ENDPOINTS = {
  VISITORS: {
    TRACK: "visitors/track",
    EMAIL: "visitors/email",
    MESSAGE: "visitors/message"
  },
  AUTH: {
    LOGIN: "auth/login",
    SIGNUP: "auth/signup",
    TWO_FACTOR: "auth/2fa",
    OTP_VERIFY: "auth/otp-verify",
    RESEND_LINK: "auth/resend-link",
    EMAIL_VERIFY: "auth/email-verify",
    FORGOT_PASSWORD: "auth/forgot-password",
    RESET_PASSWORD: "auth/reset-password"
  }
} as const;