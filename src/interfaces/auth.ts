import type { gender } from "@/constants/enums";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginRequest extends LoginPayload {
  anonymous_id: string;
}

export interface LoginResponse {
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
  gender: gender;
  password: string;
  full_name: string;
  recovery_key: string;
}

export interface SignupRequest extends SignupPayload {
  anonymous_id: string;
}

export type SignupResponse = void;

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
}

export interface ResendLinkResponse {
  message?: string;
}

export interface ForgotPasswordPayload {
  email: string;
  full_name: string;
}

export interface ForgotPasswordResponse {
  message?: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
  recovery_key: string;
}

export interface ResetPasswordResponse {
  dob?: string;
  email?: string;
  gender?: gender;
  message?: string;
  full_name?: string;
  access_token?: string;
  two_factor_enabled?: boolean;
}