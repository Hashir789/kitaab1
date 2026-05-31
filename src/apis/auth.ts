import { api } from "@/apis/api";
import { ENDPOINTS } from "@/constants/endpoints";
import type { LoginRequest, LoginResponse, Update2faPayload, Update2faResponse } from "@/interfaces/auth";

export function login(payload: LoginRequest): Promise<LoginResponse> {
  return api.post<LoginResponse, LoginRequest>(ENDPOINTS.AUTH.LOGIN, payload);
}

export function update2fa(payload: Update2faPayload): Promise<Update2faResponse> {
  return api.patch<Update2faResponse, Update2faPayload>(ENDPOINTS.AUTH.TWO_FACTOR, payload);
}