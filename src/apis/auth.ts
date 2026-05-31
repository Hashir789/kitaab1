import { api } from "@/apis/api";
import { ENDPOINTS } from "@/constants/endpoints";
import type { EmailVerifyResponse, LoginRequest, LoginResponse, OtpVerifyPayload, OtpVerifyResponse, ResendLinkPayload, ResendLinkResponse, SignupRequest, SignupResponse, Update2faPayload, Update2faResponse } from "@/interfaces/auth";

export function login(payload: LoginRequest): Promise<LoginResponse> {
  return api.post<LoginResponse, LoginRequest>(ENDPOINTS.AUTH.LOGIN, payload);
}

export function signup(payload: SignupRequest): Promise<SignupResponse> {
  return api.post<SignupResponse, SignupRequest>(ENDPOINTS.AUTH.SIGNUP, payload);
}

export function otpVerify(payload: OtpVerifyPayload): Promise<OtpVerifyResponse> {
  return api.post<OtpVerifyResponse, OtpVerifyPayload>(ENDPOINTS.AUTH.OTP_VERIFY, payload);
}

export function emailVerify(email: string): Promise<EmailVerifyResponse> {
  return api.get<EmailVerifyResponse>(
    `${ENDPOINTS.AUTH.EMAIL_VERIFY}?email=${encodeURIComponent(email)}`
  );
}

export function update2fa(payload: Update2faPayload): Promise<Update2faResponse> {
  return api.patch<Update2faResponse, Update2faPayload>(ENDPOINTS.AUTH.TWO_FACTOR, payload);
}

export function resendLink(payload: ResendLinkPayload): Promise<ResendLinkResponse> {
  return api.post<ResendLinkResponse, ResendLinkPayload>(ENDPOINTS.AUTH.RESEND_LINK, payload);
}