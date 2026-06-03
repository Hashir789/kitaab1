export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginRequest extends LoginPayload {
  anonymous_id: string;
}

export interface LoginResponse {
  full_name: string;
  access_token: string;
  two_factor_enabled: boolean;
}

export interface Update2faPayload {
  two_factor_enabled: boolean;
}

export interface Update2faResponse {
  two_factor_enabled: boolean;
}

export interface SignupPayload {
  dob: string;
  email: string;
  password: string;
  full_name: string;
  recovery_key: string;
  gender: "male" | "female" | "other";
}

export interface SignupRequest extends SignupPayload {
  anonymous_id: string;
}

export interface SignupResponse {
  access_token: string;
  two_factor_enabled: boolean;
}

export interface OtpVerifyPayload {
  email: string;
  otp: string;
}

export interface OtpVerifyResponse {
  access_token?: string;
  two_factor_enabled?: boolean;
}

export interface EmailVerifyResponse {
  verified: boolean | null;
}

export interface ResendLinkPayload {
  email: string;
  full_name: string;
}

export interface ResendLinkResponse {
  message?: string;
}